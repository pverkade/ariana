angular.module('ariana').controller('contentCtrl', function($scope) {
    setCanvasSize();
    
    // TODO set resize canvas on window resize
    
    // TODO set resize canvas on orientation change 
    
    // TODO call mouseLeftClick and mouseMove in the interface. 
    
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
