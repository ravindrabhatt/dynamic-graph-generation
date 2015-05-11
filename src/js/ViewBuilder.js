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
            r: elementLocation.r + STROKE_WIDTH / 2,
            'stroke-width': STROKE_WIDTH, stroke: region.getOfficeColor(getOffice(element.office)),
            fill: region.getRegionColor(getRegion(element.region)),
            class: "bubble region-" + getRegion(element.office) + " office-" + getOffice(element.office),
            project: element.name
        }
    );
}

var createBubbleCaption = function(elementLocation, element, revenue) {
    var fontSize = getFontSize(element.revenue, revenue.min, revenue.max);
    var nameText = makeSVG('text',{x: elementLocation.x, y: elementLocation.y + elementLocation.r + fontSize + STROKE_WIDTH,
                            class: "account-name", 'font-size': fontSize, 'text-anchor': 'middle'});

    nameText.innerHTML = element.name.substring(0, 15);
    return nameText;
}

var drawLegend = function(elementList, dimension) {
    var region = new Region();
    var legendOverflow = region.getRegions().length + region.getOffices().length > 12;

    var startLocation = dimension.marginX;
    var xLocation = startLocation;
    var yLocation = dimension.topMarginY * (legendOverflow ? 0.15 : 0.3);
    var width = dimension.screenWidth * 0.06;
    var height = dimension.topMarginY * (legendOverflow ? 0.3 : 0.4);
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
                    fill: color,
                    stroke: '#888888'
                }
            )
        );

        var textElement = makeSVG(
            'text',
            {
                x: xLocation + width / 2,
                y: yLocation + height / 2,
                'text-anchor': 'middle',
                'font-size': dimension.screenWidth / 120,
                'dominant-baseline': 'central',
                fill: "#000000"
            }
        );

        textElement.innerHTML = region.toUpperCase();
        elementList.push(textElement);

        xLocation += offset;
    });

    if(legendOverflow) {
        xLocation = startLocation;
        yLocation = dimension.topMarginY * 0.55;
    }
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
        );
        var textElement = makeSVG(
            'text',
            {
                x: xLocation + width / 2,
                y: yLocation + height / 2,
                'text-anchor': 'middle',
                'font-size': dimension.screenWidth / 120,
                'dominant-baseline': 'central',
                fill: color
            }
        );

        textElement.innerHTML = office.toUpperCase();
        elementList.push(textElement);

        xLocation += offset;
    })

    xLocation = dimension.marginX + dimension.screenWidth * 0.86;
    yLocation = dimension.topMarginY * 0.3;
    height = dimension.topMarginY * 0.4;
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
                fill: "#BBBBBB"
            }
        )
    );
    var radius = height / 5;
    elementList.push(drawStar(0, radius, {x: xLocation + radius * 2, y: yLocation + height / 2, r: height}));

    var priorityText = makeSVG('text', {
        x: xLocation + radius * 2 + (width - radius * 2) / 2,
        y: yLocation + height / 2,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'font-size': 10,
        fill: '#000000'
    });
    priorityText.innerHTML = "PRIORITY";
    elementList.push(priorityText);

    xLocation = xLocation + offset

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
                fill: "#BBBBBB"
            }
        )
    );

    var IMOSide = height / 3;
    elementList.push(drawIMOSymbol(xLocation + IMOSide * 2, yLocation + height / 2, IMOSide));

    var IMOText = makeSVG('text', {
        x: xLocation + IMOSide * 2 + (width - IMOSide * 2) / 2,
        y: yLocation + height / 2,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'font-size': 10,
        fill: '#000000'
    });
    IMOText.innerHTML = "IMO";
    elementList.push(IMOText);
}

var drawBubbleScale = function(elementList, revenue, dimension) {
    var revenueRange = revenue.max - revenue.min;
    var floorMax = Math.pow(10, revenue.max.toString().length) / 10;
    var roundedMax = 0;
    for(i = 0; i <= 10; i++) {
        if(Math.abs(roundedMax - revenue.max) > Math.abs(floorMax * i - revenue.max)) {
            roundedMax = floorMax * i;
        }
    }
    for(var scale = 20; scale <= 100; scale += 20) {
        var radius = getRadius(roundedMax * scale / 100, revenue.min, revenue.max);
        if(radius < 0) continue;
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

var drawStar = function(direction, radius, elementLocation) {
    var centre = {};
    var calculatePointOnPentagon = function(centre, radius, i) {
        return {
            x: centre.x + radius * Math.sin(i * (2 * PI / 5)),
            y: centre.y + radius * Math.cos(i * (2 * PI / 5))
        }
    };
    centre.x = elementLocation.x;
    centre.y = elementLocation.y + direction * (elementLocation.r) / 2;

    var p1 = calculatePointOnPentagon(centre, radius, 1);
    var p2 = calculatePointOnPentagon(centre, radius, 2);
    var p3 = calculatePointOnPentagon(centre, radius, 3);
    var p4 = calculatePointOnPentagon(centre, radius, 4);
    var p5 = calculatePointOnPentagon(centre, radius, 5);

    var points = p1.x + "," + p1.y + " "
        + p3.x + "," + p3.y + " "
        + p5.x + "," + p5.y + " "
        + p2.x + "," + p2.y + " "
        + p4.x + "," + p4.y + " "

    return makeSVG('polygon', {
            points: points,
            fill: '#FF0000',
            stroke: '#880000'
        }
    );
}

var drawIMOSymbol = function(x, y, IMOSymbolSide) {
    return makeSVG('rect', {
        x: x - IMOSymbolSide / 2,
        y: y - IMOSymbolSide / 2,
        width: IMOSymbolSide,
        height: IMOSymbolSide,
        stroke: '#000000',
        fill: '#888888'
    })
}