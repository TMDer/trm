
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
    # @.host = "http://localhost:3000/"
    @.params = {}
    @.subParams = {}
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

    console.log "final collect params --> "
    console.log param

    return param

  _getAdGroupId: () ->
    #get adgroup from url
    search = qs.parse(location.search.replace("?", "")) || null
    console.log search
    console.log search[@.KEYS.PARAM_ADGROUP]
    qsFromUrl = search[@.KEYS.PARAM_ADGROUP] || ""
    if qsFromUrl.length > 0
      # alert(search[@.KEYS.PARAM_ADGROUP])
      @._setCookie @.KEYS.ADGROUP, qsFromUrl
      return qsFromUrl

    search = qs.parse(document.referrer)
    aid = cookie.get(@.KEYS.ADGROUP) || null


    if aid isnt null or aid isnt ""
      console.log "get aid #{aid}"
      @._setCookie @.KEYS.ADGROUP, aid

    console.log "aid -- #{aid}"
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

  # set cookie and set it is forever or expreis
  # the expires setting is depend on KEYS
  _setCookie: (key, data, forever) ->
    newDate = new Date()
    if forever
      newDate.setHours(newDate.getHours() + @.KEYS.FOREVER)
    else
      newDate.setHours(newDate.getHours() + @.KEYS.EXPIRES)

    cookie.set(key, data, { expires: newDate, path: "/" })
    return @

  host: (host) ->
    @.host = host

  initial: (id) ->
    @.id = id

  send: (path) ->
    # request 'https://api.github.com/users/octocat/orgs', (er, res) ->
    @.params = @._prepareData()
    if @.subParams
      @.params.params = @.subParams

    console.log "send data"
    console.log @.params
    try
      request {
          method: "POST"
          url: "#{@.host}#{path}"
          body: JSON.stringify(@.params)
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
        @.subParams[key] = val
        # @.subParams.push {key: val}
      return @

    if key
      @.subParams[key] = value
      return

    # @._call key, value
    return @

  _call: (key, value) ->
    console.log "key, #{key}, value #{value}"

global = window || module.exports
global.analytics = global.analytics || []
global.analytics = new TRM()
global.analytics.host = "http://localhost:1337/track"
# global.analytics.host = "http://localhost:3000/"
