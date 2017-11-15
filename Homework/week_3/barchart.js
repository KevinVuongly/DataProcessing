var title = d3.select('body').append('h1')
              .text('Average temperature in De bilt(NL)');

var dates = 366;
var barWidth = 50;

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = barWidth * dates - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select('body').append('svg').attr('class', 'chart');

var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var y = d3.scale.linear().range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

d3.json('data/KNMI.json', function(data) {
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([d3.min(data, function(d) { return d.temperature / 10; }),
            d3.max(data, function(d) { return d.temperature / 10; })]);

  chart.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis);

  chart.append("g")
       .attr("class", "y axis")
       .call(yAxis);

  chart.selectAll(".bar")
       .data(data)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d) { return x(d.date); })
       .attr("y", function(d) { return y(d.temperature / 10); })
       .attr("width", barWidth - 5)
       .attr("height", function(d) { return height - y(d.temperature / 10); });

});
