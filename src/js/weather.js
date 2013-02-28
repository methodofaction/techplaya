
// WEATHER
(function(){
  var celsius = [
    { month: "January",   high: 27, low: 20 },
    { month: "February",  high: 27, low: 20 },
    { month: "March",     high: 28, low: 21 },
    { month: "April",     high: 29, low: 22 },
    { month: "May",       high: 31, low: 23 },
    { month: "June",      high: 29, low: 24 },
    { month: "July",      high: 31, low: 24 },
    { month: "August",    high: 31, low: 24 },
    { month: "September", high: 31, low: 24 },
    { month: "October",   high: 28, low: 23 },
    { month: "November",  high: 27, low: 22 },
    { month: "December",  high: 27, low: 21},
  ];

  var fahrenheit = celsius.map(function(d, i){
    function convert(temp) { return Math.round(temp * 9/5 + 32, 0) };
    return {
      high: convert(d.high),
      low: convert(d.low),
    }
  });

  var scale = d3.scale.linear()
    .domain([0, 50])
    .range([0, 100]);

  var w_div = d3.select("#weather");

  w_div.selectAll("div")
    .data(celsius)
    .enter()
    .append("div")
      .classed("month", true)
        .text(function(d){return d.month})
        .append("div")
          .classed("range", true)
          .style("left", function(d){return scale(d.low) + "%"})
          .style("width", function(d){return scale(d.high - d.low) + "%"})
          .attr("data-low", function(d){return d.low})
          .attr("data-high", function(d){return d.high})

  var units = d3.selectAll(".units .unit");

  units.on("click", function(){
    var isCelsius = d3.select(this).classed("celsius");
    units.classed("selected", false);
    d3.select(this).classed("selected", true);
    var data =  isCelsius ? celsius : fahrenheit;
    scale.domain(isCelsius ? [0, 50] : [0, 100])
    
    w_div.selectAll(".range")
      .style("left", "30%")
      .style("width", "70%");
    setTimeout(function(){
      w_div.selectAll(".range")
        .data(data)
        .style("left", function(d){return scale(d.low) + "%"})
        .style("width", function(d){return scale(d.high - d.low) + "%"})
        .attr("data-low", function(d){return d.low})
        .attr("data-high", function(d){return d.high})
    }, 500);
          
    w_div.classed("fahrenheit", !isCelsius);
  });
})();