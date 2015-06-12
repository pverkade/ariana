var brushTool = {
    
    start: function() {
        var scope = angular.element($("#background")).scope();
        $("#background").css("cursor", "url(/assets/vectors/brush.svg), auto");
        
        scope.drawEngine.setBrush(brushType.THIN);
    },

    stop: function() {
        var scope = angular.element($("#background")).scope();

        var image = scope.drawEngine.getCanvasImageData();
        var imageLayer = scope.renderEngine.createImageLayer(image);
        imageLayer.setPos(image.width/2.0, image.height/2.0);
        scope.renderEngine.addLayer(imageLayer);
        scope.renderEngine.render();

        scope.drawEngine.clearCanvases();
    },

    mouseDown: function($scope, event) {
        var color;
        if ($scope.config.mouse.button[1]) {
            color = $scope.config.tools.colors.primary;
        } else {
            color = $scope.config.tools.colors.secondary;
        }
        $scope.drawEngine.setColor(
            color.r,
            color.g,
            color.b,
            1.0
        );
        $scope.drawEngine.onMousedown(event);
    },

    mouseUp: function($scope, event) {
        $scope.drawEngine.onMouseup(event);
    },

    mouseMove: function($scope, event) {
        $scope.drawEngine.onMousemove(event);
    }
}