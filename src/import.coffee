UglifyJS = require("uglify-js")
fs = require("fs")
path = require("path")
optUrl = process.LIB || "localhost:1337/lib/trm.compile.js"

Promise = require("bluebird")
browserify = require('browserify')
b = browserify()

module.exports = exports = {
  DEBUG: false
  config: (opt) ->
    if typeof opt isnt "string"
      return throw "optUrl should be a string type"
    @optUrl = optUrl = opt
    console.log @.optUrl
    return @

  optUrl: optUrl

  compress: (filepath, opt) ->
    filepath = filepath || path.join(__dirname, "../usage/index.js")
    optUrl = opt || optUrl

    file = fs.readFileSync filepath, "utf8"
    file = file.replace("{ENV_PATH}", optUrl)
    file = file.replace("{VERSION}", require("../package.json").version)
    code = file
    result = UglifyJS.minify(code, { fromString: true})
    if @DEBUG
      console.log result.code
    return result

  generateLib: (config) ->
    self = @
    {domain, destPath, srcPath} = config
    filepath = srcPath || path.join(__dirname, "./trm.js")

    # will return a promise module
    return new Promise (resolve, reject) ->
      b.add(filepath)
      b.bundle (err, src) ->
        return reject(err) if err

        file = src.toString()
        file = file.replace(/{DOMAIN_NAME}/g, domain)

        if (destPath)
          self.saveFile(destPath, file)

        resolve(file)


  saveFile: (destPath, content) ->
    return fs.writeFileSync(destPath, content)

}
# compress()
