var colorPicker = {
    
    start: function() {
        $("#main-canvas").css("cursor", "crosshair");
    },
    
    mouseDown: function($scope) {
        var x = 1920 * $scope.config.mouse.current.x / $("#main-canvas").outerWidth();
        var y = 1080 * $scope.config.mouse.current.x / $("#main-canvas").outerHeight();
        
        var value = $scope.renderEngine.getPixelColor(x, y);
        
        /* Write color to config. */
        $scope.config.tools.colors.primary.r = value[0];
        $scope.config.tools.colors.primary.g = value[1];
        $scope.config.tools.colors.primary.b = value[2];
    },
    
    mouseUp: function($scope) {
    },
    
    mouseMove: function($scope) {    
        // TODO call mouseDown
    },
}