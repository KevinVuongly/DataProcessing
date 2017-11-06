var rawdata = document.getElementById('rawdata').value

rawdata = rawdata.split("\n");
rawdata.splice(0, 1);
rawdata.splice(rawdata.length-1, 1);

var date = [];
var temperature = [];

date, temperature = splitElement(date, temperature, rawdata);

date = removeSpaces(date);
temperature = removeSpaces(temperature);

var days = 366;
var info = 2;
var data = createMatrix(days, info);

for (var i = 0; i < data.length; i++){
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

// draw y-axis
drawLine(padding / 2, padding / 2,
         position(300) + padding, position(-50) + padding);

for (var i = 0; i < 8; i++){
  var yAxisPositionX = padding / 2;
  var yAxisPositionY = position(-50 + 50 * i) + padding;
  if (-50 + 50 * i != 0){
    drawLine(yAxisPositionX, yAxisPositionX + 10,
             yAxisPositionY, yAxisPositionY);
  }
  ctx.font = '12px serif';
  ctx.textAlign = 'left';
  ctx.fillText(-50 + 50 * i, padding / 2 - 20, yAxisPositionY);
}

// VERTICALE TITEL VOOR Y-AS, GAAT FOUT, VRAAG ASSISTENT OM HULP
ctx.save();
ctx.rotate(90 * Math.PI / 180);
ctx.font = '22px serif';
ctx.textAlign = 'center';
ctx.fillText('Temperature in 10 * Celsius', 500, 400);
ctx.restore()

// draw x-axis
drawLine(padding / 2, canvas.width - padding / 2,
         position(0) + padding, position(0) + padding);

var months = [];
for (var i = 0, amountOfMonths = 12; i < amountOfMonths; i++){
  months.push(date[30 * i]);
}

for (var i = 0, amountOfMonths = 12; i <= amountOfMonths; i++){
  var xAxisPositionX = padding / 2 + (plotwidth / amountOfMonths) * i;
  var xAxisPositionY = position(0) + padding;
  if ( i > 0){
    drawLine(xAxisPositionX, xAxisPositionX,
             xAxisPositionY, xAxisPositionY - 10);
  }

  if (i < amountOfMonths){
    ctx.font = '12px serif';
    ctx.textAlign = 'center';
    ctx.fillText(months[i], xAxisPositionX + (plotwidth / amountOfMonths) / 2,
                 xAxisPositionY + 10);
  }
}

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

//////////////////////////////////////////////////////

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

function drawLine(xOld, xNew, yOld, yNew){
  ctx.beginPath();
  ctx.moveTo(xOld, yOld);
  ctx.lineTo(xNew, yNew);
  ctx.stroke();
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
