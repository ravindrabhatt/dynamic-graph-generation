"use strict";
var readFile = function() {
    var files = document.getElementById("dataFile").files;

    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = function(event) {
        var dataArray = parseData(event.target.result);
        generateGraph(dataArray);
    };
}

var parseData = function(data) {
    return $.csv.toArrays(data);
}
