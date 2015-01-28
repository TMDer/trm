#TRM

[![Build Status](https://travis-ci.org/clonn/trm.svg?branch=master)](https://travis-ci.org/clonn/trm)

Tracking management client javascript code for Hiiir Ads platform

##usage

    npm install trm

## Generate library

Trm is a tracking code for PMD platform, you can generate a new library in your localhost.

    trm = require("trm")
    // will generate a library in `./tmp/test.js`
    result = trm.generateLib({
      domain: "yahoo.com.tw",
      destPath: "./tmp/test.js"
    })

    // code reulst
    console.log(result.code);

    result.then(function (result) {
      // show file content and save data in destination path
      console.log(result);
    })

##client usage

call trm and import code that is from trm source.

```js
  //code is from compressed
  out = trm.compress();
  trm.resultDisplay({
    code: out.code,
    pid: pixel id,
    aid: audience id
  });

```

##Client code output,

That is output code from `trm.resultDisplay()`

```js
  !function(){return window.analytics={load:function(t){var n,e,o;document.getElementById("analytics-js")||(n=document.createElement("script"),n.type="text/javascript",n.id="analytics-js",n.async=!0,n.src=("https:"===document.location.protocol?"https://":"http://")+"localhost:8080/.tmp/test.js",o=document.getElementsByTagName("script")[0],o.parentNode.insertBefore(n,o)),e=window.onload,window.onload=function(){return e&&e(),t()}},VERSION:"0.1.3"}}();
  window.analytics.load(function () {
    window.analytics.initial("-999", "-99999");
    window.analytics.send("");
  });

    window.analytics.load(function () {
      window.analytics.initial("1", "--FB-Audience-ID--");
      window.analytics.push("id", "abc");
      window.analytics.push("NTD", "168");
      window.analytics.send("");
    });
```

## TODO

 * client side auto test

##Ref

 * [browser-request](https://github.com/iriscouch/browser-request)
 * [browserify](http://browserify.org/)
 * [segment.io](https://github.com/segmentio/analytics.js)
