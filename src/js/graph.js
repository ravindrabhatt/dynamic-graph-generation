var MIN_RADIUS;
var MAX_RADIUS;

var MIN_FONT = 8;
var MAX_FONT = 15;

var GRAPH_HEIGHT_PERCENT = 0.90
var GRAPH_WIDTH_PERCENT = .98

var generateGraph = function(tableArray) {
    clearGraph();

    var headerRow =  tableArray[0];
    var indices = getIndices(headerRow);
    var dataArray = _.without(tableArray, headerRow);
    dataArray = _.sortBy(dataArray, function(element) {return element[indices.durationIndex]});

    var graphElement = document.getElementById('graph');

    dataArray = cleanData(dataArray, indices);
    setViewport();

    var dimension = new Dimension($('#graph').height(), $('#graph').width());

    var maxRevenue = _.max(dataArray, function(element) { return element[indices.revenueIndex];})[indices.revenueIndex];
    var minRevenue = _.min(getNonzeroElements(dataArray, indices.revenueIndex), function(element) { return element[indices.revenueIndex];})[indices.revenueIndex];

    var revenue = {
        min : minRevenue,
        max : maxRevenue
    };

    new ViewBuilder(dimension).buildView(graphElement);
    var error = dimension.screenWidth;
    var threshold = dimension.screenWidth * 0.05;
    while(error * error > threshold * threshold || error < 0) {
        var laneStart  = 0 + dimension.marginX;
        elementList = [];
        for(i = 0; i < 3; i++) {
            var filteredData = filterByDuration(dataArray, indices.durationIndex, i, i + 1);
            laneStart = plotLaneMembers(filteredData, indices, dimension, laneStart, revenue, elementList);
            drawLane(laneStart, (i + 1) + "+", dimension, elementList);
        }
        var filteredData = filterByDuration(dataArray, indices.durationIndex, 3, 100);
        laneStart = plotLaneMembers(filteredData, indices, dimension, laneStart, revenue, elementList);
        error = dimension.screenWidth - (laneStart - dimension.marginX);
        PADDING = PADDING * (1 + 2 * error / dimension.screenWidth);
    }

    for(var index in elementList) {
        document.getElementById('graph').appendChild(elementList[index]);
    }
}

var getNumber = function(value) {
    if(!value) value = "";
    var number = parseInt(value.replace(/[a-zA-Z $,]*/g, ""));
    if(isNaN(number)) {
        return 0;
    }
    return number;
}


var cleanData = function(dataArray, indices) {
   return _.map(dataArray,
    function(element) {
        element[indices.revenueIndex] = getNumber(element[indices.revenueIndex]);
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
        indices.durationIndex = _.indexOf(headerRow, "Age");
        indices.revenueIndex = _.indexOf(headerRow, "Revenue");
        indices.nameIndex = _.indexOf(headerRow, "Project");
        return indices;
}

var getRadius = function(value, minRevenue, maxRevenue) {
    RevenueRange = maxRevenue - minRevenue;
    if(value === 0) {
        return 0;
    } else {
        var radiusRange = MAX_RADIUS - MIN_RADIUS;
        return (((value - minRevenue) * radiusRange) / RevenueRange) + MIN_RADIUS;
    }
}

var getFontSize = function(value, minRevenue, maxRevenue) {
    RevenueRange = maxRevenue - minRevenue;
    if(value === 0) {
        return 0;
    } else {
        var radiusRange = MAX_FONT - MIN_FONT;
        return (((value - minRevenue) * radiusRange) / RevenueRange) + MIN_FONT;
    }
}

var getNonzeroElements = function(dataArray, index) {
    return _.filter(dataArray, function(element) { return element[index] != 0;})
}
var setViewport = function() {
        $("#graph").attr("height", $(document).height() * GRAPH_HEIGHT_PERCENT);
        $("#graph").attr("width", $(document).width() * GRAPH_WIDTH_PERCENT);
}

var getRegion = function(name) {
    return name.toLowerCase();
}

var getOffice = function(name) {
    return name.toLowerCase();
}

var clearGraph = function() {
    $("#graph").empty();
}

var plotLaneMembers = function(dataArray, indices, dimension, laneStart, revenue, elementList) {
    var arrange = new Arrange();
    var rightmostElement = new Location(0, 0, 0);
    for(var index in dataArray) {
        var element = dataArray[index];

        var elementLocation = new Location(
            laneStart,
            (100 - element[indices.CGMIndex]) * dimension.scaleY + dimension.topMarginY,
            getRadius(element[indices.revenueIndex], revenue.min, revenue.max)
        );

        elementLocation = arrange.getPosition(elementLocation, dimension, indices);
        if(elementLocation.x > rightmostElement.x) rightmostElement = elementLocation;

        var nameText = createBubbleCaption(elementLocation, element, indices, revenue);
        var bubble = createBubble(elementLocation, element, indices);

        elementList.push(bubble);
        elementList.push(nameText);
    }
    var laneEnd = rightmostElement.x + rightmostElement.r + PADDING;
    return laneEnd;
}


var drawLane = function(laneStart, caption, dimension, elementList) {
    var line = makeSVG('line',
        {
            x1: laneStart,
            y1: dimension.topMarginY,
            x2: laneStart,
            y2: dimension.topMarginY + dimension.screenHeight + dimension.bottomMarginY * 3 / 4,
            class: "lane"
        }
    );
    elementList.push(line);
    var text = makeSVG('text',
                  {
                      x: laneStart + dimension.marginX / 10,
                      y: dimension.topMarginY + dimension.screenHeight + dimension.bottomMarginY * 0.8,
                      class: "caption"
                  }
              );
    text.innerHTML = caption;
    elementList.push(text);
}