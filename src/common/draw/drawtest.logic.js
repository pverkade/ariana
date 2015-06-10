angular.module('ariana').controller('drawtestCtrl', function($scope) {
    setCanvasSize();
    
    var drawer = new Draw(document.getElementById('main-canvas'));
    drawer.activate();
    //drawer.setBrush(brushType.THIN);
    //drawer.loadBrushSVG('assets/brushes/thin.svg');

    drawer.setDrawType(drawType.CIRCLE);
    // TODO set resize canvas on resize
    
    // TODO set resize canvas on orientation change 
    
});

/* This function sets the canvas full screen. It uses the fact that hdpi 
screen require a larger canvas size. */
function setCanvasSize() {
    var canvas = document.getElementById('main-canvas');
    var desiredWidthInCSSPixels  = window.innerWidth;
    var desiredHeightInCSSPixels = window.innerHeight;
    
    canvas.style.width  = desiredWidthInCSSPixels  + "px";
    canvas.style.height = desiredHeightInCSSPixels + "px";
    
    var devicePixelRatio = window.devicePixelRatio || 1;
    
    canvas.width  = desiredWidthInCSSPixels  * devicePixelRatio;
    canvas.height = desiredHeightInCSSPixels * devicePixelRatio;
}
