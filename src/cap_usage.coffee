!(() ->
  
  window.analytics =
    initFbq: () ->
      n = window.fbq = () ->
        if n.callMethod
          n.callMethod.apply(n, arguments)
        else
          n.queue.push(arguments)
      unless window._fbq
        window._fbq = n
      n.push = n
      n.loaded = !0
      n.version = '2.0'
      n.queue = []
      e = 'script'
      t = document.createElement(e);
      t.async = !0;
      t.src = '//connect.facebook.net/en_US/fbevents.js'
      s = document.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)

    load: (callback) ->
      unless window.fbq
        @.initFbq()

      unless document.getElementById("analytics-js")
        a = document.createElement("script")
        a.type = "text/javascript"
        a.id = "analytics-js"
        a.async = not 0
        a.src = ((if "https:" is document.location.protocol then "https://" else "http://")) + "{ENV_PATH}"

        n = document.getElementsByTagName("script")[0]
        n.parentNode.insertBefore a, n

      event = window.onload
      window.onload = ->
        event()  if event
        callback()

      return

    VERSION: "{VERSION}"
)()