var Dimension = function(graphHeight, graphWidth) {
    this.screenWidth =  graphWidth * 0.95;
    this.marginX = graphWidth * 0.05;
    this.topMarginY = this.marginX;
    this.bottomMarginY = this.marginX;
    this.screenHeight = graphHeight - this.topMarginY - this.bottomMarginY;
    this.scaleY = this.screenHeight / 100;
    this.scaleX = this.screenWidth / 100;
    MIN_RADIUS = this.screenWidth / 200;
    MAX_RADIUS = this.screenWidth / 20;
}