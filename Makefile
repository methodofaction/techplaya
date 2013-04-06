NAME=techplaya
CLOSURE=build/tools/closure-compiler.jar
YUICOMPRESSOR=build/tools/yuicompressor-2.4.7.jar

# All files that will be compiled by the Closure compiler.

JS_FILES=\
	vendor/d3.v3.min.js \
	vendor/d3.geo.projection.v0.min.js \
	vendor/topojson.v0.min.js \
	utils.js \
	world.js \
	destinations.js \
	satellite.js \
	weather.js \
	flights.js \
	load.js


CSS_FILES=\
	normalize.css \
  main.css

DIRECTORIES=\
	js \

JS_INPUT_FILES=$(addprefix src/js/, $(JS_FILES))
CSS_INPUT_FILES=$(addprefix src/css/, $(CSS_FILES))
JS_BUILD_FILES=$(addprefix release/js/, $(JS_FILES))
CSS_BUILD_FILES=$(addprefix release/css/, $(CSS_FILES))
CLOSURE_JS_ARGS=$(addprefix --js , $(JS_INPUT_FILES))
COMPILED_JS=release/js/techplaya.compiled.js
COMPILED_CSS=release/css/techplaya.compiled.css


# The build directory relies on the JS being compiled.
release:

	# Make build directory and copy all editor contents into it
	mkdir -p release;
	mkdir -p release/css;
	mkdir -p release/js;
	cp -r src/img release/img;

	# Remove all hidden .svn directories
	-find release -name .git -type d | xargs rm -rf {} \;

	# Create the release version of the main HTML file.
	build/tools/ship.py --i=src/index.html --on=release > release/index.html;

	# Create a temporal css with the concatenated CSS
	cat $(CSS_INPUT_FILES) > src/css/temp.css;

	# TODO minify instead of just concatenate 
	cat $(JS_INPUT_FILES) > $(COMPILED_JS);

	# Placeholder files
	touch $(COMPILED_CSS);
	touch $(COMPILED_JS);

	java -jar $(YUICOMPRESSOR) src/css/temp.css -o $(COMPILED_CSS) --line-break 0;
	rm src/css/temp.css;



clean:
	rm -rf release

.PHONY: release clean