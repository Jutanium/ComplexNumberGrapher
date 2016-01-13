function graphFunction(x, y, func, width, height, precision) {
  var real = (-1 * math.floor(width / 2 / precision) + x)/25;
  var imag = (-1 * math.floor(height / 2 / precision) + y)/-25;

  console.log(func);
  var result = math.eval(func.replace('z', '(' + real + '+' + imag + 'i') + ')');
  //console.log("result: " + result);
  var magnitude = math.abs(result);

  var degree = math.arg(result)*360/(2*Math.PI);
  if (degree < 0)
    degree = (degree + 360);
  var light = math.atan(magnitude) / (Math.PI / 2) * 50;
  var number = real + (imag < 0 ? '' : '+') + imag
  var returnObj = {
    x: x,
    y: y,
    result: result,
    magnitude: magnitude,
    degree: degree,
    light: light,
    number: number
  }; 

  return returnObj;
}

//Struct
