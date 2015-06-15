

var magicSelection = {
    
    start: function($scope) {
        console.log("Magic selection start");
        $("#main-canvas").css("cursor", "crosshair");

        /* working with $scope to share variables between functions in this file does not seem to work. */
        var scope = angular.element($("#main-canvas")).scope();

        /*scope.imgData = new ImgData($scope.renderEngine.getWidth(), $scope.renderEngine.getHeight());
        scope.imgData.data = $scope.renderEngine.renderAsUint8Array();
        scope.magic = new MagicSelection(scope.imgData);*/
        var currentLayer = 0;//$scope.config.layers.currentLayer;
        if (currentLayer == -1) {
            console.log("No layer selected");
            return;
        }

        var layer = $scope.renderEngine.layers[currentLayer];
        if (layer.layerType != LayerType.ImageLayer) {
            console.log("Layer is not of type ImageLayer");
            return;
        }
        var image = layer.getImage();
        scope.magic = magicSelection = new MagicSelection(image);

        // $interval(callAtInterval, 1000);
        scope.sizeAnts = 4;
        scope.offset = 0;
    },
    
    mouseDown: function($scope) {
        var scope = angular.element($("#main-canvas")).scope();

        /* x and y coordinates in pixels relative to image. */
        xRelative = $scope.config.mouse.current.x - $scope.config.canvas.x;
        yRelative = $scope.config.mouse.current.y - $scope.config.canvas.y;
        console.log(xRelative, yRelative);

        /* Check wheter user has clicked inside of a selection. */
        if (scope.magic.isInSelection(xRelative, yRelative)) {
            scope.magic.removeSelection(xRelative, yRelative)
        } else {
            scope.magic.getMaskWand(xRelative, yRelative, $scope.tresholdValue);
        }

        $("#draw-canvas")
        //scope.magic.maskWand

        /* Save border and marching ants mask in scope. */
        //$scope.maskBorder = $scope.magic.getMaskBorder();
        //$scope.maskAnts = $scope.magic.marchingAnts(scope.sizeAnts * 2, scope.offset);
    },
    
    mouseUp: function($scope) {
    },
    
    mouseMove: function($scope) {    
        // TODO call mouseDown
    },

    callAtInterval: function($scope) {
        console.log("test");
        scope.offset++;
        $scope.maskAnts = $scope.magic.marchingAnts(scope.sizeAnts * 2, scope.offset);
    }
}