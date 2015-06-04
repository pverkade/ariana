angular.module('ariana').controller('contentCtrl', function($scope) {
    setCanvasSize();
    
    // TODO set resize canvas on resize
    
    // TODO set resize canvas on orientation change

    $scope.mouseMove = function(e) {
        $scope.config.mouse.location.x = e.x;
        $scope.config.mouse.location.y = e.y;
    }

    $scope.mouseClick = function(e) {
        $scope.config.mouse.click.x = e.x;
        $scope.config.mouse.click.y = e.y;
    }
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
