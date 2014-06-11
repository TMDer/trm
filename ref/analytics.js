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
    require.register("analytics-private/lib/index.js", function (e, t, i) {
        var n = t("analytics"),
            o = t("each"),
            a = t("./integrations");
        o(a, function (e, t) {
            n.use(t)
        });
        i.exports = n;
        n.require = t
    });
    require.register("analytics-private/lib/integrations/index.js", function (e, t) {
        var i = t("./slugs.json"),
            n = t("each");
        n(i, function (i) {
            var n = t("./" + i),
                o = n.Integration.prototype.name;
            e[o] = n
        })
    });;;;;
    require.register("analytics-private/lib/integrations/facebook-custom-audiences.js", function (e, t, i) {
        t("global-queue")("_fbq");
        var n = t("integration"),
            o = t("load-script");
        t("each");
        i.exports = e = function (e) {
            e.addIntegration(a)
        };
        var a = e.Integration = n("Facebook Custom Audiences").readyOnInitialize().global("_fbds").global("_fbq").option("pixelId", "").option("currency", "USD").option("events", {});
        a.prototype.initialize = function () {
            var e = this.options.pixelId;
            window._fbds = window._fbds || {};
            window._fbds.pixelId = e;
            window._fbq = window._fbq || [];
            window._fbq.push(["track", "PixelInitialized", {}]);
            this.load()
        };
        a.prototype.loaded = function () {
            return !(!window._fbq || [].push == window._fbq.push)
        };
        a.prototype.load = function (e) {
            o("//connect.facebook.net/en_US/fbds.js", e)
        };
        var r = Object.prototype.hasOwnProperty;
        a.prototype.track = function (e) {
            var t = this.options.events,
                i = e.event(),
                n = e.properties();
            if (r.call(t, i)) {
                var o = this.options.currency,
                    a = e.revenue() || 0;
                window._fbq.push(["track", t[i], {
                    currency: o,
                    value: a
                }])
            }
            window._fbq.push(["track", i, n])
        }
    });;;;;;;;;;;
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
    });;;;
    require.register("component-cookie/index.js", function (e, t, i) {
        function n(e, t, i) {
            i = i || {};
            var n = s(e) + "=" + s(t);
            null == t && (i.maxage = -1);
            i.maxage && (i.expires = new Date(+new Date + i.maxage));
            i.path && (n += "; path=" + i.path);
            i.domain && (n += "; domain=" + i.domain);
            i.expires && (n += "; expires=" + i.expires.toGMTString());
            i.secure && (n += "; secure");
            document.cookie = n
        }

        function o() {
            return r(document.cookie)
        }

        function a(e) {
            return o()[e]
        }

        function r(e) {
            var t, i = {},
                n = e.split(/ *; */);
            if ("" == n[0]) return i;
            for (var o = 0; o < n.length; ++o) {
                t = n[o].split("=");
                i[c(t[0])] = c(t[1])
            }
            return i
        }
        var s = encodeURIComponent,
            c = decodeURIComponent;
        i.exports = function (e, t, i) {
            switch (arguments.length) {
            case 3:
            case 2:
                return n(e, t, i);
            case 1:
                return a(e);
            default:
                return o()
            }
        }
    });
    require.register("component-each/index.js", function (e, t, i) {
        function n(e, t) {
            for (var i = 0; i < e.length; ++i) t(e.charAt(i), i)
        }

        function o(e, t) {
            for (var i in e) s.call(e, i) && t(i, e[i])
        }

        function a(e, t) {
            for (var i = 0; i < e.length; ++i) t(e[i], i)
        }
        var r = t("type"),
            s = Object.prototype.hasOwnProperty;
        i.exports = function (e, t) {
            switch (r(e)) {
            case "array":
                return a(e, t);
            case "object":
                return "number" == typeof e.length ? a(e, t) : o(e, t);
            case "string":
                return n(e, t)
            }
        }
    });
    require.register("component-clone/index.js", function (e, t, i) {
        function n(e) {
            switch (o(e)) {
            case "object":
                var t = {};
                for (var i in e) e.hasOwnProperty(i) && (t[i] = n(e[i]));
                return t;
            case "array":
                for (var t = new Array(e.length), a = 0, r = e.length; r > a; a++) t[a] = n(e[a]);
                return t;
            case "regexp":
                var s = "";
                s += e.multiline ? "m" : "";
                s += e.global ? "g" : "";
                s += e.ignoreCase ? "i" : "";
                return new RegExp(e.source, s);
            case "date":
                return new Date(e.getTime());
            default:
                return e
            }
        }
        var o;
        try {
            o = t("type")
        } catch (a) {
            o = t("type-component")
        }
        i.exports = n
    });
    require.register("component-map/index.js", function (e, t, i) {
        var n = t("to-function");
        i.exports = function (e, t) {
            var i = [];
            t = n(t);
            for (var o = 0; o < e.length; ++o) i.push(t(e[o], o));
            return i
        }
    });
    require.register("component-querystring/index.js", function (e, t) {
        var i = encodeURIComponent,
            n = decodeURIComponent,
            o = t("trim"),
            a = t("type");
        e.parse = function (e) {
            if ("string" != typeof e) return {};
            e = o(e);
            if ("" == e) return {};
            "?" == e.charAt(0) && (e = e.slice(1));
            for (var t = {}, i = e.split("&"), a = 0; a < i.length; a++) {
                var r, s = i[a].split("="),
                    c = n(s[0]);
                if (r = /(\w+)\[(\d+)\]/.exec(c)) {
                    t[r[1]] = t[r[1]] || [];
                    t[r[1]][r[2]] = n(s[1])
                } else t[s[0]] = null == s[1] ? "" : n(s[1])
            }
            return t
        };
        e.stringify = function (e) {
            if (!e) return "";
            var t = [];
            for (var n in e) {
                var o = e[n];
                if ("array" != a(o)) t.push(i(n) + "=" + i(e[n]));
                else
                    for (var r = 0; r < o.length; ++r) t.push(i(n + "[" + r + "]") + "=" + i(o[r]))
            }
            return t.join("&")
        }
    });
    require.register("component-type/index.js", function (e, t, i) {
        var n = Object.prototype.toString;
        i.exports = function (e) {
            switch (n.call(e)) {
            case "[object Date]":
                return "date";
            case "[object RegExp]":
                return "regexp";
            case "[object Arguments]":
                return "arguments";
            case "[object Array]":
                return "array";
            case "[object Error]":
                return "error"
            }
            if (null === e) return "null";
            if (void 0 === e) return "undefined";
            if (e !== e) return "nan";
            if (e && 1 === e.nodeType) return "element";
            e = e.valueOf ? e.valueOf() : Object.prototype.valueOf.apply(e);
            return typeof e
        }
    });
    require.register("component-url/index.js", function (e) {
        function t(e) {
            switch (e) {
            case "http:":
                return 80;
            case "https:":
                return 443;
            default:
                return location.port
            }
        }
        e.parse = function (e) {
            var i = document.createElement("a");
            i.href = e;
            return {
                href: i.href,
                host: i.host || location.host,
                port: "0" === i.port || "" === i.port ? t(i.protocol) : i.port,
                hash: i.hash,
                hostname: i.hostname || location.hostname,
                pathname: "/" != i.pathname.charAt(0) ? "/" + i.pathname : i.pathname,
                protocol: i.protocol && ":" != i.protocol ? i.protocol : location.protocol,
                search: i.search,
                query: i.search.slice(1)
            }
        };
        e.isAbsolute = function (e) {
            return 0 == e.indexOf("//") || !!~e.indexOf("://")
        };
        e.isRelative = function (t) {
            return !e.isAbsolute(t)
        };
        e.isCrossDomain = function (t) {
            t = e.parse(t);
            return t.hostname !== location.hostname || t.port !== location.port || t.protocol !== location.protocol
        }
    });
    require.register("forbeslindesay-base64-encode/index.js", function (e, t, i) {
        function n(e) {
            var t, i, n, r, s, c, l, p = "",
                d = 0;
            e = o(e);
            for (; d < e.length;) {
                t = e.charCodeAt(d++);
                i = e.charCodeAt(d++);
                n = e.charCodeAt(d++);
                r = t >> 2;
                s = (3 & t) << 4 | i >> 4;
                c = (15 & i) << 2 | n >> 6;
                l = 63 & n;
                isNaN(i) ? c = l = 64 : isNaN(n) && (l = 64);
                p = p + a.charAt(r) + a.charAt(s) + a.charAt(c) + a.charAt(l)
            }
            return p
        }
        var o = t("utf8-encode"),
            a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        i.exports = n
    });
    require.register("ianstormtaylor-case/lib/index.js", function (e, t, i) {
        function n(e) {
            for (var t in o)
                if ("none" != t) {
                    var i = o[t];
                    if (i(e) == e) return t
                }
            return null
        }
        var o = t("./cases");
        i.exports = e = n;
        e.cases = o;
        e.add = function (t, i) {
            e[t] = o[t] = i
        };
        for (var a in o) e.add(a, o[a])
    });
    require.register("ianstormtaylor-case/lib/cases.js", function (e, t) {
        var i = t("to-camel-case"),
            n = t("to-capital-case"),
            o = t("to-constant-case"),
            a = t("to-dot-case"),
            r = t("to-no-case"),
            s = t("to-pascal-case"),
            c = t("to-sentence-case"),
            l = t("to-slug-case"),
            p = t("to-snake-case"),
            d = t("to-space-case"),
            u = t("to-title-case");
        e.camel = i;
        e.pascal = s;
        e.dot = a;
        e.slug = l;
        e.snake = p;
        e.space = d;
        e.constant = o;
        e.capital = n;
        e.title = u;
        e.sentence = c;
        e.lower = function (e) {
            return r(e).toLowerCase()
        };
        e.upper = function (e) {
            return r(e).toUpperCase()
        };
        e.inverse = function (e) {
            for (var t, i = 0; t = e[i]; i++)
                if (/[a-z]/i.test(t)) {
                    var n = t.toUpperCase(),
                        o = t.toLowerCase();
                    e[i] = t == n ? o : n
                }
            return e
        };
        e.none = r
    });
    require.register("ianstormtaylor-is/index.js", function (e, t) {
        function i(e) {
            return function (t) {
                return e === o(t)
            }
        }
        var n = t("is-empty");
        try {
            var o = t("type")
        } catch (a) {
            var o = t("component-type")
        }
        for (var r, s = ["arguments", "array", "boolean", "date", "element", "function", "null", "number", "object", "regexp", "string", "undefined"], c = 0; r = s[c]; c++) e[r] = i(r);
        e.fn = e["function"];
        e.empty = n;
        e.nan = function (t) {
            return e.number(t) && t != t
        }
    });
    require.register("ianstormtaylor-to-no-case/index.js", function (e, t, i) {
        function n(e) {
            return r.test(e) ? e.toLowerCase() : s.test(e) ? o(e).toLowerCase() : a(e).toLowerCase()
        }

        function o(e) {
            return e.replace(c, function (e, t) {
                return t ? " " + t : ""
            })
        }

        function a(e) {
            return e.replace(l, function (e, t, i) {
                return t + " " + i.toLowerCase().split("").join(" ")
            })
        }
        i.exports = n;
        var r = /\s/,
            s = /[\W_]/,
            c = /[\W_]+(.|$)/g,
            l = /(.)([A-Z]+)/g
    });
    require.register("learnboost-jsonp/index.js", function (e, t, i) {
        function n() {}

        function o(e, t, i) {
            function o() {
                s.parentNode.removeChild(s);
                window[f] = n
            }
            if ("function" == typeof t) {
                i = t;
                t = {}
            }
            t || (t = {});
            var s, c, l = t.prefix || "__jp",
                p = t.param || "callback",
                d = null != t.timeout ? t.timeout : 6e4,
                u = encodeURIComponent,
                g = document.getElementsByTagName("script")[0] || document.head,
                f = l + r++;
            d && (c = setTimeout(function () {
                o();
                i && i(new Error("Timeout"))
            }, d));
            window[f] = function (e) {
                a("jsonp got", e);
                c && clearTimeout(c);
                o();
                i && i(null, e)
            };
            e += (~e.indexOf("?") ? "&" : "?") + p + "=" + u(f);
            e = e.replace("?&", "?");
            a('jsonp req "%s"', e);
            s = document.createElement("script");
            s.src = e;
            g.parentNode.insertBefore(s, g)
        }
        var a = t("debug")("jsonp");
        i.exports = o;
        var r = 0
    });
    require.register("segmentio-alias/index.js", function (e, t, i) {
        function n(e, t) {
            switch (r(t)) {
            case "object":
                return o(s(e), t);
            case "function":
                return a(s(e), t)
            }
        }

        function o(e, t) {
            for (var i in t)
                if (void 0 !== e[i]) {
                    e[t[i]] = e[i];
                    delete e[i]
                }
            return e
        }

        function a(e, t) {
            var i = {};
            for (var n in e) i[t(n)] = e[n];
            return i
        }
        var r = t("type");
        try {
            var s = t("clone")
        } catch (c) {
            var s = t("clone-component")
        }
        i.exports = n
    });
    require.register("segmentio-facade/lib/index.js", function (e, t, i) {
        var n = t("./facade");
        i.exports = n;
        n.Alias = t("./alias");
        n.Group = t("./group");
        n.Identify = t("./identify");
        n.Track = t("./track");
        n.Page = t("./page");
        n.Screen = t("./screen")
    });
    require.register("segmentio-facade/lib/alias.js", function (e, t, i) {
        function n(e) {
            o.call(this, e)
        }
        var o = t("./facade"),
            a = t("require-component")(t),
            r = a("inherit");
        i.exports = n;
        r(n, o);
        n.prototype.type = n.prototype.action = function () {
            return "alias"
        };
        n.prototype.from = n.prototype.previousId = function () {
            return this.field("previousId") || this.field("from")
        };
        n.prototype.to = n.prototype.userId = function () {
            return this.field("userId") || this.field("to")
        }
    });
    require.register("segmentio-facade/lib/facade.js", function (e, t, i) {
        function n(e) {
            e.timestamp = e.hasOwnProperty("timestamp") ? new Date(e.timestamp) : new Date;
            this.obj = e
        }

        function o(e) {
            var t = r(e);
            l(t);
            return t
        }
        var a = t("require-component")(t),
            r = a("clone"),
            s = a("./is-enabled"),
            c = a("obj-case"),
            l = a("isodate-traverse");
        i.exports = n;
        n.prototype.proxy = function (e) {
            var t = e.split(".");
            e = t.shift();
            var i = this[e] || this.field(e);
            if (!i) return i;
            "function" == typeof i && (i = i.call(this) || {});
            if (0 === t.length) return o(i);
            i = c(i, t.join("."));
            return o(i)
        };
        n.prototype.field = function (e) {
            var t = this.obj[e];
            return o(t)
        };
        n.proxy = function (e) {
            return function () {
                return this.proxy(e)
            }
        };
        n.field = function (e) {
            return function () {
                return this.field(e)
            }
        };
        n.prototype.json = function () {
            return r(this.obj)
        };
        n.prototype.context = n.prototype.options = function (e) {
            var t = r(this.obj.options || this.obj.context) || {};
            if (!e) return r(t);
            if (this.enabled(e)) {
                var i = this.integrations(),
                    n = i[e] || c(i, e);
                "boolean" == typeof n && (n = {});
                return n || {}
            }
        };
        n.prototype.enabled = function (e) {
            var t = this.proxy("options.providers.all");
            "boolean" != typeof t && (t = this.proxy("options.all"));
            "boolean" != typeof t && (t = this.proxy("integrations.all"));
            "boolean" != typeof t && (t = !0);
            var i = t && s(e),
                n = this.integrations();
            n.providers && n.providers.hasOwnProperty(e) && (i = n.providers[e]);
            if (n.hasOwnProperty(e)) {
                var o = n[e];
                i = "boolean" == typeof o ? o : !0
            }
            return i ? !0 : !1
        };
        n.prototype.integrations = function () {
            return this.obj.integrations || this.proxy("options.providers") || this.options()
        };
        n.prototype.active = function () {
            var e = this.proxy("options.active");
            (null === e || void 0 === e) && (e = !0);
            return e
        };
        n.prototype.sessionId = n.prototype.anonymousId = function () {
            return this.field("anonymousId") || this.field("sessionId")
        };
        n.prototype.library = function () {
            var e = this.proxy("options.library");
            return e ? "string" == typeof e ? {
                name: e,
                version: null
            } : e : {
                name: "unknown",
                version: null
            }
        };
        n.prototype.userId = n.field("userId");
        n.prototype.channel = n.field("channel");
        n.prototype.timestamp = n.field("timestamp");
        n.prototype.userAgent = n.proxy("options.userAgent");
        n.prototype.ip = n.proxy("options.ip")
    });
    require.register("segmentio-facade/lib/group.js", function (e, t, i) {
        function n(e) {
            o.call(this, e)
        }
        var o = t("./facade"),
            a = t("require-component")(t),
            r = a("inherit"),
            s = a("new-date");
        i.exports = n;
        r(n, o);
        n.prototype.type = n.prototype.action = function () {
            return "group"
        };
        n.prototype.groupId = o.field("groupId");
        n.prototype.created = function () {
            var e = this.proxy("traits.createdAt") || this.proxy("traits.created") || this.proxy("properties.createdAt") || this.proxy("properties.created");
            return e ? s(e) : void 0
        };
        n.prototype.traits = function (e) {
            var t = this.properties(),
                i = this.groupId();
            e = e || {};
            i && (t.id = i);
            for (var n in e) {
                var o = null == this[n] ? this.proxy("traits." + n) : this[n]();
                if (null != o) {
                    t[e[n]] = o;
                    delete t[n]
                }
            }
            return t
        };
        n.prototype.properties = function () {
            return this.field("traits") || this.field("properties") || {}
        }
    });
    require.register("segmentio-facade/lib/page.js", function (e, t, i) {
        function n(e) {
            a.call(this, e)
        }
        var o = t("require-component")(t),
            a = o("./facade"),
            r = o("inherit"),
            s = t("./track");
        i.exports = n;
        r(n, a);
        n.prototype.type = n.prototype.action = function () {
            return "page"
        };
        n.prototype.category = a.field("category");
        n.prototype.name = a.field("name");
        n.prototype.properties = function () {
            var e = this.field("properties") || {},
                t = this.category(),
                i = this.name();
            t && (e.category = t);
            i && (e.name = i);
            return e
        };
        n.prototype.fullName = function () {
            var e = this.category(),
                t = this.name();
            return t && e ? e + " " + t : t
        };
        n.prototype.event = function (e) {
            return e ? "Viewed " + e + " Page" : "Loaded a Page"
        };
        n.prototype.track = function (e) {
            var t = this.properties();
            return new s({
                event: this.event(e),
                properties: t
            })
        }
    });
    require.register("segmentio-facade/lib/identify.js", function (e, t, i) {
        function n(e) {
            a.call(this, e)
        }
        var o = t("require-component")(t);
        o("clone");
        var a = o("./facade"),
            r = o("inherit"),
            s = o("is-email"),
            c = o("new-date"),
            l = o("trim");
        i.exports = n;
        r(n, a);
        n.prototype.type = n.prototype.action = function () {
            return "identify"
        };
        n.prototype.traits = function (e) {
            var t = this.field("traits") || {},
                i = this.userId();
            e = e || {};
            i && (t.id = i);
            for (var n in e) {
                var o = null == this[n] ? this.proxy("traits." + n) : this[n]();
                if (null != o) {
                    t[e[n]] = o;
                    delete t[n]
                }
            }
            return t
        };
        n.prototype.email = function () {
            var e = this.proxy("traits.email");
            if (e) return e;
            var t = this.userId();
            return s(t) ? t : void 0
        };
        n.prototype.created = function () {
            var e = this.proxy("traits.created") || this.proxy("traits.createdAt");
            return e ? c(e) : void 0
        };
        n.prototype.companyCreated = function () {
            var e = this.proxy("traits.company.created") || this.proxy("traits.company.createdAt");
            return e ? c(e) : void 0
        };
        n.prototype.name = function () {
            var e = this.proxy("traits.name");
            if ("string" == typeof e) return l(e);
            var t = this.firstName(),
                i = this.lastName();
            return t && i ? l(t + " " + i) : void 0
        };
        n.prototype.firstName = function () {
            var e = this.proxy("traits.firstName");
            if ("string" == typeof e) return l(e);
            var t = this.proxy("traits.name");
            return "string" == typeof t ? l(t).split(" ")[0] : void 0
        };
        n.prototype.lastName = function () {
            var e = this.proxy("traits.lastName");
            if ("string" == typeof e) return l(e);
            var t = this.proxy("traits.name");
            if ("string" == typeof t) {
                var i = l(t).indexOf(" ");
                if (-1 !== i) return l(t.substr(i + 1))
            }
        };
        n.prototype.uid = function () {
            return this.userId() || this.username() || this.email()
        };
        n.prototype.description = function () {
            return this.proxy("traits.description") || this.proxy("traits.background")
        };
        n.prototype.username = a.proxy("traits.username");
        n.prototype.website = a.proxy("traits.website");
        n.prototype.phone = a.proxy("traits.phone");
        n.prototype.address = a.proxy("traits.address");
        n.prototype.avatar = a.proxy("traits.avatar")
    });
    require.register("segmentio-facade/lib/is-enabled.js", function (e, t, i) {
        var n = {
            Salesforce: !0,
            Marketo: !0
        };
        i.exports = function (e) {
            return !n[e]
        }
    });
    require.register("segmentio-facade/lib/track.js", function (e, t, i) {
        function n(e) {
            r.call(this, e)
        }

        function o(e) {
            if (e) {
                if ("number" == typeof e) return e;
                if ("string" == typeof e) {
                    e = e.replace(/\$/g, "");
                    e = parseFloat(e);
                    return isNaN(e) ? void 0 : e
                }
            }
        }
        var a = t("require-component")(t);
        a("clone");
        var r = a("./facade"),
            s = a("./identify"),
            c = a("inherit"),
            l = a("is-email");
        i.exports = n;
        c(n, r);
        n.prototype.type = n.prototype.action = function () {
            return "track"
        };
        n.prototype.event = r.field("event");
        n.prototype.value = r.proxy("properties.value");
        n.prototype.category = r.proxy("properties.category");
        n.prototype.country = r.proxy("properties.country");
        n.prototype.state = r.proxy("properties.state");
        n.prototype.city = r.proxy("properties.city");
        n.prototype.zip = r.proxy("properties.zip");
        n.prototype.id = r.proxy("properties.id");
        n.prototype.sku = r.proxy("properties.sku");
        n.prototype.tax = r.proxy("properties.tax");
        n.prototype.name = r.proxy("properties.name");
        n.prototype.price = r.proxy("properties.price");
        n.prototype.total = r.proxy("properties.total");
        n.prototype.coupon = r.proxy("properties.coupon");
        n.prototype.shipping = r.proxy("properties.shipping");
        n.prototype.orderId = function () {
            return this.proxy("properties.id") || this.proxy("properties.orderId")
        };
        n.prototype.subtotal = function () {
            var e, t = this.obj.properties.subtotal,
                i = this.total();
            if (t) return t;
            if (!i) return 0;
            (e = this.tax()) && (i -= e);
            (e = this.shipping()) && (i -= e);
            return i
        };
        n.prototype.products = function () {
            var e = this.obj.properties || {};
            return e.products || []
        };
        n.prototype.quantity = function () {
            var e = this.obj.properties || {};
            return e.quantity || 1
        };
        n.prototype.currency = function () {
            var e = this.obj.properties || {};
            return e.currency || "USD"
        };
        n.prototype.referrer = r.proxy("properties.referrer");
        n.prototype.query = r.proxy("options.query");
        n.prototype.properties = function (e) {
            var t = this.field("properties") || {};
            e = e || {};
            for (var i in e) {
                var n = null == this[i] ? this.proxy("properties." + i) : this[i]();
                if (null != n) {
                    t[e[i]] = n;
                    delete t[i]
                }
            }
            return t
        };
        n.prototype.traits = function () {
            return this.proxy("options.traits") || {}
        };
        n.prototype.username = function () {
            return this.proxy("traits.username") || this.proxy("properties.username") || this.userId() || this.sessionId()
        };
        n.prototype.email = function () {
            var e = this.proxy("traits.email");
            e = e || this.proxy("properties.email");
            if (e) return e;
            var t = this.userId();
            return l(t) ? t : void 0
        };
        n.prototype.revenue = function () {
            var e = this.proxy("properties.revenue"),
                t = this.event();
            !e && t && t.match(/completed ?order/i) && (e = this.proxy("properties.total"));
            return o(e)
        };
        n.prototype.cents = function () {
            var e = this.revenue();
            return "number" != typeof e ? this.value() || 0 : 100 * e
        };
        n.prototype.identify = function () {
            var e = this.json();
            e.traits = this.traits();
            return new s(e)
        }
    });
    require.register("segmentio-facade/lib/screen.js", function (e, t, i) {
        function n(e) {
            r.call(this, e)
        }
        var o = t("require-component")(t),
            a = o("inherit"),
            r = o("./page"),
            s = t("./track");
        i.exports = n;
        a(n, r);
        n.prototype.type = n.prototype.action = function () {
            return "screen"
        };
        n.prototype.event = function (e) {
            return e ? "Viewed " + e + " Screen" : "Loaded a Screen"
        };
        n.prototype.track = function (e) {
            var t = this.properties();
            return new s({
                event: this.event(e),
                properties: t
            })
        }
    });
    require.register("segmentio-analytics.js/lib/index.js", function (e, t, i) {
        var n = t("integrations"),
            o = t("./analytics"),
            a = t("each"),
            r = i.exports = e = new o;
        r.require = t;
        e.VERSION = "1.5.11";
        a(n, function (e, t) {
            r.use(t)
        })
    });
    require.register("segmentio-analytics.js/lib/analytics.js", function (e, t, i) {
        function n() {
            this.Integrations = {};
            this._integrations = {};
            this._readied = !1;
            this._timeout = 300;
            this._user = k;
            s.all(this);
            var e = this;
            this.on("initialize", function (t, i) {
                i.initialPageview && e.page()
            });
            this.on("initialize", function () {
                e._parseQuery()
            })
        }

        function o() {
            var e = l();
            if (!e) return window.location.pathname;
            var t = _.parse(e);
            return t.pathname
        }

        function a(e) {
            var t = l();
            if (t) return~ t.indexOf("?") ? t : t + e;
            var i = window.location.href,
                n = i.indexOf("#");
            return -1 == n ? i : i.slice(0, n)
        }
        var r = t("after"),
            s = t("bind"),
            c = t("callback"),
            l = t("canonical"),
            p = t("clone"),
            d = t("./cookie"),
            u = t("debug"),
            g = t("defaults"),
            f = t("each"),
            m = t("emitter"),
            y = t("./group"),
            v = t("is");
        t("is-email");
        var h = t("is-meta");
        t("new-date");
        var j = t("event").bind,
            b = t("prevent"),
            w = t("querystring"),
            x = t("object").length,
            q = t("./store"),
            _ = t("url"),
            k = t("./user"),
            I = t("facade"),
            z = I.Identify,
            O = I.Group,
            P = I.Alias,
            C = I.Track,
            A = I.Page;
        i.exports = n;
        m(n.prototype);
        n.prototype.use = function (e) {
            e(this);
            return this
        };
        n.prototype.addIntegration = function (e) {
            var t = e.prototype.name;
            if (!t) throw new TypeError("attempted to add an invalid integration");
            this.Integrations[t] = e;
            return this
        };
        n.prototype.init = n.prototype.initialize = function (e, t) {
            e = e || {};
            t = t || {};
            this._options(t);
            this._readied = !1;
            this._integrations = {};
            k.load();
            y.load();
            var i = this;
            f(e, function (t) {
                var n = i.Integrations[t];
                n || delete e[t]
            });
            var n = r(x(e), function () {
                i._readied = !0;
                i.emit("ready")
            });
            f(e, function (e, o) {
                var a = i.Integrations[e];
                t.initialPageview && o.initialPageview === !1 && (a.prototype.page = r(2, a.prototype.page));
                var s = new a(p(o));
                s.once("ready", n);
                s.initialize();
                i._integrations[e] = s
            });
            this.initialized = !0;
            this.emit("initialize", e, t);
            return this
        };
        n.prototype.identify = function (e, t, i, n) {
            v.fn(i) && (n = i, i = null);
            v.fn(t) && (n = t, i = null, t = null);
            v.object(e) && (i = t, t = e, e = k.id());
            k.identify(e, t);
            e = k.id();
            t = k.traits();
            this._invoke("identify", new z({
                options: i,
                traits: t,
                userId: e
            }));
            this.emit("identify", e, t, i);
            this._callback(n);
            return this
        };
        n.prototype.user = function () {
            return k
        };
        n.prototype.group = function (e, t, i, n) {
            if (0 === arguments.length) return y;
            v.fn(i) && (n = i, i = null);
            v.fn(t) && (n = t, i = null, t = null);
            v.object(e) && (i = t, t = e, e = y.id());
            y.identify(e, t);
            e = y.id();
            t = y.traits();
            this._invoke("group", new O({
                options: i,
                traits: t,
                groupId: e
            }));
            this.emit("group", e, t, i);
            this._callback(n);
            return this
        };
        n.prototype.track = function (e, t, i, n) {
            v.fn(i) && (n = i, i = null);
            v.fn(t) && (n = t, i = null, t = null);
            this._invoke("track", new C({
                properties: t,
                options: i,
                event: e
            }));
            this.emit("track", e, t, i);
            this._callback(n);
            return this
        };
        n.prototype.trackClick = n.prototype.trackLink = function (e, t, i) {
            if (!e) return this;
            v.element(e) && (e = [e]);
            var n = this;
            f(e, function (e) {
                j(e, "click", function (o) {
                    var a = v.fn(t) ? t(e) : t,
                        r = v.fn(i) ? i(e) : i;
                    n.track(a, r);
                    if (e.href && "_blank" !== e.target && !h(o)) {
                        b(o);
                        n._callback(function () {
                            window.location.href = e.href
                        })
                    }
                })
            });
            return this
        };
        n.prototype.trackSubmit = n.prototype.trackForm = function (e, t, i) {
            if (!e) return this;
            v.element(e) && (e = [e]);
            var n = this;
            f(e, function (e) {
                function o(o) {
                    b(o);
                    var a = v.fn(t) ? t(e) : t,
                        r = v.fn(i) ? i(e) : i;
                    n.track(a, r);
                    n._callback(function () {
                        e.submit()
                    })
                }
                var a = window.jQuery || window.Zepto;
                a ? a(e).submit(o) : j(e, "submit", o)
            });
            return this
        };
        n.prototype.page = function (e, t, i, n, r) {
            v.fn(n) && (r = n, n = null);
            v.fn(i) && (r = i, n = i = null);
            v.fn(t) && (r = t, n = i = t = null);
            v.object(e) && (n = t, i = e, t = e = null);
            v.object(t) && (n = i, i = t, t = null);
            v.string(e) && !v.string(t) && (t = e, e = null);
            var s = {
                path: o(),
                referrer: document.referrer,
                title: document.title,
                search: location.search
            };
            t && (s.name = t);
            e && (s.category = e);
            i = p(i) || {};
            g(i, s);
            i.url = i.url || a(i.search);
            this._invoke("page", new A({
                properties: i,
                category: e,
                options: n,
                name: t
            }));
            this.emit("page", e, t, i, n);
            this._callback(r);
            return this
        };
        n.prototype.pageview = function (e) {
            var t = {};
            e && (t.path = e);
            this.page(t);
            return this
        };
        n.prototype.alias = function (e, t, i, n) {
            v.fn(i) && (n = i, i = null);
            v.fn(t) && (n = t, i = null, t = null);
            v.object(t) && (i = t, t = null);
            this._invoke("alias", new P({
                options: i,
                from: t,
                to: e
            }));
            this.emit("alias", e, t, i);
            this._callback(n);
            return this
        };
        n.prototype.ready = function (e) {
            if (!v.fn(e)) return this;
            this._readied ? c.async(e) : this.once("ready", e);
            return this
        };
        n.prototype.timeout = function (e) {
            this._timeout = e
        };
        n.prototype.debug = function (e) {
            0 == arguments.length || e ? u.enable("analytics:" + (e || "*")) : u.disable()
        };
        n.prototype._options = function (e) {
            e = e || {};
            d.options(e.cookie);
            q.options(e.localStorage);
            k.options(e.user);
            y.options(e.group);
            return this
        };
        n.prototype._callback = function (e) {
            c.async(e, this._timeout);
            return this
        };
        n.prototype._invoke = function (e, t) {
            t.options();
            this.emit("invoke", t);
            f(this._integrations, function (i, n) {
                t.enabled(i) && n.invoke.call(n, e, t)
            });
            return this
        };
        n.prototype.push = function (e) {
            var t = e.shift();
            this[t] && this[t].apply(this, e)
        };
        n.prototype._parseQuery = function () {
            var e = w.parse(window.location.search);
            e.ajs_uid && this.identify(e.ajs_uid);
            e.ajs_event && this.track(e.ajs_event);
            return this
        }
    });
    require.register("segmentio-analytics.js/lib/cookie.js", function (e, t, i) {
        function n(e) {
            this.options(e)
        }
        var o = t("bind"),
            a = t("cookie"),
            r = t("clone"),
            s = t("defaults"),
            c = t("json"),
            l = t("top-domain");
        n.prototype.options = function (e) {
            if (0 === arguments.length) return this._options;
            e = e || {};
            var t = "." + l(window.location.href);
            "." == t && (t = "");
            s(e, {
                maxage: 31536e6,
                path: "/",
                domain: t
            });
            this._options = e
        };
        n.prototype.set = function (e, t) {
            try {
                t = c.stringify(t);
                a(e, t, r(this._options));
                return !0
            } catch (i) {
                return !1
            }
        };
        n.prototype.get = function (e) {
            try {
                var t = a(e);
                t = t ? c.parse(t) : null;
                return t
            } catch (i) {
                return null
            }
        };
        n.prototype.remove = function (e) {
            try {
                a(e, null, r(this._options));
                return !0
            } catch (t) {
                return !1
            }
        };
        i.exports = o.all(new n);
        i.exports.Cookie = n
    });
    require.register("segmentio-analytics.js/lib/entity.js", function (e, t, i) {
        function n(e) {
            this.options(e)
        }
        var o = t("isodate-traverse"),
            a = t("defaults"),
            r = t("./cookie"),
            s = t("./store"),
            c = t("extend"),
            l = t("clone");
        i.exports = n;
        n.prototype.options = function (e) {
            if (0 === arguments.length) return this._options;
            e || (e = {});
            a(e, this.defaults || {});
            this._options = e
        };
        n.prototype.id = function (e) {
            switch (arguments.length) {
            case 0:
                return this._getId();
            case 1:
                return this._setId(e)
            }
        };
        n.prototype._getId = function () {
            var e = this._options.persist ? r.get(this._options.cookie.key) : this._id;
            return void 0 === e ? null : e
        };
        n.prototype._setId = function (e) {
            this._options.persist ? r.set(this._options.cookie.key, e) : this._id = e
        };
        n.prototype.properties = n.prototype.traits = function (e) {
            switch (arguments.length) {
            case 0:
                return this._getTraits();
            case 1:
                return this._setTraits(e)
            }
        };
        n.prototype._getTraits = function () {
            var e = this._options.persist ? s.get(this._options.localStorage.key) : this._traits;
            return e ? o(l(e)) : {}
        };
        n.prototype._setTraits = function (e) {
            e || (e = {});
            this._options.persist ? s.set(this._options.localStorage.key, e) : this._traits = e
        };
        n.prototype.identify = function (e, t) {
            t || (t = {});
            var i = this.id();
            (null === i || i === e) && (t = c(this.traits(), t));
            e && this.id(e);
            this.debug("identify %o, %o", e, t);
            this.traits(t);
            this.save()
        };
        n.prototype.save = function () {
            if (!this._options.persist) return !1;
            r.set(this._options.cookie.key, this.id());
            s.set(this._options.localStorage.key, this.traits());
            return !0
        };
        n.prototype.logout = function () {
            this.id(null);
            this.traits({});
            r.remove(this._options.cookie.key);
            s.remove(this._options.localStorage.key)
        };
        n.prototype.reset = function () {
            this.logout();
            this.options({})
        };
        n.prototype.load = function () {
            this.id(r.get(this._options.cookie.key));
            this.traits(s.get(this._options.localStorage.key))
        }
    });
    require.register("segmentio-analytics.js/lib/group.js", function (e, t, i) {
        function n(e) {
            this.defaults = n.defaults;
            this.debug = o;
            a.call(this, e)
        }
        var o = t("debug")("analytics:group"),
            a = t("./entity"),
            r = t("inherit"),
            s = t("bind");
        n.defaults = {
            persist: !0,
            cookie: {
                key: "ajs_group_id"
            },
            localStorage: {
                key: "ajs_group_properties"
            }
        };
        r(n, a);
        i.exports = s.all(new n);
        i.exports.Group = n
    });
    require.register("segmentio-analytics.js/lib/store.js", function (e, t, i) {
        function n(e) {
            this.options(e)
        }
        var o = t("bind"),
            a = t("defaults"),
            r = t("store");
        n.prototype.options = function (e) {
            if (0 === arguments.length) return this._options;
            e = e || {};
            a(e, {
                enabled: !0
            });
            this.enabled = e.enabled && r.enabled;
            this._options = e
        };
        n.prototype.set = function (e, t) {
            return this.enabled ? r.set(e, t) : !1
        };
        n.prototype.get = function (e) {
            return this.enabled ? r.get(e) : null
        };
        n.prototype.remove = function (e) {
            return this.enabled ? r.remove(e) : !1
        };
        i.exports = o.all(new n);
        i.exports.Store = n
    });
    require.register("segmentio-analytics.js/lib/user.js", function (e, t, i) {
        function n(e) {
            this.defaults = n.defaults;
            this.debug = o;
            a.call(this, e)
        }
        var o = t("debug")("analytics:user"),
            a = t("./entity"),
            r = t("inherit"),
            s = t("bind"),
            c = t("./cookie");
        n.defaults = {
            persist: !0,
            cookie: {
                key: "ajs_user_id",
                oldKey: "ajs_user"
            },
            localStorage: {
                key: "ajs_user_traits"
            }
        };
        r(n, a);
        n.prototype.load = function () {
            this._loadOldCookie() || a.prototype.load.call(this)
        };
        n.prototype._loadOldCookie = function () {
            var e = c.get(this._options.cookie.oldKey);
            if (!e) return !1;
            this.id(e.id);
            this.traits(e.traits);
            c.remove(this._options.cookie.oldKey);
            return !0
        };
        i.exports = s.all(new n);
        i.exports.User = n
    });
    require.register("segmentio-analytics.js-integration/lib/index.js", function (e, t, i) {
        function n(e) {
            function t(i) {
                this.debug = r("analytics:integration:" + l(e));
                this.options = s(a(i) || {}, this.defaults);
                this._queue = [];
                this.once("ready", o(this, this.flush));
                t.emit("construct", this);
                this._wrapInitialize();
                this._wrapLoad();
                this._wrapPage();
                this._wrapTrack()
            }
            t.prototype.defaults = {};
            t.prototype.globals = [];
            t.prototype.name = e;
            for (var i in p) t[i] = p[i];
            for (var i in c) t.prototype[i] = c[i];
            return t
        }
        var o = t("bind");
        t("callback");
        var a = t("clone"),
            r = t("debug"),
            s = t("defaults"),
            c = t("./protos"),
            l = t("slug"),
            p = t("./statics");
        i.exports = n
    });
    require.register("segmentio-analytics.js-integration/lib/protos.js", function (e, t) {
        var i = t("to-no-case"),
            n = t("after"),
            o = t("callback"),
            a = t("emitter"),
            r = t("next-tick"),
            s = t("./events"),
            c = t("type");
        a(e);
        e.initialize = function () {
            this.load()
        };
        e.loaded = function () {
            return !1
        };
        e.load = function (e) {
            o.async(e)
        };
        e.page = function () {};
        e.track = function () {};
        e.map = function (e, t) {
            var n = i(t),
                o = [];
            if (!e) return o;
            if ("object" == c(e))
                for (var a in e) {
                    var r = e[a],
                        s = i(a);
                    s == n && o.push(r)
                }
            if ("array" == c(e)) {
                if (!e.length) return o;
                if (!e[0].key) return o;
                for (var l = 0; l < e.length; ++l) {
                    var r = e[l],
                        s = i(r.key);
                    s == n && o.push(r.value)
                }
            }
            return o
        };
        e.invoke = function (e) {
            if (this[e]) {
                var t = [].slice.call(arguments, 1);
                if (!this._ready) return this.queue(e, t);
                var i;
                try {
                    this.debug("%s with %o", e, t);
                    i = this[e].apply(this, t)
                } catch (n) {
                    this.debug("error %o calling %s with %o", n, e, t)
                }
                return i
            }
        };
        e.queue = function (e, t) {
            if ("page" == e && this._assumesPageview && !this._initialized) return this.page.apply(this, t);
            this._queue.push({
                method: e,
                args: t
            });
            return void 0
        };
        e.flush = function () {
            this._ready = !0;
            for (var e; e = this._queue.shift();) this[e.method].apply(this, e.args)
        };
        e.reset = function () {
            for (var e, t = 0; e = this.globals[t]; t++) window[e] = void 0
        };
        e._wrapInitialize = function () {
            var e = this.initialize;
            this.initialize = function () {
                this.debug("initialize");
                this._initialized = !0;
                var t = e.apply(this, arguments);
                this.emit("initialize");
                var i = this;
                this._readyOnInitialize && r(function () {
                    i.emit("ready")
                });
                return t
            };
            this._assumesPageview && (this.initialize = n(2, this.initialize))
        };
        e._wrapLoad = function () {
            var e = this.load;
            this.load = function (t) {
                var i = this;
                this.debug("loading");
                if (!this.loaded()) return e.call(this, function (e, n) {
                    i.debug("loaded");
                    i.emit("load");
                    i._readyOnLoad && i.emit("ready");
                    t && t(e, n)
                });
                this.debug("already loaded");
                r(function () {
                    i._readyOnLoad && i.emit("ready");
                    t && t()
                })
            }
        };
        e._wrapPage = function () {
            var e = this.page;
            this.page = function () {
                return this._assumesPageview && !this._initialized ? this.initialize.apply(this, arguments) : e.apply(this, arguments)
            }
        };
        e._wrapTrack = function () {
            var e = this.track;
            this.track = function (t) {
                var i, n, o = t.event();
                for (var a in s) {
                    var r = s[a];
                    if (this[a] && r.test(o)) {
                        n = this[a].apply(this, arguments);
                        i = !0;
                        break
                    }
                }
                i || (n = e.apply(this, arguments));
                return n
            }
        }
    });
    require.register("segmentio-analytics.js-integration/lib/events.js", function (e, t, i) {
        i.exports = {
            removedProduct: /removed[ _]?product/i,
            viewedProduct: /viewed[ _]?product/i,
            addedProduct: /added[ _]?product/i,
            completedOrder: /completed[ _]?order/i
        }
    });
    require.register("segmentio-analytics.js-integration/lib/statics.js", function (e, t) {
        t("after");
        var i = t("emitter");
        i(e);
        e.option = function (e, t) {
            this.prototype.defaults[e] = t;
            return this
        };
        e.mapping = function (e) {
            this.option(e, []);
            this.prototype[e] = function (t) {
                return this.map(this.options[e], t)
            };
            return this
        };
        e.global = function (e) {
            this.prototype.globals.push(e);
            return this
        };
        e.assumesPageview = function () {
            this.prototype._assumesPageview = !0;
            return this
        };
        e.readyOnLoad = function () {
            this.prototype._readyOnLoad = !0;
            return this
        };
        e.readyOnInitialize = function () {
            this.prototype._readyOnInitialize = !0;
            return this
        }
    });
    require.register("segmentio-convert-dates/index.js", function (e, t, i) {
        function n(e, t) {
            e = a(e);
            for (var i in e) {
                var r = e[i];
                o.date(r) && (e[i] = t(r));
                o.object(r) && (e[i] = n(r, t))
            }
            return e
        }
        var o = t("is");
        try {
            var a = t("clone")
        } catch (r) {
            var a = t("clone-component")
        }
        i.exports = n
    });
    require.register("segmentio-extend/index.js", function (e, t, i) {
        i.exports = function (e) {
            for (var t, i = Array.prototype.slice.call(arguments, 1), n = 0; t = i[n]; n++)
                if (t)
                    for (var o in t) e[o] = t[o];
            return e
        }
    });
    require.register("segmentio-is-email/index.js", function (e, t, i) {
        function n(e) {
            return o.test(e)
        }
        i.exports = n;
        var o = /.+\@.+\..+/
    });
    require.register("segmentio-json/index.js", function (e, t, i) {
        var n = window.JSON || {},
            o = n.stringify,
            a = n.parse;
        i.exports = a && o ? JSON : t("json-fallback")
    });
    require.register("segmentio-load-script/index.js", function (e, t, i) {
        var n = t("type");
        i.exports = function (e, t) {
            if (!e) throw new Error("Cant load nothing...");
            "string" === n(e) && (e = {
                src: e
            });
            var i = "https:" === document.location.protocol || "chrome-extension:" === document.location.protocol;
            e.src && 0 === e.src.indexOf("//") && (e.src = i ? "https:" + e.src : "http:" + e.src);
            i && e.https ? e.src = e.https : !i && e.http && (e.src = e.http);
            var o = document.createElement("script");
            o.type = "text/javascript";
            o.async = !0;
            o.src = e.src;
            var a = document.getElementsByTagName("script")[0];
            a.parentNode.insertBefore(o, a);
            if (t && "function" === n(t))
                if (o.addEventListener) {
                    o.addEventListener("load", function (e) {
                        t(null, e)
                    }, !1);
                    o.addEventListener("error", function (e) {
                        t(new Error("Failed to load the script."), e)
                    }, !1)
                } else o.attachEvent && o.attachEvent("onreadystatechange", function (e) {
                    /complete|loaded/.test(o.readyState) && t(null, e)
                });
            return o
        }
    });
    require.register("segmentio-load-pixel/index.js", function (e, t, i) {
        function n(e, t, i) {
            return function (n) {
                n = n || window.event;
                var o = new Error(t);
                o.event = n;
                o.source = i;
                e(o)
            }
        }
        var o = t("querystring").stringify,
            a = t("substitute");
        i.exports = function (e) {
            return function (t, i, r) {
                "function" == typeof i && (r = i, i = {});
                i = i || {};
                r = r || function () {};
                var s = a(e, i),
                    c = new Image;
                c.onerror = n(r, "failed to load pixel", c);
                c.onload = function () {
                    r()
                };
                t = o(t);
                t && (t = "?" + t);
                c.src = s + t;
                c.width = 1;
                c.height = 1;
                return c
            }
        }
    });
    require.register("segmentio-to-iso-string/index.js", function (e, t, i) {
        function n(e) {
            return e.getUTCFullYear() + "-" + o(e.getUTCMonth() + 1) + "-" + o(e.getUTCDate()) + "T" + o(e.getUTCHours()) + ":" + o(e.getUTCMinutes()) + ":" + o(e.getUTCSeconds()) + "." + String((e.getUTCMilliseconds() / 1e3).toFixed(3)).slice(2, 5) + "Z"
        }

        function o(e) {
            var t = e.toString();
            return 1 === t.length ? "0" + t : t
        }
        i.exports = n
    });
    require.register("yields-capitalize/index.js", function (e, t, i) {
        e = i.exports = function (e) {
            return e.charAt(0).toUpperCase() + e.slice(1)
        };
        e.words = function (t) {
            return t.replace(/\w+/g, e)
        }
    });
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
    require.register("segmentio-utm-params/index.js", function (e, t, i) {
        function n(e) {
            var t, i = o(e),
                n = {};
            for (var a in i)
                if (~a.indexOf("utm_")) {
                    t = a.substr(4);
                    "campaign" == t && (t = "name");
                    n[t] = i[a]
                }
            return n
        }
        var o = t("querystring").parse;
        i.exports = n
    });
    require.register("segmentio-top-domain/index.js", function (e, t, i) {
        function n(e) {
            var t = o(e).hostname,
                i = t.match(a);
            return i ? i[0] : ""
        }
        var o = t("url").parse;
        i.exports = n;
        var a = /[a-z0-9][a-z0-9\-]*[a-z0-9]\.[a-z\.]{2,6}$/i
    });
    require.register("segmentio-ad-params/index.js", function (e, t, i) {
        function n(e) {
            var t = o(e);
            for (var i in t)
                for (var n in a)
                    if (i === n) return {
                        id: t[i],
                        type: a[n]
                    }
        }
        var o = t("querystring").parse;
        i.exports = n;
        var a = {
            btid: "dataxu",
            urid: "millennial-media"
        }
    });
    require.register("gjohnson-uuid/index.js", function (e, t, i) {
        i.exports = function n(e) {
            return e ? (e ^ 16 * Math.random() >> e / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, n)
        }
    });
    require.register("segmentio-global-queue/index.js", function (e, t, i) {
        function n(e, t) {
            var i = o("global-queue:" + e);
            t = t || {};
            return function (n) {
                n = [].slice.call(arguments);
                window[e] || (window[e] = []);
                i("%o", n);
                t.wrap === !1 ? window[e].push.apply(window[e], n) : window[e].push(n)
            }
        }
        var o = t("debug");
        i.exports = n
    });
    require.register("component-to-function/index.js", function (e, t, i) {
        function n(e) {
            switch ({}.toString.call(e)) {
            case "[object Object]":
                return s(e);
            case "[object Function]":
                return e;
            case "[object String]":
                return r(e);
            case "[object RegExp]":
                return a(e);
            default:
                return o(e)
            }
        }

        function o(e) {
            return function (t) {
                return e === t
            }
        }

        function a(e) {
            return function (t) {
                return e.test(t)
            }
        }

        function r(e) {
            return /^ *\W+/.test(e) ? new Function("_", "return _ " + e) : new Function("_", "return " + c(e))
        }

        function s(e) {
            var t = {};
            for (var i in e) t[i] = "string" == typeof e[i] ? o(e[i]) : n(e[i]);
            return function (e) {
                if ("object" != typeof e) return !1;
                for (var i in t) {
                    if (!(i in e)) return !1;
                    if (!t[i](e[i])) return !1
                }
                return !0
            }
        }

        function c(e) {
            var t = p(e);
            if (!t.length) return "_." + e;
            var i, n, o;
            for (n = 0; n < t.length; n++) {
                o = t[n];
                i = "_." + o;
                i = "('function' == typeof " + i + " ? " + i + "() : " + i + ")";
                e = l(o, e, i)
            }
            return e
        }

        function l(e, t, i) {
            return t.replace(new RegExp("(\\.)?" + e, "g"), function (e, t) {
                return t ? e : i
            })
        }
        var p;
        try {
            p = t("props")
        } catch (d) {
            p = t("component-props")
        }
        i.exports = n
    });
    require.register("component-trim/index.js", function (e, t, i) {
        function n(e) {
            return e.trim ? e.trim() : e.replace(/^\s*|\s*$/g, "")
        }
        e = i.exports = n;
        e.left = function (e) {
            return e.trimLeft ? e.trimLeft() : e.replace(/^\s*/, "")
        };
        e.right = function (e) {
            return e.trimRight ? e.trimRight() : e.replace(/\s*$/, "")
        }
    });
    require.register("ianstormtaylor-to-camel-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).replace(/\s(\w)/g, function (e, t) {
                return t.toUpperCase()
            })
        }
        var o = t("to-space-case");
        i.exports = n
    });
    require.register("ForbesLindesay-utf8-encode/index.js", function (e, t, i) {
        function n(e) {
            e = e.replace(/\r\n/g, "\n");
            for (var t = "", i = 0; i < e.length; i++) {
                var n = e.charCodeAt(i);
                if (128 > n) t += String.fromCharCode(n);
                else if (n > 127 && 2048 > n) {
                    t += String.fromCharCode(192 | n >> 6);
                    t += String.fromCharCode(128 | 63 & n)
                } else {
                    t += String.fromCharCode(224 | n >> 12);
                    t += String.fromCharCode(128 | 63 & n >> 6);
                    t += String.fromCharCode(128 | 63 & n)
                }
            }
            return t
        }
        i.exports = n
    });
    require.register("ianstormtaylor-to-capital-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).replace(/(^|\s)(\w)/g, function (e, t, i) {
                return t + i.toUpperCase()
            })
        }
        var o = t("to-no-case");
        i.exports = n
    });
    require.register("ianstormtaylor-to-constant-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).toUpperCase()
        }
        var o = t("to-snake-case");
        i.exports = n
    });
    require.register("ianstormtaylor-to-sentence-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).replace(/[a-z]/i, function (e) {
                return e.toUpperCase()
            })
        }
        var o = t("to-no-case");
        i.exports = n
    });
    require.register("ianstormtaylor-to-pascal-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).replace(/(?:^|\s)(\w)/g, function (e, t) {
                return t.toUpperCase()
            })
        }
        var o = t("to-space-case");
        i.exports = n
    });
    require.register("ianstormtaylor-to-dot-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).replace(/\s/g, ".")
        }
        var o = t("to-space-case");
        i.exports = n
    });
    require.register("ianstormtaylor-to-slug-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).replace(/\s/g, "-")
        }
        var o = t("to-space-case");
        i.exports = n
    });
    require.register("ianstormtaylor-to-snake-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).replace(/\s/g, "_")
        }
        var o = t("to-space-case");
        i.exports = n
    });
    require.register("ianstormtaylor-to-space-case/index.js", function (e, t, i) {
        function n(e) {
            return o(e).replace(/[\W_]+(.|$)/g, function (e, t) {
                return t ? " " + t : ""
            })
        }
        var o = t("to-no-case");
        i.exports = n
    });
    require.register("ianstormtaylor-to-title-case/index.js", function (e, t, i) {
        function n(e) {
            return r(e).replace(p, function (e) {
                return e.toLowerCase()
            }).replace(d, function (e) {
                return e.toUpperCase()
            })
        }
        try {
            var o = t("escape-regexp")
        } catch (a) {
            var o = t("escape-regexp-component")
        }
        var r = t("to-capital-case"),
            s = t("map"),
            c = t("title-case-minors");
        i.exports = n;
        var l = s(c, o),
            p = new RegExp("[^^]\\b(" + l.join("|") + ")\\b", "ig"),
            d = /:\s*(\w)/g
    });
    require.register("ianstormtaylor-is-empty/index.js", function (e, t, i) {
        function n(e) {
            if (null == e) return !0;
            if ("number" == typeof e) return 0 === e;
            if (void 0 !== e.length) return 0 === e.length;
            for (var t in e)
                if (o.call(e, t)) return !1;
            return !0
        }
        i.exports = n;
        var o = Object.prototype.hasOwnProperty
    });
    require.register("visionmedia-debug/index.js", function (e, t, i) {
        i.exports = "undefined" == typeof window ? t("./lib/debug") : t("./debug")
    });
    require.register("visionmedia-debug/debug.js", function (e, t, i) {
        function n(e) {
            return n.enabled(e) ? function (t) {
                t = o(t);
                var i = new Date,
                    a = i - (n[e] || i);
                n[e] = i;
                t = e + " " + t + " +" + n.humanize(a);
                window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
            } : function () {}
        }

        function o(e) {
            return e instanceof Error ? e.stack || e.message : e
        }
        i.exports = n;
        n.names = [];
        n.skips = [];
        n.enable = function (e) {
            try {
                localStorage.debug = e
            } catch (t) {}
            for (var i = (e || "").split(/[\s,]+/), o = i.length, a = 0; o > a; a++) {
                e = i[a].replace("*", ".*?");
                "-" === e[0] ? n.skips.push(new RegExp("^" + e.substr(1) + "$")) : n.names.push(new RegExp("^" + e + "$"))
            }
        };
        n.disable = function () {
            n.enable("")
        };
        n.humanize = function (e) {
            var t = 1e3,
                i = 6e4,
                n = 60 * i;
            return e >= n ? (e / n).toFixed(1) + "h" : e >= i ? (e / i).toFixed(1) + "m" : e >= t ? (0 | e / t) + "s" : e + "ms"
        };
        n.enabled = function (e) {
            for (var t = 0, i = n.skips.length; i > t; t++)
                if (n.skips[t].test(e)) return !1;
            for (var t = 0, i = n.names.length; i > t; t++)
                if (n.names[t].test(e)) return !0;
            return !1
        };
        try {
            window.localStorage && n.enable(localStorage.debug)
        } catch (a) {}
    });
    require.register("CamShaft-require-component/index.js", function (e, t, i) {
        i.exports = function (e) {
            function t(t, i) {
                try {
                    return e(t)
                } catch (n) {
                    try {
                        return e(i || t + "-component")
                    } catch (o) {
                        throw n
                    }
                }
            }
            for (var i in e) t[i] = e[i];
            return t
        }
    });
    require.register("segmentio-isodate-traverse/index.js", function (e, t, i) {
        function n(e, t) {
            void 0 === t && (t = !0);
            return s.object(e) ? o(e, t) : s.array(e) ? a(e, t) : void 0
        }

        function o(e, t) {
            r(e, function (i, o) {
                c.is(o, t) ? e[i] = c.parse(o) : (s.object(o) || s.array(o)) && n(o, t)
            });
            return e
        }

        function a(e, t) {
            r(e, function (i, o) {
                s.object(i) ? n(i, t) : c.is(i, t) && (e[o] = c.parse(i))
            });
            return e
        }
        var r, s = t("is"),
            c = t("isodate");
        try {
            r = t("each")
        } catch (l) {
            r = t("each-component")
        }
        i.exports = n
    });
    require.register("component-inherit/index.js", function (e, t, i) {
        i.exports = function (e, t) {
            var i = function () {};
            i.prototype = t.prototype;
            e.prototype = new i;
            e.prototype.constructor = e
        }
    });
    require.register("segmentio-new-date/lib/index.js", function (e, t, i) {
        function n(e) {
            return 315576e5 > e ? 1e3 * e : e
        }
        var o = t("is"),
            a = t("isodate"),
            r = t("./milliseconds"),
            s = t("./seconds");
        i.exports = function (e) {
            return o.date(e) ? e : o.number(e) ? new Date(n(e)) : a.is(e) ? a.parse(e) : r.is(e) ? r.parse(e) : s.is(e) ? s.parse(e) : new Date(e)
        }
    });
    require.register("segmentio-new-date/lib/seconds.js", function (e) {
        var t = /\d{10}/;
        e.is = function (e) {
            return t.test(e)
        };
        e.parse = function (e) {
            var t = 1e3 * parseInt(e, 10);
            return new Date(t)
        }
    });
    require.register("segmentio-new-date/lib/milliseconds.js", function (e) {
        var t = /\d{13}/;
        e.is = function (e) {
            return t.test(e)
        };
        e.parse = function (e) {
            e = parseInt(e, 10);
            return new Date(e)
        }
    });
    require.register("segmentio-obj-case/index.js", function (e, t, i) {
        function n(e) {
            return function (t, i, n) {
                var a = i.split(".");
                if (0 !== a.length) {
                    for (; a.length > 1;) {
                        i = a.shift();
                        t = o(t, i);
                        if (null === t || void 0 === t) return
                    }
                    i = a.shift();
                    return e(t, i, n)
                }
            }
        }

        function o(e, t) {
            for (var i = 0; i < c.length; i++) {
                var n = c[i](t);
                if (e.hasOwnProperty(n)) return e[n]
            }
        }

        function a(e, t) {
            for (var i = 0; i < c.length; i++) {
                var n = c[i](t);
                e.hasOwnProperty(n) && delete e[n]
            }
            return e
        }

        function r(e, t, i) {
            for (var n = 0; n < c.length; n++) {
                var o = c[n](t);
                e.hasOwnProperty(o) && (e[o] = i)
            }
            return e
        }
        var s = t("case"),
            c = [s.upper, s.lower, s.snake, s.pascal, s.camel, s.constant, s.title, s.capital, s.sentence];
        i.exports = i.exports.find = n(o);
        i.exports.replace = function (e) {
            n(r).apply(this, arguments);
            return e
        };
        i.exports.del = function (e) {
            n(a).apply(this, arguments);
            return e
        }
    });
    require.register("avetisk-defaults/index.js", function (e, t, i) {
        "use strict";
        var n = function (e, t, i) {
            for (var o in t) i && e[o] instanceof Object && t[o] instanceof Object ? e[o] = n(e[o], t[o], !0) : o in e || (e[o] = t[o]);
            return e
        };
        i.exports = n
    });
    require.register("component-emitter/index.js", function (e, t, i) {
        function n(e) {
            return e ? o(e) : void 0
        }

        function o(e) {
            for (var t in n.prototype) e[t] = n.prototype[t];
            return e
        }
        var a = t("indexof");
        i.exports = n;
        n.prototype.on = n.prototype.addEventListener = function (e, t) {
            this._callbacks = this._callbacks || {};
            (this._callbacks[e] = this._callbacks[e] || []).push(t);
            return this
        };
        n.prototype.once = function (e, t) {
            function i() {
                n.off(e, i);
                t.apply(this, arguments)
            }
            var n = this;
            this._callbacks = this._callbacks || {};
            t._off = i;
            this.on(e, i);
            return this
        };
        n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function (e, t) {
            this._callbacks = this._callbacks || {};
            if (0 == arguments.length) {
                this._callbacks = {};
                return this
            }
            var i = this._callbacks[e];
            if (!i) return this;
            if (1 == arguments.length) {
                delete this._callbacks[e];
                return this
            }
            var n = a(i, t._off || t);~
            n && i.splice(n, 1);
            return this
        };
        n.prototype.emit = function (e) {
            this._callbacks = this._callbacks || {};
            var t = [].slice.call(arguments, 1),
                i = this._callbacks[e];
            if (i) {
                i = i.slice(0);
                for (var n = 0, o = i.length; o > n; ++n) i[n].apply(this, t)
            }
            return this
        };
        n.prototype.listeners = function (e) {
            this._callbacks = this._callbacks || {};
            return this._callbacks[e] || []
        };
        n.prototype.hasListeners = function (e) {
            return !!this.listeners(e).length
        }
    });
    require.register("component-event/index.js", function (e) {
        e.bind = function (e, t, i, n) {
            e.addEventListener ? e.addEventListener(t, i, n || !1) : e.attachEvent("on" + t, i);
            return i
        };
        e.unbind = function (e, t, i, n) {
            e.removeEventListener ? e.removeEventListener(t, i, n || !1) : e.detachEvent("on" + t, i);
            return i
        }
    });
    require.register("component-object/index.js", function (e) {
        var t = Object.prototype.hasOwnProperty;
        e.keys = Object.keys || function (e) {
            var i = [];
            for (var n in e) t.call(e, n) && i.push(n);
            return i
        };
        e.values = function (e) {
            var i = [];
            for (var n in e) t.call(e, n) && i.push(e[n]);
            return i
        };
        e.merge = function (e, i) {
            for (var n in i) t.call(i, n) && (e[n] = i[n]);
            return e
        };
        e.length = function (t) {
            return e.keys(t).length
        };
        e.isEmpty = function (t) {
            return 0 == e.length(t)
        }
    });
    require.register("ianstormtaylor-bind/index.js", function (e, t, i) {
        function n(e, t) {
            t = [].slice.call(arguments, 1);
            for (var i, n = 0; i = t[n]; n++) e[i] = o(e, e[i]);
            return e
        }
        try {
            var o = t("bind")
        } catch (a) {
            var o = t("bind-component")
        }
        var r = t("bind-all");
        i.exports = e = o;
        e.all = r;
        e.methods = n
    });
    require.register("ianstormtaylor-callback/index.js", function (e, t, i) {
        function n(e) {
            "function" == typeof e && e()
        }
        var o = t("next-tick");
        i.exports = n;
        n.async = function (e, t) {
            if ("function" == typeof e) {
                if (!t) return o(e);
                setTimeout(e, t);
                return void 0
            }
        };
        n.sync = n
    });
    require.register("segmentio-after/index.js", function (e, t, i) {
        i.exports = function (e, t) {
            return 0 >= e ? t() : function () {
                return --e < 1 ? t.apply(this, arguments) : void 0
            }
        }
    });
    require.register("segmentio-analytics.js-integrations/index.js", function (e, t) {
        var i = t("./lib/slugs"),
            n = t("each");
        n(i, function (i) {
            var n = t("./lib/" + i),
                o = n.Integration.prototype.name;
            e[o] = n
        })
    });;;;;;;;;;;;;;;;;;;;;;;
    require.register("segmentio-analytics.js-integrations/lib/facebook-ads.js", function (e, t, i) {
        var n = t("load-script"),
            o = t("integration"),
            a = t("global-queue")("_fbq");
        i.exports = e = function (e) {
            e.addIntegration(s)
        };
        var r = Object.prototype.hasOwnProperty,
            s = e.Integration = o("Facebook Ads").readyOnInitialize().global("_fbq").option("currency", "USD").option("events", {});
        s.prototype.initialize = function () {
            window._fbq = window._fbq || [];
            this.load()
        };
        s.prototype.load = function (e) {
            n("//connect.facebook.net/en_US/fbds.js", e);
            window._fbq.loaded = !0
        };
        s.prototype.loaded = function () {
            return !!window._fbq.loaded
        };
        s.prototype.track = function (e) {
            var t = this.options.events;
            e.traits();
            var i = e.event(),
                n = e.revenue() || 0;
            r.call(t, i) && a("track", t[i], {
                value: String(n.toFixed(2)),
                currency: this.options.currency
            })
        }
    });;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    require.register("segmentio-canonical/index.js", function (e, t, i) {
        i.exports = function () {
            for (var e, t = document.getElementsByTagName("link"), i = 0; e = t[i]; i++)
                if ("canonical" == e.getAttribute("rel")) return e.getAttribute("href")
        }
    });
    require.register("segmentio-is-meta/index.js", function (e, t, i) {
        i.exports = function (e) {
            if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return !0;
            var t = e.which,
                i = e.button;
            return t || void 0 === i ? 2 === t ? !0 : !1 : 1 & !i && 2 & !i && 4 & i
        }
    });
    require.register("segmentio-store.js/store.js", function (e, t, i) {
        ! function (e) {
            function t() {
                try {
                    return c in e && e[c]
                } catch (t) {
                    return !1
                }
            }

            function n(e) {
                return function () {
                    var t = Array.prototype.slice.call(arguments, 0);
                    t.unshift(a);
                    p.appendChild(a);
                    a.addBehavior("#default#userData");
                    a.load(c);
                    var i = e.apply(r, t);
                    p.removeChild(a);
                    return i
                }
            }

            function o(e) {
                return e.replace(g, "___")
            }
            var a, r = {},
                s = e.document,
                c = "localStorage",
                l = "__storejs__";
            r.disabled = !1;
            r.set = function () {};
            r.get = function () {};
            r.remove = function () {};
            r.clear = function () {};
            r.transact = function (e, t, i) {
                var n = r.get(e);
                if (null == i) {
                    i = t;
                    t = null
                }
                "undefined" == typeof n && (n = t || {});
                i(n);
                r.set(e, n)
            };
            r.getAll = function () {};
            r.serialize = function (e) {
                return JSON.stringify(e)
            };
            r.deserialize = function (e) {
                if ("string" != typeof e) return void 0;
                try {
                    return JSON.parse(e)
                } catch (t) {
                    return e || void 0
                }
            };
            if (t()) {
                a = e[c];
                r.set = function (e, t) {
                    if (void 0 === t) return r.remove(e);
                    a.setItem(e, r.serialize(t));
                    return t
                };
                r.get = function (e) {
                    return r.deserialize(a.getItem(e))
                };
                r.remove = function (e) {
                    a.removeItem(e)
                };
                r.clear = function () {
                    a.clear()
                };
                r.getAll = function () {
                    for (var e = {}, t = 0; t < a.length; ++t) {
                        var i = a.key(t);
                        e[i] = r.get(i)
                    }
                    return e
                }
            } else if (s.documentElement.addBehavior) {
                var p, d;
                try {
                    d = new ActiveXObject("htmlfile");
                    d.open();
                    d.write('<script>document.w=window</script><iframe src="/favicon.ico"></iframe>');
                    d.close();
                    p = d.w.frames[0].document;
                    a = p.createElement("div")
                } catch (u) {
                    a = s.createElement("div");
                    p = s.body
                }
                var g = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
                r.set = n(function (e, t, i) {
                    t = o(t);
                    if (void 0 === i) return r.remove(t);
                    e.setAttribute(t, r.serialize(i));
                    e.save(c);
                    return i
                });
                r.get = n(function (e, t) {
                    t = o(t);
                    return r.deserialize(e.getAttribute(t))
                });
                r.remove = n(function (e, t) {
                    t = o(t);
                    e.removeAttribute(t);
                    e.save(c)
                });
                r.clear = n(function (e) {
                    var t = e.XMLDocument.documentElement.attributes;
                    e.load(c);
                    for (var i, n = 0; i = t[n]; n++) e.removeAttribute(i.name);
                    e.save(c)
                });
                r.getAll = n(function (e) {
                    for (var t, i = e.XMLDocument.documentElement.attributes, n = {}, a = 0; t = i[a]; ++a) {
                        var s = o(t.name);
                        n[t.name] = r.deserialize(e.getAttribute(s))
                    }
                    return n
                })
            }
            try {
                r.set(l, l);
                r.get(l) != l && (r.disabled = !0);
                r.remove(l)
            } catch (u) {
                r.disabled = !0
            }
            r.enabled = !r.disabled;
            "undefined" != typeof i && i.exports ? i.exports = r : "function" == typeof define && define.amd ? define(r) : e.store = r
        }(this.window || global)
    });
    require.register("yields-prevent/index.js", function (e, t, i) {
        i.exports = function (e) {
            e = e || window.event;
            return e.preventDefault ? e.preventDefault() : e.returnValue = !1
        }
    });
    require.register("timoxley-next-tick/index.js", function (e, t, i) {
        "use strict";
        if ("function" == typeof setImmediate) i.exports = function (e) {
            setImmediate(e)
        };
        else if ("undefined" != typeof process && "function" == typeof process.nextTick) i.exports = process.nextTick;
        else if ("undefined" == typeof window || window.ActiveXObject || !window.postMessage) i.exports = function (e) {
            setTimeout(e)
        };
        else {
            var n = [];
            window.addEventListener("message", function () {
                for (var e = 0; e < n.length;) try {
                    n[e++]()
                } catch (t) {
                    n = n.slice(e);
                    window.postMessage("tic!", "*");
                    throw t
                }
                n.length = 0
            }, !0);
            i.exports = function (e) {
                n.length || window.postMessage("tic!", "*");
                n.push(e)
            }
        }
    });
    require.register("yields-slug/index.js", function (e, t, i) {
        i.exports = function (e, t) {
            t || (t = {});
            return e.toLowerCase().replace(t.replace || /[^a-z0-9]/g, " ").replace(/^ +| +$/g, "").replace(/ +/g, t.separator || "-")
        }
    });
    require.register("component-json-fallback/index.js", function (exports, require, module) {
        ! function () {
            "use strict";

            function f(e) {
                return 10 > e ? "0" + e : e
            }

            function quote(e) {
                escapable.lastIndex = 0;
                return escapable.test(e) ? '"' + e.replace(escapable, function (e) {
                    var t = meta[e];
                    return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + e + '"'
            }

            function str(e, t) {
                var i, n, o, a, r, s = gap,
                    c = t[e];
                c && "object" == typeof c && "function" == typeof c.toJSON && (c = c.toJSON(e));
                "function" == typeof rep && (c = rep.call(t, e, c));
                switch (typeof c) {
                case "string":
                    return quote(c);
                case "number":
                    return isFinite(c) ? String(c) : "null";
                case "boolean":
                case "null":
                    return String(c);
                case "object":
                    if (!c) return "null";
                    gap += indent;
                    r = [];
                    if ("[object Array]" === Object.prototype.toString.apply(c)) {
                        a = c.length;
                        for (i = 0; a > i; i += 1) r[i] = str(i, c) || "null";
                        o = 0 === r.length ? "[]" : gap ? "[\n" + gap + r.join(",\n" + gap) + "\n" + s + "]" : "[" + r.join(",") + "]";
                        gap = s;
                        return o
                    }
                    if (rep && "object" == typeof rep) {
                        a = rep.length;
                        for (i = 0; a > i; i += 1)
                            if ("string" == typeof rep[i]) {
                                n = rep[i];
                                o = str(n, c);
                                o && r.push(quote(n) + (gap ? ": " : ":") + o)
                            }
                    } else
                        for (n in c)
                            if (Object.prototype.hasOwnProperty.call(c, n)) {
                                o = str(n, c);
                                o && r.push(quote(n) + (gap ? ": " : ":") + o)
                            }
                    o = 0 === r.length ? "{}" : gap ? "{\n" + gap + r.join(",\n" + gap) + "\n" + s + "}" : "{" + r.join(",") + "}";
                    gap = s;
                    return o
                }
            }
            var JSON = module.exports = {};
            if ("function" != typeof Date.prototype.toJSON) {
                Date.prototype.toJSON = function () {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
                };
                String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
                    return this.valueOf()
                }
            }
            var cx, escapable, gap, indent, meta, rep;
            if ("function" != typeof JSON.stringify) {
                escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                meta = {
                    "\b": "\\b",
                    "	": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                };
                JSON.stringify = function (e, t, i) {
                    var n;
                    gap = "";
                    indent = "";
                    if ("number" == typeof i)
                        for (n = 0; i > n; n += 1) indent += " ";
                    else "string" == typeof i && (indent = i);
                    rep = t;
                    if (t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
                    return str("", {
                        "": e
                    })
                }
            }
            if ("function" != typeof JSON.parse) {
                cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                JSON.parse = function (text, reviver) {
                    function walk(e, t) {
                        var i, n, o = e[t];
                        if (o && "object" == typeof o)
                            for (i in o)
                                if (Object.prototype.hasOwnProperty.call(o, i)) {
                                    n = walk(o, i);
                                    void 0 !== n ? o[i] = n : delete o[i]
                                }
                        return reviver.call(e, t, o)
                    }
                    var j;
                    text = String(text);
                    cx.lastIndex = 0;
                    cx.test(text) && (text = text.replace(cx, function (e) {
                        return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                    }));
                    if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                        j = eval("(" + text + ")");
                        return "function" == typeof reviver ? walk({
                            "": j
                        }, "") : j
                    }
                    throw new SyntaxError("JSON.parse")
                }
            }
        }()
    });
    require.register("segmentio-substitute/index.js", function (e, t, i) {
        function n(e, t, i) {
            if (!t) throw new TypeError("expected an object");
            i = i || /:(\w+)/g;
            return e.replace(i, function (e, i) {
                return null != t[i] ? t[i] : e
            })
        }
        i.exports = n
    });
    require.register("component-has-cors/index.js", function (e, t, i) {
        var n = t("global");
        try {
            i.exports = "XMLHttpRequest" in n && "withCredentials" in new n.XMLHttpRequest
        } catch (o) {
            i.exports = !1
        }
    });
    require.register("component-props/index.js", function (e, t, i) {
        function n(e) {
            return e.replace(/\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, "").replace(s, "").match(/[$a-zA-Z_]\w*/g) || []
        }

        function o(e, t, i) {
            var n = /\.\w+|\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\/|[a-zA-Z_]\w*/g;
            return e.replace(n, function (e) {
                return "(" == e[e.length - 1] ? i(e) : ~t.indexOf(e) ? i(e) : e
            })
        }

        function a(e) {
            for (var t = [], i = 0; i < e.length; i++)~ t.indexOf(e[i]) || t.push(e[i]);
            return t
        }

        function r(e) {
            return function (t) {
                return e + t
            }
        }
        var s = /\b(this|Array|Date|Object|Math|JSON)\b/g;
        i.exports = function (e, t) {
            var i = a(n(e));
            t && "string" == typeof t && (t = r(t));
            return t ? o(e, i, t) : i
        }
    });
    require.register("ianstormtaylor-map/index.js", function (e, t, i) {
        try {
            var n = t("each")
        } catch (o) {
            var n = t("each-component")
        }
        i.exports = function (e, t) {
            var i = [];
            n(e, function () {
                i.push(t.apply(null, arguments))
            });
            return i
        }
    });
    require.register("component-escape-regexp/index.js", function (e, t, i) {
        i.exports = function (e) {
            return String(e).replace(/([.*+?=^!:${}()|[\]\/\\])/g, "\\$1")
        }
    });
    require.register("ianstormtaylor-title-case-minors/index.js", function (e, t, i) {
        i.exports = ["a", "an", "and", "as", "at", "but", "by", "en", "for", "from", "how", "if", "in", "neither", "nor", "of", "on", "only", "onto", "out", "or", "per", "so", "than", "that", "the", "to", "until", "up", "upon", "v", "v.", "versus", "vs", "vs.", "via", "when", "with", "without", "yet"]
    });
    require.register("segmentio-isodate/index.js", function (e) {
        var t = /^(\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:([ T])(\d{2}):?(\d{2})(?::?(\d{2})(?:[,\.](\d{1,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?)?)?$/;
        e.parse = function (e) {
            var i = [1, 5, 6, 7, 8, 11, 12],
                n = t.exec(e),
                o = 0;
            if (!n) return new Date(e);
            for (var a, r = 0; a = i[r]; r++) n[a] = parseInt(n[a], 10) || 0;
            n[2] = parseInt(n[2], 10) || 1;
            n[3] = parseInt(n[3], 10) || 1;
            n[2]--;
            n[8] && (n[8] = (n[8] + "00").substring(0, 3));
            if (" " == n[4]) o = (new Date).getTimezoneOffset();
            else if ("Z" !== n[9] && n[10]) {
                o = 60 * n[11] + n[12];
                "+" == n[10] && (o = 0 - o)
            }
            var s = Date.UTC(n[1], n[2], n[3], n[5], n[6] + o, n[7], n[8]);
            return new Date(s)
        };
        e.is = function (e, i) {
            return i && !1 === /^\d{4}-\d{2}-\d{2}/.test(e) ? !1 : t.test(e)
        }
    });
    require.register("component-indexof/index.js", function (e, t, i) {
        i.exports = function (e, t) {
            if (e.indexOf) return e.indexOf(t);
            for (var i = 0; i < e.length; ++i)
                if (e[i] === t) return i;
            return -1
        }
    });
    require.register("component-bind/index.js", function (e, t, i) {
        var n = [].slice;
        i.exports = function (e, t) {
            "string" == typeof t && (t = e[t]);
            if ("function" != typeof t) throw new Error("bind() requires a function");
            var i = n.call(arguments, 2);
            return function () {
                return t.apply(e, i.concat(n.call(arguments)))
            }
        }
    });
    require.register("segmentio-bind-all/index.js", function (e, t, i) {
        try {
            var n = t("bind"),
                o = t("type")
        } catch (a) {
            var n = t("bind-component"),
                o = t("type-component")
        }
        i.exports = function (e) {
            for (var t in e) {
                var i = e[t];
                "function" === o(i) && (e[t] = n(e, e[t]))
            }
            return e
        }
    });
    require.register("component-domify/index.js", function (e, t, i) {
        function n(e) {
            if ("string" != typeof e) throw new TypeError("String expected");
            e = e.replace(/^\s+|\s+$/g, "");
            var t = /<([\w:]+)/.exec(e);
            if (!t) return document.createTextNode(e);
            var i = t[1];
            if ("body" == i) {
                var n = document.createElement("html");
                n.innerHTML = e;
                return n.removeChild(n.lastChild)
            }
            var a = o[i] || o._default,
                r = a[0],
                s = a[1],
                c = a[2],
                n = document.createElement("div");
            n.innerHTML = s + e + c;
            for (; r--;) n = n.lastChild;
            if (n.firstChild == n.lastChild) return n.removeChild(n.firstChild);
            for (var l = document.createDocumentFragment(); n.firstChild;) l.appendChild(n.removeChild(n.firstChild));
            return l
        }
        i.exports = n;
        var o = {
            legend: [1, "<fieldset>", "</fieldset>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            _default: [0, "", ""]
        };
        o.td = o.th = [3, "<table><tbody><tr>", "</tr></tbody></table>"];
        o.option = o.optgroup = [1, '<select multiple="multiple">', "</select>"];
        o.thead = o.tbody = o.colgroup = o.caption = o.tfoot = [1, "<table>", "</table>"];
        o.text = o.circle = o.ellipse = o.line = o.path = o.polygon = o.polyline = o.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', "</svg>"]
    });
    require.register("component-once/index.js", function (e, t, i) {
        var n = 0,
            o = function () {
                return this
            }();
        i.exports = function (e) {
            function t() {
                if (this == o) {
                    if (t.called) return;
                    t.called = !0;
                    return e.apply(this, arguments)
                }
                var n = "__called_" + i + "__";
                if (!this[n]) {
                    this[n] = !0;
                    return e.apply(this, arguments)
                }
            }
            var i = n++;
            return t
        }
    });
    require.register("component-throttle/index.js", function (e, t, i) {
        function n(e, t) {
            var i, n = 0;
            return function () {
                var o = (new Date).getTime(),
                    a = o - n;
                if (a >= t) {
                    i = e.apply(this, arguments);
                    n = o
                }
                return i
            }
        }
        i.exports = n
    });
    require.register("component-queue/index.js", function (e, t, i) {
        function n(e) {
            e = e || {};
            this.timeout = e.timeout || 0;
            this.concurrency = e.concurrency || 1;
            this.pending = 0;
            this.jobs = []
        }

        function o(e, t) {
            return function (i) {
                var n, a = setTimeout(function () {
                    n = !0;
                    var e = new Error("Timeout of " + t + "ms exceeded");
                    e.timeout = o;
                    i(e)
                }, t);
                e(function (e, t) {
                    if (!n) {
                        clearTimeout(a);
                        i(e, t)
                    }
                })
            }
        }
        var a = t("emitter");
        i.exports = n;
        a(n.prototype);
        n.prototype.length = function () {
            return this.pending + this.jobs.length
        };
        n.prototype.push = function (e, t) {
            this.jobs.push([e, t]);
            setTimeout(this.run.bind(this), 0)
        };
        n.prototype.run = function () {
            for (; this.pending < this.concurrency;) {
                var e = this.jobs.shift();
                if (!e) break;
                this.exec(e)
            }
        };
        n.prototype.exec = function (e) {
            var t = this,
                i = this.timeout,
                n = e[0],
                a = e[1];
            i && (n = o(n, i));
            this.pending++;
            n(function (e, i) {
                a && a(e, i);
                t.pending--;
                t.run()
            })
        }
    });
    require.register("segmentio-load-date/index.js", function (e, t, i) {
        var n = new Date,
            o = window.performance;
        o && o.timing && o.timing.responseEnd && (n = new Date(o.timing.responseEnd));
        i.exports = n
    });
    require.register("segmentio-script-onload/index.js", function (e, t, i) {
        function n(e, t) {
            e.addEventListener("load", function (e, i) {
                t(null, i)
            }, !1);
            e.addEventListener("error", function (i) {
                var n = new Error('failed to load the script "' + e.src + '"');
                n.event = i;
                t(n)
            }, !1)
        }

        function o(e, t) {
            e.attachEvent("onreadystatechange", function (i) {
                /complete|loaded/.test(e.readyState) && t(null, i)
            })
        }
        i.exports = function (e, t) {
            return e.addEventListener ? n(e, t) : o(e, t)
        }
    });
    require.register("segmentio-on-body/index.js", function (e, t, i) {
        function n(e) {
            e(document.body)
        }
        var o = t("each"),
            a = !1,
            r = [];
        i.exports = function (e) {
            a ? n(e) : r.push(e)
        };
        var s = setInterval(function () {
            if (document.body) {
                a = !0;
                o(r, n);
                clearInterval(s)
            }
        }, 5)
    });
    require.register("segmentio-on-error/index.js", function (e, t, i) {
        function n() {
            for (var e, t = 0; e = a[t]; t++) e.apply(this, arguments)
        }

        function o(e) {
            a.push(e);
            if (window.onerror != n) {
                a.push(window.onerror);
                window.onerror = n
            }
        }
        i.exports = o;
        var a = [];
        "function" == typeof window.onerror && a.push(window.onerror);
        window.onerror = n
    });
    require.register("segmentio-to-unix-timestamp/index.js", function (e, t, i) {
        function n(e) {
            return Math.floor(e.getTime() / 1e3)
        }
        i.exports = n
    });
    require.register("segmentio-use-https/index.js", function (e, t, i) {
        function n(e) {
            return o() ? "https:" + e : "http:" + e
        }

        function o() {
            return "https:" == location.protocol || "chrome-extension:" == location.protocol
        }
        i.exports = function (e) {
            switch (arguments.length) {
            case 0:
                return o();
            case 1:
                return n(e)
            }
        }
    });
    require.register("segmentio-when/index.js", function (e, t, i) {
        function n(e, t, i) {
            if (e()) return o.async(t);
            var n = setInterval(function () {
                if (e()) {
                    o(t);
                    clearInterval(n)
                }
            }, i || 10)
        }
        var o = t("callback");
        i.exports = n
    });
    require.register("visionmedia-batch/index.js", function (e, t, i) {
        function n() {}

        function o() {
            if (!(this instanceof o)) return new o;
            this.fns = [];
            this.concurrency(1 / 0);
            this.throws(!0);
            for (var e = 0, t = arguments.length; t > e; ++e) this.push(arguments[e])
        }
        try {
            var a = t("events").EventEmitter
        } catch (r) {
            var s = t("emitter")
        }
        i.exports = o;
        a ? o.prototype.__proto__ = a.prototype : s(o.prototype);
        o.prototype.concurrency = function (e) {
            this.n = e;
            return this
        };
        o.prototype.push = function (e) {
            this.fns.push(e);
            return this
        };
        o.prototype.throws = function (e) {
            this.e = !!e;
            return this
        };
        o.prototype.end = function (e) {
            function t() {
                function n(n, l) {
                    if (!i) {
                        if (n && d) return i = !0, e(n);
                        var u = a - r + 1,
                            g = new Date;
                        s[p] = l;
                        c[p] = n;
                        o.emit("progress", {
                            index: p,
                            value: l,
                            error: n,
                            pending: r,
                            total: a,
                            complete: u,
                            percent: 0 | 100 * (u / a),
                            start: f,
                            end: g,
                            duration: g - f
                        });
                        --r ? t() : d ? e(null, s) : e(c, s)
                    }
                }
                var p = u++,
                    g = l[p];
                if (g) {
                    var f = new Date;
                    try {
                        g(n)
                    } catch (m) {
                        n(m)
                    }
                }
            }
            var i, o = this,
                a = this.fns.length,
                r = a,
                s = [],
                c = [],
                e = e || n,
                l = this.fns,
                p = this.n,
                d = this.e,
                u = 0;
            if (!l.length) return e(null, s);
            for (var g = 0; g < l.length && g != p; g++) t();
            return this
        }
    });
    require.register("segmentio-replace-document-write/index.js", function (e, t, i) {
        function n(e) {
            var t = document.createElement("script");
            t.src = e.src;
            t.async = e.async;
            t.defer = e.defer;
            return t
        }
        var o = t("domify");
        i.exports = function (e, t, i) {
            function a(a) {
                var s = o(a);
                s.src || "";
                if (-1 === s.src.indexOf(e)) return r(a);
                "SCRIPT" == s.tagName && (s = n(s));
                t.appendChild(s);
                document.write = r;
                i && i()
            }
            var r = document.write;
            document.write = a;
            "function" == typeof t && (i = t, t = null);
            t || (t = document.body)
        }
    });
    require.register("component-global/index.js", function (e, t, i) {
        i.exports = function () {
            return this
        }()
    });
    require.register("analytics-private/lib/integrations/slugs.json", function (e, t, i) {
        i.exports = ["facebook-custom-audiences", "segmentio"]
    });
    require.register("segmentio-analytics.js-integrations/lib/slugs.json", function (e, t, i) {
        i.exports = ["facebook-ads"]
    });
    require.alias("component-cookie/index.js", "analytics-private/deps/cookie/index.js");
    require.alias("component-cookie/index.js", "cookie/index.js");
    require.alias("component-each/index.js", "analytics-private/deps/each/index.js");
    require.alias("component-each/index.js", "each/index.js");
    require.alias("component-clone/index.js", "analytics-private/deps/clone/index.js");
    require.alias("component-clone/index.js", "clone/index.js");
    require.alias("component-map/index.js", "analytics-private/deps/map/index.js");
    require.alias("component-map/index.js", "map/index.js");
    require.alias("component-querystring/index.js", "analytics-private/deps/querystring/index.js");
    require.alias("component-querystring/index.js", "querystring/index.js");
    require.alias("component-type/index.js", "analytics-private/deps/type/index.js");
    require.alias("component-type/index.js", "type/index.js");
    require.alias("component-url/index.js", "analytics-private/deps/url/index.js");
    require.alias("component-url/index.js", "url/index.js");
    require.alias("forbeslindesay-base64-encode/index.js", "analytics-private/deps/base64-encode/index.js");
    require.alias("forbeslindesay-base64-encode/index.js", "base64-encode/index.js");
    require.alias("ianstormtaylor-case/lib/index.js", "analytics-private/deps/case/lib/index.js");
    require.alias("ianstormtaylor-case/lib/cases.js", "analytics-private/deps/case/lib/cases.js");
    require.alias("ianstormtaylor-case/lib/index.js", "analytics-private/deps/case/index.js");
    require.alias("ianstormtaylor-case/lib/index.js", "case/index.js");
    require.alias("ianstormtaylor-is/index.js", "analytics-private/deps/is/index.js");
    require.alias("ianstormtaylor-is/index.js", "is/index.js");
    require.alias("ianstormtaylor-to-no-case/index.js", "analytics-private/deps/to-no-case/index.js");
    require.alias("ianstormtaylor-to-no-case/index.js", "to-no-case/index.js");
    require.alias("learnboost-jsonp/index.js", "analytics-private/deps/jsonp/index.js");
    require.alias("learnboost-jsonp/index.js", "analytics-private/deps/jsonp/index.js");
    require.alias("learnboost-jsonp/index.js", "jsonp/index.js");
    require.alias("segmentio-alias/index.js", "analytics-private/deps/alias/index.js");
    require.alias("segmentio-alias/index.js", "alias/index.js");
    require.alias("segmentio-facade/lib/index.js", "analytics-private/deps/facade/lib/index.js");
    require.alias("segmentio-facade/lib/alias.js", "analytics-private/deps/facade/lib/alias.js");
    require.alias("segmentio-facade/lib/facade.js", "analytics-private/deps/facade/lib/facade.js");
    require.alias("segmentio-facade/lib/group.js", "analytics-private/deps/facade/lib/group.js");
    require.alias("segmentio-facade/lib/page.js", "analytics-private/deps/facade/lib/page.js");
    require.alias("segmentio-facade/lib/identify.js", "analytics-private/deps/facade/lib/identify.js");
    require.alias("segmentio-facade/lib/is-enabled.js", "analytics-private/deps/facade/lib/is-enabled.js");
    require.alias("segmentio-facade/lib/track.js", "analytics-private/deps/facade/lib/track.js");
    require.alias("segmentio-facade/lib/screen.js", "analytics-private/deps/facade/lib/screen.js");
    require.alias("segmentio-facade/lib/index.js", "analytics-private/deps/facade/index.js");
    require.alias("segmentio-facade/lib/index.js", "facade/index.js");
    require.alias("segmentio-analytics.js/lib/index.js", "analytics-private/deps/analytics/lib/index.js");
    require.alias("segmentio-analytics.js/lib/analytics.js", "analytics-private/deps/analytics/lib/analytics.js");
    require.alias("segmentio-analytics.js/lib/cookie.js", "analytics-private/deps/analytics/lib/cookie.js");
    require.alias("segmentio-analytics.js/lib/entity.js", "analytics-private/deps/analytics/lib/entity.js");
    require.alias("segmentio-analytics.js/lib/group.js", "analytics-private/deps/analytics/lib/group.js");
    require.alias("segmentio-analytics.js/lib/store.js", "analytics-private/deps/analytics/lib/store.js");
    require.alias("segmentio-analytics.js/lib/user.js", "analytics-private/deps/analytics/lib/user.js");
    require.alias("segmentio-analytics.js/lib/index.js", "analytics-private/deps/analytics/index.js");
    require.alias("segmentio-analytics.js/lib/index.js", "analytics/index.js");
    require.alias("segmentio-analytics.js-integration/lib/index.js", "analytics-private/deps/integration/lib/index.js");
    require.alias("segmentio-analytics.js-integration/lib/protos.js", "analytics-private/deps/integration/lib/protos.js");
    require.alias("segmentio-analytics.js-integration/lib/events.js", "analytics-private/deps/integration/lib/events.js");
    require.alias("segmentio-analytics.js-integration/lib/statics.js", "analytics-private/deps/integration/lib/statics.js");
    require.alias("segmentio-analytics.js-integration/lib/index.js", "analytics-private/deps/integration/index.js");
    require.alias("segmentio-analytics.js-integration/lib/index.js", "integration/index.js");
    require.alias("segmentio-convert-dates/index.js", "analytics-private/deps/convert-dates/index.js");
    require.alias("segmentio-convert-dates/index.js", "convert-dates/index.js");
    require.alias("segmentio-extend/index.js", "analytics-private/deps/extend/index.js");
    require.alias("segmentio-extend/index.js", "extend/index.js");
    require.alias("segmentio-is-email/index.js", "analytics-private/deps/is-email/index.js");
    require.alias("segmentio-is-email/index.js", "is-email/index.js");
    require.alias("segmentio-json/index.js", "analytics-private/deps/json/index.js");
    require.alias("segmentio-json/index.js", "json/index.js");
    require.alias("segmentio-load-script/index.js", "analytics-private/deps/load-script/index.js");
    require.alias("segmentio-load-script/index.js", "load-script/index.js");
    require.alias("segmentio-load-pixel/index.js", "analytics-private/deps/load-pixel/index.js");
    require.alias("segmentio-load-pixel/index.js", "analytics-private/deps/load-pixel/index.js");
    require.alias("segmentio-load-pixel/index.js", "load-pixel/index.js");
    require.alias("segmentio-to-iso-string/index.js", "analytics-private/deps/to-iso-string/index.js");
    require.alias("segmentio-to-iso-string/index.js", "to-iso-string/index.js");
    require.alias("yields-capitalize/index.js", "analytics-private/deps/capitalize/index.js");
    require.alias("yields-capitalize/index.js", "capitalize/index.js");
    require.alias("yields-send-json/index.js", "analytics-private/deps/send-json/index.js");
    require.alias("yields-send-json/index.js", "analytics-private/deps/send-json/index.js");
    require.alias("yields-send-json/index.js", "send-json/index.js");
    require.alias("segmentio-utm-params/index.js", "analytics-private/deps/utm-params/index.js");
    require.alias("segmentio-utm-params/index.js", "analytics-private/deps/utm-params/index.js");
    require.alias("segmentio-utm-params/index.js", "utm-params/index.js");
    require.alias("segmentio-top-domain/index.js", "analytics-private/deps/top-domain/index.js");
    require.alias("segmentio-top-domain/index.js", "analytics-private/deps/top-domain/index.js");
    require.alias("segmentio-top-domain/index.js", "top-domain/index.js");
    require.alias("segmentio-ad-params/index.js", "analytics-private/deps/ad-params/index.js");
    require.alias("segmentio-ad-params/index.js", "analytics-private/deps/ad-params/index.js");
    require.alias("segmentio-ad-params/index.js", "ad-params/index.js");
    require.alias("gjohnson-uuid/index.js", "analytics-private/deps/uuid/index.js");
    require.alias("gjohnson-uuid/index.js", "uuid/index.js");
    require.alias("segmentio-global-queue/index.js", "analytics-private/deps/global-queue/index.js");
    require.alias("segmentio-global-queue/index.js", "global-queue/index.js");
    require.alias("analytics-private/lib/index.js", "analytics-private/index.js");
    require.alias("component-type/index.js", "component-each/deps/type/index.js");
    require.alias("component-type/index.js", "component-clone/deps/type/index.js");
    require.alias("component-to-function/index.js", "component-map/deps/to-function/index.js");
    require.alias("component-type/index.js", "component-querystring/deps/type/index.js");
    require.alias("component-trim/index.js", "component-querystring/deps/trim/index.js");
    require.alias("ForbesLindesay-utf8-encode/index.js", "forbeslindesay-base64-encode/deps/utf8-encode/index.js");
    require.alias("ianstormtaylor-to-no-case/index.js", "ianstormtaylor-case/deps/to-no-case/index.js");
    require.alias("ianstormtaylor-to-camel-case/index.js", "ianstormtaylor-case/deps/to-camel-case/index.js");
    require.alias("ianstormtaylor-to-capital-case/index.js", "ianstormtaylor-case/deps/to-capital-case/index.js");
    require.alias("ianstormtaylor-to-constant-case/index.js", "ianstormtaylor-case/deps/to-constant-case/index.js");
    require.alias("ianstormtaylor-to-sentence-case/index.js", "ianstormtaylor-case/deps/to-sentence-case/index.js");
    require.alias("ianstormtaylor-to-pascal-case/index.js", "ianstormtaylor-case/deps/to-pascal-case/index.js");
    require.alias("ianstormtaylor-to-dot-case/index.js", "ianstormtaylor-case/deps/to-dot-case/index.js");
    require.alias("ianstormtaylor-to-slug-case/index.js", "ianstormtaylor-case/deps/to-slug-case/index.js");
    require.alias("ianstormtaylor-to-snake-case/index.js", "ianstormtaylor-case/deps/to-snake-case/index.js");
    require.alias("ianstormtaylor-to-space-case/index.js", "ianstormtaylor-case/deps/to-space-case/index.js");
    require.alias("ianstormtaylor-to-title-case/index.js", "ianstormtaylor-case/deps/to-title-case/index.js");
    require.alias("component-type/index.js", "ianstormtaylor-is/deps/type/index.js");
    require.alias("ianstormtaylor-is-empty/index.js", "ianstormtaylor-is/deps/is-empty/index.js");
    require.alias("visionmedia-debug/index.js", "learnboost-jsonp/deps/debug/index.js");
    require.alias("visionmedia-debug/debug.js", "learnboost-jsonp/deps/debug/debug.js");
    require.alias("component-clone/index.js", "segmentio-alias/deps/clone/index.js");
    require.alias("component-type/index.js", "segmentio-alias/deps/type/index.js");
    require.alias("component-clone/index.js", "segmentio-facade/deps/clone/index.js");
    require.alias("segmentio-is-email/index.js", "segmentio-facade/deps/is-email/index.js");
    require.alias("component-trim/index.js", "segmentio-facade/deps/trim/index.js");
    require.alias("CamShaft-require-component/index.js", "segmentio-facade/deps/require-component/index.js");
    require.alias("segmentio-isodate-traverse/index.js", "segmentio-facade/deps/isodate-traverse/index.js");
    require.alias("component-inherit/index.js", "segmentio-facade/deps/inherit/index.js");
    require.alias("segmentio-new-date/lib/index.js", "segmentio-facade/deps/new-date/lib/index.js");
    require.alias("segmentio-new-date/lib/seconds.js", "segmentio-facade/deps/new-date/lib/seconds.js");
    require.alias("segmentio-new-date/lib/milliseconds.js", "segmentio-facade/deps/new-date/lib/milliseconds.js");
    require.alias("segmentio-new-date/lib/index.js", "segmentio-facade/deps/new-date/index.js");
    require.alias("segmentio-obj-case/index.js", "segmentio-facade/deps/obj-case/index.js");
    require.alias("segmentio-obj-case/index.js", "segmentio-facade/deps/obj-case/index.js");
    require.alias("component-cookie/index.js", "segmentio-analytics.js/deps/cookie/index.js");
    require.alias("component-each/index.js", "segmentio-analytics.js/deps/each/index.js");
    require.alias("component-clone/index.js", "segmentio-analytics.js/deps/clone/index.js");
    require.alias("component-querystring/index.js", "segmentio-analytics.js/deps/querystring/index.js");
    require.alias("component-url/index.js", "segmentio-analytics.js/deps/url/index.js");
    require.alias("ianstormtaylor-is/index.js", "segmentio-analytics.js/deps/is/index.js");
    require.alias("segmentio-facade/lib/index.js", "segmentio-analytics.js/deps/facade/lib/index.js");
    require.alias("segmentio-facade/lib/alias.js", "segmentio-analytics.js/deps/facade/lib/alias.js");
    require.alias("segmentio-facade/lib/facade.js", "segmentio-analytics.js/deps/facade/lib/facade.js");
    require.alias("segmentio-facade/lib/group.js", "segmentio-analytics.js/deps/facade/lib/group.js");
    require.alias("segmentio-facade/lib/page.js", "segmentio-analytics.js/deps/facade/lib/page.js");
    require.alias("segmentio-facade/lib/identify.js", "segmentio-analytics.js/deps/facade/lib/identify.js");
    require.alias("segmentio-facade/lib/is-enabled.js", "segmentio-analytics.js/deps/facade/lib/is-enabled.js");
    require.alias("segmentio-facade/lib/track.js", "segmentio-analytics.js/deps/facade/lib/track.js");
    require.alias("segmentio-facade/lib/screen.js", "segmentio-analytics.js/deps/facade/lib/screen.js");
    require.alias("segmentio-facade/lib/index.js", "segmentio-analytics.js/deps/facade/index.js");
    require.alias("segmentio-extend/index.js", "segmentio-analytics.js/deps/extend/index.js");
    require.alias("segmentio-is-email/index.js", "segmentio-analytics.js/deps/is-email/index.js");
    require.alias("segmentio-json/index.js", "segmentio-analytics.js/deps/json/index.js");
    require.alias("segmentio-top-domain/index.js", "segmentio-analytics.js/deps/top-domain/index.js");
    require.alias("segmentio-top-domain/index.js", "segmentio-analytics.js/deps/top-domain/index.js");
    require.alias("visionmedia-debug/index.js", "segmentio-analytics.js/deps/debug/index.js");
    require.alias("visionmedia-debug/debug.js", "segmentio-analytics.js/deps/debug/debug.js");
    require.alias("segmentio-isodate-traverse/index.js", "segmentio-analytics.js/deps/isodate-traverse/index.js");
    require.alias("component-inherit/index.js", "segmentio-analytics.js/deps/inherit/index.js");
    require.alias("segmentio-new-date/lib/index.js", "segmentio-analytics.js/deps/new-date/lib/index.js");
    require.alias("segmentio-new-date/lib/seconds.js", "segmentio-analytics.js/deps/new-date/lib/seconds.js");
    require.alias("segmentio-new-date/lib/milliseconds.js", "segmentio-analytics.js/deps/new-date/lib/milliseconds.js");
    require.alias("segmentio-new-date/lib/index.js", "segmentio-analytics.js/deps/new-date/index.js");
    require.alias("avetisk-defaults/index.js", "segmentio-analytics.js/deps/defaults/index.js");
    require.alias("component-emitter/index.js", "segmentio-analytics.js/deps/emitter/index.js");
    require.alias("component-event/index.js", "segmentio-analytics.js/deps/event/index.js");
    require.alias("component-object/index.js", "segmentio-analytics.js/deps/object/index.js");
    require.alias("ianstormtaylor-bind/index.js", "segmentio-analytics.js/deps/bind/index.js");
    require.alias("ianstormtaylor-callback/index.js", "segmentio-analytics.js/deps/callback/index.js");
    require.alias("segmentio-after/index.js", "segmentio-analytics.js/deps/after/index.js");
    require.alias("segmentio-analytics.js-integrations/index.js", "segmentio-analytics.js/deps/integrations/index.js");;;;;;;;;;;;;;;;;;;;;;;
    require.alias("segmentio-analytics.js-integrations/lib/facebook-ads.js", "segmentio-analytics.js/deps/integrations/lib/facebook-ads.js");;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    require.alias("segmentio-canonical/index.js", "segmentio-analytics.js/deps/canonical/index.js");
    require.alias("segmentio-is-meta/index.js", "segmentio-analytics.js/deps/is-meta/index.js");
    require.alias("segmentio-store.js/store.js", "segmentio-analytics.js/deps/store/store.js");
    require.alias("segmentio-store.js/store.js", "segmentio-analytics.js/deps/store/index.js");
    require.alias("yields-prevent/index.js", "segmentio-analytics.js/deps/prevent/index.js");
    require.alias("component-clone/index.js", "segmentio-analytics.js-integration/deps/clone/index.js");
    require.alias("component-type/index.js", "segmentio-analytics.js-integration/deps/type/index.js");
    require.alias("ianstormtaylor-to-no-case/index.js", "segmentio-analytics.js-integration/deps/to-no-case/index.js");
    require.alias("visionmedia-debug/index.js", "segmentio-analytics.js-integration/deps/debug/index.js");
    require.alias("visionmedia-debug/debug.js", "segmentio-analytics.js-integration/deps/debug/debug.js");
    require.alias("avetisk-defaults/index.js", "segmentio-analytics.js-integration/deps/defaults/index.js");
    require.alias("component-emitter/index.js", "segmentio-analytics.js-integration/deps/emitter/index.js");
    require.alias("ianstormtaylor-bind/index.js", "segmentio-analytics.js-integration/deps/bind/index.js");
    require.alias("ianstormtaylor-callback/index.js", "segmentio-analytics.js-integration/deps/callback/index.js");
    require.alias("segmentio-after/index.js", "segmentio-analytics.js-integration/deps/after/index.js");
    require.alias("timoxley-next-tick/index.js", "segmentio-analytics.js-integration/deps/next-tick/index.js");
    require.alias("yields-slug/index.js", "segmentio-analytics.js-integration/deps/slug/index.js");
    require.alias("component-clone/index.js", "segmentio-convert-dates/deps/clone/index.js");
    require.alias("ianstormtaylor-is/index.js", "segmentio-convert-dates/deps/is/index.js");
    require.alias("component-json-fallback/index.js", "segmentio-json/deps/json-fallback/index.js");
    require.alias("component-type/index.js", "segmentio-load-script/deps/type/index.js");
    require.alias("component-querystring/index.js", "segmentio-load-pixel/deps/querystring/index.js");
    require.alias("segmentio-substitute/index.js", "segmentio-load-pixel/deps/substitute/index.js");
    require.alias("segmentio-substitute/index.js", "segmentio-load-pixel/deps/substitute/index.js");
    require.alias("forbeslindesay-base64-encode/index.js", "yields-send-json/deps/base64-encode/index.js");
    require.alias("learnboost-jsonp/index.js", "yields-send-json/deps/jsonp/index.js");
    require.alias("learnboost-jsonp/index.js", "yields-send-json/deps/jsonp/index.js");
    require.alias("segmentio-json/index.js", "yields-send-json/deps/json/index.js");
    require.alias("component-has-cors/index.js", "yields-send-json/deps/has-cors/index.js");
    require.alias("component-has-cors/index.js", "yields-send-json/deps/has-cors/index.js");
    require.alias("component-querystring/index.js", "segmentio-utm-params/deps/querystring/index.js");
    require.alias("component-url/index.js", "segmentio-top-domain/deps/url/index.js");
    require.alias("component-querystring/index.js", "segmentio-ad-params/deps/querystring/index.js");
    require.alias("visionmedia-debug/index.js", "segmentio-global-queue/deps/debug/index.js");
    require.alias("visionmedia-debug/debug.js", "segmentio-global-queue/deps/debug/debug.js");
    require.alias("component-props/index.js", "component-to-function/deps/props/index.js");
    require.alias("ianstormtaylor-to-space-case/index.js", "ianstormtaylor-to-camel-case/deps/to-space-case/index.js");
    require.alias("ianstormtaylor-to-no-case/index.js", "ianstormtaylor-to-capital-case/deps/to-no-case/index.js");
    require.alias("ianstormtaylor-to-snake-case/index.js", "ianstormtaylor-to-constant-case/deps/to-snake-case/index.js");
    require.alias("ianstormtaylor-to-no-case/index.js", "ianstormtaylor-to-sentence-case/deps/to-no-case/index.js");
    require.alias("ianstormtaylor-to-space-case/index.js", "ianstormtaylor-to-pascal-case/deps/to-space-case/index.js");
    require.alias("ianstormtaylor-to-space-case/index.js", "ianstormtaylor-to-dot-case/deps/to-space-case/index.js");
    require.alias("ianstormtaylor-to-space-case/index.js", "ianstormtaylor-to-slug-case/deps/to-space-case/index.js");
    require.alias("ianstormtaylor-to-space-case/index.js", "ianstormtaylor-to-snake-case/deps/to-space-case/index.js");
    require.alias("ianstormtaylor-to-no-case/index.js", "ianstormtaylor-to-space-case/deps/to-no-case/index.js");
    require.alias("ianstormtaylor-to-capital-case/index.js", "ianstormtaylor-to-title-case/deps/to-capital-case/index.js");
    require.alias("ianstormtaylor-map/index.js", "ianstormtaylor-to-title-case/deps/map/index.js");
    require.alias("component-escape-regexp/index.js", "ianstormtaylor-to-title-case/deps/escape-regexp/index.js");
    require.alias("ianstormtaylor-title-case-minors/index.js", "ianstormtaylor-to-title-case/deps/title-case-minors/index.js");
    require.alias("component-each/index.js", "segmentio-isodate-traverse/deps/each/index.js");
    require.alias("ianstormtaylor-is/index.js", "segmentio-isodate-traverse/deps/is/index.js");
    require.alias("segmentio-isodate/index.js", "segmentio-isodate-traverse/deps/isodate/index.js");
    require.alias("ianstormtaylor-is/index.js", "segmentio-new-date/deps/is/index.js");
    require.alias("segmentio-isodate/index.js", "segmentio-new-date/deps/isodate/index.js");
    require.alias("ianstormtaylor-case/lib/index.js", "segmentio-obj-case/deps/case/lib/index.js");
    require.alias("ianstormtaylor-case/lib/cases.js", "segmentio-obj-case/deps/case/lib/cases.js");
    require.alias("ianstormtaylor-case/lib/index.js", "segmentio-obj-case/deps/case/index.js");
    require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");
    require.alias("component-bind/index.js", "ianstormtaylor-bind/deps/bind/index.js");
    require.alias("segmentio-bind-all/index.js", "ianstormtaylor-bind/deps/bind-all/index.js");
    require.alias("timoxley-next-tick/index.js", "ianstormtaylor-callback/deps/next-tick/index.js");
    require.alias("component-each/index.js", "segmentio-analytics.js-integrations/deps/each/index.js");
    require.alias("component-clone/index.js", "segmentio-analytics.js-integrations/deps/clone/index.js");
    require.alias("component-type/index.js", "segmentio-analytics.js-integrations/deps/type/index.js");
    require.alias("component-url/index.js", "segmentio-analytics.js-integrations/deps/url/index.js");
    require.alias("ianstormtaylor-is/index.js", "segmentio-analytics.js-integrations/deps/is/index.js");
    require.alias("segmentio-alias/index.js", "segmentio-analytics.js-integrations/deps/alias/index.js");
    require.alias("segmentio-facade/lib/index.js", "segmentio-analytics.js-integrations/deps/facade/lib/index.js");
    require.alias("segmentio-facade/lib/alias.js", "segmentio-analytics.js-integrations/deps/facade/lib/alias.js");
    require.alias("segmentio-facade/lib/facade.js", "segmentio-analytics.js-integrations/deps/facade/lib/facade.js");
    require.alias("segmentio-facade/lib/group.js", "segmentio-analytics.js-integrations/deps/facade/lib/group.js");
    require.alias("segmentio-facade/lib/page.js", "segmentio-analytics.js-integrations/deps/facade/lib/page.js");
    require.alias("segmentio-facade/lib/identify.js", "segmentio-analytics.js-integrations/deps/facade/lib/identify.js");
    require.alias("segmentio-facade/lib/is-enabled.js", "segmentio-analytics.js-integrations/deps/facade/lib/is-enabled.js");
    require.alias("segmentio-facade/lib/track.js", "segmentio-analytics.js-integrations/deps/facade/lib/track.js");
    require.alias("segmentio-facade/lib/screen.js", "segmentio-analytics.js-integrations/deps/facade/lib/screen.js");
    require.alias("segmentio-facade/lib/index.js", "segmentio-analytics.js-integrations/deps/facade/index.js");
    require.alias("segmentio-analytics.js-integration/lib/index.js", "segmentio-analytics.js-integrations/deps/integration/lib/index.js");
    require.alias("segmentio-analytics.js-integration/lib/protos.js", "segmentio-analytics.js-integrations/deps/integration/lib/protos.js");
    require.alias("segmentio-analytics.js-integration/lib/events.js", "segmentio-analytics.js-integrations/deps/integration/lib/events.js");
    require.alias("segmentio-analytics.js-integration/lib/statics.js", "segmentio-analytics.js-integrations/deps/integration/lib/statics.js");
    require.alias("segmentio-analytics.js-integration/lib/index.js", "segmentio-analytics.js-integrations/deps/integration/index.js");
    require.alias("segmentio-convert-dates/index.js", "segmentio-analytics.js-integrations/deps/convert-dates/index.js");
    require.alias("segmentio-extend/index.js", "segmentio-analytics.js-integrations/deps/extend/index.js");
    require.alias("segmentio-is-email/index.js", "segmentio-analytics.js-integrations/deps/is-email/index.js");
    require.alias("segmentio-load-script/index.js", "segmentio-analytics.js-integrations/deps/load-script/index.js");
    require.alias("segmentio-load-pixel/index.js", "segmentio-analytics.js-integrations/deps/load-pixel/index.js");
    require.alias("segmentio-load-pixel/index.js", "segmentio-analytics.js-integrations/deps/load-pixel/index.js");
    require.alias("segmentio-to-iso-string/index.js", "segmentio-analytics.js-integrations/deps/to-iso-string/index.js");
    require.alias("segmentio-global-queue/index.js", "segmentio-analytics.js-integrations/deps/global-queue/index.js");
    require.alias("ianstormtaylor-to-snake-case/index.js", "segmentio-analytics.js-integrations/deps/to-snake-case/index.js");
    require.alias("ianstormtaylor-is-empty/index.js", "segmentio-analytics.js-integrations/deps/is-empty/index.js");
    require.alias("visionmedia-debug/index.js", "segmentio-analytics.js-integrations/deps/debug/index.js");
    require.alias("visionmedia-debug/debug.js", "segmentio-analytics.js-integrations/deps/debug/debug.js");
    require.alias("segmentio-obj-case/index.js", "segmentio-analytics.js-integrations/deps/obj-case/index.js");
    require.alias("segmentio-obj-case/index.js", "segmentio-analytics.js-integrations/deps/obj-case/index.js");
    require.alias("avetisk-defaults/index.js", "segmentio-analytics.js-integrations/deps/defaults/index.js");
    require.alias("component-object/index.js", "segmentio-analytics.js-integrations/deps/object/index.js");
    require.alias("ianstormtaylor-bind/index.js", "segmentio-analytics.js-integrations/deps/bind/index.js");
    require.alias("ianstormtaylor-callback/index.js", "segmentio-analytics.js-integrations/deps/callback/index.js");
    require.alias("segmentio-canonical/index.js", "segmentio-analytics.js-integrations/deps/canonical/index.js");
    require.alias("timoxley-next-tick/index.js", "segmentio-analytics.js-integrations/deps/next-tick/index.js");
    require.alias("yields-slug/index.js", "segmentio-analytics.js-integrations/deps/slug/index.js");
    require.alias("component-indexof/index.js", "segmentio-analytics.js-integrations/deps/indexof/index.js");
    require.alias("component-bind/index.js", "segmentio-analytics.js-integrations/deps/bind/index.js");
    require.alias("component-domify/index.js", "segmentio-analytics.js-integrations/deps/domify/index.js");
    require.alias("component-once/index.js", "segmentio-analytics.js-integrations/deps/once/index.js");
    require.alias("component-throttle/index.js", "segmentio-analytics.js-integrations/deps/throttle/index.js");
    require.alias("component-queue/index.js", "segmentio-analytics.js-integrations/deps/queue/index.js");
    require.alias("component-queue/index.js", "segmentio-analytics.js-integrations/deps/queue/index.js");
    require.alias("segmentio-load-date/index.js", "segmentio-analytics.js-integrations/deps/load-date/index.js");
    require.alias("segmentio-script-onload/index.js", "segmentio-analytics.js-integrations/deps/script-onload/index.js");
    require.alias("segmentio-script-onload/index.js", "segmentio-analytics.js-integrations/deps/script-onload/index.js");
    require.alias("segmentio-on-body/index.js", "segmentio-analytics.js-integrations/deps/on-body/index.js");
    require.alias("segmentio-on-error/index.js", "segmentio-analytics.js-integrations/deps/on-error/index.js");
    require.alias("segmentio-to-unix-timestamp/index.js", "segmentio-analytics.js-integrations/deps/to-unix-timestamp/index.js");
    require.alias("segmentio-use-https/index.js", "segmentio-analytics.js-integrations/deps/use-https/index.js");
    require.alias("segmentio-when/index.js", "segmentio-analytics.js-integrations/deps/when/index.js");
    require.alias("visionmedia-batch/index.js", "segmentio-analytics.js-integrations/deps/batch/index.js");
    require.alias("segmentio-replace-document-write/index.js", "segmentio-analytics.js-integrations/deps/replace-document-write/index.js");
    require.alias("segmentio-replace-document-write/index.js", "segmentio-analytics.js-integrations/deps/replace-document-write/index.js");
    require.alias("component-global/index.js", "component-has-cors/deps/global/index.js");
    require.alias("component-each/index.js", "ianstormtaylor-map/deps/each/index.js");
    require.alias("component-type/index.js", "segmentio-bind-all/deps/type/index.js");
    require.alias("component-bind/index.js", "segmentio-bind-all/deps/bind/index.js");
    require.alias("component-emitter/index.js", "component-queue/deps/emitter/index.js");
    require.alias("component-each/index.js", "segmentio-on-body/deps/each/index.js");
    require.alias("ianstormtaylor-callback/index.js", "segmentio-when/deps/callback/index.js");
    require.alias("component-emitter/index.js", "visionmedia-batch/deps/emitter/index.js");
    require.alias("component-domify/index.js", "segmentio-replace-document-write/deps/domify/index.js");
    require.alias("analytics-private/lib/index.js", "analytics-private/index.js");
    require.alias("segmentio-analytics.js-integrations/lib/slugs.json", "segmentio-analytics.js/deps/integrations/lib/slugs.json");
    var analytics = require("analytics-private"),
        snippet = window.analytics && window.analytics.SNIPPET_VERSION ? parseFloat(window.analytics.SNIPPET_VERSION, 10) : 0;
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
