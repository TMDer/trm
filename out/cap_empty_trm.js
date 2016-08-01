/*
# record, user data
*/

var TRM, global, _lodash;

_lodash = require("lodash");

_lodash = _lodash.noConflict();

TRM = (function() {
  function TRM() {
    return this;
  }

  TRM.prototype.setNGo = function(info) {};

  return TRM;

})();

global = window || module.exports;

global.analytics = global.analytics || [];

global.analytics = _lodash.merge(global.analytics, new TRM());

global.console = global.console || {
  log: function(msg) {
    return msg;
  }
};

module.exports = TRM;
