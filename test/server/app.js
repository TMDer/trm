var https = require("https");
var http = require("http");
var fs = require("fs");
var route = require("./route");

var httpsPort = 8080;
var httpPort = 3000;

var keys = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt')
};

https.createServer(keys, route()).listen(httpsPort);

http.createServer(route()).listen(httpPort);

console.log("create https server");
console.log("https://localhost:" + httpsPort);
console.log("http://localhost:" + httpPort);
