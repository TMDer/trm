
###
# record, user data
###

# emmiter = require("eventemitter")

request = require('browser-request')

class TRM
  constructor: () ->
    @.host = "http://localhost:1337/track"
    return @

  host: (host) ->
    @.host = host

  initial: (id) ->
    @.id = id

  send: (path, key, value) ->
    # request 'https://api.github.com/users/octocat/orgs', (er, res) ->
    try
      request {
        method: "GET"
        url: "#{@.host}#{path}"
        qs: {
          id: @.id
        }
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
        @._call val, key
      return @

    @._call key, value
    return @

  _call: (key, value) ->
    console.log "key, #{key}, value #{value}"

global = window || module.exports
global.analytics = global.analytics || []
global.analytics = new TRM()
global.analytics.host = "http://localhost:1337/track"
