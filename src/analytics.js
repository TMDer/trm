! function () {
    function require(e, t, i) {
        var n = require.resolve(e);
        if (null == n) {
            i = i || e;
            t = t || "root";
            var o = new Error('Failed to require "' + i + '" from "' + t + '"');
            o.path = i;
            o.parent = t;
            o.require = !0;
            throw o
        }
        var a = require.modules[n];
        if (!a._resolving && !a.exports) {
            var r = {};
            r.exports = {};
            r.client = r.component = !0;
            a._resolving = !0;
            a.call(this, r.exports, require.relative(n), r);
            delete a._resolving;
            a.exports = r.exports
        }
        return a.exports
    }
    require.modules = {};
    require.aliases = {};
    require.resolve = function (e) {
        "/" === e.charAt(0) && (e = e.slice(1));
        for (var t = [e, e + ".js", e + ".json", e + "/index.js", e + "/index.json"], i = 0; i < t.length; i++) {
            var e = t[i];
            if (require.modules.hasOwnProperty(e)) return e;
            if (require.aliases.hasOwnProperty(e)) return require.aliases[e]
        }
    };
    require.normalize = function (e, t) {
        var i = [];
        if ("." != t.charAt(0)) return t;
        e = e.split("/");
        t = t.split("/");
        for (var n = 0; n < t.length; ++n) ".." == t[n] ? e.pop() : "." != t[n] && "" != t[n] && i.push(t[n]);
        return e.concat(i).join("/")
    };
    require.register = function (e, t) {
        require.modules[e] = t
    };
    require.alias = function (e, t) {
        if (!require.modules.hasOwnProperty(e)) throw new Error('Failed to alias "' + e + '", it does not exist');
        require.aliases[t] = e
    };
    require.relative = function (e) {
        function t(e, t) {
            for (var i = e.length; i--;)
                if (e[i] === t) return i;
            return -1
        }

        function i(t) {
            var n = i.resolve(t);
            return require(n, e, t)
        }
        var n = require.normalize(e, "..");
        i.resolve = function (i) {
            var o = i.charAt(0);
            if ("/" == o) return i.slice(1);
            if ("." == o) return require.normalize(n, i);
            var a = e.split("/"),
                r = t(a, "deps") + 1;
            r || (r = 0);
            i = a.slice(0, r + 1).join("/") + "/deps/" + i;
            return i
        };
        i.exists = function (e) {
            return require.modules.hasOwnProperty(i.resolve(e))
        };
        return i
    };

    // send data, via httprequest
    require.register("yields-send-json/index.js", function (e, t, i) {
        function n(e, t, i, n) {
            function o() {
                return 4 == a.readyState ? n(null, a) : void 0
            }
            3 == arguments.length && (n = i, i = {});
            var a = new XMLHttpRequest;
            a.onerror = n;
            a.onreadystatechange = o;
            a.open("POST", e, !0);
            for (var r in i) a.setRequestHeader(r, i[r]);
            a.send(c.stringify(t))
        }

        function o(t, i, n, o) {
            3 == arguments.length && (o = n);
            var r = e.prefix;
            i = a(c.stringify(i));
            i = encodeURIComponent(i);
            t += "?" + r + "=" + i;
            s(t, {
                param: e.callback
            }, function (e, i) {
                if (e) return o(e);
                o(null, {
                    url: t,
                    body: i
                });
                return void 0
            })
        }
        var a = t("base64-encode"),
            r = t("has-cors"),
            s = t("jsonp"),
            c = t("json");
        e = i.exports = r ? n : o;
        e.callback = "callback";
        e.prefix = "data";
        e.json = n;
        e.base64 = o;
        e.type = r ? "xhr" : "jsonp"
    });

    // send request and save data
    require.register("analytics-private/lib/integrations/segmentio.js", function (e, t, i) {
        function n() {
            var t = e.global;
            return "http:" == t.location.protocol ? "http:" : "https:"
        }

        function o() {}
        var a = t("integration");
        t("load-script");
        var r, s = t("utm-params"),
            c = t("ad-params"),
            l = t("send-json"),
            p = t("cookie"),
            d = t("clone"),
            u = t("uuid"),
            g = t("top-domain"),
            f = t("extend"),
            m = t("json");
        i.exports = e = function (e) {
            e.addIntegration(v);
            r = e
        };
        e.global = window;
        var y = {
                maxage: 31536e6,
                secure: !1,
                path: "/"
            },
            v = e.Integration = a("Segment.io").readyOnInitialize().option("apiKey", "");
        v.prototype.initialize = function () {
            var e = this.session(),
                t = this;
            e.sid || this.session(null);
            r.on("invoke", function (e) {
                var i = e.action(),
                    n = "on" + e.action();
                t.debug("%s %o", i, e);
                t[n] && t[n](e)
            })
        };
        v.prototype.loaded = function () {
            return !0
        };
        v.prototype.onpage = function (e) {
            this.send("/p", e.json())
        };
        v.prototype.onidentify = function (e) {
            this.send("/i", e.json())
        };
        v.prototype.ongroup = function (e) {
            this.send("/g", e.json())
        };
        v.prototype.ontrack = function (e) {
            var t = e.json();
            delete t.traits;
            this.send("/t", t)
        };
        v.prototype.onalias = function (e) {
            var t = e.json(),
                i = this.session();
            t.previousId = t.from || i.id || i.sid;
            t.userId = t.to;
            delete t.from;
            delete t.to;
            this.send("/a", t)
        };
        v.prototype.session = function (e) {
            var t = this.cookie("_sio") || "",
                i = t.split("----")[0],
                n = t.split("----")[1],
                o = {
                    sid: i,
                    id: n
                };
            if (0 == arguments.length) return o;
            if (e === n) return o;
            (n || null == n) && (o.sid = u());
            o.id = e;
            t = [o.sid, o.id].join("----");
            this.cookie("_sio", t);
            return o
        };
        v.prototype.normalize = function (t) {
            this.debug("normalize %o", t);
            var i = e.global,
                n = i.location.search,
                o = this.session();
            t.userId && (o = this.session(t.userId));
            !t.userId && o.id && (t.userId = o.id);
            var a = t.context = t.context || t.options || {};
            delete t.options;
            t.writeKey = this.options.apiKey;
            a.userAgent = navigator.userAgent;
            a.library = {
                name: "analytics.js",
                version: r.VERSION
            };
            n && (a.campaign = s(n));
            this.referrerId(n, a);
            t.anonymousId = o.sid;
            t.messageId = u();
            this.debug("normalized %o", t);
            return t
        };
        v.prototype.send = function (e, t, i) {
            var a = n() + "//api.segment.io/v1" + e,
                r = {
                    "Content-Type": "application/json"
                },
                i = i || o,
                s = this;
            t = this.normalize(t);
            l(a, t, r, function (e, n) {
                s.debug("sent %O, received %O", t, arguments);
                if (e) return i(e);
                i(null, n);
                return void 0
            })
        };
        v.prototype.cookie = function (t, i) {
            if (1 === arguments.length) return p(t);
            var n = e.global,
                o = n.location.href,
                a = "." + g(o);
            "." == a && (a = "");
            this.debug("cookie domain %s -> %s", o, a);
            var r = d(y);
            r.domain = a;
            this.debug("cookie %s, %s, %o", t, i, r);
            p(t, i, r);
            if (!p(i)) {
                delete r.domain;
                this.debug("fallback cookie %s, %s, %o", t, i, r);
                p(t, i, r)
            }
        };
        v.prototype.referrerId = function (e, t) {
            var i, n = this.cookie("s:context.referrer");
            n && (n = m.parse(n));
            e && (i = c(e));
            i = i || n;
            if (i) {
                t.referrer = f(t.referrer || {}, i);
                this.cookie("s:context.referrer", m.stringify(i))
            }
        }
    });

  // init analytics
  analytics.initialize({
      "Facebook Ads": {
          "events": {}
      },
      "Facebook Custom Audiences": {
          "pixelId": "432432432432",
          "events": {
              "test": "hello"
          }
      },
      "Segment.io": {
          "apiKey": "kl3i9psjto"
      }
  }, {
      initialPageview: 0 === snippet
  });
  for (; window.analytics && window.analytics.length > 0;) {
      var args = window.analytics.shift(),
          method = args.shift();
      analytics[method] && analytics[method].apply(analytics, args)
  }
  window.analytics = analytics
}();
