/*  Name: Kevin Vuong
 *  Student number: 10730141
 */

document.addEventListener("DOMContentLoaded", function() {
    // width and height of barchart
    var margin = {top: 20, right: 30, bottom: 30, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // scale x
    var x = d3.scale.linear().range([0, width]);

    // scale y
    var y = d3.scale.linear().range([height, 0]);

    // create colors for legend
    var color = d3.scale.category10();

    // add x-axis
    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    // add y-axis
    var yAxis = d3.svg.axis().scale(y).orient("left");

    // add svg element
    var svg = d3.select("body").append("div")
        .attr("class", "scatterplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // get data, make barchart
    d3.csv("data.csv", function(error, data) {
        // throw error when data is not found
        if (error) throw error;

        data.forEach(function(d) {
            d.GrossDomesticProduct = +d.GrossDomesticProduct;
            d.Population = +d.Population;
            d.Total = +d.Total;
        });

        // construct domain and range
        x.domain(d3.extent(data, function(d)
                 { return d.Population; })).nice();
        y.domain(d3.extent(data, function(d)
                 { return d.GrossDomesticProduct; })).nice();

        // add x-axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Population in millions");

        // add y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("GDP in US dollars/capita");

        // draw scatterplot
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return d.Total / 100000; })
            .attr("cx", function(d) { return x(d.Population); })
            .attr("cy", function(d) { return y(d.GrossDomesticProduct); })
            .style("fill", function(d) { return color(d.Continent); })
            .on('mouseover', function() {
                tooltip.style('display', null)
            })
            .on('mouseout', function() {
                tooltip.style('display', 'none')
            })
            .on('mousemove', function(d) {
                var xPos = d3.mouse(this)[0] - 15;
                var yPos = d3.mouse(this)[1] - 15;
                tooltip.attr('transform', 'translate(' + xPos + ',' + yPos + ')');
                tooltip.select('text').text(d.Country +
                     ", " + "Total GDP is " + d.Total);
            });

        // construct tooltip
        var tooltip = svg.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none');

        // add atributes to tooltip
        tooltip.append('text')
            .attr('x', 15)
            .attr('dy', '1.2em')
            .style('fontsize', '1.25em')
            .attr('font-weight', 'bold');

        // construct legend
        var legend = svg.selectAll(".legend")
             .data(color.domain())
             .enter().append("g")
             .attr("class", "legend")
             .attr("transform", function(d, i)
             { return "translate(0," + i * 20 + ")"; });

        // create rectangles for the colors of the legend
        legend.append("rect")
             .attr("x", width - 18)
             .attr("width", 18)
             .attr("height", 18)
             .style("fill", color);

        // add text to the legend
        legend.append("text")
             .attr("x", width - 24)
             .attr("y", 9)
             .attr("dy", ".35em")
             .style("text-anchor", "end")
             .text(function(d) { return d; });

        // add title to the scatterplot
        svg.append("text")
             .attr("x", (width / 2))
             .attr("y", 0 - (margin.top / 2) + 10)
             .attr("text-anchor", "middle")
             .style("font-size", "24px")
             .text("GDP per capita compared to population");
    });

    // URL-source of data
    d3.select("body").append("div")
        .attr("class", "data")
        .append("sup")
        .text("Population data")
        .on("click", function(){
            window.open('https://data.oecd.org/pop/population.htm');
    });

    d3.select(".data").append("sup")
        .text("GDP data")
        .on("click", function(){
            window.open('https://data.oecd.org/gdp/gross-domestic-product-gdp.htm');
    });
});
