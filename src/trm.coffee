
###
# record, user data
###

# emmiter = require("eventemitter")

request = require('browser-request')
cookie = require("cookie-cutter")
url = require("url")
qs = require("querystring")
uuid = require('node-uuid')


class TRM
  constructor: () ->
    @.host = "http://localhost:1337/track"
    @.params = {}
    @.KEYS = {
      ID: "pmd.uuid"
      ADGROUP: "pmd.adGroupId"
      PARAM_ADGROUP: "adgroup"
      TRACKPIXEL: "pmd.trackPixelId"
      EXPIRES: 3
      FOREVER: 9999999999
    }

    return @

  _prepareData: () ->
    @._initParams()
    @._initCookie()

  _initParams: () ->
    # get uuid from cookie
    param = {}
    uuid = @._getTrmUuid()
    #parse track Pixel
    aid = @._getAdGroupId()
    # unless uuid
    #   if pid and aid
    #     uuid = initUuid()

    param = {
      trackPixel: @.id || 0
      adGroup: aid || 0
      referer: document.referrer || ""
      id: uuid
    }
    console.log "final collect params --> "
    console.log param

    return param

  _getAdGroupId: () ->
    #get adgroup from url
    search = qs.parse(location.search.replace("?", "")) || null
    if search && search[@.KEYS.PARAM_ADGROUP]
      # console.log "search -- "
      # console.log search[@.KEYS.PARAM_ADGROUP]
      return search[@.KEYS.PARAM_ADGROUP]

    # console.log "not find aid"
    search = qs.parse(document.referrer)
    aid = search[@.KEYS.PARAM_ADGROUP] || cookie.get(@.KEYS.ADGROUP) || null
    # console.log "aid --"
    # console.log aid
    return aid

  #get uuid from cookie, or generate a new uid
  _getTrmUuid: () ->
    uid = cookie.get(@.KEYS.ID)
    # create a uid
    unless uid
      uid = uuid.v4()
      # console.log "create a uuid, #{uid}"
      @._setCookie(@.KEYS.ID, uid, true)
    return uid

  _initCookie: () ->
    times = parseInt(cookie.get('times'), 10) || 0
    if times
      @._setCookie("times", times + 1)
    @._setCookie("times", times + 1)
    return @
    # cookie.set('times', times + 1, { expires: new Date(300) })

  # set cookie and set it is forever or expreis
  # the expires setting is depend on KEYS
  _setCookie: (key, data, forever) ->
    newDate = new Date()
    if forever
      newDate.setHours(newDate.getHours() + @.KEYS.FOREVER)
    else
      newDate.setHours(newDate.getHours() + @.KEYS.EXPIRES)

    cookie.set(key, data, { expires: newDate })
    return @

  host: (host) ->
    @.host = host

  initial: (id) ->
    @.id = id

  send: (path) ->
    # request 'https://api.github.com/users/octocat/orgs', (er, res) ->
    @.params = @._prepareData()
    try
      request {
        method: "POST"
        url: "#{@.host}#{path}"
        form: @.params
        # qs: {
        #   id: @.id
        # }
      }, (er, res) ->
        if !er
          return console.log('browser-request got your root path:\n' + res.body)

        return console.log('There was an error, but at least browser-request loaded and ran!')

    catch error
      return console.log("send request, error happen")

  push: (key, value) ->

    # console.log key
    # console.log typeof key
    if typeof key is "object"
      items = key
      items.forEach (val, key) ->
        @.params[key] = val
        # @.params.push {key: val}
      return @

    if key
      @.params[key] = value
      return

    # @._call key, value
    return @

  _call: (key, value) ->
    console.log "key, #{key}, value #{value}"

global = window || module.exports
global.analytics = global.analytics || []
global.analytics = new TRM()
global.analytics.host = "http://localhost:1337/track"
