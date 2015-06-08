var colorPicker = {
    
    start: function() {
        $("#main-canvas").css("cursor", "crosshair");
    },
    
    mouseDown: function($scope) {
        var x = $scope.config.mouse.current.x;
        var y = $scope.config.mouse.current.x;
        
        var value = $scope.renderEngine.getPixelColor(x, y);
        console.log(value);
        // TODO finish code
        //$scope.config.tools.color.primary = ...
    },
    
    mouseUp: function($scope) {
    },
    
    mouseMove: function($scope) {    
        // TODO call mouseDown 
        $("#main-canvas").css("cursor", "crosshair");
    },
}