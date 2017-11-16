// Name: Kevin Vuong
// Student number: 10730141

// create titles
var title = d3.select('body').append('h1')
              .text('Average temperature in De bilt(NL)');

// amount of dates in data
var dates = 366;

// width of bar in pixels
var barWidth = 50;

// width and height of barchart
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = barWidth * dates - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// add svg element
d3.select('body').append('svg').attr('class', 'chart');

// scale x
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

// scale y
var y = d3.scale.linear().range([height, 0]);

// add chart to chart class
var chart = d3.select('.chart')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
              .append('g')
              .attr('transform', 'translate(' + margin.left
                                              + ',' + margin.top + ')');

// add x-axis
var xAxis = d3.svg.axis().scale(x).orient('bottom');

// add y-axis
var yAxis = d3.svg.axis().scale(y).orient('left');

// get data, make barchart
d3.json('data/KNMI.json', function(error, data) {
    // throw error when data is not found
    if (error) throw error;

    // construct domain and range
    x.domain(data.map(function(d) { return d.date; }));
    y.domain([d3.min(data, function(d) { return d.temperature / 10; }),
              d3.max(data, function(d) { return d.temperature / 10; })]);

    // add x-axis to barchart
    chart.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    // add y-axis to barchart
    chart.append('g')
        .attr('class', 'axis axis-y')
        .call(yAxis);

    // add each bar
    chart.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.date); })
        .attr('y', function(d) { return y(d.temperature / 10); })
        .attr('width', barWidth - 5)
        .attr('height', function(d) { return height - y(d.temperature / 10); })
        .on('mouseover', function() {
            tooltip.style('display', null)
        })
        .on('mouseout', function() {
            tooltip.style('display', 'none')
        })
        .on('mousemove', function(d) {
            var xPos = d3.mouse(this)[0] - 15;
            var yPos = d3.mouse(this)[1] - 55;
            tooltip.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
            tooltip.select('text').text('Temperature: ' + d.temperature / 10);
        });

    // construct tooltip
    var tooltip = chart.append('g')
        .attr('class', 'tooltip')
        .style('display', 'none');

    // add atributes to tooltip
    tooltip.append('text')
        .attr('x', 15)
        .attr('dy', '1.2em')
        .style('fontsize', '1.25em')
        .attr('font-weight', 'bold');
});

// URL-source of data
d3.select('body').append('sup').text('data from KNMI')
.on('click', function(){
    window.open('http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi');
})
