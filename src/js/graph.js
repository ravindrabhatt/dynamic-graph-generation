var MIN_RADIUS = 10;
var MAX_RADIUS = 100;

var generateGraph = function(tableArray) {
    var headerRow =  tableArray[0];
    var dataArray = _.without(tableArray, headerRow);

    var indices = getIndices(headerRow);
    dataArray = cleanData(dataArray, indices);
    setViewport();

    var screenWidth =  $("#graph").width() * 0.95;
    var marginX = $("#graph").width() * 0.05;
    var topMarginY = marginX;
    var bottomMarginY = marginX;
    var screenHeight = $("#graph").height() - topMarginY - bottomMarginY;
    var scaleY = screenHeight / 100;
    var scaleX = screenWidth / 4;

    var maxRPM = _.max(dataArray, function(element) { return element[indices.RPMIndex];})[indices.RPMIndex];
    var minRPM = _.min(getNonzeroElements(dataArray, indices.RPMIndex), function(element) { return element[indices.RPMIndex];})[indices.RPMIndex];

    var totalRPM = sumOfRPM(dataArray, indices.RPMIndex);
    var RPM1 = sumOfRPM(filterByDuration(dataArray, indices.durationIndex, 0, 2), indices.RPMIndex);
    var RPM2 = sumOfRPM(filterByDuration(dataArray, indices.durationIndex, 2), indices.RPMIndex);
    var RPM3 = sumOfRPM(filterByDuration(dataArray, indices.durationIndex, 3), indices.RPMIndex);
    var RPM3Plus = sumOfRPM(filterByDuration(dataArray, indices.durationIndex, 4, 1000), indices.RPMIndex);


    var graph = makeSVG('rect', {x: 0, y: 0, height: '100%', width: '100%', stroke: 'black', 'stroke-width': 0, fill: '#e0e0e0'});
    var viewPort = makeSVG('rect', {x: 0 + marginX, y: 0 + topMarginY, height: screenHeight, width: screenWidth, stroke: 'black', 'stroke-width': 0, fill: '#f8f8f8'});
    document.getElementById('graph').appendChild(graph);
    document.getElementById('graph').appendChild(viewPort);

    for(var index in dataArray) {
        var element = dataArray[index];
        var circle = makeSVG(
                                'circle',
                                {
                                    cx: getDuration(element[indices.durationIndex]) * scaleX + marginX,
                                    cy: (100 - element[indices.CGMIndex]) * scaleY + topMarginY,
                                    r: getRadius(element[indices.RPMIndex], minRPM, maxRPM),
                                    'stroke-width': 2,
                                    class: "region-" + getRegion(element[indices.regionIndex]) + " office-" + getOffice(element[indices.officeIndex])
                                }
                            );
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

var getRadius = function(value, minRPM, maxRPM) {
    RPMRange = maxRPM - minRPM;
    if(value === 0) {
        return 0;
    } else {
        var radiusRange = MAX_RADIUS - MIN_RADIUS;
        return (((value - minRPM) * radiusRange) / RPMRange) + MIN_RADIUS;
    }
}

var getNonzeroElements = function(dataArray, index) {
    return _.filter(dataArray, function(element) { return element[index] != 0;})
}
var setViewport = function() {
        $("#graph").attr("height", $(document).height() * 0.92);
        $("#graph").attr("width", $(document).width() * 0.92);
}

var getRegion = function(name) {
    return name.toLowerCase();
}

var getOffice = function(name) {
    return name.toLowerCase();
}