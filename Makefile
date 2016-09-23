.PHONY: clean

all: eve-ui.min.js

eve-ui.min.js: eve-ui.js
	uglifyjs eve-ui.js --output eve-ui.min.js --compress

eve-ui.js: src/eve-ui.ts
	tsc -p tsconfig.json

clean:
	-rm eve-ui.js eve-ui.min.js
