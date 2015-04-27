/*
# record, user data
*/

var TRM, cookie, global, qs, request, url, uuid;

request = require('browser-request');

cookie = require("cookie-cutter");

url = require("url");

qs = require("querystring");

uuid = require('node-uuid');

TRM = (function() {
  function TRM() {
    this.host = "{DOMAIN_NAME}/track";
    this.audienceHost = "https://www.facebook.com/tr?id={AID}&amp;ev=PixelInitialized";
    this.params = {};
    this.subParams = {};
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
      version: this.version || ""
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

  TRM.prototype.host = function(host) {
    return this.host = host;
  };

  TRM.prototype.initial = function(id, aid) {
    this.id = id;
    return this.aid = aid;
  };

  TRM.prototype.setVersion = function(version) {
    return this.version = version;
  };

  TRM.prototype._protocol = function(url) {
    var protocol;
    protocol = window.location.protocol === "https:" ? "https:" : "http:";
    if (url.indexOf("http") === 0) {
      return url.replace(/^http:|^https:/, protocol);
    }
    return protocol + "//" + url;
  };

  TRM.prototype.send = function(path, _fbq) {
    var error, that;
    that = this;
    this.params = this._prepareData();
    if (this.subParams) {
      this.params.params = this.subParams;
    }
    try {
      request({
        method: "POST",
        url: this._protocol("" + this.host + path),
        body: JSON.stringify(this.params)
      }, function(er, res) {
        var fbConversionIds, result;
        if (!er) {
          result = JSON.parse(res.body);
          fbConversionIds = JSON.parse("[" + result.fbConversionInfo.fbConversionIds + "]");
          that.sendFbConversionInfo(fbConversionIds, _fbq);
          return;
        }
        return console.log('There was an error, but at least browser-request loaded and ran!');
      });
    } catch (_error) {
      error = _error;
      return console.log("send request, error happen");
    }
    return this.sendAudience();
  };

  TRM.prototype.sendFbConversionInfo = function(fbConversionIds, _fbq) {
    var fbConversionId, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = fbConversionIds.length; _i < _len; _i++) {
      fbConversionId = fbConversionIds[_i];
      _fbq = _fbq || [];
      _results.push(_fbq.push([
        'track', fbConversionId, {
          'value': '0.00',
          'currency': 'USD'
        }
      ]));
    }
    return _results;
  };

  TRM.prototype.sendAudience = function(aid) {
    var img, src, _ref;
    if (window.document.getElementById(this.KEYS.AUDIENCETAGID)) {
      return;
    }
    aid = aid || this.aid;
    img = new Image(1, 1);
    window.document.body.appendChild(img);
    src = this.audienceHost.replace("{AID}", aid);
    img.src = src;
    if ((_ref = img.style) != null) {
      _ref.display = "none";
    }
    return img;
  };

  TRM.prototype.push = function(key, value) {
    var items;
    if (typeof key === "object") {
      items = key;
      items.forEach(function(val, key) {
        return this.subParams[key] = val;
      });
      return this;
    }
    if (key) {
      this.subParams[key] = value;
      return;
    }
    return this;
  };

  TRM.prototype._call = function(key, value) {};

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
