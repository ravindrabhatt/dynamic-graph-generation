var generateGraph = function(dataMap) {
    clearGraph();

    var graphElement = document.getElementById('graph');

    setViewport();

    var dimension = new Dimension($('#graph').height(), $('#graph').width());

    var maxRevenue = _.max(dataMap, function(element) { return element.revenue;}).revenue;
    var minRevenue = _.min(getNonzeroElements(dataMap), function(element) { return element.revenue;}).revenue;

    if(minRevenue == maxRevenue) minRevenue = 0;

    var revenue = {
        min : minRevenue,
        max : maxRevenue
    };

    new ViewBuilder(dimension).buildView(graphElement);

    if(_.size(dataMap) == 0) {
        var noDataText = makeSVG('text', {
             x: dimension.screenWidth / 2 + dimension.marginX,
             y: dimension.screenHeight / 2 + dimension.topMarginY,
             'text-anchor': 'middle',
             'font-size': dimension.screenWidth / 50,
             fill: '#FF0000'
         });
        noDataText.innerHTML = "NO DATA" ;
        document.getElementById('graph').appendChild(noDataText);
        return;
    }

    var error = dimension.screenWidth;
    var threshold = dimension.screenWidth * 0.05;
    var loopCount = 0;
    while((error * error > threshold * threshold || error < 0) && loopCount < 10) {
        var laneStart  = 0 + dimension.marginX;
        elementList = [];
        for(i = 0; i < 3; i++) {
            var filteredData = filterByDuration(dataMap, i, i + 1);
            laneStart = plotLaneMembers(filteredData, dimension, laneStart, revenue, elementList) + 5;
            drawLane(laneStart, (i + 1) + "+", dimension, elementList);
        }
        var filteredData = filterByDuration(dataMap, 3, 100);
        laneStart = plotLaneMembers(filteredData, dimension, laneStart, revenue, elementList);
        error = dimension.screenWidth - (laneStart - dimension.marginX);
        PADDING = PADDING * (1 + 2 * error / dimension.screenWidth);
        loopCount += 1;
        if(_.size(dataMap) < 2) break;
    }

    drawBubbleScale(elementList, revenue, dimension);
    drawLegend(elementList, dimension);

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

var getArrowScale = function(value, minRevenue, maxRevenue) {
    RevenueRange = maxRevenue - minRevenue;
    if(value === 0) {
        return 0;
    } else {
        var radiusRange = MAX_ARROW - MIN_ARROW;
        return (((value - minRevenue) * radiusRange) / RevenueRange) + MIN_ARROW;
    }
}

var getTrendDirection = function(value) {
    if(value >= 0) {
        return 1;
    }
    return -1;
}

var getNonzeroElements = function(dataMap) {
    return _.filter(dataMap, function(element) { return element.revenue != 0;})
}
var setViewport = function() {
        $("#graph").attr("height", $(window).height() * GRAPH_HEIGHT_PERCENT);
        $("#graph").attr("width", $(window).width() * GRAPH_WIDTH_PERCENT);
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
    var rightmostElement = new Location(laneStart, 0, 0);
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
            var trendArrow = drawArrow(getTrendDirection(element.trend), elementLocation, getArrowScale(element.revenue, revenue.min, revenue.max));

            elementList.push(bubble);
            elementList.push(nameText);
            elementList.push(trendArrow);

            if(element.isPriority) {
                var priorityStar = drawStar(getTrendDirection(element.trend), elementLocation.r / 5, elementLocation);
                elementList.push(priorityStar);
            }
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
            'stroke-width': 1,
            stroke: '#000000',
            'stroke-dasharray': '5 10',
            class: "lane"
        }
    );
    elementList.push(line);
    var text = makeSVG('text',
                  {
                      x: laneStart + dimension.marginX / 10,
                      y: dimension.topMarginY + dimension.screenHeight + dimension.bottomMarginY * 0.8,
                      fill: '#000000',
                      class: "caption"
                  }
              );
    text.innerHTML = caption;
    elementList.push(text);
}