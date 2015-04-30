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
    this.getPosition = function(newElement, dimension) {
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
        bubbleList = _.sortBy(bubbleList, function(element) {return element.x;});
        return newElement;
    }
}

var getScaledValueX = function(value, dimension) {
    return value * dimension.scaleX + dimension.marginX;
}


var filterByDuration = function(dataMap, lower, upper) {
    if(!upper) upper = lower + 1;
    return _.filter(dataMap, function(element){
        return parseInt(element.duration) >= lower && parseInt(element.duration) < upper;
    });
}


var showPopUp = function(element, dataMap, dimension) {
    $("#popup").show();
    var projectName = element.getAttribute('project');
    var project = dataMap[projectName];
    document.getElementById('project-name').innerHTML = project.name;
    var projectDataElement = document.getElementById('project-data');
    projectDataElement.innerHTML = "";
    projectDataElement.innerHTML += "Region : " + project.region + "<br>";
    projectDataElement.innerHTML += "Office : " + project.office + "<br>";
    projectDataElement.innerHTML += "Revenue : $ " + project.revenue + "<br>";
    projectDataElement.innerHTML += "CGM : " + project.CGM + "%" + "<br>";
    projectDataElement.innerHTML += "Age : " + project.duration + (project.duration == 1 ? " Year" : " Years") + "<br>";
    setupPopupLocation(element, dimension);
}

var hidePopUp = function() {
    $("#popup").hide();
}

var setupPopupLocation = function(element, dimension) {
        var x = parseFloat(element.getAttribute('cx'));
        var y = parseFloat(element.getAttribute('cy'));
        var r = parseFloat(element.getAttribute('r'));

        var offset = $("#graph").position();
        var xLocation = "left";
        var yLocation = "top";
        if(x > dimension.screenWidth / 2) { xLocation = "right";}
        if(y > dimension.screenHeight / 2) { yLocation = "bottom";}
        $("#popup").css("left", x
                                 + (r / Math.sqrt(2) + offset.left) * (xLocation == "left" ? 1 : -1)
                                 - (xLocation == "left" ? 0 : $("#popup").width())
                      );
        $("#popup").css('top', y
                                + (r / Math.sqrt(2) + offset.top) * (yLocation == "top" ? 1 : -1)
                                - (yLocation == "top" ? 0 : $("#popup").height())
                      );
        $("#popup").attr("class", "pointer-" + yLocation + "-" + xLocation);

}

var createSVGForSaving = function() {
    var filename = 'portfolio'
    var svg  = document.getElementById('graph');
    var xml  = new XMLSerializer().serializeToString(svg);
    var data = "data:image/svg+xml;base64," + btoa(xml);

    var oldLink = document.getElementById('download-link');
    if(oldLink) oldLink.remove();

    var anchor = document.createElement('a');
    anchor.setAttribute('id', "download-link");
    anchor.setAttribute('href', data);
    anchor.setAttribute('download', filename + ".svg");

    var button = document.createElement('button');
    button.innerHTML = "Download";

    anchor.appendChild(button)
    document.getElementById('option').appendChild(anchor);

}