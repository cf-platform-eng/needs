SOURCES := $(shell ls *.js cmd/*.js lib/*.js lib/needs/*.js)

.PHONY: deps
deps: node_modules/.installed

node_modules/.installed: package.json yarn.lock
	yarn install
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
build: version deps build/needs-linux build/needs-macos build/needs-alpine
build/needs-linux build/needs-macos build/needs-alpine: $(SOURCES)
	mkdir -p build
	npm run build

.PHONY: build-image
build-image: build version
	docker build --tag us-west1-docker.pkg.dev/isv-tile-partners/partner-engineering/needs:$(shell cat version) --file Dockerfile .

.PHONY: set-pipeline
set-pipeline: ci/pipeline.yaml
	fly -t ppe-isv set-pipeline -p needs -c ci/pipeline.yaml