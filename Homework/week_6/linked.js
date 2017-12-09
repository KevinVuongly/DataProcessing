/*  Name: Kevin Vuong
 *  Student number: 10730141
 */

// wait until DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {

    // URL-source of data
    d3.select("body").append("div")
        .attr("class", "data");

    d3.select(".data").append("sup")
        .text("Population data")
        .on("click", function(){
            window.open("https://data.oecd.org/pop/population.htm");
    });

    d3.select(".data").append("sup")
        .text("GDP data")
        .on("click", function(){
            window.open("https://data.oecd.org/gdp/gross-domestic-product-gdp.htm");
    });

    d3.select(".data").append("sup")
        .text("Quality of Life index data")
        .on("click", function(){
            window.open("https://www.numbeo.com/quality-of-life/rankings_by_country.jsp?title=2017-mid&region=150");
    });

    // width and height of barchart
    var margin = {top: 50, right: 200, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // scale x
    var x = d3.scale.linear().range([0, width]);

    // scale y
    var y = d3.scale.linear().range([height, 0]);

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

    var xBar = d3.scale.ordinal().rangeRoundBands([0, width + 100], .1);
    var yBar = d3.scale.linear().rangeRound([height, 0]);
    var zBar = d3.scale.category10();

    // add x-axis
    var xAxisBar = d3.svg.axis().scale(xBar).orient("bottom");

    // add y-axis
    var yAxisBar = d3.svg.axis().scale(yBar).orient("left");

    var barplotsvg = d3.select("body").append("div")
        .attr("class", "barplot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "rectangles")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    queue()
    	.defer(d3.csv, "data/GDP.csv")
        .defer(d3.csv, "data/happy.csv")
    	.await(makeChart);

    // get data, make barchart
    function makeChart(error, GDP, happy) {
        // throw error when data is not found
        if (error) throw error;

        GDP.forEach(function(d) {
            d.GrossDomesticProduct = +d.GrossDomesticProduct;
            d.Population = +d.Population;
            d.Total = +d.Total;
        });

        happy.forEach(function(d) {
            d.Quality = +d.Quality;
            d.Purchasing = +d.Purchasing;
            d.Safety = +d.Safety;
            d.Health = +d.Health;
            d.Livingcost = +d.Livingcost;
        })

        // SCATTERPLOT
        // construct domain and range
        x.domain(d3.extent(GDP, function(d)
                 { return d.Population; })).nice();
        y.domain(d3.extent(GDP, function(d)
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

        // BARPLOT
        var indexes = ["Quality of Life", "Purchasing power",
                     "Safety", "Healthcare", "Cost of Living"]
        xBar.domain(indexes.map(function(d) { return d; }));
        yBar.domain([0, 200]);

        // add x-axis to barchart
        barplotsvg.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisBar)
            .append("text")
            .attr("class", "label")
            .attr("x", width + 100)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Indexes");

        // add y-axis to barchart
        barplotsvg.append('g')
            .attr('class', 'axis axis-y')
            .call(yAxisBar)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Score");

        // title of barplot, empty at first
        barplotsvg.append("text")
            .attr("class", "barchartTitle")
            .attr("x", (width / 2) + margin.left)
            .attr("y", 20 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "50px")
            .text("Click on a country");

        barplotsvg.selectAll(".bar")
            .data(indexes)
            .enter().append("rect")
            .attr("class", function(d, i) { return "rectangle" + i; })
            .attr("fill", function(d, i) { return zBar(i); })
            .attr('x', function(d) { return xBar(d) + 15; })
            .attr('y', 0)
            .attr('width', width / indexes.length - 30)
            .attr('height',0);

        // construct tooltip
        var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

        // draw scatterplot
        svg.selectAll(".dot")
            .data(GDP)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return d.Total / 100000; })
            .attr("cx", function(d) { return x(d.Population); })
            .attr("cy", function(d) { return y(d.GrossDomesticProduct); })
            .attr("fill", "green")
            .on("mouseover", function(d) {
                d3.select(this).attr("fill", "red");
                d3.select(this).moveToFront();
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.Country + "<br></br>"
                             + "Total GDP is: $"
                             + parseInt(d.Total).toLocaleString()
                             + ".000.000")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "green");
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function(d) {
                var element = d3.select(this);
                element.attr("fill", "blue");

                var updatesvg = d3.select(".barplot")

                updatesvg.transition()
                    .select(".barchartTitle")
                    .text(d.Country);

                var currentCountry = d.Country;

                for (var i = 0; i < happy.length; i++){
                    if (happy[i].Country.localeCompare(currentCountry) == 0){

                        d3.select(".rectangle0")
                            .data(happy)
                            .transition()
                            .duration(1000)
                            .attr('y', yBar(happy[i].Quality))
                            .attr('height',  height - yBar(happy[i].Quality));

                        d3.select(".rectangle1")
                            .data(happy)
                            .transition()
                            .duration(1000)
                            .attr('y', yBar(happy[i].Purchasing))
                            .attr('height',  height - yBar(happy[i].Purchasing));

                        d3.select(".rectangle2")
                            .data(happy)
                            .transition()
                            .duration(1000)
                            .attr('y', yBar(happy[i].Safety))
                            .attr('height',  height - yBar(happy[i].Safety));

                        d3.select(".rectangle3")
                            .data(happy)
                            .transition()
                            .duration(1000)
                            .attr('y', yBar(happy[i].Health))
                            .attr('height',  height - yBar(happy[i].Health));

                        d3.select(".rectangle4")
                            .data(happy)
                            .transition()
                            .duration(1000)
                            .attr('y', yBar(happy[i].Livingcost))
                            .attr('height',  height - yBar(happy[i].Livingcost));

                        return;
                    }
                }
            });
    }
})

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
