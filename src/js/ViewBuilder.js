var ViewBuilder = function(dimension) {
    var screenHeight = dimension.screenHeight;
    var screenWidth = dimension.screenWidth;
    var marginX = dimension.marginX;
    var topMarginY = dimension.topMarginY;
    var bottomMarginY = dimension.bottomMarginY;
    
    this.buildView = function(element) {
        drawViewPort(element);
        drawAxes(element);
        drawGrid(element);
    };

    var drawViewPort = function(element) {
        var area = makeSVG('rect', {x: 0, y: 0, height: '100%', width: '100%', stroke: 'black', 'stroke-width': 0, fill: '#e0e0e0', class: "area"});
        var viewPort = makeSVG('rect', {x: 0 + marginX, y: 0 + topMarginY, height: screenHeight, width: screenWidth, stroke: 'black', 'stroke-width': 0, fill: '#f8f8f8', class: "viewport"});

        element.appendChild(area);
        element.appendChild(viewPort);
    }

    var drawAxes = function(element) {
        var axisX = makeSVG('line', {x1: marginX, y1: topMarginY + screenHeight, x2: marginX + screenWidth, y2: topMarginY + screenHeight, class: "axis"});
        var axisY = makeSVG('line', {x1: marginX, y1: topMarginY, x2: marginX, y2: topMarginY + screenHeight, class: "axis"});
        var captionY = makeSVG('text', {x: marginX / 2, 'text-anchor': 'middle', y: topMarginY + screenHeight / 2, transform: 'rotate(270, ' + marginX / 2 + ', ' + (topMarginY + screenHeight / 2) + ')', class: "caption"});
        captionY.innerHTML = "CGM";

        var captionX = makeSVG('text', {x: screenWidth + marginX * 0.8, 'text-anchor': 'end', y: topMarginY + screenHeight + bottomMarginY / 2, class: "caption"});
        captionX.innerHTML = "Years";

        element.appendChild(axisX);
        element.appendChild(axisY);
        element.appendChild(captionY);
        element.appendChild(captionX);


        var increment = 20;
        for(var i = 0; i <= 100; i += increment){
            var y = topMarginY + screenHeight * ((100 - i) / 100);
            var marking = makeSVG('line', {x1: marginX, y1: y, x2: marginX * 0.9, y2: y, class: "axis"});
            var markingCaption = makeSVG('text', {x: marginX * 0.8, 'text-anchor': 'end', y: y, class: "caption"});
            markingCaption.innerHTML = i + "%";
            element.appendChild(marking);
            element.appendChild(markingCaption)
        }
    }

    var drawGrid = function(element) {
        var gridLine;
        var incrementY = screenHeight / 10;
        var incrementX = screenWidth / 10;
        for(var i = 1; i < 10; i++) {
            gridLine = makeSVG('line', {x1: marginX, y1: topMarginY + incrementY * i, x2: marginX + screenWidth, y2: topMarginY + incrementY * i, class: "grid"});
            element.appendChild(gridLine);
            gridLine = makeSVG('line', {x1: marginX + incrementX * i, y1: topMarginY, x2: marginX + incrementX * i, y2: topMarginY + screenHeight, class: "grid"});
            element.appendChild(gridLine);
        }
    }
};

var makeSVG = function(tag, attrs) {
    var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        element.setAttribute(k, attrs[k]);
    return element;
};

var createBubble = function(elementLocation, element, indices) {
    var regionColor = new RegionColor();
    return makeSVG(
        'circle',
        {
            cx: elementLocation.x,
            cy: elementLocation.y,
            r: elementLocation.r,
            'stroke-width': 2, stroke: regionColor.getRegionColor(getRegion(element[indices.regionIndex])),
            fill: regionColor.getOfficeColor(getOffice(element[indices.officeIndex])),
            class: "bubble region-" + getRegion(element[indices.regionIndex]) + " office-" + getOffice(element[indices.officeIndex]),
            project: element[indices.nameIndex]
        }
    );
}

var createBubbleCaption = function(elementLocation, element, indices, revenue) {
    var fontSize = getFontSize(element[indices.revenueIndex], revenue.min, revenue.max);
    var nameText = makeSVG('text',{x: elementLocation.x, y: elementLocation.y + elementLocation.r + fontSize,
                            class: "account-name", 'font-size': fontSize, 'text-anchor': 'middle'});

    var nameArray = element[indices.nameIndex].replace(' - ', ' ').split(' ');
    for(var i in nameArray) {
        var tspan = makeSVG('tspan',{x: elementLocation.x, dy: (i == 0 ? 0 : fontSize)});
        tspan.innerHTML = nameArray[i];
        nameText.appendChild(tspan);
    }
    return nameText;
}