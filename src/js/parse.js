"use strict";
var readFile = function() {
    var files = document.getElementById("dataFile").files;

    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = function(event) {
        var dataMap = parseData(event.target.result);
        generateGraph(dataMap);
        createSVGForSaving();
    };
}

var parseData = function(data) {
    return createMap($.csv.toArrays(data));
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
