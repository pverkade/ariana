app.directive('loose', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/loose/loose.tpl.html',
        controller: 'LooseCtrl'
    };
});

app.controller('LooseCtrl', ['$scope', 'tools', 'canvas', 'layers', 'mouse',
    function($scope, tools, canvas, layers, mouse) {

    $scope.toolname = 'loose';
    $scope.active = tools.getTool() == $scope.toolname;

    /* init */
    $scope.init = function() {
        canvas.setCursor('default');

        var currentLayer = layers.getCurrentIndex();
        if (currentLayer == -1) {
            console.log("No layer selected");
            return;
        }

        var layer = $scope.renderEngine.layers[currentLayer];
        if (layer.layerType != LayerType.ImageLayer) {
            console.log("Layer is not of type ImageLayer");
            return;
        }
        $scope.image = layer.getImage();

        $scope.loose = new LooseSelection($scope.image.width, $scope.image.height);

        $scope.canvas = document.createElement("canvas");
        $scope.context = $scope.canvas.getContext("2d");
        $scope.imgData = $scope.context.createImageData($scope.loose.width, $scope.loose.height);

        $scope.mouseBTNDown = false;

        $scope.startSharedSelection($scope.image.width, $scope.image.height);
        $scope.loose.setMaskWand($scope.maskWand);
        $scope.loose.setMaskBorder($scope.maskBorder);

        $scope.drawEngine.setLineWidth(2);
        $scope.drawEngine.setDrawType(drawType.DASHED);
    };
    
    $scope.stop = function() {
        var scope = angular.element($("#main-canvas")).scope();
        scope.editEngine.removeSelectionLayer();
        $scope.requestEditEngineUpdate();
    };

    $scope.mouseDown = function() {
        $scope.stop();
        
        /* x and y coordinates in pixels relative to image. */
        xMouse = mouse.getPosX();
        yMouse = mouse.getPosY();

        $scope.drawEngine.onMousedown(xMouse, yMouse);   
        $scope.mouseBTNDown = true; 
    };

    /* onMouseUp */
    $scope.mouseUp = function() {
        $scope.loose.reset();
        $scope.mouseBTNDown = false;

        $scope.drawEngine.onMouseup(xMouse, yMouse);
        $scope.drawEngine.clearCanvases();
    };

    /* onMouseMove */
    $scope.mouseMove = function() {
        /* x and y coordinates in pixels relative to image. */
        xMouse = mouse.getPosX();
        yMouse = mouse.getPosY();    

        /* Calculate x and y coordinates in pixels of the original image */
        var currentLayer = layers.getCurrentIndex();
        var layer = $scope.renderEngine.layers[currentLayer];
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }

        if ($scope.mouseBTNDown == true) {
            if ($scope.loose.addPoint(new Point(xMouse, yMouse))) {
                var boundingPath = $scope.loose.getLastBoundingPath();

                /* A new bounding path has been found. */
                if (boundingPath.length != 0) {
                    var bitmask = $scope.loose.getLastMaskWand();
                    for (var i = 0; i < bitmask.length; i++) {
                        if (bitmask[i]) {
                            $scope.imgData.data[4 * i] = 255;
                            $scope.imgData.data[4 * i + 1] = 0;
                            $scope.imgData.data[4 * i + 2] = 0;
                            $scope.imgData.data[4 * i + 3] = 255;
                        }
                    }

                    /* Add new layer for bounding path and set selection. */
                    var newLayer = $scope.renderEngine.createSelectionImageLayer($scope.imgData, 0);
                    $scope.addLayer(newLayer);

                    $scope.editEngine.setSelectionLayer($scope.marchingAnts, newLayer);
                    $scope.requestRenderEngineUpdate();

                    $scope.loose.reset();

                    /* When a bounding path is drawn the bounding path is draw and user interface acts like
                        the user has released the mouse button. */
                    $scope.drawEngine.onMouseup(xMouse, yMouse);
                    $scope.mouseBTNDown = false;
                }
            }    
        }

        $scope.drawEngine.onMousemove(xMouse, yMouse);        
    };
    /*
     * This will watch for this tools' "active" variable changes.
     * When "active" changes to "true", this tools functions need to
     * be registered to the global config.
     * This functions NEEDS to be in each tools controller for
     * the tool to function. Please assign the correct toolfunctions
     * to the "activeToolFunctions" object.
     * Always call "init" first;
     */
    $scope.$watch('active', function(nval, oval) {
        if (nval) {
            $scope.init();

            tools.setToolFunctions({
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            });
        }
        else if (oval) {
            $scope.stop();
        }
    }, true);
}]);