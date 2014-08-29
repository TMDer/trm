;(function () {
  var trmHost = "{ENV_PATH}";
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
      }

      var event = window.onload;
      window.onload = function () {
        if (event) event();
        return callback();
      };
  }, window.analytics.VERSION = "{VERSION}";
})();