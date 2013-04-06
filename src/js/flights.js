techplaya = techplaya || {};
techplaya.flights = function(destinations){

  var world = techplaya.world;
  var destinations = techplaya.destinations;
  var location = [-86.85, 21.16];

  // FLIGHTS
  var width = 1200,
      height = 1000;

  var isTouch = !!('ontouchstart' in window) || !!('onmsgesturechange' in window);

  var flights_div = document.querySelector("section.flights");

  var projection = d3.geo.armadillo()
      .scale(500)
      .translate([width / 2, height*0.64])
      .parallel(20)
      .rotate([40, 0])
      .precision(.1)

  var path = d3.geo.path().projection(projection); 

  var graticule = d3.geo.graticule();


  var svg = d3.select("#map").append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", "0 0 1200 1000");

  var defs = svg.append("defs");
  var gradient = defs.append("radialGradient")
  var colors = ["white", "white"]

  gradient
      .attr("r", "0.5")
      .attr("id", "world_gradient")
      .attr("gradientTransform", "translate(0, -0.5)")
      .selectAll("stop")
      .data(colors)
      .enter()
      .append("stop")
          .attr("offset",      function(d,i){return i})
          .attr("stop-opacity",function(d,i){return i == 0 ? 0.1 : 0})
          .attr("stop-color",  "white");

  var clipPath = defs.append("clipPath")
      .attr("id", "clip")
      .append("path")
          .datum({type: "Sphere"})
          .attr("id", "sphere")
          .attr("d", path);

  svg.append("use")
      .attr("class", "background")
      .attr("fill", "url(#world_gradient)")
      .attr("xlink:href", "#sphere");

  svg.append("g")
      .attr("class", "graticule")
      .attr("clip-path", "url(#clip)")
    .selectAll("path")
      .data(graticule.lines)
    .enter().append("path")
    .attr("d", path);

  svg.append("use")
     .attr("class", "foreground")
     .attr("xlink:href", "#sphere");

  svg.append("path", ".graticule")
    .datum(topojson.object(world, world.objects.land))
    .attr("class", "land")
    .attr("clip-path", "url(#clip)")
    .attr("d", path);

  svg.append("path", ".graticule")
    .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
    .attr("class", "boundary")
    .attr("clip-path", "url(#clip)")
    .attr("d", path);


  //routes
  var route_color = d3.range(destinations.length).map(function(d, i) { return d3.hcl(i*2, 70,Math.random()*50+50).toString(); });
  var arc = d3.geo.greatArc()
      .source(function(d){return d.coords})
      .target(location)
      .precision(.1);

  var destinations = d3.shuffle(destinations)
  var routes = svg.selectAll("path.route")
      .data(destinations)
      .enter().append("path")
      .attr("data-city", function(d){return d.name})
      .attr("d", function(d) { return path(arc(d)); })
      .attr("stroke", function(d,i){return route_color[i]}) 
      .attr("stroke-dasharray", function(d){ return this.getTotalLength() + " " + this.getTotalLength() })
      .attr("stroke-dashoffset", function(d){ return isTouch ? 0 : this.getTotalLength()})
      .classed("route", true)

  var destination_el = d3.select("#destination");

  var cities = svg.selectAll("circle")
      .data(destinations)
      .enter().append("circle")
          .attr("class", function(d){return "city"})
          .attr("data-city", function(d){return d.name})
          .attr("cx", function(d){return projection(d.coords)[0]})
          .attr("cy", function(d){return projection(d.coords)[1]})
          .attr("fill", function(d,i){return route_color[i]}) 
          .attr("r", isTouch ? 15 : 1)
          .style("opacity", isTouch ? 0.3 : 1)
          .on("mouseover", showInfo)
          .on("touchstart", showInfo)
          .on("mouseout", hideInfo)

          function showInfo(d, i){
            d3.selectAll("[data-city='" + d.name + "']").style("opacity", 1)
            destination_el
              .style("border-color", route_color[i])
              .style("opacity", 1)
              .select("h2")
                .text(d.name)
                .style("color", route_color[i]);
            destination_el.select("#duration").text(d.flight_time);
            destination_el.select("#airlines").text(d.airlines.join(", "));
          }

          function hideInfo(d){
              d3.selectAll("[data-city='" + d.name + "']")
                  .transition()
                  .duration(300)
                  .style("opacity", 0.3)
          };

  window.onscroll = isTouch ? null : function(){ techplaya.throttle(routes_animation, window)};

  function routes_animation(){
    if (window.scrollY < flights_div.offsetTop - flights_div.offsetHeight) return;
    window.onscroll = null;
    radar = null;
    cities.transition()
      .delay(function(d, i){return i*20})
      .attr("r", 10)
      .style("opacity", 0.3)
      .ease("out")
      .each("end", function(){d3.select(this).transition().ease("in").attr("r", 4)});

    routes.transition()
      .delay(function(d, i){return i*20 + 500})
      .duration(3000)
      .attr("stroke-dashoffset", 0);
  }
};