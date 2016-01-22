//TODO: Since we're going with precision option #2, get rid of precision argument
const roundTo = 4;
function graphFunction(x, y, func, width, height, precision) {
    var real = (-1 * math.floor(width / 2 / precision) + x) / 25;
    var imag = (-1 * math.floor(height / 2 / precision) + y) / -25;
    var point = graphFunctionComplexInput(real, imag, func);
    point.x = x;
    point.y = y;
    return point;
}
function graphFunctionComplexInput(real, imag, func) {
    console.log(func);
    var replaced = func.replace('z', '(' + real + '+' + imag + 'i' + ')');
    console.log(replaced);
    var eval = math.eval(replaced);
    var result;
    if (eval == '-Infinity')
        result = '-Infinity';
    else if (eval == 'Infinity' || eval == 'NaN - aNi')
        result = 'Infinity';
    else result = math.round(eval.re, roundTo) + (eval.im < 0 ? '' : '+') + math.round (eval.im, roundTo) + 'i';
    //console.log("result: " + result);
    var magnitude = math.abs(eval);


    var degree = math.arg(eval) * 360 / (2 * Math.PI);
    if (degree < 0)
        degree = (degree + 360);

    var light = math.atan(magnitude/2) / (Math.PI / 2) * 100;
    var number = real + (imag < 0 ? '' : '+') + imag + 'i';

    if (real === 0 && imag === 0)
        console.log('MAGNITUDE = ' + magnitude);
    if (typeof magnitude === 'number' && magnitude != 'NaN' && magnitude != 'Infinity')
        magnitude = math.round(magnitude, roundTo);
    if (typeof degree === 'number' && degree != 'NaN')
        degree = math.round(degree, roundTo);
    if (typeof light === 'number' && light != 'NaN')
        light = math.round(light, roundTo);
    return {
        result: result,
        magnitude: magnitude,
        degree: degree,
        light: light,
        number: number
    };

}
//Struct
