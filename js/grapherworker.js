importScripts('math.js', 'staticfunctions.js');
onmessage = function (e) {
    var func = e.data.input;
    console.log(func);
    var startX = e.data.startX;
    var endX = e.data.endX;
    var width = e.data.width;
    var height = e.data.height;
    var precision = e.data.precision;
    var nanIsInfinity = e.data.nanIsInfinity;
    console.log("precision: " + precision);
    //First precision option
    /*for (var x = math.floor(startX / precision); x < math.floor(endX / precision); x++) {
        for (var y = 0; y < math.floor(height / precision); y++) {
            var pixel = graphFunction(x, y, func, width, height, precision);
            postMessage(pixel);
        }
    }*/
    //Second precision option
    for (var x = startX; x < endX; x += precision) {
        for (var y = 0; y < height; y += precision) {
            postMessage(graphFunction(x, y, func, width, height, nanIsInfinity));
        }
    }

    postMessage({done: true});
    close();
    /*
     var result = math.eval(func.replace('z', '(' + real + '+' + imag + 'i') + ')');

     console.log("result: " + result);
     var magnitude = math.abs(result);
     var degree = math.arg(result)*360/(2*Math.PI);
     if (degree < 0)
     degree = (degree + 360);
     var light = math.atan(magnitude) / (Math.PI / 2) * 50
     var returnObj = {
     result: result,
     magnitude: magnitude,
     degree: degree,
     light: light
     };

     postMessage(returnObj);
     close();*/
}
