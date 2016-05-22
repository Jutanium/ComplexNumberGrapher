const roundTo = 2;
function graphFunction(x, y, func, width, height, nanIsInfinity) {
    var real = (-1 * math.floor(width / 2) + x) / 25;
    var imag = (-1 * math.floor(height / 2 ) + y) / -25;

    var point = graphFunctionComplexInput(real, imag, func, nanIsInfinity);
    point.x = x;
    point.y = y;
    return point;
}
function graphFunctionComplexInput(real, imag, func, nanIsInfinity) {
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
    else if (eval == 'Infinity')
        result = 'Infinity';
    else if (eval == 'NaN - aNi') {
        console.log('nanIsInfinity: ')
        console.log(nanIsInfinity);
        if (nanIsInfinity)
            result = 'Infinity';
        else result = 'NaN';
    }

    else {
        if (typeof eval.re === "undefined") //If the answer isn't in the form of x+yi, make it so
        {
            if (!isNaN(eval))
                result = math.round(eval, roundTo) + '+0i';
        }
        else {
            var re, im, sign;
            //Don't attempt to round any Infinity numbers!
            if (eval.re == 'Infinity' || eval.re == '-Infinity' || isNaN(eval.re))
                re = eval.re;
            else re = math.round(eval.re, roundTo);
            if (eval.im == 'Infinity' || eval.im == '-Infinity' || isNaN(eval.im))
                im = eval.im;
            else im = math.round(eval.im, roundTo) + 'i';
            sign = (math.compare(im, 0) == -1) ? '' : '+'; //if the imaginary part is negative, there's already a sign
            result = re + sign + im;

        }
    }
    //console.log("result: " + result);
    var magnitude = math.abs(eval);


    var degree = math.arg(eval) * 360 / (2 * Math.PI);
    if (degree < 0)
        degree = (degree + 360);


    var light = isNaN (magnitude) || result.indexOf('Infinity') > -1 ? 100 : math.atan(magnitude) / (Math.PI / 2) * 100;
    console.log('light:' + light);
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
