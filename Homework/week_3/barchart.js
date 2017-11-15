var dates = 366;

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 25 * dates - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select('body').append('svg').attr('class', 'chart')

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

d3.json('data/KNMI.json', function(data) {
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([d3.min(data, function(d) { return d.temperature / 10 - 2; }),
            d3.max(data, function(d) { return d.temperature / 10; })]);

  var bar = chart.selectAll("g")
                 .data(data)
                 .enter().append("g")
                 .attr("transform", function(d)
                  { return "translate(" + x(d.date) + ",0)"; });

  bar.append("rect").attr("y", function(d) { return y(d.temperature / 10); })
                    .attr("height", function(d)
                    { return height - y(d.temperature / 10); })
                    .attr("width", x.rangeBand());

  bar.append("text").attr("x", x.rangeBand() / 2)
                    .attr("y", function(d)
                    { return y(d.temperature / 10) + 3; })
                    .attr("dy", ".75em")
                    .text(function(d) { return d.temperature / 10; });
});

function type(d) {
  d.temperature = +d.temperature; // coerce to number
  return d;
}
