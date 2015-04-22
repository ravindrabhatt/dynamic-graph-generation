var PADDING = 10;

var Location = function(x1, y1, r1) {
    var scope = this;
    scope.x = x1;
    scope.y = y1;
    scope.r = r1;
    this.conflicts = function(location) {
        var distance = Math.sqrt((location.x - scope.x) * (location.x - scope.x) + (location.y - scope.y) * (location.y - scope.y));
        if(distance < (location.r + scope.r) + PADDING) {
            return true;
        }
        return false;
    }
}


var Arrange = function() {
    var bubbleList = [
        new Location(0, 0, 0)
    ];
    var increment = 1;
    this.getPosition = function(newElement, dimension, indices) {
        var wrapFlag = false;
        newElement.x = newElement.x + newElement.r + PADDING;
        for(var i = 0; i < bubbleList.length; i++) {
            var lastElement = bubbleList[i];
            if(newElement.conflicts(lastElement)) {
                while(newElement.conflicts(lastElement)) {
                    newElement.x = newElement.x + increment;
                }
            }
        }
        bubbleList.push(newElement);
        return newElement;
    }
}

var getScaledValueX = function(value, dimension) {
    return value * dimension.scaleX + dimension.marginX;
}


var filterByDuration = function(dataArray, index, lower, upper) {
    if(!upper) upper = lower + 1;
    return _.filter(dataArray, function(element){
        return parseInt(element[index]) >= lower && parseInt(element[index]) < upper;
    });
}
