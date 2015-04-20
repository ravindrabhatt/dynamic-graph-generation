
var generateGraph = function(tableArray) {
    var headerRow =  tableArray[0];
    var dataArray = _.without(tableArray, headerRow);

    var indices = getIndices(headerRow);
    dataArray = cleanData(dataArray, indices);
    setViewport();

    var screenHeight = $("#graph").height();
    var screenWidth =  $("#graph").width();
    var scaleY = screenHeight / 100;
    var scaleX = screenWidth / 4;

    var totalRPM = sumOfRPM(dataArray, indices.RPMIndex);
    var RPM1 = sumOfRPM(filterByDuration(dataArray, indices.durationIndex, 1), indices.RPMIndex);
    var RPM2 = sumOfRPM(filterByDuration(dataArray, indices.durationIndex, 2), indices.RPMIndex);
    var RPM3Plus = sumOfRPM(filterByDuration(dataArray, indices.durationIndex, 3, 15), indices.RPMIndex);


    var viewPort = makeSVG('rect', {x: '0', y: '0', height: '100%', width: '100%', stroke: 'black', 'stroke-width': 0, fill: '#cccccc'});
        document.getElementById('graph').appendChild(viewPort);

    for(var index in dataArray) {
        var circle = makeSVG('circle', {cx: getDuration(dataArray[index][indices.durationIndex]) * scaleX, cy: (100 - dataArray[index][indices.CGMIndex]) * scaleY, r: 5, stroke: 'black', 'stroke-width': 0, fill: 'black'});
        document.getElementById('graph').appendChild(circle);
    }
}

var getDuration = function(value) {
    if(value >= 3) {
        return 3;
    } else {
        return value;
    }
}

var sumOfRPM = function(array, index) {
   return _.reduce(array,
                function(result, element){
                    return result + element[index];
                },
            0);
}

var getNumber = function(value) {
    if(!value) value = "";
    var number = parseInt(value.replace(/[a-zA-Z $,]*/g, ""));
    if(isNaN(number)) {
        console.log("###Not A Number!");
        return 0;
    }
    console.log(number);
    return number;
}

var filterByDuration = function(dataArray, index, lower, upper) {
    if(!upper) upper = lower + 1;
    return _.filter(dataArray, function(element){
        return parseInt(element[index]) >= lower && parseInt(element[index]) < upper;
    });
}

var makeSVG = function(tag, attrs) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        element.setAttribute(k, attrs[k]);
    return element;
}


var cleanData = function(dataArray, indices) {
   return _.map(dataArray,
    function(element) {
        element[indices.RPMIndex] = getNumber(element[indices.RPMIndex]);
        element[indices.CGMIndex] = getNumber(element[indices.CGMIndex]);
        element[indices.durationIndex] = getNumber(element[indices.durationIndex]);
        return element;
    }
   );
}

var getIndices = function(headerRow) {
        var indices = {};
        indices.CGMIndex = _.indexOf(headerRow, "CGM");
        indices.regionIndex = _.indexOf(headerRow, "Region");
        indices.officeIndex = _.indexOf(headerRow, "Office");
        indices.durationIndex = _.indexOf(headerRow, "How old/");
        indices.RPMIndex = _.indexOf(headerRow, "Feb-11");
        return indices;
}

var setViewport = function() {
        $("#graph").height($(document).height() * 0.9);
        $("#graph").width($(document).width() * 0.9);
}