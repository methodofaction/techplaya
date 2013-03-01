NAME=techplaya
VERSION=0.1
PACKAGE=$(NAME)-$(VERSION)
CLOSURE=build/tools/closure-compiler.jar
YUICOMPRESSOR=build/tools/yuicompressor-2.4.7.jar

# All files that will be compiled by the Closure compiler.

JS_FILES=\
	js/vendor/d3.v3.min.js \
	js/vendor/d3.geo.projection.v0.min.js \
	js/vendor/topojson.v0.min.js \
	js/utils.js \
	js/world.js \
	js/destinations.js \
	js/weather.js \
	js/flights.js


CSS_FILES=\
	css/normalize.css \
  css/main.css

JS_INPUT_FILES=$(addprefix src/, $(JS_FILES))
CSS_INPUT_FILES=$(addprefix src/, $(CSS_FILES))
JS_BUILD_FILES=$(addprefix build/$(PACKAGE)/, $(JS_FILES))
CSS_BUILD_FILES=$(addprefix build/$(PACKAGE)/, $(CSS_FILES))
CLOSURE_JS_ARGS=$(addprefix --js , $(JS_INPUT_FILES))
COMPILED_JS=src/js/techplaya.compiled.js
COMPILED_CSS=src/css/techplaya.compiled.css

all: release

# The build directory relies on the JS being compiled.
build/$(PACKAGE): $(COMPILED_JS)

	# Make build directory and copy all editor contents into it
	mkdir -p build/$(PACKAGE)
	cp -r src/* build/$(PACKAGE)

	# Remove all hidden .svn directories
	-find $(PACKAGE) -name .git -type d | xargs rm -rf {} \;

	# Create the release version of the main HTML file.
	build/tools/ship.py -i=src/index.html --on=techplaya_release > $(PACKAGE)/index.html

$(COMPILED_CSS):
	cat $(CSS_INPUT_FILES) > src/css/techplaya.css;
	java -jar $(YUICOMPRESSOR) src/css/techplaya.css -o $(COMPILED_CSS) --line-break 0;

$(COMPILED_JS):
	java -jar $(CLOSURE) \
		--compilation_level SIMPLE_OPTIMIZATIONS \
		$(CLOSURE_JS_ARGS) \
		--js_output_file $(COMPILED_JS)

compile: $(COMPILED_JS) $(COMPILED_CSS)

release: $(PACKAGE)

clean:
	rm -rf $(PACKAGE)
	rm -rf $(COMPILED_JS)
	rm -rf $(COMPILED_CSS)