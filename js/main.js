var graphCanvas = document.getElementById('graph');
var graphContext = graphCanvas.getContext('2d');
var axesCanvas = document.getElementById('axes');
var axesContext = axesCanvas.getContext('2d');

const width = graphCanvas.width;
const height = graphCanvas.height;
const newline = "</br>";

var currentWorker;
var precision = 5;
var input;

function line(context, x, y, toX, toY, strokewidth) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(toX, toY)
    context.lineWidth = typeof strokewidth === 'number' ? strokewidth : 2;
    context.stroke();
}

function axes() {
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

function fillPixelRGB(x, y, r, g, b, a) {
    graphContext.beginPath()
    graphContext.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
    graphContext.fillRect(x, y, 1, 1);
}

function fillPixelHSL(x, y, h, s, l) {
    graphContext.beginPath()
    graphContext.fillStyle = "hsl(" + h + "," + s + "%," + l + "%)";
    graphContext.fillRect(x, y, 1, 1);
}

function updateInput() {
    input = $('#inputTextbox').mathquill('text')
        .replace('**', '^')
        .replace('cdot ', '*');
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
    grapher.postMessage({input: input, startX: 0, endX: width, width: width, height: height, precision: precision});

    grapher.onmessage = function (e) {
        var point = e.data;

        for (i = 0; i < precision; i++)
            for (j = 0; j <  precision; j++) {
                fillPixelHSL(point.x * precision + i, point.y * precision + j, point.degree, 100, point.light);
            }

    }
}

axesCanvas.addEventListener('mousemove', function (e) {
    console.log("rollover");
    updateInput();

    if (input.indexOf('z') == -1)
        return;

    var rect = graphCanvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    var point = graphFunction(x, y, input, width, height, precision);

    $('#debug').html(
        'z = ' + point.number + newline
        + 'f(z) = ' + point.result + newline
        + '|f(z)| = ' + point.magnitude + newline
        + '&thta; of f(z) = ' + point.degree + newline
        + 'HSL light at ' + '(' + x + ', ' + y + ') = ' + point.light);

    fillPixelHSL(x, y, point.degree, 100, point.light);

    //startWorker(x, y);
}, false);

axes();
