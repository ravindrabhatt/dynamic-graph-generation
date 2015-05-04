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
        var axisX = makeSVG('line', {x1: marginX, y1: topMarginY + screenHeight, x2: marginX + screenWidth, y2: topMarginY + screenHeight,
            'stroke-width': 1, stroke: '#000000', class: "axis"});
        var axisY = makeSVG('line', {x1: marginX, y1: topMarginY, x2: marginX, y2: topMarginY + screenHeight,
            'stroke-width': 1, stroke: '#000000', class: "axis"});
        var captionY = makeSVG('text', {x: marginX / 2, 'text-anchor': 'middle',
            y: topMarginY + screenHeight / 2,
            transform: 'rotate(270, ' + marginX / 2 + ', ' + (topMarginY + screenHeight / 2) + ')',
            fill: '#000000', class: "caption"});
        captionY.innerHTML = "CGM";

        var captionX = makeSVG('text', {x: screenWidth + marginX * 0.8, 'text-anchor': 'end',
            y: topMarginY + screenHeight + bottomMarginY / 2, fill: '#000000', class: "caption"});
        captionX.innerHTML = "Years";

        element.appendChild(axisX);
        element.appendChild(axisY);
        element.appendChild(captionY);
        element.appendChild(captionX);


        var increment = 20;
        for(var i = 0; i <= 100; i += increment){
            var y = topMarginY + screenHeight * ((100 - i) / 100);
            var marking = makeSVG('line', {x1: marginX, y1: y, x2: marginX * 0.9, y2: y,
                'stroke-width': 1, stroke: '#000000', class: "axis"});
            var markingCaption = makeSVG('text', {x: marginX * 0.8, 'text-anchor': 'end', y: y,
                fill: '#000000', class: "caption"});
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
            gridLine = makeSVG('line', {x1: marginX, y1: topMarginY + incrementY * i,
                x2: marginX + screenWidth, y2: topMarginY + incrementY * i,
                'stroke-width': 1, stroke: '#cccccc',
                'stroke-dasharray': '2 2', class: "grid"}
            );
            element.appendChild(gridLine);
            gridLine = makeSVG('line', {x1: marginX + incrementX * i, y1: topMarginY,
                x2: marginX + incrementX * i, y2: topMarginY + screenHeight,
                'stroke-width': 1, stroke: '#cccccc',
                'stroke-dasharray': '2 2', class: "grid"}
            );
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

var createBubble = function(elementLocation, element) {
    var region = new Region();
    return makeSVG(
        'circle',
        {
            cx: elementLocation.x,
            cy: elementLocation.y,
            r: elementLocation.r,
            'stroke-width': 3, stroke: region.getRegionColor(getRegion(element.region)),
            fill: region.getOfficeColor(getOffice(element.office)),
            class: "bubble region-" + getRegion(element.office) + " office-" + getOffice(element.office),
            project: element.name
        }
    );
}

var createBubbleCaption = function(elementLocation, element, revenue) {
    var fontSize = getFontSize(element.revenue, revenue.min, revenue.max);
    var nameText = makeSVG('text',{x: elementLocation.x, y: elementLocation.y + elementLocation.r + fontSize,
                            class: "account-name", 'font-size': fontSize, 'text-anchor': 'middle'});

    var nameArray = element.name.replace(' - ', ' ').split(' ');
    for(var i in nameArray) {
        var tspan = makeSVG('tspan',{x: elementLocation.x, dy: (i == 0 ? 0 : fontSize)});
        tspan.innerHTML = nameArray[i];
        nameText.appendChild(tspan);
    }
    return nameText;
}

var drawLegend = function(elementList, dimension) {
    var region = new Region();
    var xLocation = dimension.marginX + dimension.screenWidth * 0.06;
    var yLocation = dimension.topMarginY * 0.3;
    var width = dimension.screenWidth * 0.06;
    var height = dimension.topMarginY * 0.4;
    var offset = dimension.screenWidth * 0.07;

    _.each(region.regionColor, function(color, region) {
        elementList.push(
            makeSVG(
                'rect',
                {
                    x: xLocation,
                    y: yLocation,
                    width: width,
                    height: height,
                    fill: color
                }
            )
        );

        var textElement = makeSVG(
            'text',
            {
                x: xLocation + width / 2,
                y: yLocation + height / 2,
                'text-anchor': 'middle',
                'font-size': 12,
                'dominant-baseline': 'central',
                fill: "#FFFFFF"
            }
        );

        textElement.innerHTML = region.toUpperCase();
        elementList.push(textElement);

        xLocation += offset;
    });

    _.each(region.officeColor, function(color, office){
        elementList.push(
            makeSVG(
                'rect',
                {
                    x: xLocation,
                    y: yLocation,
                    width: width,
                    height: height,
                    stroke: "#888888",
                    'stroke-width': 1,
                    fill: "none"
                }
            )
        );        var textElement = makeSVG(
            'text',
            {
                x: xLocation + width / 2,
                y: yLocation + height / 2,
                'text-anchor': 'middle',
                'font-size': 10,
                'dominant-baseline': 'central',
                fill: color
            }
        );

        textElement.innerHTML = office.toUpperCase();
        elementList.push(textElement);

        xLocation += offset;
    })
}

var drawBubbleScale = function(elementList, revenue, dimension) {
    var revenueRange = revenue.max - revenue.min;
    var roundedMax = Math.pow(10, revenue.max.toString().length);
    if(roundedMax - revenue.max > revenue.max - roundedMax / 2) roundedMax = roundedMax / 2;
    for(var scale = 20; scale < 100; scale += 20) {
        var radius = getRadius(roundedMax * scale / 100, revenue.min, revenue.max);
        console.log(roundedMax * scale / 100);
        elementList.push(
            makeSVG(
                'circle',
                {
                    cx: dimension.screenWidth * 0.9 + dimension.marginX,
                    cy: dimension.topMarginY + dimension.screenHeight - radius,
                    r: radius,
                    'stroke-width': 1,
                    fill: "none",
                    stroke: "#888888",
                    class: "scale"
                }
            )
        );

        var caption = makeSVG(
                'text',
                {
                    x: dimension.screenWidth * 0.95 + dimension.marginX,
                    y: dimension.topMarginY + dimension.screenHeight - radius * 2,
                    'font-size': 12,
                    stroke: "#AAAAAA"
                }
            )
        var value = roundedMax * scale / 100;
        caption.innerHTML = getCurrencyAmount(value);
        elementList.push(caption);

        elementList.push(
            makeSVG(
                'line',
                {
                    x1: dimension.screenWidth * 0.9 + dimension.marginX,
                    y1: dimension.topMarginY + dimension.screenHeight - radius * 2,
                    x2: dimension.screenWidth * 0.95 + dimension.marginX,
                    y2: dimension.topMarginY + dimension.screenHeight - radius * 2,
                    stroke: "#AAAAAA",
                    class: "scale"
                }
            )
        );
    }

    elementList.push(
                makeSVG(
                    'line',
                    {
                        x1: dimension.screenWidth * 0.9 + dimension.marginX,
                        y1: dimension.topMarginY + dimension.screenHeight,
                        x2: dimension.screenWidth * 0.9 + dimension.marginX,
                        y2: dimension.topMarginY + dimension.screenHeight - 2.2 * radius,
                        stroke: "#888888",
                        class: "scale"
                    }
                )
            );
}

var getCurrencyAmount = function(value) {
    var valueString = "";
    if(value / 1000000 >= 1) {
        valueString = value / 1000000 + " M"
    } else if(value / 1000 >= 1) {
        valueString = value / 1000 + " K"
    } else {
        valueString = value.toString();
    }
    return valueString;

}

var drawArrow = function(direction, elementLocation, scale) {
    var centre = {};
    centre.x = elementLocation.x;
    centre.y = elementLocation.y - direction * (elementLocation.r - scale * 3) / 2;
    var points = centre.x + "," + (centre.y - direction * scale * 0.4) + " "
        + (centre.x - scale) + "," + centre.y + " "
        + centre.x + "," + (centre.y - direction * scale * 3) + " "
        + (centre.x + scale) + "," + centre.y + " "
        + centre.x + "," + (centre.y - direction * scale * 0.4) + " "

    return makeSVG('polygon', {
            points: points,
            fill: direction == 1 ? '#00FF00' : '#FF0000',
            stroke: direction == 1 ? '#008800' : '#880000'
        }
    );
}
