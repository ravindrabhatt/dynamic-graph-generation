"use strict";

var storedData = null;

var filterAndGenerate = function() {
    if(storedData == null) {
        var files = document.getElementById("dataFile").files;
        var reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = function(event) {
            var dataMap = parseData(event.target.result);
            dataMap = cleanData(dataMap);
            storedData = dataMap;
            buildFilters();
            display(storedData);
        }
    } else {
        display(storedData);
    }
}

var display = function(data) {
    clearAll();
    generateGraph(filterData(data));
    createSVGForSaving();
}

var parseData = function(data) {
    return createMap($.csv.toArrays(data));
}

var filterData = function(data) {
    var regionFilter = document.getElementById('region-filter');
    var officeFilter = document.getElementById('office-filter');
    if(regionFilter.selectedIndex > 0) {
        var region = regionFilter.options[regionFilter.selectedIndex].text;
        data = _.pick(data, function(value, key) {
            return value.region.toLowerCase() == region.toLowerCase();
        });
    }
    if(officeFilter.selectedIndex > 0) {
        var office = officeFilter.options[officeFilter.selectedIndex].text;
        data = _.pick(data, function(value, key) {
            return value.office.toLowerCase() == office.toLowerCase();
        })
    }
    return data;
}

var createMap = function(dataArray) {

    var headerRow =  dataArray[0];
    var indices = getIndices(headerRow);
    var dataArray = _.without(dataArray, headerRow);
    var dataArray = _.sortBy(dataArray, function(element) {return element[indices.durationIndex]});
    var dataMap = {};

    for(var index in dataArray) {
        var element = dataArray[index];
        var name = element[indices.nameIndex];
        var map = {};
        map.name = name;
        map.region = element[indices.regionIndex];
        map.office = element[indices.officeIndex];
        map.revenue = element[indices.revenueIndex];
        map.CGM = element[indices.CGMIndex];
        map.duration = element[indices.durationIndex];
        map.trend = element[indices.trendIndex];
        dataMap[name] = map;
    }
    return dataMap;
}


var getIndices = function(headerRow) {
        var indices = {};
        indices.CGMIndex = _.indexOf(headerRow, "CGM");
        indices.regionIndex = _.indexOf(headerRow, "Region");
        indices.officeIndex = _.indexOf(headerRow, "Office");
        indices.durationIndex = _.indexOf(headerRow, "Age");
        indices.revenueIndex = _.indexOf(headerRow, "Revenue");
        indices.nameIndex = _.indexOf(headerRow, "Project");
        indices.trendIndex = _.indexOf(headerRow, "Trend");
        return indices;
}

var clearAll = function() {
    var oldLink = document.getElementById('download-link');
    if(oldLink) oldLink.remove();

    MIN_FONT = 8;
    MAX_FONT = 15;

    MIN_ARROW = 2;
    MAX_ARROW = 8;

    GRAPH_HEIGHT_PERCENT = 0.90
    GRAPH_WIDTH_PERCENT = .98

    PADDING = 10;
}

var getNumber = function(value) {
    if(!value) value = "";
    var number = parseInt(value.replace(/[a-zA-Z $,]*/g, ""));
    if(isNaN(number)) {
        return 0;
    }
    return number;
}

var cleanData = function(dataMap) {
   return _.mapObject(dataMap,
    function(element, key) {
        element.revenue = getNumber(element.revenue);
        element.CGM = getNumber(element.CGM);
        element.duration = getNumber(element.duration);
        element.trend = getNumber(element.trend);
        return element;
    }
   );
}
