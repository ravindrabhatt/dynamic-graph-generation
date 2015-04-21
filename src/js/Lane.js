var Lane = function(dataArray, durationIndex, revenueIndex) {
    var RevenueY1 = sumOfRevenue(filterByDuration(dataArray, durationIndex, 0, 2), revenueIndex);
    var RevenueY2 = sumOfRevenue(filterByDuration(dataArray, durationIndex, 2), revenueIndex);
    var RevenueY3 = sumOfRevenue(filterByDuration(dataArray, durationIndex, 3), revenueIndex);
    var RevenueY4 = sumOfRevenue(filterByDuration(dataArray, durationIndex, 4, 1000), revenueIndex);
    var totalRevenue = sumOfRevenue(dataArray, revenueIndex);

    var lane1 = {
        percentage : RevenueY1 * 100 / totalRevenue,
        start : 0
    }
    var lane2 = {
        percentage : RevenueY2 * 100 / totalRevenue,
        start : lane1.start + lane1.percentage
    }
    var lane3 = {
        percentage : RevenueY3 * 100 / totalRevenue,
        start : lane2.start + lane2.percentage
    }
    var lane4 = {
        percentage : RevenueY4 * 100 / totalRevenue,
        start : lane3.start + lane3.percentage
    }

    this.draw = function(element, dimension) {
         drawLane(lane2, "1+", dimension, element);
         drawLane(lane3, "2+", dimension, element);
         drawLane(lane4, "3+ Years", dimension, element);
    }

    this.getLaneDimensions = function(age) {
        var lane;
        if(age === 0 || age === 1) lane = lane1;
        else if(age === 2) lane = lane2;
        else if(age === 3) lane = lane3;
        else if(age >= 4) lane = lane4;
        else lane = lane4;
        var dimensions = {};
        dimensions.start = lane.start;
        dimensions.end = lane.start + lane.percentage;
        return dimensions;
    }

    var drawLane = function(lane, caption, dimension, element) {
        var line = makeSVG('line',
            {
                x1: dimension.marginX + lane.start * dimension.scaleX,
                y1: dimension.topMarginY,
                x2: dimension.marginX + lane.start * dimension.scaleX,
                y2: dimension.topMarginY + dimension.screenHeight + dimension.bottomMarginY * 3 / 4,
                class: "lane"
            }
        );
        element.appendChild(line);
        var text = makeSVG('text',
                      {
                          x: dimension.marginX + lane.start * dimension.scaleX + dimension.marginX / 10,
                          y: dimension.topMarginY + dimension.screenHeight + dimension.bottomMarginY / 2,
                          class: "caption"
                      }
                  );
        text.innerHTML = caption;
        element.appendChild(text);
    }
}

var sumOfRevenue = function(array, index) {
   return _.reduce(
        array,
        function(result, element){
            return result + element[index];
        },
        0
   );
}

var filterByDuration = function(dataArray, index, lower, upper) {
    if(!upper) upper = lower + 1;
    return _.filter(dataArray, function(element){
        return parseInt(element[index]) >= lower && parseInt(element[index]) < upper;
    });
}

