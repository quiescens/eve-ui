.PHONY: clean

all: eve-ui.min.js eve-ui.css

%.min.js: %.js
	uglifyjs $< --output $@ --compress --mangle

eve-ui.css: src/eve-ui.ts
	awk '/eveui_css_start/,/eveui_css_end/' src/eve-ui.ts > eve-ui.css

eve-ui.js: tsconfig.json eve-ui.p.ts
	tsc -p tsconfig.json

eve-ui.p.ts: src/eve-ui.ts preprocess.pl
	perl preprocess.pl $< > $@

clean:
	-rm -f eve-ui.min.js eve-ui.js eve-ui.css eve-ui.p.ts
