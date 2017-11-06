var rawdata = document.getElementById('rawdata').value

rawdata = rawdata.split("\n");
rawdata.splice(0, 1);
rawdata.splice(rawdata.length-1, 1);

var date = [];
var temperature = [];

date, temperature = splitElement(date, temperature, rawdata);

date = removeSpaces(date);
temperature = removeSpaces(temperature);

days = 366;
info = 2;
data = createMatrix(days, info);

for (var i = 0; i < data.length; i++){
  data[i][0] = date[i];
  data[i][0] = data[i][0].slice(0, 4) + "/" + data[i][0].slice(4, 6) +
                "/" + data[i][0].slice(6, 8);
  data[i][0] = new Date(data[i][0]);

  data[i][1] = Number(temperature[i]);
}

var domainTemp = [0, 365];
var rangeTemp = [Math.min.apply(0, temperature),
                  Math.max.apply(0, temperature)];

var canvas = document.getElementById('myCanvas');
canvas.width  = days;
canvas.height = rangeTemp[1] - rangeTemp[0];

var ctx = canvas.getContext('2d');

position = createTransform(domainTemp, rangeTemp);

var yStart = canvas.height - (data[0][1] + Math.abs(rangeTemp[0]));

ctx.lineJoin = 'round';
ctx.beginPath();
ctx.moveTo(0, yStart);
for (var i = 1; i < data.length; i++){
  var y = canvas.height - (data[i][1] + Math.abs(rangeTemp[0]));
  ctx.lineTo(i, y);
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
      return alpha * x + beta;
    }
}
