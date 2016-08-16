###
# record, user data
###
request = require('browser-request')
cookie = require("cookie-cutter")
url = require("url")
qs = require("querystring")
uuid = require('node-uuid')
VERSION = require("../package.json").version
_lodash = require("lodash")
_lodash = _lodash.noConflict()



class TRM

  constructor: () ->

    @host = "{DOMAIN_NAME}/track"
    @fbPixelId = "{FB_PIXEL_ID}";
    @data = {PIXEL_DATA}
    @targetTable = {TARGET_DATA}
    @pmdReturnData = {}
    @hasInitFacebookPixel = false
    @hasInitHashChangeEvent = false
    @supportHashChangeTrmVersion = 24  #trm v0.2.4
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
    @info = info
    @pmdReturnData = _lodash.cloneDeep info
    @flow()

    isSupport = @checkTrmVersion(@supportHashChangeTrmVersion)
    return if isSupport or @hasInitHashChangeEvent
    @bindHashChangeEvent(info)

  bindHashChangeEvent: (info) ->
    that = @
    @hasInitHashChangeEvent = true
    onhashchangeEvent = window.onhashchange
    window.onhashchange = ->
      onhashchangeEvent() if onhashchangeEvent
      that.setNGo.call(that, info)
    return

  checkTrmVersion: (supportTrmVersion) ->
    currentTrmVersion = window.analytics.VERSION or "0"
    isSupport = false

    if currentTrmVersion and supportTrmVersion
      currentTrmVersion = currentTrmVersion.replace(/\./g, "")
      currentTrmVersion = parseInt currentTrmVersion

      isSupport = currentTrmVersion >= supportTrmVersion

    return isSupport

  flow: () ->

    that = @
    unless @hasInitFacebookPixel
      @initFacebookPixel()

    @touchFacebookEvent ["track", "PageView"]
    @id = @data.trackPixelId
    triggers = @data.triggers

    _lodash.forEach triggers, (trigger) ->
      switch trigger.triggerType
        when "Element"
          that.delayIfNotSuccess that, that.setTriggerElementEvent, [trigger]
          @touchAdMinerEvent()
        when "Page"
          currentUrl = window.location.href
          if currentUrl.indexOf(trigger.emitUrl) is -1 then return
          that.delayIfNotSuccess that, that.process, [trigger], that.touchAdMinerEvent



  delayIfNotSuccess: (context, fn, argumentArray, callback) ->

    isSuccess = fn.apply(context, argumentArray)
    if isSuccess and _lodash.isFunction(callback)
      callback.call(context)
    else
      setTimeout( ->
        fn.apply(context, argumentArray)
        callback.call(context) if _lodash.isFunction(callback)
        return
      , 3500)



  initFacebookPixel: () ->

    return if not this.hasFbPixelId()

    @touchFacebookEvent ["init", this.fbPixelId]
    @hasInitFacebookPixel = true



  touchFacebookEvent: (dataArray) ->
    # https://developers.facebook.com/docs/marketing-api/facebook-pixel/v2.5#standardevents
    return if not this.hasFbPixelId()

    fbq.apply null, dataArray



  hasFbPixelId : () ->

    if this.fbPixelId is "{FB_PIXEL_ID}"
      return true
    return false



  setTriggerElementEvent: (trigger) ->
    that = @
    triggerElement = trigger.emitElement
    elements = @queryElement triggerElement
    if elements.length is 0
      return false

    _lodash.forEach elements, (element) ->
      element.addEventListener "click", () ->
        that.process.call that, trigger, that.touchAdMinerEvent
    return true



  process: (trigger, callback) ->

    that = @
    elementsObj = trigger.elementsObj

    data = @collectElementsData elementsObj

    return false unless @isDataSuccessfullyGet(data)

    data.triggerEventId = trigger.id

    triggerTarget = trigger.triggerTarget
    fbDataArray = @transformData triggerTarget, data

    # If CheckoutFlow, touch CheckoutFlow + emitStep
    if fbDataArray[1] is "CheckoutFlow"
      step = trigger.emitStep
      triggerTarget = triggerTarget + step
      fbDataArray[1] = fbDataArray[1] + step
      # If emitStep is 1, touch InitiateCheckout as well
      if step is 1
        fbDataForInitiateCheckout = ["track", "InitiateCheckout"]
        fbDataForInitiateCheckout.push fbDataArray[2]
        @touchFacebookEvent fbDataForInitiateCheckout
    else if fbDataArray[1] is "Product"
      fbDataForViewContent = ["track", "ViewContent"]
      fbDataForViewContent.push fbDataArray[2]
      @touchFacebookEvent fbDataForViewContent

    @touchFacebookEvent fbDataArray

    # There should be a callback if it's triggered by element
    if _lodash.isFunction callback
      eventData = _lodash.cloneDeep @info
      eventData[triggerTarget] = data
      callback.call that, eventData
      return true

    @pmdReturnData[triggerTarget] = data

    # For Tracker targetValues 相容性
    totalPrices = data.totalPrices
    if totalPrices and totalPrices[0]
      totalPrice = totalPrices[0]
      @pmdReturnData.price = totalPrice
      @pmdReturnData.currency = @data.currency

    return true



  collectElementsData: (elementsObj) ->

    that = this
    data = {}

    _lodash.forEach elementsObj, (element, key) ->

      return true unless element and element[Object.keys(element)[0]]
      
      e = that.queryElement element
      if _lodash.isArrayLikeObject e
        e = _lodash.map e, (obj) ->
          return obj.innerText
        data[key] = e
        return
      if e
        data[key] = e.innerText

    return data



  isDataSuccessfullyGet: (elementsObj) ->

    return true unless _lodash.isPlainObject(elementsObj) and Object.keys(elementsObj).length

    isDataFound = false

    _lodash.forEach elementsObj, (e) ->
      if e.length and e[0]
        isDataFound = true
        return false

    return isDataFound



  transformData: (adMinerTarget, data) ->

    that = @
    fbData = {}
    returnFbDataArray = []
    targetMap = _lodash.find @targetTable, (targetObj, key) ->
      return key is adMinerTarget

    fieldMap = targetMap.fields

    _lodash.forEach data, (value, key) ->
      fbData[fieldMap[key]] = value
      delete fbData["undefined"]

    otherFields = targetMap.otherFields

    if otherFields
      _lodash.forEach otherFields, (field) ->
        if field is "currency" then fbData.currency = that.data.currency

    return [targetMap.facebookEventType, targetMap.facebookTarget, fbData]



  queryElement: (elementWithQueryInfo) ->

    return null unless elementWithQueryInfo

    if elementWithQueryInfo.id
      element = document.getElementById elementWithQueryInfo.id
      return [element] if element
      return []
    if elementWithQueryInfo.class
      return document.getElementsByClassName elementWithQueryInfo.class
    if elementWithQueryInfo.name
      return document.getElementsByName elementWithQueryInfo.name
    return document.querySelectorAll elementWithQueryInfo.customSelection



  touchAdMinerEvent: (data = undefined) ->

    that = @
    @params = @prepareData()
    @params.params = if data then data else @pmdReturnData

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



  prepareData: () ->
    # it will get params and get params from data, and update cookie
    param = @initParams()
    return param



  initParams: () ->
    # get uuid from cookie
    param = {}
    uuid = @getTrmUuid()
    #get adgroup ID, from local cookie or url params
    aid = @getAdGroupId()

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



  getAdGroupId: (url) ->
    #get adgroup from url
    url = url || location.search
    url = url.toLowerCase()
    search = qs.parse(url) || null
    qsFromUrl = search[@KEYS.PARAM_ADGROUP] || ""

    if qsFromUrl.length > 0
      @setCookie @KEYS.ADGROUP, qsFromUrl
      return qsFromUrl

    aid = cookie.get(@KEYS.ADGROUP) || null
    return aid



  #get uuid from cookie, or generate a new uid
  getTrmUuid: () ->
    uid = cookie.get(@KEYS.ID)
    # create a uid
    unless uid
      uid = uuid.v4()
      @setCookie(@KEYS.ID, uid, true)
    return uid



  # set cookie and set it is forever or expreis
  # the expires setting is depend on KEYS
  setCookie: (key, data, forever) ->
    newDate = new Date()

    if forever
      newDate.setHours(newDate.getHours() + @KEYS.FOREVER)
    else
      newDate.setDate(newDate.getDate() + @KEYS.EXPIRES)

    cookie.set(key, data, { expires: newDate, path: "/" })
    return @



global = window || module.exports
global.analytics = global.analytics || []
global.analytics = _lodash.merge(global.analytics, new TRM())
global.analytics.host = "{DOMAIN_NAME}/track"
global.console = global.console || {
  log: (msg) ->
    return msg
}

module.exports = TRM





