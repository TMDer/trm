var UglifyJS, cfg, compress, config, fs, path;

UglifyJS = require("uglify-js");

fs = require("fs");

path = require("path");

config = process.LIB || "localhost:1337/lib/trm.compile.js";

cfg = function(cfg) {
  if (typeof cfg !== "string") {
    throw "config should be a string type";
  }
  config = cfg;
  return this;
};

compress = function(filepath, opt) {
  var code, file, result;
  filepath = filepath || path.join(__dirname, "../usage/index.js");
  config = opt || config;
  file = fs.readFileSync(filepath, "utf8");
  file = file.replace("{ENV_PATH}", config);
  code = file;
  result = UglifyJS.minify(code, {
    fromString: true
  });
  console.log(result.code);
  return result;
};

module.exports = {
  config: cfg,
  compress: compress
};

compress();
