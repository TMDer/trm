#!/bin/sh

npm install
grunt compile

browserify --entry out/trm.js --outfile lib/trm.compile.js
npm run-script build
noder --port 3000
