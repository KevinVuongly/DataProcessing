d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;
    document.body.appendChild(xml.documentElement);

    var missingColorBox = ['138.7', '180.6', '222.5'];
    for (var i = 0; i < missingColorBox.length; i++){
        d3.select('svg').append('rect')
        .attr('id', 'kleur' + (i + 4))
        .attr('class', 'st1')
        .attr('x', '13')
        .attr('y', missingColorBox[i])
        .attr('width', '21')
        .attr('height', '29');
    };

    var missingTextBox =['180.6', '222.5'];
    for (var i = 0; i < missingTextBox.length; i++){
        d3.select('svg').append('rect')
        .attr('id', 'text' + (i + 5))
        .attr('class', 'st2')
        .attr('x', '46.5')
        .attr('y', missingTextBox[i])
        .attr('width', '119.1')
        .attr('height', '29');
    };

    var colors = ['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824'];

    for (var i = 0; i < colors.length; i++){
        d3.select('#kleur' + (i + 1)).style('fill', colors[i]);
    };

    var texts = ['100', '1000', '10000', '100000', '1000000', '10000000'];
    var yPos = ['13.5', '56.9', '96.8', '138.7', '180.6', '222.5'];

    for (var i = 0; i < yPos.length; i++){
        yPos[i] = Number(yPos[i]) + 29 / 2;
    }
    
    var textPos = 199.1 / 2;

    for (var i = 0; i < texts.length; i++){
        d3.select('svg').append('text')
        .attr('x', textPos)
        .attr('y', yPos[i])
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .text(texts[i]);
    }

});
