var colorPicker = {
    
    start: function() {
        $("#background").css("cursor", "crosshair");
    },
    
    mouseDown: function($scope) {
        // FIXME use directive to call mouseMove
    },
    
    mouseUp: function($scope) {
    },
    
    mouseMove: function($scope) { 
        if (!($scope.config.mouse.button[1] || $scope.config.mouse.button[3])) return;
    
        var x = $scope.config.mouse.current.x - $scope.config.canvas.x;
        var y = $scope.config.mouse.current.y - $scope.config.canvas.y;
        
        var value = $scope.renderEngine.getPixelColor(x, y);
        
        /* Write color to config. */
        if ($scope.config.mouse.button[1]) {
            $scope.config.tools.colors.primary.r = value[0];
            $scope.config.tools.colors.primary.g = value[1];
            $scope.config.tools.colors.primary.b = value[2];
        }
        
        if ($scope.config.mouse.button[3]) {
            $scope.config.tools.colors.secondary.r = value[0];
            $scope.config.tools.colors.secondary.g = value[1];
            $scope.config.tools.colors.secondary.b = value[2];
        }
    },
}