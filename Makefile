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

build: needs
needs: lint deps
	./node_modules/pkg . -t node12-macos-x64