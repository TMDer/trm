!(function() {
  return window.analytics = {
    load: function(callback) {
      var a, event, n;
      if (!document.getElementById("analytics-js")) {
        a = document.createElement("script");
        a.type = "text/javascript";
        a.id = "analytics-js";
        a.async = !0;
        a.src = ("https:" === document.location.protocol ? "https://" : "http://") + "{ENV_PATH}";
        n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(a, n);
      }
      event = window.onload;
      window.onload = function() {
        if (event) {
          event();
        }
        return callback();
      };
    },
    VERSION: "{VERSION}"
  };
})();
