var https = require("https")
var fs = require("fs")
var keys = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt')
};

https.createServer(keys, function(req,res) {

  res.write('Hello, World');
  res.end();
}).listen(8080);
console.log("create https server");
