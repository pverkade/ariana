var magicSelection = {
    
    start: function() {
        $("#main-canvas").css("cursor", "crosshair");
        // var image = new Image();
        imageData = $scope.renderEngine.renderToImg();
        $scope.magic = new MagicSelection(imageData);

        $interval(callAtInterval, 1000);
        $scope.offset = 0;
    },
    
    mouseDown: function($scope) {
        /* x and y coordinates in pixels relative to image. */
        xRelative = $scope.config.mouse.current.x - $scope.xOffset;
        yRelative = $scope.config.mouse.current.y - $scope.yOffset;

        /* Check wheter user has clicked inside of a selection. */
        if ($scope.magic.isInSelection(xRelative, yRelative)) {
            $scope.magic.removeSelection(xRelative, yRelative)
        } else {
            $scope.magic.getMaskWand(xRelative, yRelative, $scope.tresholdValue);
        }

        /* Save border and marching ants mask in scope. */
        $scope.maskBorder = $scope.magic.getMaskBorder();
        $scope.maskAnts = $scope.magic.marchingAnts($scope.sizeAnts * 2, 0);
    },
    
    mouseUp: function($scope) {
    },
    
    mouseMove: function($scope) {    
        // TODO call mouseDown
    },

    function callAtInterval() {
        $scope.offset++;
        $scope.maskAnts = $scope.magic.marchingAnts($scope.sizeAnts * 2, $scope.offset);
    }
}