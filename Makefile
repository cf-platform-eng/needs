.PHONY: deps lint test build

SOURCES := $(shell ls *.js lib/*.js lib/needs/*.js)

deps: node_modules/.installed

node_modules/.installed: package.json package-lock.json
	npm install
	touch node_modules/.installed

lint: node_modules/.installed $(SOURCES)
	npm run lint

test: deps lint
	npm test

test-features: lint deps
	npm run feature-test

clean:
	rm -rf build
	rm -rf node_modules

build: lint deps build/needs-linux build/needs-macos
build/needs-linux build/needs-macos:
	mkdir -p build
	npm run build

build-image: build
	docker build --tag cfplatformeng/needs:$(shell cat version) --file Dockerfile .
