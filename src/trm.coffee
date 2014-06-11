
###
# record, user data
###

# emmiter = require("eventemitter")

request = require('browser-request')

class TRM
  constructor: (@clientId) ->
    @.clientId = clientId

  host: (host) ->
    @.host = host

  initial: (key) ->
    @.key = key

  send: () ->
    # request 'https://api.github.com/users/octocat/orgs', (er, res) ->
    request 'https://tw.yahoo.com/', (er, res) ->
      if !er
        return console.log('browser-request got your root path:\n' + res.body)

      console.log('There was an error, but at least browser-request loaded and ran!')

  push: (key, value) ->
    if typeof key is "object"
      items = key
      items.forEach (val, key) ->
        @._call val, key

    if key and value
      @._call val key

  _call: (key, value) ->
    console.log "key and value"

host = "http://localhost:1337/tracking"

# exports.hello = "hello"
# module.exports = TRM
