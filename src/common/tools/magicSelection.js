var magicSelection = {
    
    start: function($scope) {
        var scope = angular.element($("#main-canvas")).scope();
        $("#main-canvas").css("cursor", "crosshair");

        var imgData = new ImgData($scope.renderEngine.getWidth(), $scope.renderEngine.getHeight()); 
        imgData.data = $scope.renderEngine.renderAsUint8Array();
        
        scope.magic = new MagicSelection(imgData);
        console.log("magic in scope");
        console.log(scope.magic);

        // $interval(callAtInterval, 1000);
        $scope.offset = 0;
    },
    
    mouseDown: function($scope) {
        var scope = angular.element($("#main-canvas")).scope();

        /* x and y coordinates in pixels relative to image. */
        xRelative = $scope.config.mouse.current.x; //- $scope.config.canvas.x;
        yRelative = $scope.config.mouse.current.y; //- $scope.config.canvas.y;

        console.log("xRelative, yRelative");
        console.log(xRelative, yRelative);

        /* Check wheter user has clicked inside of a selection. */
        if (scope.magic.isInSelection(xRelative, yRelative)) {
            scope.magic.removeSelection(xRelative, yRelative)
        } else {
            scope.magic.getMaskWand(xRelative, yRelative, $scope.tresholdValue);
        }

        /* Save border and marching ants mask in scope. */
        scope.maskBorder = $scope.magic.getMaskBorder();
        scope.maskAnts = $scope.magic.marchingAnts($scope.sizeAnts * 2, 0);
    },
    
    mouseUp: function($scope) {
    },
    
    mouseMove: function($scope) {    
        // TODO call mouseDown
    },

    callAtInterval: function($scope) {
        console.log("test");
        $scope.offset++;
        $scope.maskAnts = $scope.magic.marchingAnts($scope.sizeAnts * 2, $scope.offset);
    }
}