;(function () {
  window.analytics = {
    load: function (callback) {
      if (!document.getElementById("analytics-js")) {
          var a = document.createElement("script");
          a.type = "text/javascript", a.id = "analytics-js", a.async = !0, a.src = ("https:" === document.location.protocol ? "https://" : "http://") + "{ENV_PATH}";
          var n = document.getElementsByTagName("script")[0];
          n.parentNode.insertBefore(a, n);
      }

      var event = window.onload;
      window.onload = function () {
        if (event) event();
        return callback();
      };  
    },
    VERSION: "{VERSION}"
  };
})();
