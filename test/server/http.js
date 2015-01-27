var server = require("http");
var route = require("./route");
var httpPort = 3000;

module.exports = server.createServer(route()).listen(httpPort);

console.log("create https server");
console.log("http://localhost:" + httpPort);
