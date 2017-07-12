.PHONY: clean

all: eve-ui.min.js.gz eve-ui.min.js eve-ui.js eve-ui.min.css eve-ui.css

%.min.js: %.js
	uglifyjs $< --output $@ --ecma=6 --compress pure_funcs=mark --mangle

%.min.css: %.css
	cssmin < $< > $@

%.gz: %
	gzip -fk $<

eve-ui.css: src/eve-ui.ts
	awk '/eveui_css_start/,/eveui_css_end/' src/eve-ui.ts > eve-ui.css

eve-ui.js: tsconfig.json eve-ui.p.ts
	tsc -p tsconfig.json

eve-ui.p.ts: src/eve-ui.ts preprocess.pl
	perl preprocess.pl $< > $@

clean:
	-rm -f eve-ui.min.js.gz eve-ui.min.js eve-ui.js eve-ui.min.css eve-ui.css eve-ui.p.ts
