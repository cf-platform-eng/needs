SOURCES := $(shell ls *.js cmd/*.js lib/*.js lib/needs/*.js)

.PHONY: deps
deps: node_modules/.installed

node_modules/.installed: package.json
	npm install
	touch node_modules/.installed

.PHONY: lint
lint: deps $(SOURCES)
	npm run lint

.PHONY: test
test: deps lint
	npm test

.PHONY: test-features
test-features: lint deps
	npm run feature-test

.PHONY: clean
clean:
	rm -rf build
	rm -rf node_modules

.PHONY: build
build: version deps build/needs-linux build/needs-macos
build/needs-linux build/needs-macos: $(SOURCES)
	mkdir -p build
	npm run build

.PHONY: build-image
build-image: build version
	docker build --tag cfplatformeng/needs:$(shell cat version) --file Dockerfile .
