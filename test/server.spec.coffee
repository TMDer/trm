trm = require("../out/import")
fs = require("fs")
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

httpServer = require("./server/http")
request = require("supertest")

trm.DEBUG = true

describe 'basic test for http', () ->
  it "run a static file server", (done) ->
    request(httpServer)
      .get('/')
      .expect(200, done)



describe 'test for https, cert only', () ->
  it "run a static file server", (done) ->
    request(require("./server/https"))
      .get('/')
      .expect(200, done)