var https = require("https");
var http = require("http");
var fs = require("fs");
var path = require("path");
var route = require("./route");

var httpsPort = 8080;
var httpPort = 3000;

console.log(path.join(__dirname, '/keys/server.key'));

var keys = {
  key: fs.readFileSync(path.join(__dirname, './keys/server.key')),
  cert: fs.readFileSync(path.join(__dirname, './keys/server.crt'))
};

https.createServer(keys, route(httpsPort)).listen(httpsPort);
http.createServer(route(httpPort)).listen(httpPort);

console.log("create https server");
console.log("https://localhost:" + httpsPort);
console.log("http://localhost:" + httpPort);
