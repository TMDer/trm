#!/bin/sh

npm install
grunt compile

browserify --entry out/trm.js --outfile lib/trm.compile.js
noder --port 3000
