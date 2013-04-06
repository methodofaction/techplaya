Techplaya
=============

This is the website that drives [techplaya.com](http://techplaya.com/). It's a showcase of people who work in dev/design/biz in Playa del Carmen. You might want to use it as a starting point for a showcase of your own community. Behind the scenes it uses [D3](http://d3js.com/), a really awesome javascript library for manipulating documents based on data. 

MIT License

Rationale
-------

Playa del Carmen is a small city along the Mexican Caribbean. It is a popular tourist destination and it hosts a small tech community. We would like to connect with other like-minded individuals who visit the area. 

Customization
-------

If you wish to customize techplaya for your own community you should modify these files:

* **src/index.html** Currently all information is hardcoded in HTML, you should modify this
* **src/js/destinations.js** Cities and airlines with direct flights
* **src/js/flights.js** `var location = [lat, long]`
* **src/js/satellite.js** displays the header map. Fiddle around with the projection to get the area of the world that you need.
* **src/js/satellite.js** specify the montly weather in Celsius.

Build
-------

`make release` will concatenate your JS and CSS and put it into the `release` directory. It will also modify your `index.html` to point to the minified files. You should deploy the files from this directory.

`make clean` will delete the release directory.


TODO
-------

* Put under a better build process such as middleman
* Create fallbacks for browsers that don't support SVG

