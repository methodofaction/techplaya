
(function(){

//satellite projection for header

var width = 1600,
    height = 600;
 
var projection = d3.geo.satellite()
    .distance(1.7)
    .scale(2500)
    .rotate([90.00, -5, 0])
    .center([-5, 10])
    .tilt(0)
    .clipAngle(50);

var graticule = d3.geo.graticule()
    .extent([[-150, 10], [-30 + 1e-6, 57]])
    .step([3, 3]);
 
var path = d3.geo.path()
    .projection(projection);
 
var svg = d3.select("#satellite").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    
var defs = svg.append("defs");

var clipPath = defs.append("clipPath")
    .attr("id", "clip-intro")
    .append("path")
        .datum({type: "Sphere"})
        .attr("id", "sphere-intro")
        .attr("d", path);

svg.append("use")
   .attr("class", "foreground")
   .attr("xlink:href", "#sphere-intro");

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .style("opacity", "0.3")
    .attr("clip-path", "url(#clip-intro)")
    .attr("d", path)
 
svg.append("path")
    .datum(topojson.object(world, world.objects.land))
    .attr("class", "land")
    .attr("d", path);

svg.append("circle")
    .attr("class", "city")
    .attr("cx", projection([-87.06, 20.6167])[0])
    .attr("cy", projection([-87.06, 20.6167])[1])
    .attr("r", 5)

var home_city = svg.append("circle")
    .attr("cx", projection([-87.06, 20.6167])[0])
    .attr("cy", projection([-87.06, 20.6167])[1])
    .attr("fill", "none")
    .attr("stroke", "black")

function radar(){
  home_city
    .attr("r", 10)
    .attr("stroke-width", 5)
    .attr("stroke-opacity", 0.3)
    .transition()
    .duration(1000)
      .attr("r", 20)
      .attr("stroke-width", 10)
      .attr("stroke-opacity", 0)
      .each("end", radar)
}


var satellite  = d3.select("#satellite svg");
function map_adjust(){
  var proportion = 1600 / window.innerWidth * 600
  satellite.attr("viewBox", "0 -" + proportion/2 + " 1600 " + 1600 / window.innerWidth * 600);
}

window.onresize = map_adjust; 

map_adjust();
radar();

})();

