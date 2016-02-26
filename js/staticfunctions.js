const roundTo = 15;
function graphFunction(x, y, func, width, height) {
    var real = (-1 * math.floor(width / 2) + x) / 25;
    var imag = (-1 * math.floor(height / 2 ) + y) / -25;
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
        .replace(/(-{0,1}\d)\+0i/g, '$1'); //make x+0i x, because x+0i is bugged in some functions in mathjs
        //.replace()
    console.log(replaced);
    var eval = math.eval(replaced);
    console.log(eval);
    var result;
    console.log(eval.re == 'Infinity' || eval.re == '-Infinity');
    console.log(eval.im == 'Infinity' || eval.im == '-Infinity');
    if (eval == '-Infinity')
        result = '-Infinity';
    else if (eval == 'Infinity' || eval == 'NaN - aNi')
        result = 'Infinity';
    else {
        if (typeof eval.re === "undefined") //If the answer isn't in the form of x+yi, make it so
        {
            if (!isNaN(eval))
                result = math.round(eval, roundTo) + '+0i';
        }
        else {
            result = '';
            //Don't attempt to round any Infinity numbers!
            if (eval.re == 'Infinity' || eval.re == '-Infinity' || isNaN(eval.im))
                result += eval.re;
            else result += math.round(eval.re, roundTo);
            result += (eval.im !== 0 && eval.im < 0 ? '' : '+');
            if (eval.im == 'Infinity' || eval.im == '-Infinity' || isNaN(eval.im))
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


    if (typeof magnitude === 'number' && !isNaN(magnitude) && magnitude != 'Infinity'
        && magnitude != '-Infinity')
        magnitude = math.round(magnitude, roundTo);
    if (typeof degree === 'number' && !isNaN(degree))
        degree = math.round(degree, roundTo);
    if (typeof light === 'number' && !isNaN(light))
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
