

var looseSelection = {
    
    start: function($scope) {
        $("#main-canvas").css("cursor", "crosshair");
        $("#background").css("cursor", "url(/assets/vectors/pen.svg), auto");

        /* working with $scope to share variables between functions in this file does not seem to work. */
        var scope = angular.element($("#main-canvas")).scope();
        
        scope.looseSelection = new LooseSelection();

        scope.drawEngine.setDrawType(drawType.NORMAL);
    },

    stop: function() {
        var scope = angular.element($("#background")).scope();

        scope.drawEngine.clearCanvases(); // nodig?
        //var image = new Image();
        //image.onload = function() { scope.newLayerFromDrawing(image); }
        //image.src = scope.drawEngine.getCanvasImageData();
        //scope.drawEngine.deactivate();
    },

    mouseDown: function($scope, event) {
        //$("#main-canvas").css("cursor", "grabbing");
        if (scope.looseSelection.addPoint()) {
            var boundingPath = scope.looseSelection.getBoundingPath();
            if (boundingPath == []) {
                $scope.drawEngine.onMousedown(event);
            } else {
                /* When a bounding path is drawn the bounding path is draw and user interface acts like
                    the user has released the mouse button. */
                $scope.drawEngine.setCurrentPath(boundingPath);
                $scope.drawEngine.onMouseup(event);
            }
        }
        
    },
    
    mouseDownRight: function($scope, event) {
        //$("#main-canvas").css("cursor", "grabbing");
        $scope.drawEngine.onContextmenu(event);
    },
    
    mouseUp: function($scope, event) {
        $("#background").css("cursor", "url(/assets/vectors/pen.svg), auto");
        $scope.drawEngine.onMouseup(event);
    },
    
    mouseMove: function($scope, event) {
        $scope.drawEngine.onMousemove(event);
    },
}