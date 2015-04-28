!(() ->
  
  window.analytics =
    load: (callback) ->
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
