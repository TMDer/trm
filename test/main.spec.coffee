trm = require("../out/import")
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

    result = trm.generateLib {
      domain: "yahoo.com.tw"
      destPath: "./tmp/test.js"
    }

    result.then (data) ->
      data.should.be.type('string')
      done()
