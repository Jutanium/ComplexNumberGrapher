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
    var replaced = func
        .replace(/\|(.+)\|/, "abs($1)") //turn |whatever| into abs(whatever)
        .replace(/z/g, '(' + real + '+' + imag + 'i' + ')') //replace z with input
        .replace(/0\+0i/g, '0'); //0+0i is bugged in some functions, such as f(z) = z^2, so make it 0
        //.replace()
    console.log(replaced);
    var eval = math.eval(replaced);
    console.log(eval);
    var result;
    if (eval == '-Infinity')
        result = '-Infinity';
    else if (eval == 'Infinity' || eval == 'NaN - aNi')
        result = 'Infinity';
    else {
        if (typeof eval.re === "undefined") //If the answer isn't in the form of x+yi, make it so
            result = math.round(eval, roundTo) + '+0i';
        else {
            result = '';
            //Don't attempt to round any Infinity numbers!
            if (eval.re == 'Infinity' || eval.re == '-Infinity')
                result += result.re;
            else result += math.round(eval.re, roundTo);
            result += (eval.im < 0 ? '' : '+');
            if (eval.im == 'Infinity' || eval.im == '-Infinity')
                result += eval.im;
            else result += math.round(eval.im, roundTo) + 'i';
        }
    }
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
