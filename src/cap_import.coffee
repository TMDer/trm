UglifyJS = require("uglify-js")
fs = require("fs")
path = require("path")
optUrl = process.LIB || "localhost:1337/lib/trm.compile.js"

Promise = require("bluebird")
browserify = require('browserify')
VERSION = require("../package.json").version

module.exports = exports = {
  DEBUG: false

  # For Platform displaying pixel code
  config: (opt) ->

    if typeof opt isnt "string"
      return throw "optUrl should be a string type"
    @optUrl = optUrl = opt
    return @

  optUrl: optUrl

  resultDisplay: ({code, pid, aid}) ->

    code = code.replace /{ENV_PATH}/g, @optUrl + pid

    return code + """
      window.analytics.load(function () {
        window.analytics.setNGo({"email": "aaa@bbb.cc"});
      });
    """

  compress: (filepath, opt) ->
    filepath = filepath || path.join(__dirname, "./cap_usage.js")

    file = fs.readFileSync filepath, "utf8"
    file = file.replace "{VERSION}", VERSION
    code = file
    result = @.compressContent code
    return result



  # For Tracker generating custom trm
  generateLib: (config) ->

    self = @
    {domain, destPath, srcPath, minify} = config
    filepath = srcPath || path.join(__dirname, "./cap_trm.js")

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

  compressContent: (content) ->
    return UglifyJS.minify(content, {fromString: true})

  saveFile: (destPath, content) ->
    return fs.writeFileSync(destPath, content)

}
# compress()
