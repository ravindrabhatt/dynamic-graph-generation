var Region = function(){
    this.regionColor = _.object(_.map(regions, function(value, key) {return key.toLowerCase();}), _.values(regions));

    this.officeColor = _.object(_.map(offices, function(value, key) {return key.toLowerCase();}), _.values(offices));

    this.getRegions = function() {
        return _.keys(this.regionColor);
    }


    this.getOffices = function() {
        return _.keys(this.officeColor);
    }

    this.getRegionColor = function(region) {
        if(this.regionColor[region])
            return this.regionColor[region];
        else
            return this.regionColor.default;
    };

    this.getOfficeColor = function(office) {
        if(this.officeColor[office])
            return this.officeColor[office];
        else
            return this.officeColor.default;
    }

}
