var MIN_RADIUS;
var MAX_RADIUS;

var MIN_FONT = 8;
var MAX_FONT = 15;

var GRAPH_HEIGHT_PERCENT = 0.90
var GRAPH_WIDTH_PERCENT = .98

var generateGraph = function(tableMap) {
    clearGraph();

    var graphElement = document.getElementById('graph');

    dataMap = cleanData(tableMap);
    setViewport();

    var dimension = new Dimension($('#graph').height(), $('#graph').width());

    var maxRevenue = _.max(dataMap, function(element) { return element.revenue;}).revenue;
    var minRevenue = _.min(getNonzeroElements(dataMap), function(element) { return element.revenue;}).revenue;

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
            var filteredData = filterByDuration(dataMap, i, i + 1);
            laneStart = plotLaneMembers(filteredData, dimension, laneStart, revenue, elementList);
            drawLane(laneStart, (i + 1) + "+", dimension, elementList);
        }
        var filteredData = filterByDuration(dataMap, 3, 100);
        laneStart = plotLaneMembers(filteredData, dimension, laneStart, revenue, elementList);
        error = dimension.screenWidth - (laneStart - dimension.marginX);
        PADDING = PADDING * (1 + 2 * error / dimension.screenWidth);
    }

    for(var index in elementList) {
        document.getElementById('graph').appendChild(elementList[index]);
    }

    $(".bubble").hover(
        function() {
            showPopUp(this, dataMap, dimension);
        },
        function() {
            hidePopUp();
        }
    )
}

var getNumber = function(value) {
    if(!value) value = "";
    var number = parseInt(value.replace(/[a-zA-Z $,]*/g, ""));
    if(isNaN(number)) {
        return 0;
    }
    return number;
}


var cleanData = function(dataMap) {
   return _.mapObject(dataMap,
    function(element, key) {
        element.revenue = getNumber(element.revenue);
        element.CGM = getNumber(element.CGM);
        element.duration = getNumber(element.duration);
        return element;
    }
   );
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

var getNonzeroElements = function(dataMap) {
    return _.filter(dataMap, function(element) { return element.revenue != 0;})
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

var plotLaneMembers = function(dataMap, dimension, laneStart, revenue, elementList) {
    var arrange = new Arrange();
    var rightmostElement = new Location(0, 0, 0);
    _.each(dataMap,
        function(element){

            var elementLocation = new Location(
                laneStart,
                (100 - element.CGM) * dimension.scaleY + dimension.topMarginY,
                getRadius(element.revenue, revenue.min, revenue.max)
            );

            elementLocation = arrange.getPosition(elementLocation, dimension);
            if(elementLocation.x > rightmostElement.x) rightmostElement = elementLocation;

            var nameText = createBubbleCaption(elementLocation, element, revenue);
            var bubble = createBubble(elementLocation, element);

            elementList.push(bubble);
            elementList.push(nameText);
        }
    )
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