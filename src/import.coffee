UglifyJS = require("uglify-js")
fs = require("fs")
path = require("path")
optUrl = process.LIB || "localhost:1337/lib/trm.compile.js"

Promise = require("bluebird")
browserify = require('browserify')

module.exports = exports = {
  DEBUG: false
  config: (opt) ->
    if typeof opt isnt "string"
      return throw "optUrl should be a string type"
    @optUrl = optUrl = opt
    return @

  optUrl: optUrl

  resultDisplay: ({code, pid, aid}) ->
    return code + """
      window.analytics.load(function () {
        window.fbConversion.load();
        window.analytics.initial("#{pid}", "#{aid}");
        window.analytics.send("");
      });
    """

  compress: (filepath, opt) ->
    filepath = filepath || path.join(__dirname, "./usage.js")
    optUrl = opt || optUrl

    file = fs.readFileSync filepath, "utf8"
    file = file.replace("{ENV_PATH}", optUrl)
    file = file.replace("{VERSION}", require("../package.json").version)
    code = file
    result = @.compressContent(code)
    return result

  compressContent: (content) ->
    return UglifyJS.minify(content, { fromString: true})

  generateLib: (config) ->
    self = @
    {domain, destPath, srcPath, minify} = config
    filepath = srcPath || path.join(__dirname, "./trm.js")

    # will return a promise module
    return new Promise (resolve, reject) ->
      b = browserify()
      b.add(filepath)
      b.bundle (err, src) ->
        return reject(err) if err

        file = src.toString()
        file = file.replace(/{DOMAIN_NAME}/g, domain)

        if minify
          file = self.compressContent(file)
          file = file.code

        unless destPath
          return reject()

        destPath = path.join(process.cwd(), destPath)
        self.saveFile(destPath, file)

        resolve(file)


  saveFile: (destPath, content) ->
    return fs.writeFileSync(destPath, content)

}
# compress()
