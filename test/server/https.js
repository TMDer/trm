var server = require("https");
var fs = require("fs");
var route = require("./route");

var httpsPort = 8080;
var httpPort = 3000;

var keys = {
  key: fs.readFileSync(__dirname + '/keys/server.key'),
  cert: fs.readFileSync(__dirname + '/keys/server.crt')
};

module.exports = server.createServer(keys, route()).listen(httpsPort);

console.log("create https server");
console.log("https://localhost:" + httpsPort);
