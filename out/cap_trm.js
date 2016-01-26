/*
# record, user data
*/

var TRM, VERSION, cookie, global, qs, request, url, uuid, _;

request = require('browser-request');

cookie = require("cookie-cutter");

url = require("url");

qs = require("querystring");

uuid = require('node-uuid');

VERSION = require("../package.json").version;

_ = require("lodash");

TRM = (function() {
  function TRM() {
    this.host = "{DOMAIN_NAME}/track";
    this.data = {
      PIXEL_DATA: PIXEL_DATA
    };
    this.targetTable = {
      TARGET_DATA: TARGET_DATA
    };
    this.pmdReturnData = {};
    this.KEYS = {
      ID: "pmd.uuid",
      ADGROUP: "pmd.adGroupId",
      PARAM_ADGROUP: "adgroupid",
      TRACKPIXEL: "pmd.trackPixelId",
      EXPIRES: 7,
      FOREVER: 9999999999,
      AUDIENCETAGID: "pmd-tag-aid"
    };
    return this;
  }

  TRM.prototype.setNGo = function(info) {
    this.pmdReturnData = info;
    return this.flow();
  };

  TRM.prototype.flow = function() {
    var that, triggers;
    console.log("!!! flow");
    that = this;
    this.initFacebookPixel();
    this.touchFacebookEvent(["track", "PageView"]);
    this.touchFacebookEvent(["track", "ViewContent"]);
    this.id = this.data.trackPixelId;
    triggers = this.data.triggers;
    _.forEach(triggers, function(trigger) {
      var currentUrl;
      console.log("!!! flow trigger", trigger);
      switch (trigger.triggerType) {
        case "Element":
          return that.setTriggerElementEvent(trigger);
        case "Page":
          currentUrl = window.location.href;
          if (currentUrl.indexOf(trigger.emitUrl) === -1) {
            return;
          }
          return that.process(trigger);
      }
    });
    return this.touchAdMinerEvent();
  };

  TRM.prototype.initFacebookPixel = function() {
    console.log("!!! initFacebookPixel");
    return this.touchFacebookEvent(["init", "{FB_PIXEL_ID}"]);
  };

  TRM.prototype.touchFacebookEvent = function(dataArray) {
    return fbq.apply(null, dataArray);
  };

  TRM.prototype.setTriggerElementEvent = function(trigger) {
    var elements, that, triggerElement;
    console.log("!!! setTriggerElementEvent");
    that = this;
    triggerElement = trigger.emitElement;
    elements = this.queryElement(triggerElement);
    console.log("!!! setTriggerElementEvent element", elements);
    return _.forEach(elements, function(element) {
      return element.addEventListener("click", function() {
        return that.process.call(that, trigger, that.touchAdMinerEvent);
      });
    });
  };

  TRM.prototype.process = function(trigger, callback) {
    var data, elementsObj, fbDataArray, fbDataForInitiateCheckout, step, that, totalPrice, totalPrices, triggerTarget;
    console.log("!!! process");
    that = this;
    elementsObj = trigger.elementsObj;
    data = {
      triggerEventId: trigger.id
    };
    console.log("!!! elements to collect", elementsObj);
    _.forEach(elementsObj, function(element, key) {
      var e;
      e = that.queryElement(element);
      if (_.isArrayLikeObject(e)) {
        e = _.map(e, function(obj) {
          return obj.innerText;
        });
        data[key] = e;
        return;
      }
      if (e) {
        return data[key] = e.innerText;
      }
    });
    console.log("!!! collect elements data", data);
    triggerTarget = trigger.triggerTarget;
    fbDataArray = this.transformData(triggerTarget, data);
    if (fbDataArray[1] === "CheckoutFlow") {
      step = trigger.emitStep;
      triggerTarget = triggerTarget + step;
      fbDataArray[1] = fbDataArray[1] + step;
      if (step === 1) {
        fbDataForInitiateCheckout = ["track", "InitiateCheckout"];
        fbDataForInitiateCheckout.push(fbDataArray[2]);
        console.log("!!! fbDataForInitiateCheckout", fbDataForInitiateCheckout);
        this.touchFacebookEvent(fbDataForInitiateCheckout);
      }
    }
    console.log("!!! fbDataArray", fbDataArray);
    this.touchFacebookEvent(fbDataArray);
    this.pmdReturnData[triggerTarget] = data;
    totalPrices = data.totalPrices;
    if (totalPrices && totalPrices[0]) {
      totalPrice = totalPrices[0];
      this.pmdReturnData.price = totalPrice;
      this.pmdReturnData.currency = trigger.currency;
    }
    if (_.isFunction(callback)) {
      return callback.call(that);
    }
  };

  TRM.prototype.transformData = function(adMinerTarget, data) {
    var fbData, fieldMap, otherFields, returnFbDataArray, targetMap, that;
    that = this;
    fbData = {};
    returnFbDataArray = [];
    targetMap = _.find(this.targetTable, function(targetObj, key) {
      return key === adMinerTarget;
    });
    console.log("!!! targetMap", targetMap);
    fieldMap = targetMap.fields;
    _.forEach(data, function(value, key) {
      return fbData[fieldMap[key]] = value;
    });
    otherFields = targetMap.otherFields;
    if (otherFields) {
      _.forEach(otherFields, function(field) {
        if (field === "currency") {
          return fbData.currency = that.data.currency;
        }
      });
    }
    console.log("!!! fbData", fbData);
    return [targetMap.facebookEventType, targetMap.facebookTarget, fbData];
  };

  TRM.prototype.queryElement = function(elementWithQueryInfo) {
    var element;
    if (elementWithQueryInfo.id) {
      element = document.getElementById(elementWithQueryInfo.id);
      return [element];
    }
    if (elementWithQueryInfo["class"]) {
      return document.getElementsByClassName(elementWithQueryInfo["class"]);
    }
    if (elementWithQueryInfo.name) {
      return document.getElementsByName(elementWithQueryInfo.name);
    }
    return document.querySelectorAll(elementWithQueryInfo.custom);
  };

  TRM.prototype.touchAdMinerEvent = function() {
    var error, that;
    that = this;
    this.params = this._prepareData();
    this.params.params = this.pmdReturnData;
    try {
      return request({
        method: "POST",
        url: this.protocol("" + this.host),
        body: JSON.stringify(this.params)
      }, function(err, res) {
        if (err) {
          console.log("There was an error.");
        }
      });
    } catch (_error) {
      error = _error;
      return console.log("send request, error happen");
    }
  };

  TRM.prototype.protocol = function(url) {
    var protocol;
    protocol = window.location.protocol === "https:" ? "https:" : "http:";
    if (url.indexOf("http") === 0) {
      return url.replace(/^http:|^https:/, protocol);
    }
    return protocol + "//" + url;
  };

  TRM.prototype._prepareData = function() {
    var param;
    param = this._initParams();
    return param;
  };

  TRM.prototype._initParams = function() {
    var aid, param;
    param = {};
    uuid = this._getTrmUuid();
    aid = this._getAdGroupId();
    param = {
      trackPixelId: this.id || 0,
      adGroupId: aid || 0,
      referer: document.referrer || "",
      id: uuid,
      version: VERSION || ""
    };
    return param;
  };

  TRM.prototype._getAdGroupId = function(url) {
    var aid, qsFromUrl, search;
    url = url || location.search;
    url = url.toLowerCase();
    search = qs.parse(url) || null;
    qsFromUrl = search[this.KEYS.PARAM_ADGROUP] || "";
    if (qsFromUrl.length > 0) {
      this._setCookie(this.KEYS.ADGROUP, qsFromUrl);
      return qsFromUrl;
    }
    aid = cookie.get(this.KEYS.ADGROUP) || null;
    return aid;
  };

  TRM.prototype._getTrmUuid = function() {
    var uid;
    uid = cookie.get(this.KEYS.ID);
    if (!uid) {
      uid = uuid.v4();
      this._setCookie(this.KEYS.ID, uid, true);
    }
    return uid;
  };

  TRM.prototype._setCookie = function(key, data, forever) {
    var newDate;
    newDate = new Date();
    if (forever) {
      newDate.setHours(newDate.getHours() + this.KEYS.FOREVER);
    } else {
      newDate.setDate(newDate.getDate() + this.KEYS.EXPIRES);
    }
    cookie.set(key, data, {
      expires: newDate,
      path: "/"
    });
    return this;
  };

  return TRM;

})();

global = window || module.exports;

global.analytics = global.analytics || [];

global.analytics = new TRM();

global.analytics.host = "{DOMAIN_NAME}/track";

global.console = global.console || {
  log: function(msg) {
    return msg;
  }
};

module.exports = TRM;
