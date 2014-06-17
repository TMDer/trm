
###
# record, user data
###

# emmiter = require("eventemitter")

request = require('browser-request')
cookie = require("cookie-cutter")
url = require("url")
querystring = require("querystring")


class TRM
  constructor: () ->
    @.host = "http://localhost:1337/track"
    @.params = []
    @._initCookie()
    return @

  _initCookie: () ->
    times = parseInt(cookie.get('times'), 10) || 0
    if times
      @._setCookie("times", times + 1)
    @._setCookie("times", times + 1)
    return @
    # cookie.set('times', times + 1, { expires: new Date(300) })

  _setCookie: (key, data) ->
    newDate = new Date()
    # set 3 hour for expires
    newDate.setHours(newDate.getHours() + 3)
    console.log newDate
    cookie.set(key, data, { expires: newDate })
    return @

  host: (host) ->
    @.host = host

  initial: (id) ->
    @.id = id

  send: (path) ->
    # request 'https://api.github.com/users/octocat/orgs', (er, res) ->
    try
      request {
        method: "POST"
        url: "#{@.host}#{path}"
        form: {
          params: @.params
        }
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
    if typeof key is "object"
      items = key
      items.forEach (val, key) ->
        @.params.push {key: val}
      return @

    if key
      @.params.push {key, value}
      return

    # @._call key, value
    return @

  _call: (key, value) ->
    console.log "key, #{key}, value #{value}"

global = window || module.exports
global.analytics = global.analytics || []
global.analytics = new TRM()
global.analytics.host = "http://localhost:1337/track"
