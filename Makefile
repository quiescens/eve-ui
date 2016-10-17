.PHONY: clean

all: eve-ui.min.js eve-ui.css

eve-ui.min.js: eve-ui.js
	uglifyjs eve-ui.js --output eve-ui.min.js --compress

eve-ui.js: tsconfig.json src/eve-ui.ts
	tsc -p tsconfig.json

eve-ui.css: src/eve-ui.ts
	awk '/eveui_css_start/,/eveui_css_end/' src/eve-ui.ts > eve-ui.css

clean:
	-rm -f eve-ui.min.js eve-ui.js eve-ui.css
