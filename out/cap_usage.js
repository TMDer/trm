!(function() {
  return window.analytics = {
    initFbq: function() {
      var e, n, s, t;
      n = window.fbq = function() {
        if (n.callMethod) {
          return n.callMethod.apply(n, arguments);
        } else {
          return n.queue.push(arguments);
        }
      };
      if (!window._fbq) {
        window._fbq = n;
      }
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      e = 'script';
      t = document.createElement(e);
      t.async = !0;
      t.src = '//connect.facebook.net/en_US/fbevents.js';
      s = document.getElementsByTagName(e)[0];
      return s.parentNode.insertBefore(t, s);
    },
    load: function(callback) {
      var a, n, onhashchangeEvent, onloadEvent;
      if (!window.fbq) {
        this.initFbq();
      }
      if (!document.getElementById("analytics-js")) {
        a = document.createElement("script");
        a.type = "text/javascript";
        a.id = "analytics-js";
        a.async = !0;
        a.src = ("https:" === document.location.protocol ? "https://" : "http://") + "{ENV_PATH}";
        n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(a, n);
      }
      onloadEvent = window.onload;
      window.onload = function() {
        if (onloadEvent) {
          onloadEvent();
        }
        if (callback && ({}.toString.call(callback) === '[object Function]')) {
          return callback();
        }
      };
      onhashchangeEvent = window.onhashchange;
      window.onhashchange = function() {
        if (onhashchangeEvent) {
          onhashchangeEvent();
        }
        if (callback && ({}.toString.call(callback) === '[object Function]')) {
          return callback();
        }
      };
    },
    VERSION: "{VERSION}"
  };
})();
