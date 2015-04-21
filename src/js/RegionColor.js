var RegionColor = function(){
    this.regionColor = {
        usa: '#87b782',
        americas: '#ffb782',
        eu: '#fde0cf',
        india: '#ff8888',
        apac: '#fffa81',
        default: '#000000'
    };

    this.officeColor = {
        pune: '#df3180',
        bangalore: '#152dfb',
        hyderabad: '#bf9c84',
        gurgaon: '#f59a9f',
        chennai: '#66b983',
        default: '#ff0000'
    };

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
