.PHONY: deps lint test build

SOURCES := $(shell ls *.js lib/*.js lib/needs/*.js)

deps: node_modules/.installed

node_modules/.installed: package.json package-lock.json
	npm install
	touch node_modules/.installed

lint: $(SOURCES)
	eslint $(SOURCES)

test: deps lint
	npm test

test-features: lint deps
	npm run feature-test

clean:
	rm -rf build
	rm -rf node_modules

build: build/needs-linux build/needs-macos
build/needs-linux build/needs-macos: lint deps
	mkdir -p build
	pkg . --targets latest-linux-x64,latest-macos-x64 --out-path ./build
