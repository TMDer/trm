var serveStatic = require('serve-static');
var serve = serveStatic(__dirname + '/static');
var handle = require('finalhandler');
var trm = require("../../out/import");

var destPath = "./test/server/static/.tmp/test.js";
trm.generateLib({
  domain: "localhost:3000",
  destPath: destPath,
  minify: true
});

var optUrl = "localhost:3000/.tmp/test.js"
trm.config(optUrl)
var code = trm.compress().code + [
  'window.analytics.load(function () {',
  '  window.analytics.initial("-999", "-999");',
  '  window.analytics.send("");',
  '});'
].join("");
console.log(code)

module.exports = function () {
  return function(req,res) {
    var done = handle(req, res);
    serve(req, res, done);
  }
}