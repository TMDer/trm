var UglifyJS, exports, fs, optUrl, path;

UglifyJS = require("uglify-js");

fs = require("fs");

path = require("path");

optUrl = process.LIB || "localhost:1337/lib/trm.compile.js";

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
  }
};
