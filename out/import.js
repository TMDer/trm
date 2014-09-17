var Promise, UglifyJS, b, browserify, exports, fs, optUrl, path;

UglifyJS = require("uglify-js");

fs = require("fs");

path = require("path");

optUrl = process.LIB || "localhost:1337/lib/trm.compile.js";

Promise = require("bluebird");

browserify = require('browserify');

b = browserify();

module.exports = exports = {
  DEBUG: false,
  config: function(opt) {
    if (typeof opt !== "string") {
      throw "optUrl should be a string type";
    }
    this.optUrl = optUrl = opt;
    console.log(this.optUrl);
    return this;
  },
  optUrl: optUrl,
  compress: function(filepath, opt) {
    var code, file, result;
    filepath = filepath || path.join(__dirname, "../usage/index.js");
    optUrl = opt || optUrl;
    file = fs.readFileSync(filepath, "utf8");
    file = file.replace("{ENV_PATH}", optUrl);
    file = file.replace("{VERSION}", require("../package.json").version);
    code = file;
    result = UglifyJS.minify(code, {
      fromString: true
    });
    if (this.DEBUG) {
      console.log(result.code);
    }
    return result;
  },
  generateLib: function(config) {
    var destPath, domain, filepath, self, srcPath;
    self = this;
    domain = config.domain, destPath = config.destPath, srcPath = config.srcPath;
    filepath = srcPath || path.join(__dirname, "./trm.js");
    return new Promise(function(resolve, reject) {
      b.add(filepath);
      return b.bundle(function(err, src) {
        var file;
        if (err) {
          return reject(err);
        }
        file = src.toString();
        file = file.replace(/{DOMAIN_NAME}/g, domain);
        if (destPath) {
          self.saveFile(destPath, file);
        }
        return resolve(file);
      });
    });
  },
  saveFile: function(destPath, content) {
    return fs.writeFileSync(destPath, content);
  }
};
