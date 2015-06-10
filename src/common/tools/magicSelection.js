var magicSelection = {
    
    start: function() {
        $("#main-canvas").css("cursor", "crosshair");
        var image = new Image();
        image.src = $scope.renderEngine.renderToImg();

        image.onload = function() {
            $scope.context.drawImage(image, x_offset, y_offset);
            imageData = $scope.context.getImageData(x_offset, y_offset, image.width, image.height);
            $scope.magic = new MagicSelection(imageData);
        };

        //imageData = $scope.renderEngine.renderToImg();
        //$scope.magic = new MagicSelection(imageData);

        // console.log($scope);

        canvas = document.getElementById('main-canvas');
        $scope.context = canvas.getContext('2d');

        $interval(callAtInterval, 1000);
        $scope.offset = 0;
    },
    
    mouseDown: function($scope) {
        var x = $scope.config.mouse.current.x;
        var y = $scope.config.mouse.current.x;
        
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