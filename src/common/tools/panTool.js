var canvasLocationX = 120;
var canvasLocationY = 120;

var panTool = {
    
    start: function() {
        $("#background").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        $("#background").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        $("#background").css("cursor", "grab");
    },
    
    mouseMove: function($scope) {
        var dx = $scope.config.mouse.current.x - $scope.config.mouse.lastClick.x;
        var dy = $scope.config.mouse.current.y - $scope.config.mouse.lastClick.y;

        // TODO ugly code
        $scope.config.mouse.lastClick.x += dx;
        $scope.config.mouse.lastClick.y += dy;
        
        canvasLocationX += dx;
        canvasLocationY += dy;
        
        window.requestAnimationFrame(function() {$("#main-canvas").css("transform", "translate(" + canvasLocationX + "px, " + canvasLocationY + "px)");});
    },
}