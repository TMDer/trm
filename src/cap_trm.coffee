###
# record, user data
###
request = require('browser-request')
cookie = require("cookie-cutter")
url = require("url")
qs = require("querystring")
uuid = require('node-uuid')
VERSION = require("../package.json").version
_ = require("lodash")



class TRM

  constructor: () ->

    @host = "{DOMAIN_NAME}/track"
    @data = {PIXEL_DATA}
    @targetTable = {TARGET_DATA}
    @pmdReturnData = {}
    @KEYS = {
      ID: "pmd.uuid"
      ADGROUP: "pmd.adGroupId"
      PARAM_ADGROUP: "adgroupid"
      TRACKPIXEL: "pmd.trackPixelId"
      EXPIRES: 7
      FOREVER: 9999999999
      AUDIENCETAGID: "pmd-tag-aid"
    }
    return @



  setNGo: (info) ->
    # info: {email: "xxx"}
    @pmdReturnData = info
    @flow()



  flow: () ->
    console.log "!!! flow"
    that = @
    @initFacebookPixel()
    @touchFacebookEvent ["track", "PageView"]
    @touchFacebookEvent ["track", "ViewContent"]
    @id = @data.trackPixelId
    triggers = @data.triggers

    _.forEach triggers, (trigger) ->
      console.log "!!! flow trigger", trigger
      switch trigger.triggerType
        when "Element"
          that.setTriggerElementEvent trigger
        when "Page"
          currentUrl = window.location.href
          if currentUrl.indexOf(trigger.emitUrl) is -1 then return
          that.process trigger

    # _.defer @touchAdMinerEvent
    @touchAdMinerEvent()



  initFacebookPixel: () ->
    console.log "!!! initFacebookPixel"
    @touchFacebookEvent ["init", "{FB_PIXEL_ID}"]



  touchFacebookEvent: (dataArray) ->
    # https://developers.facebook.com/docs/marketing-api/facebook-pixel/v2.5#standardevents
    fbq.apply null, dataArray



  setTriggerElementEvent: (trigger) ->
    console.log "!!! setTriggerElementEvent"
    that = @
    triggerElement = trigger.emitElement
    element = @queryElement triggerElement
    console.log "!!! setTriggerElementEvent element", element

    element.addEventListener "click.adMiner", () ->
      that.process trigger, that.touchAdMinerEvent



  process: (trigger, callback) ->
    console.log "!!! process"
    that = @
    elementsObj = trigger.elementsObj
    data =
      triggerEventId: trigger.id

    console.log "!!! elements to collect", elementsObj

    _.forEach elementsObj, (element, key) ->
      e = that.queryElement element
      if _.isArrayLikeObject e
        e = _.map e, (obj) ->
          return obj.innerText
        data[key] = e
        return
      if e
        data[key] = e.innerText

    # data = {
    #   productCategory: "3C",
    #   productName: "MAC Book"
    # }
    console.log "!!! collect elements data", data

    triggerTarget = trigger.triggerTarget
    fbDataArray = @transformData triggerTarget, data

    if fbDataArray[1] is "CheckoutFlow"
      step = trigger.emitStep
      triggerTarget = triggerTarget + step
      fbDataArray[1] = fbDataArray[1] + step
      if step is 1
        fbDataForInitiateCheckout = ["track", "InitiateCheckout"]
        fbDataForInitiateCheckout.push fbDataArray[2]
        console.log "!!! fbDataForInitiateCheckout", fbDataForInitiateCheckout
        @touchFacebookEvent fbDataForInitiateCheckout

    console.log "!!! fbDataArray", fbDataArray

    @touchFacebookEvent fbDataArray
    @pmdReturnData[triggerTarget] = data

    # For Tracker targetValues 相容性
    totalPrices = data.totalPrices
    if totalPrices and totalPrices[0]
      totalPrice = totalPrices[0]
      @pmdReturnData.price = totalPrice
      @pmdReturnData.currency = trigger.currency

    if _.isFunction callback then callback()



  transformData: (adMinerTarget, data) ->

    # data = {
    #   productCategory: "3C",
    #   productName: "MAC Book"
    # }

    that = @
    fbData = {}
    returnFbDataArray = []
    targetMap = _.find @targetTable, (targetObj, key) ->
      return key is adMinerTarget

    # targetMap = {
    #   facebookEventType: "trackCustom",
    #   facebookTarget: "Product",
    #   fields: {
    #     "productCategories": "content_category",
    #     "productNames": "content_name",
    #   },
    #   // otherFields: ["currency"]
    # }
    console.log "!!! targetMap", targetMap

    fieldMap = targetMap.fields

    _.forEach data, (value, key) ->
      # "3C", "productCategory"
      fbData[fieldMap[key]] = value

    otherFields = targetMap.otherFields

    if otherFields
      _.forEach otherFields, (field) ->
        if field is "currency" then fbData.currency = that.data.currency

    # fbData = {
    #   content_category: "3C",
    #   content_name: "MAC Book"
    # }
    console.log "!!! fbData", fbData

    return [targetMap.facebookEventType, targetMap.facebookTarget, fbData]



  # collectData: (element, key) ->

  #   # data = {}
  #   e = that.queryElement element
  #   if _.isArrayLikeObject e
  #     e = _.map e, (obj) ->
  #       return obj.innerText
  #     return {"#{key}": e}
  #   else if e
  #     return {"#{key}": e.innerText}
  #   else
  #     return null



  queryElement: (elementWithQueryInfo) ->

    if elementWithQueryInfo.id
      element = document.getElementById elementWithQueryInfo.id
      return [element]
    if elementWithQueryInfo.class
      return document.getElementsByClassName elementWithQueryInfo.class
    if elementWithQueryInfo.name
      return document.getElementsByName elementWithQueryInfo.name
    return document.querySelectorAll elementWithQueryInfo.custom



  touchAdMinerEvent: () ->

    that = @
    @params = @_prepareData()
    @params.params = @pmdReturnData

    try
      request {
        method: "POST"
        url: @protocol("#{@host}")
        body: JSON.stringify(@params)
      }, (err, res) ->
        if err
          console.log "There was an error."
        # , but at least browser-request loaded and ran!'
        # result = JSON.parse res.body
        return
        
    catch error
      return console.log("send request, error happen")



  protocol: (url) ->

    protocol = if window.location.protocol is "https:" then "https:" else "http:"
    if url.indexOf("http") is 0
      return url.replace(/^http:|^https:/, protocol)
    return protocol + "//" + url



  _prepareData: () ->
    # it will get params and get params from data, and update cookie
    param = @_initParams()
    return param



  _initParams: () ->
    # get uuid from cookie
    param = {}
    uuid = @_getTrmUuid()
    #get adgroup ID, from local cookie or url params
    aid = @_getAdGroupId()

    # set all param
    param = {
      trackPixelId: @id || 0
      adGroupId: aid || 0
      referer: document.referrer || ""
      id: uuid
      version: VERSION || ""
    }

    # if console
    #   console.log "final collect params --> "
    #   console.log param

    return param



  _getAdGroupId: (url) ->
    #get adgroup from url
    url = url || location.search
    url = url.toLowerCase()
    search = qs.parse(url) || null
    qsFromUrl = search[@KEYS.PARAM_ADGROUP] || ""

    if qsFromUrl.length > 0
      @_setCookie @KEYS.ADGROUP, qsFromUrl
      return qsFromUrl

    aid = cookie.get(@KEYS.ADGROUP) || null
    return aid



  #get uuid from cookie, or generate a new uid
  _getTrmUuid: () ->
    uid = cookie.get(@KEYS.ID)
    # create a uid
    unless uid
      uid = uuid.v4()
      @_setCookie(@KEYS.ID, uid, true)
    return uid



  # set cookie and set it is forever or expreis
  # the expires setting is depend on KEYS
  _setCookie: (key, data, forever) ->
    newDate = new Date()

    if forever
      newDate.setHours(newDate.getHours() + @KEYS.FOREVER)
    else
      newDate.setDate(newDate.getDate() + @KEYS.EXPIRES)

    cookie.set(key, data, { expires: newDate, path: "/" })
    return @



global = window || module.exports
global.analytics = global.analytics || []
global.analytics = new TRM()
global.analytics.host = "{DOMAIN_NAME}/track"
global.console = global.console || {
  log: (msg) ->
    return msg
}

module.exports = TRM





