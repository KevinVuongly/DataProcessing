var xhr = new XMLHttpRequest();

xhr.open('GET', 'KNMI.txt', true);
xhr.send();

xhr.onreadystatechange = function(){
  if (xhr.readyState == 4 && xhr.status == 200){
    var rawdata = xhr.responseText;

    document.getElementById('rawdata').innerHTML = rawdata;

    var datastruct = document.getElementById('rawdata');
    var rawdata = datastruct.value;

    if (datastruct.style.display == 'none'){
      datastruct.style.display = "block";
    }
    else {
      datastruct.style.display = 'none';
    }

    rawdata = rawdata.split("\n");
    rawdata.splice(rawdata.length-1, 1);

    var date = [];
    var temperature = [];

    date, temperature = splitElement(date, temperature, rawdata);

    date = removeSpaces(date);
    temperature = removeSpaces(temperature);

    var days = date.length;
    var info = 2;
    var data = createMatrix(days, info);

    for (var i = 0; i < date.length; i++){
      data[i][0] = date[i];
      data[i][0] = data[i][0].slice(0, 4) + "/" + data[i][0].slice(4, 6) +
                    "/" + data[i][0].slice(6, 8);
      data[i][0] = new Date(data[i][0]);

      data[i][1] = Number(temperature[i]);
    }

    var rangeTemp = [0, 400];
    var domainTemp = [Math.min.apply(0, temperature),
                      Math.max.apply(0, temperature)];

    var canvas = document.getElementById('myCanvas');

    var padding = 160;
    var plotwidth = 2 * days;
    var plotheight = rangeTemp[1] - rangeTemp[0];

    canvas.width = plotwidth + padding;
    canvas.height = plotheight + 2 * padding;

    var ctx = canvas.getContext('2d');

    var position = createTransform(domainTemp, rangeTemp);

    // initialize title of graph
    ctx.font = '36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Average temperature in De Bilt(NL)',
                  canvas.width / 2, 50);

    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('november 9th 2014 - november 9th 2015',
                  canvas.width / 2, 80 );

    // draw y-axis
    drawLine(ctx, padding / 2, padding / 2,
             position(300) + padding, position(-50) + padding);

    for (var i = 0; i < 8; i++){
      var yAxisPositionX = padding / 2;
      var yAxisPositionY = position(-50 + 50 * i) + padding;
      if (-50 + 50 * i != 0){
        drawLine(ctx, yAxisPositionX, yAxisPositionX + 10,
                 yAxisPositionY, yAxisPositionY);
      }
      ctx.font = '12px serif';
      ctx.textAlign = 'left';
      ctx.fillText(-5 + 5 * i, padding / 2 - 20, yAxisPositionY);
    }

    ctx.save();
    ctx.translate(padding / 4, canvas.height / 2);
    ctx.rotate(270 * Math.PI / 180);
    ctx.font = '22px serif';
    ctx.textAlign = 'center';
    var degree = 176;
    ctx.fillText('Temperature in Celsius (' +
                  String.fromCharCode(degree) + 'C)', 0, 0);
    ctx.restore()

    // draw x-axis
    drawLine(ctx, padding / 2, canvas.width - padding / 2,
             position(0) + padding, position(0) + padding);

    var months = ['9th nov', '9th dec', '9th jan', '9th feb', '9th mar',
                  '9th apr', '9th may', '9th jun', '9th jul','9th aug',
                  '9th sept', '9th oct', '9th nov'];

    for (var i = 0, amountOfMonths = 12; i <= amountOfMonths; i++){
      var xAxisPositionX = padding / 2 + (plotwidth / amountOfMonths) * i;
      var xAxisPositionY = position(0) + padding;
      if ( i > 0){
        drawLine(ctx, xAxisPositionX, xAxisPositionX,
                 xAxisPositionY, xAxisPositionY - 10);
      }

      ctx.save();
      ctx.translate(xAxisPositionX, xAxisPositionY + 30);
      ctx.rotate(45 * Math.PI / 180);
      ctx.font = '12px serif';
      ctx.textAlign = 'center';
      ctx.fillText(months[i], 0, 0);
      ctx.restore();
    }

    var yearswitch = 53;

    drawLine(ctx, padding / 2 + 2 * yearswitch, padding / 2 + 2 * yearswitch,
             position(0) + padding, position(-50) + padding);

    ctx.save();
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.fillText('2014', padding / 2 + yearswitch, position(-50) + padding);
    ctx.restore()

    ctx.save();
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.fillText('2015', (plotwidth / amountOfMonths) * 2 + 2 * yearswitch,
                  position(-50) + padding);
    ctx.restore()


    // drawing the data in graph
    var yStart = position(data[0][1]);

    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(padding / 2, yStart + padding);
    for (var i = 1; i < data.length; i++){
      var y = position(data[i][1]);
      ctx.lineTo(padding / 2 + 2 * i, y + padding);
    }
    ctx.stroke();
  }
  else if (xhr.readyState == 4 && xhr.status >= 404){
     alert('Couldn\'t find the file.');
  }
}

/////////////////////////////////////////////////////////

function createMatrix(rows, columns){
  var matrix = [];

  for(var i=0; i < rows; i++) {
    matrix[i] = new Array(columns);
  }

  return matrix;
}

function splitElement(part1, part2, data){
  for (var i = 0; i < data.length; i++){
    var split = data[i].split(",");
    part1.push(split[0]);
    part2.push(split[1]);
  }

  return part1, part2;
}

function removeSpaces(array){

  for (var i = 0; i < array.length; i++)
  {
    array[i] = array[i].replace(/ /g, "");
  }

  return array;
}

function drawLine(context, xOld, xNew, yOld, yNew){
  context.beginPath();
  context.moveTo(xOld, yOld);
  context.lineTo(xNew, yNew);
  context.stroke();
}

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return range_max - (alpha * x + beta);
    }
}
