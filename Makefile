SOURCES := $(shell ls *.js lib/*.js lib/needs/*.js)

deps: node_modules/besoin_made

node_modules/besoin_made: package.json package-lock.json
	npm install
	touch node_modules/besoin_made

lint: $(SOURCES)
	eslint $(SOURCES)

test: deps lint
	npm test
