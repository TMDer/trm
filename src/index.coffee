host = "http://localhost:1337/tracking"

###
# record, user data
###

# emmiter = require("eventemitter")

class TRM
  constructor: (@clientId) ->
    @.clientId = clientId

  host: (host) ->
    @.host = host

  initial: (key) ->
    @.key = key

  push: (key, value) ->
    if typeof key is "object"
      items = key
      items.forEach (val, key) ->
        @._call val, key

    if key and value
      @._call val key

  _call: (key, value) ->
    console.log "key and value"
