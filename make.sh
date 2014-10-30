#!/bin/sh

npm install
grunt compile

browserify --entry out/trm.js --outfile lib/trm.compile.js
browserify --entry out/trm.js --outfile static-server/lib/trm.compile.js
npm run-script build
cd ./static-server/
noder --port 3000
cd ..
