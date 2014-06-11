BINS= node_modules/.bin
C= $(BINS)/component
MINIFY = $(BINS)/uglifyjs
DELEGATE= test \
  test-coverage \
  test-browser \
  test-sauce

trm.js: node_modules components $(shell find lib)
  @$(C) build --standalone trm --out . --name trm
  @$(MINIFY) trm.js --output trm.min.js

components: component.json
  @$(C) install

node_modules: package.json
  @npm install

$(DELEGATE): trm.js
  cd test && make $@

clean:
  rm -rf components trm.js trm.min.js
  cd test && make $@
