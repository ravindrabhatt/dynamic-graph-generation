var buildFilters = function() {
    var region = new Region();

    var regions = region.getRegions();
    regions.splice(0, 0, "All");
    var regionFilter = document.getElementById('region-filter');
    for(var regionIndex in regions) {
        var option = document.createElement("option");
        option.text = regions[regionIndex].charAt(0).toUpperCase() + regions[regionIndex].slice(1);
        regionFilter.add(option);
    }

    regionFilter.style.visibility="visible";

    var offices = region.getOffices();
    offices.splice(0, 0, "All");
    var officeFilter = document.getElementById('office-filter');
    for(var officeIndex in offices) {
        var option = document.createElement("option");
        option.text = offices[officeIndex].charAt(0).toUpperCase() + offices[officeIndex].slice(1);
        officeFilter.add(option);
    }

    officeFilter.style.visibility="visible";

}