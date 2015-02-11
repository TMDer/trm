
###
# record, user data
###
request = require('browser-request')
cookie = require("cookie-cutter")
url = require("url")
qs = require("querystring")
uuid = require('node-uuid')


class TRM
  constructor: () ->
    @.host = "{DOMAIN_NAME}/track"
    @.audienceHost = "https://www.facebook.com/tr?id={AID}&amp;ev=PixelInitialized"
    @.params = {}
    @.subParams = {}
    @.KEYS = {
      ID: "pmd.uuid"
      ADGROUP: "pmd.adGroupId"
      PARAM_ADGROUP: "adgroupid"
      TRACKPIXEL: "pmd.trackPixelId"
      EXPIRES: 7
      FOREVER: 9999999999
      AUDIENCETAGID: "pmd-tag-aid"
    }

    return @

  _prepareData: () ->
    # it will get params and get params from data, and update cookie
    param = @._initParams()
    return param

  _initParams: () ->
    # get uuid from cookie
    param = {}
    uuid = @._getTrmUuid()
    #get adgroup ID, from local cookie or url params
    aid = @._getAdGroupId()

    # set all param
    param = {
      trackPixelId: @.id || 0
      adGroupId: aid || 0
      referer: document.referrer || ""
      id: uuid
    }

    # if console
    #   console.log "final collect params --> "
    #   console.log param

    return param

  _getAdGroupId: (url) ->
    #get adgroup from url
    url = url || location.search
    url = url.toLowerCase()
    search = qs.parse(url) || null
    qsFromUrl = search[@.KEYS.PARAM_ADGROUP] || ""

    if qsFromUrl.length > 0
      @._setCookie @.KEYS.ADGROUP, qsFromUrl
      return qsFromUrl

    aid = cookie.get(@.KEYS.ADGROUP) || null
    return aid

  #get uuid from cookie, or generate a new uid
  _getTrmUuid: () ->
    uid = cookie.get(@.KEYS.ID)
    # create a uid
    unless uid
      uid = uuid.v4()
      @._setCookie(@.KEYS.ID, uid, true)
    return uid

  # set cookie and set it is forever or expreis
  # the expires setting is depend on KEYS
  _setCookie: (key, data, forever) ->
    newDate = new Date()

    if forever
      newDate.setHours(newDate.getHours() + @.KEYS.FOREVER)
    else
      newDate.setDate(newDate.getDate() + @.KEYS.EXPIRES)

    cookie.set(key, data, { expires: newDate, path: "/" })
    return @

  host: (host) ->
    @.host = host

  initial: (id, aid) ->
    @.id = id
    @.aid = aid

  _protocol: (url) ->
    protocol = if window.location.protocol is "https:" then "https:" else "http:"
    if url.indexOf("http") is 0
      return url.replace(/^http:|^https:/, protocol)
    return protocol + "//" + url
    

  send: (path) ->
    @.params = @._prepareData()

    if @.subParams
      @.params.params = @.subParams

    try
      request {
          method: "POST"
          url: @._protocol("#{@.host}#{path}")
          body: JSON.stringify(@.params)
      }, (er, res) ->
        if ! er
          return
          # return console.log('browser-request got your root path:\n' + res.body)

        return console.log('There was an error, but at least browser-request loaded and ran!')
    catch error
      return console.log("send request, error happen")

    @sendAudience()

  sendAudience: (aid) ->

    if (window.document.getElementById(@.KEYS.AUDIENCETAGID))
      return

    aid = aid || @.aid

    # unless aid
    #   return console.log("Aid is not found")

    img = new Image(1,1)
    window.document.body.appendChild(img)
    src = @.audienceHost.replace("{AID}", aid)
    img.src = src
    img.style?.display = "none"
    return img

  push: (key, value) ->

    if typeof key is "object"
      items = key
      items.forEach (val, key) ->
        @.subParams[key] = val
        # @.subParams.push {key: val}
      return @

    if key
      @.subParams[key] = value
      return

    # @._call key, value
    return @

  _call: (key, value) ->
    return

global = window || module.exports
global.analytics = global.analytics || []
global.analytics = new TRM()
global.analytics.host = "{DOMAIN_NAME}/track"
global.console = global.console || {
  log: (msg) ->
    return msg  
}

module.exports = TRM