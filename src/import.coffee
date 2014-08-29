UglifyJS = require("uglify-js")
fs = require("fs")
path = require("path")
optUrl = process.LIB || "localhost:1337/lib/trm.compile.js"

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
    {domain, destPath, srcPath} = config

    filepath = srcPath || path.join(__dirname, "./trm.js")

    file = fs.readFileSync filepath, "utf8"
    file = file.replace(/{DOMAIN_NAME}/g, domain)

    if (destPath)
      # destPath = path.join(__dirname , "node_modules/trm/out", "./trm.js")
      console.log destPath
      console.log "save file of: #{destPath}"
      @.saveFile(destPath, file)

    # console.log file
    return file

  saveFile: (destPath, content) ->
    return fs.writeFileSync(destPath, content)

}
# compress()
