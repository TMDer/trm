!(function() {
  window.fbConversion = {
    load: function() {
      var fbds, s, _fbq;
      _fbq = window._fbq || (window._fbq = []);
      if (!_fbq.loaded) {
        fbds = document.createElement('script');
        fbds.async = true;
        fbds.src = '//connect.facebook.net/en_US/fbds.js';
        s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(fbds, s);
        _fbq.loaded = true;
      }
    }
  };
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
