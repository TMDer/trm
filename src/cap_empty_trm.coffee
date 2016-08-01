###
# record, user data
###
_lodash = require("lodash")
_lodash = _lodash.noConflict()



class TRM

  constructor: () ->
    return @



  setNGo: (info) ->
    return



global = window || module.exports
global.analytics = global.analytics || []
global.analytics = _lodash.merge(global.analytics, new TRM())
global.console = global.console || {
  log: (msg) ->
    return msg
}

module.exports = TRM