browserify:
	browserify lib/get-updates.js --standalone getUpdates > client/get-updates.js

test:
	mocha "test" --timeout 2000

.PHONY: test