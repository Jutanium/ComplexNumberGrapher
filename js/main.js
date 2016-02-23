var graphCanvas = document.getElementById('graph');
var graphContext = graphCanvas.getContext('2d');
var axesCanvas = document.getElementById('axes');
var axesContext = axesCanvas.getContext('2d');

const width = graphCanvas.width;
const height = graphCanvas.height;
const newline = "</br>";
const popoutOpacity = 0;

//There might be a better way to do this check...
const complexNumberRegex = /^[+-]?[0-9]*[.]?[0-9]+[+-]{1}[0-9]*[.]?[0-9]+i$/;

var currentWorker; //Web worker. One at a time!
var precisionBox;
var input;
var currentImage; //(Array) Stores the x, y, number, result, magnitude, degree, and light of every point in the image
var MQ;
var inputTextbox;

$(document).ready(function() {
    //'Initialization' stuff
    $("#popout").css('opacity', popoutOpacity);

    MQ = MathQuill.getInterface(2);
    inputTextbox = MQ.MathField($('#inputTextbox')[0]);
    $(".staticMath").each(function() {
        MQ.StaticMath(this);
    })

    precisionBox = $('#precision');

    drawAxes();
    //EVENTS
    $('#z').on('input', function() { //When the user edits the z directly
        var newNumber = $(this).html();
        updateInput();
        if (complexNumberRegex.test(newNumber)) //If it's a valid complex number
        {
            var indexOfSplit = newNumber.lastIndexOf('+');
            if (indexOfSplit == 0)
                indexOfSplit = newNumber.lastIndexOf('-');
            var real = newNumber.substring(0, indexOfSplit);
            console.log("real: " + real);
            var imag = newNumber.substring(newNumber.charAt(indexOfSplit) == '-' ? indexOfSplit : indexOfSplit + 1,
                newNumber.length-1);
            console.log("imag: " + imag);
            updateDetails(graphFunctionComplexInput(real, imag, input));
        }
    });


    //Makes sure the user can't put newlines or spaces when they edit the z! The regex will catch other stuff
    $("#z").keypress(function(e){
        return (e.which != 13 && e.which != 9 && e.which != 32);
    });
    axesCanvas.addEventListener('mouseenter', function (e) {
        $("#popout").show();
    });

    axesCanvas.addEventListener('mouseleave', function (e) {
        $("#popout").hide();
    });
    axesCanvas.addEventListener('mousemove', function (e) {
        console.log("rollover");
        updateInput();

        if (input.indexOf('z') == -1)
            return;

        var rect = graphCanvas.getBoundingClientRect();
        var x = e.clientX - Math.round(rect.left);
        var y = e.clientY - Math.round(rect.top);

        var point;
        if (typeof currentImage !== 'undefined' && typeof currentImage[x][y] === 'number')
        {
            point = currentImage[x][y];
        }
        else point = graphFunction(x, y, input, width, height, 1);

        updateDetails(point);

        //fillPixelHSL(x, y, point.degree, 100, point.light);
        var popout = $("#popout");
        popout.css({top: y + 10, left: x + 10});
        popout.html(point.result + newline);
        //startWorker(x, y);
    });
    axesCanvas.addEventListener('mousedown', function (e) {
        $("#popout").css('opacity', '1');
    });
    axesCanvas.addEventListener('mouseup', function (e) {
        $("#popout").css('opacity', popoutOpacity);
    });

});

function line(context, x, y, toX, toY, strokewidth) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY);
    context.lineWidth = typeof strokewidth === 'number' ? strokewidth : 2;
    context.stroke();
}

/**
 * Draw graph axes
 */
function drawAxes() {
    //Axes
    line(axesContext, 0, height / 2, width, height / 2);
    line(axesContext, width / 2, 0, width / 2, height);
    //Notches
    for (var y = height / 20; y < height; y += height / 20) {
        line(axesContext, width / 2 - 5, y, width / 2 + 5, y);
    }
    for (var x = width / 20; x < width; x += width / 20) {
        line(axesContext, x, height / 2 - 5, x, height / 2 + 5);
    }
    //Origin
    axesContext.beginPath();
    axesContext.arc(width / 2, height / 2, 3, 0, Math.PI * 2);
    axesContext.fill();
}

//UNUSED
function fillPixelRGB(x, y, r, g, b, a) {
    graphContext.beginPath();
    graphContext.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
    graphContext.fillRect(x, y, 1, 1);
}

function fillPixelHSL(x, y, h, s, l) {
    graphContext.beginPath();
    graphContext.fillStyle = "hsl(" + h + "," + s + "%," + l + "%)";
    graphContext.fillRect(x, y, 1, 1);
}

function graphPoint(point) {
    var precision = Number(precisionBox.val());
    console.log("precision :" + precision);
    for (i = 0; i < precision; i++) {
        for (j = 0; j < precision; j++) {
            //First precision option:
            //fillPixelHSL(point.x * precision + i, point.y * precision + j, point.degree, 100, point.light);
            //Second precision option
            fillPixelHSL(point.x + i, point.y + j, point.degree, 100, point.light);
            currentImage[point.x + i][point.y + j] = point;
        }
    }
}
function updateInput() {
    //TODO: More validation
    //Parse the latex that Mathquill gives us
    input = inputTextbox.latex()
        .replace(/\\frac\{(.+)\}\{(.+)\}/, '($1)/($2)') //replace \frac{1}{2} notation
        .replace(/\\left/g, '(') //get rid of \left
        .replace(/\\right/g, ')') //get rid of \right
        .replace(/\{(.+)\}/g, '($1)') //replace {whatever} with (whatever)
        .replace(/\\cdot/g, '*') //replace bullet multiplication sign with *
        .replace(/\\ /g, '') //get rid of spaces, which are backslashes followed by spaces in latex
        .replace(/\\/g, '') //get rid of remaining backslashes
        .replace(/pi/g, '(pi)') //self contain pi
        //self contain e's, i's, and z's that aren't part of function names. (works since no functions have i, z, or e
        //followed by another i, z, or e. TODO: make work for ceil(x)
        .replace(/(i|z|e)(?=[0-9]|i|z|e|\s|\))/g, '($1)');
}

//Called by function buttons
function insertFunction(text) {
    inputTextbox.typedText(text);
}

function updateDetails(point) {
    $('#z').html(point.number);
    $('#output').html(point.result);
    $('#magnitude').html(point.magnitude);
    $('#degree').html(point.degree);
    //$('#light').html(point.light);
    $('#arrow').css('left', point.degree - 5);
}
//On graph button click
function graph() {
    graphContext.clearRect(0, 0, graphCanvas.width, graphCanvas.height); //Clear the graph
    if (typeof currentWorker !== 'undefined') currentWorker.terminate(); //Kill the current worker
    updateInput();
    startWorker();
}

function startWorker() {
    var grapher = new Worker("js/grapherworker.js");
    currentWorker = grapher;
    grapher.postMessage({input: input, startX: 0, endX: width, width: width, height: height, precision: Number(precisionBox.val())});
    currentImage = new Array(width);
    for (var i = 0; i < currentImage.length; i++) {
        currentImage[i] = new Array(height);
    }
    grapher.onmessage = function (e) {
        var point = e.data;
        //console.log(point.x + ", " + point.y);
        graphPoint(point);
    }
}


