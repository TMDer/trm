var serveStatic = require('serve-static');
var serve = serveStatic(__dirname + '/static');
var handle = require('finalhandler');
var trm = require("../../out/import");
var optUrl = "caesarchi.com/test.js"

trm.config(optUrl)
console.log(trm.compress())

module.exports = function () {
  return function(req,res) {
    var done = handle(req, res);
    serve(req, res, done);
  }
}