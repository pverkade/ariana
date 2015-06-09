var colorPicker = {
    
    start: function() {
        $("#background").css("cursor", "crosshair");
    },
    
    mouseDown: function($scope) {
        //
    },
    
    mouseUp: function($scope) {
    },
    
    mouseMove: function($scope) {
        /* Get mouse location on canvas. */
        // TODO also use zoom-factor etc.
        var x = $scope.config.mouse.current.x - canvasLocationX;
        var y = $scope.config.mouse.current.y - canvasLocationY;
        
        /* Get the color of that pixel. */
        var color = $scope.renderEngine.getPixelColor(x, y);
        
        /* Write color to config. */
        $scope.config.tools.colors.primary.r = color[0];
        $scope.config.tools.colors.primary.g = color[1];
        $scope.config.tools.colors.primary.b = color[2];
    },
}