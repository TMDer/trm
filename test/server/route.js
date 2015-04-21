var serveStatic = require('serve-static');
var serve = serveStatic(__dirname + '/static');
var fs = require("fs");
var path = require("path");
var handle = require('finalhandler');
var trm = require("../../out/import");



module.exports = function (port) {
  var destPath = "./test/server/static/.tmp/test.js";

  trm.generateLib({
    domain: "localhost:" + port,
    destPath: destPath,
    minify: true
  });

  var optUrl = "localhost:" + port + "/.tmp/test.js";
  trm.config(optUrl);

  var code = trm.compress().code + [
    'window.analytics.load(function () {',
    '  window.analytics.initial("-999", "-999");',
    '  window.analytics.send("");',
    '});'
  ].join("");

  var code = trm.resultDisplay({
    code: trm.compress().code,
    pid: "-999",
    aid: "-99999"
  });

  var indexRes = fs.readFileSync(path.join(__dirname, "/static/index.html"), "utf8")

  return function(req,res) {
    if (req.url === "/track") {
      return res.end("ok");
    }

    if (req.url === "/") {
      return res.end(indexRes.replace("{{CODE}}", code));
    }
    
    var done = handle(req, res);
    serve(req, res, done);
  }
}