#TRM

Tracking management client javascript code

##usage

    git clone https://github.com/clonn/trm.git && cd trm
    ./make.sh

##Tracking library

    wget https://raw.githubusercontent.com/clonn/trm/master/lib/trm.compile.js

##client

````
    var trmHost = "localhost:1337/lib/trm.compile.js";
    window.analytics = window.analytics || [], window.analytics.methods = ["host", "initial", "send", "push"], window.analytics.factory = function (t) {
        return function () {
            var a = Array.prototype.slice.call(arguments);
            return a.unshift(t), window.analytics.push(a), window.analytics
        }
    };
    for (var i = 0; i < window.analytics.methods.length; i++) {
        var key = window.analytics.methods[i];
        window.analytics[key] = window.analytics.factory(key)
    }
    window.analytics.load = function (callback) {
        if (!document.getElementById("analytics-js")) {
            var a = document.createElement("script");
            a.type = "text/javascript", a.id = "analytics-js", a.async = !0, a.src = ("https:" === document.location.protocol ? "https://" : "http://") + trmHost;
            var n = document.getElementsByTagName("script")[0];
            n.parentNode.insertBefore(a, n);
            console.log(n);
        }

        var event = window.onload;
        console.log(event)
        window.onload = function () {
          if (event) event();
          return callback();
        };
    }, window.analytics.SNIPPET_VERSION = "2.0.9";

    window.analytics.load(function () {
      window.analytics.initial("1");
      window.analytics.push("id", "abc");
      window.analytics.push("NTD", "168");
      window.analytics.send("");
    });
````

##

 * need to uglify

##Ref

 * [browser-request](https://github.com/iriscouch/browser-request)
 * [browserify](http://browserify.org/)
 * [segment.io](https://github.com/segmentio/analytics.js)
