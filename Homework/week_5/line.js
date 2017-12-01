/*  Name: Kevin Vuong
 *  Student number: 10730141
 */

// wait until DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {

    // create svg element
    d3.select("#mbars").append("svg").attr("width", 1200).attr("height", 600);

    // initialize svg dimensions
    var svg = d3.select("svg"),
        margin = {top: 20, right: 150, bottom: 30, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;

    // variable to parse time
    var parseTime = d3.timeParse("%Y%m%d");

    // scale x
    var x = d3.scaleTime().range([0, width]);

    // scale y
    var y = d3.scaleLinear().range([height, 0]);

    // scale z, needed to give each line an unique color
    var z = d3.scaleOrdinal(d3.schemeCategory10);

    // update plot when clicked on a city
    d3.selectAll(".m")
	    .on("click", function() {

            // remove old plot if any
            d3.selectAll(".plot").remove();
            d3.selectAll(".tooltip").remove();

            // add g element to svg
            var g = svg.append("g").attr("class", "plot")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // get variable of the city
            var city = this.getAttribute("value");

            // get data of the city
			var str;
			if(city == "Hoorn") {
				str = "https://kevinvuongly.github.io/DataProcessing/Homework/week_5/data/data_hoorn.csv";
			}
			else {
				str = "https://kevinvuongly.github.io/DataProcessing/Homework/week_5/data/data_debilt.csv";
			}

        d3.csv(str, type, function(error, data) {
            // throw error when data is not found
            if (error) throw error;

            // initialize data
            var typeTemperatures = data.columns.slice(1).map(function(id) {
              return {
                id: id,
                values: data.map(function(d) {
                    return {datetext: d.datetext,
                        date: d.date, temperature: d[id] / 10};
                });
              };
            });

            // line variable for plot
            var line = d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.temperature); });

            // initialize domain of x
            x.domain(d3.extent(data, function(d) { return d.date; }));

            // initialize range of y
            y.domain([
                d3.min(typeTemperatures, function(c)
                    { return d3.min(c.values, function(d)
                        { return d.temperature; }); }),
                d3.max(typeTemperatures, function(c)
                    { return d3.max(c.values, function(d)
                        { return d.temperature; }); })
            ]);

            // initialize color of each lineplot
            z.domain(typeTemperatures.map(function(c) { return c.id; }));

            // create x-axis
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // create y-axis
            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000")
                .text("Temperature, ºC");

            // create g element vor each line
            var condition = g.selectAll(".condition")
                .data(typeTemperatures)
                .enter().append("g")
                .attr("class", "condition");

            // add the line
            condition.append("path")
                .attr("class", "line")
                .attr("d", function(d) { return line(d.values); })
                .style("stroke", function(d) { return z(d.id); });

            // add text of the line
            condition.append("text")
                .datum(function(d) {
                    return {id: d.id, value: d.values[d.values.length - 1]}; })
                .attr("transform", function(d)
                    { return "translate(" + Number(x(d.value.date) + 10)
                        + "," + y(d.value.temperature) + ")"; })
                .attr("x", 3)
                .attr("dy", "0.35em")
                .style("font", "12px sans-serif")
                .text(function(d) { return d.id; });

            // initialize transparant rectangle for crosshair
            var transpRect = g.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "white")
                .attr("opacity", 0);

            // vertical line of crosshair
            var verticalLine = g.append("line")
                .attr("opacity", 0)
                .attr("y1", 0)
                .attr("y2", height)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("pointer-events", "none");

            // horizontal line of crosshair
            var horizontalLine = g.append("line")
                .attr("opacity", 0)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("pointer-events", "none");

            // event listeners for the crosshair
            transpRect.on("mousemove", function(){
                mousex = d3.mouse(this)[0];
                mousey = d3.mouse(this)[1];
                verticalLine.attr("x1", mousex).attr("x2", mousex)
                    .attr("opacity", 1);
                horizontalLine.attr("y1", mousey).attr("y2", mousey)
                    .attr("opacity", 1)
            }).on("mouseout", function(){
                verticalLine.attr("opacity", 0.1);
                horizontalLine.attr("opacity", 0.1);
            });

            // title of the plot
            g.append("text")
                .attr("id", "plottitle")
                .attr("x", (width / 2))
                .attr("y", 0 - (margin.top / 2) + 50)
                .text(city);

            // construct tooltip
            var tooltip = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

            // add scatter points of each line to show tooltip
            var scatter = g.selectAll(".series")
                .data(typeTemperatures)
              .enter().append("g")
                .attr("class", "series")
                .style("fill", function(d, i) { return z(d.id); })
              .selectAll(".point")
                .data(function(d) { return d.values; })
              .enter().append("circle")
                .attr("class", "point")
                .attr("r", 5)
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.temperature); })
                .on("mouseover", function(d) {
                    d3.select(this).attr("r", 10);
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(d.datetext + "<br/><br/>"
                                 + "Temperature: " + d.temperature + " ºC")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this).attr("r", 5);
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });
    });

    // URL-source of data
    d3.select("body").append("div")
        .attr("class", "data")
        .append("sup")
        .text("KNMI data")
        .on("click", function(){
            window.open("http://projects.knmi.nl/klimatologie/daggegevens/selectie.cgi");
    });

    function type(d, _, columns) {
        d.date = parseTime(d.date);

        var parseDate = d3.timeFormat("%d-%m-%Y");
        d.datetext = parseDate(d.date);

        for (var i = 1, n = columns.length, c; i < n; ++i)
            d[c = columns[i]] = +d[c];
        return d;
    };
});
