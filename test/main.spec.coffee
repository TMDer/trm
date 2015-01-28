trm = require("../out/import")
fs = require("fs")
path = require("path")
trm.DEBUG = true

describe "tracking system test", (done) ->
  it "run with path return", (done) ->
    optUrl = "caesarchi.com/test.js"
    trm.config(optUrl)
    trm.optUrl.should.be.type("string")
    trm.optUrl.should.startWith("caesarchi.com/test.js")
    done()
  it "after compress, show result", (done) ->
    result = trm.compress()
    result.should.be.type("object")
    result.code.should.be.type("string")
    result.code.should.should.match(/caesarchi.com/)
    result.code.should.startWith("!function()")
    done()

  it "check client version and trm version", (done) ->
    version = require("../package.json").version
    result = trm.compress()
    regexp = new RegExp(version)
    result.code.should.should.match(regexp)
    done()

  it "generate library file", (done) ->
    destPath = "./test/server/static/.tmp/test.js"
    result = trm.generateLib {
      domain: "yahoo.com.tw"
      destPath: destPath
    }

    result.then (data) ->
      data.should.be.type('string')
      done()

describe "run trm test", (done) ->
  it "output / save a file", (done) ->
    destPath = "./test/server/static/.tmp/test.js"
    result = trm.generateLib {
      domain: "yahoo.com.tw"
      destPath: destPath
      minify: true
    }

    result.then (data) ->
      # trm.saveFile "test/.tmp/trm.js", data
      file = fs.existsSync(path.join(process.cwd(), destPath))
      file.should.be.true
      done()

describe "compress content", (done) ->
  it "only compress", (done) ->
    content = """
      var hello = function () {
        s = "hello" + "world";
        return s;
      };
    """
    result = trm.compressContent(content)
    
    code = result.code
    code.should.be.a.string
    code.indexOf("\n").should.be.equal(-1)
    done()

  it ", resultDisplay function - show emebmed code result", (done) ->
    compressed = trm.compress()
    result = trm.resultDisplay({code: compressed.code, pid: "-999", aid: "-9999"})
    console.log result
    result.should.be.string
    result.indexOf("-9999").should.not.be.equal(-1)
    done()

# TRM = require("../out/trm")
# trmLib = new TRM()

# describe.only "ad group id check", (done) ->
#   it "verify ad group id is correct from url", (done) ->
#     url = "http://apps.friday.tw/index.php?page=public&type=fb_xjzl_precious&trackPixelId=14&adGroupId=148"
#     console.log trmLib
#     result = trmLib._getAdGroupId(url)
#     console.log result

