var MIN_RADIUS = 5;
var MAX_RADIUS = 60;

var generateGraph = function(tableArray) {
    var regionColor = new RegionColor();
    var headerRow =  tableArray[0];
    var dataArray = _.without(tableArray, headerRow);
    var graphElement = document.getElementById('graph');

    var indices = getIndices(headerRow);
    dataArray = cleanData(dataArray, indices);
    setViewport();

    var dimension = new Dimension($('#graph').height(), $('#graph').width());

    var maxRevenue = _.max(dataArray, function(element) { return element[indices.revenueIndex];})[indices.revenueIndex];
    var minRevenue = _.min(getNonzeroElements(dataArray, indices.revenueIndex), function(element) { return element[indices.revenueIndex];})[indices.revenueIndex];

    new ViewBuilder(dimension).buildView(graphElement);
    var laneBuilder = new Lane(dataArray, indices.durationIndex, indices.revenueIndex);
    laneBuilder.draw(graphElement, dimension);


    for(var index in dataArray) {
        var element = dataArray[index];
        var lane = laneBuilder.getLaneDimensions(element[indices.durationIndex]);
        var circle = makeSVG(
                                'circle',
                                {
                                    cx:  ((lane.end - lane.start) / 2 + lane.start) * dimension.scaleX + dimension.marginX,
                                    cy: (100 - element[indices.CGMIndex]) * dimension.scaleY + dimension.topMarginY,
                                    r: getRadius(element[indices.revenueIndex], minRevenue, maxRevenue),
                                    'stroke-width': 2, stroke: regionColor.getRegionColor(getRegion(element[indices.regionIndex])),
                                    fill: regionColor.getOfficeColor(getOffice(element[indices.officeIndex])),
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
