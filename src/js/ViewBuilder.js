var ViewBuilder = function(dimension) {
    var screenHeight = dimension.screenHeight;
    var screenWidth = dimension.screenWidth;
    var marginX = dimension.marginX;
    var topMarginY = dimension.topMarginY;
    var bottomMarginY = dimension.bottomMarginY;
    
    this.buildView = function(element) {
        var area = makeSVG('rect', {x: 0, y: 0, height: '100%', width: '100%', stroke: 'black', 'stroke-width': 0, fill: '#e0e0e0', class: "area"});
        var viewPort = makeSVG('rect', {x: 0 + marginX, y: 0 + topMarginY, height: screenHeight, width: screenWidth, stroke: 'black', 'stroke-width': 0, fill: '#f8f8f8', class: "viewport"});
        var axisX = makeSVG('line', {x1: marginX, y1: topMarginY + screenHeight, x2: marginX + screenWidth, y2: topMarginY + screenHeight, class: "axis"});
        var axisY = makeSVG('line', {x1: marginX, y1: topMarginY, x2: marginX, y2: topMarginY + screenHeight, class: "axis"});
    
        var captionY = makeSVG('text', {x: marginX / 2, 'text-anchor': 'middle', y: topMarginY + screenHeight / 2, transform: 'rotate(270, ' + marginX / 2 + ', ' + (topMarginY + screenHeight / 2) + ')', class: "caption"});
        captionY.innerHTML = "CGM";
    
        element.appendChild(area);
        element.appendChild(viewPort);
        element.appendChild(axisX);
        element.appendChild(axisY);
        element.appendChild(captionY);
    
        var gridLine;
        var incrementY = screenHeight / 10;
        var incrementX = screenWidth / 10;
        for(var i = 1; i < 10; i++) {
            gridLine = makeSVG('line', {x1: marginX, y1: topMarginY + incrementY * i, x2: marginX + screenWidth, y2: topMarginY + incrementY * i, class: "grid"});
            element.appendChild(gridLine);
            gridLine = makeSVG('line', {x1: marginX + incrementX * i, y1: topMarginY, x2: marginX + incrementX * i, y2: topMarginY + screenHeight, class: "grid"});
            element.appendChild(gridLine);
        }
    };
};

var makeSVG = function(tag, attrs) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        element.setAttribute(k, attrs[k]);
    return element;
};
