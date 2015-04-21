var Location = function(x1, y1, r1) {
    var scope = this;
    scope.x = x1;
    scope.y = y1;
    scope.r = r1;
    this.conflicts = function(location) {
        var distance = (location.x - scope.x) * (location.x - scope.x) + (location.y - scope.y) * (location.y - scope.y);
        if( distance < (location.r + scope.r) * (location.r + scope.r)) {
            return true;
        }
        return false;
    }
}


var Arrange = function() {
    var conflictQueue = [
        new Location(0, 0, 0)
    ];
    var lastDirection = 1;
    this.getPosition = function(newElement, lane, dimension, indices) {

        var lastElement = conflictQueue.shift();
        if(newElement.conflicts(lastElement)) {
            while(newElement.conflicts(lastElement)) {
                newElement.x = newElement.x + lastDirection;
            }
            lastDirection = lastDirection * -1;
        }
        conflictQueue.push(newElement);
        return newElement;
    }
}
