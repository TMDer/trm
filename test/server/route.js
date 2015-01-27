var serveStatic = require('serve-static');
var serve = serveStatic('static');
var handle = require('finalhandler');

module.exports = function () {
  return function(req,res) {
    var done = handle(req, res);
    serve(req, res, done);
  }
}