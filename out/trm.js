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
      id: uuid
    };
    if (console) {
      console.log("final collect params --> ");
      console.log(param);
    }
    return param;
  };

  TRM.prototype._getAdGroupId = function(url) {
    var aid, qsFromUrl, search;
    url = url.toLowerCase() || location.search.toLowerCase();
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

  TRM.prototype._protocal = function(url) {
    if (window.location.protocol === "https://") {
      return url.replace("http://", "https://");
    }
    return url.replace("https://", "http://");
  };

  TRM.prototype.send = function(path) {
    var error;
    this.params = this._prepareData();
    if (this.subParams) {
      this.params.params = this.subParams;
    }
    try {
      request({
        method: "POST",
        url: "" + this.host + path,
        body: JSON.stringify(this.params)
      }, function(er, res) {
        if (!er) {
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

  TRM.prototype.sendAudience = function(aid) {
    var img, src, _ref;
    if (window.document.getElementById(this.KEYS.AUDIENCETAGID)) {
      return;
    }
    aid = aid || this.aid;
    if (!aid) {
      return console.log("Aid is not found");
    }
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
