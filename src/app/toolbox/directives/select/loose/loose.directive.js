angular.module('ariana').directive('loose', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/loose/loose.tpl.html',
        controller: 'LooseCtrl'
    };
});

angular.module('ariana').controller('LooseCtrl', function($scope) {
    $scope.toolname = 'loose';
    $scope.active = $scope.config.tools.activeTool == $scope.toolname;

    $scope.init = function() {
        $scope.setCursor('default');
        $scope.selection.maskEnabled = true;

        var currentLayer = $scope.config.layers.currentLayer;
        if (currentLayer == -1) {
            return;
        }

        var layer = $scope.renderEngine.layers[currentLayer];
        if (layer.layerType != LayerType.ImageLayer) {
            return;
        }
        
        $scope.image = layer.getImage();

        $scope.loose = new LooseSelection($scope.image.width, $scope.image.height);

        $scope.mouseBTNDown = false;

        $scope.startSharedSelection($scope.image.width, $scope.image.height);
        $scope.setSelectionTool($scope.loose);
        $scope.loose.setMaskWand($scope.maskWand);
        $scope.loose.setMaskBorder($scope.maskBorder);

        $scope.drawEngine.setLineWidth(2);
        $scope.drawEngine.setDrawType(drawType.DASHED);
        
        $scope.editEngine.setSelectionLayer($scope.marchingAnts, layer);
        $scope.requestEditEngineUpdate();     
    };
    
    $scope.stop = function() {
        $scope.editEngine.removeSelectionLayer();
        $scope.requestEditEngineUpdate();
    };

    $scope.mouseDown = function() {
        /* x and y coordinates in pixels relative to image. */
        xMouse = $scope.config.mouse.current.x;
        yMouse = $scope.config.mouse.current.y;  

        /* Check wheter user has clicked inside of a selection. */
        if ($scope.loose.isInSelection(xMouse, yMouse)) {
            $scope.loose.removeSelection(xMouse, yMouse);
        } 

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
        xMouse = $scope.config.mouse.current.x;
        yMouse = $scope.config.mouse.current.y;    

        /* Calculate x and y coordinates in pixels of the original image */
        var currentLayer = $scope.config.layers.currentLayer;
        var layer = $scope.renderEngine.layers[currentLayer];
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }

        if ($scope.mouseBTNDown == true) {
            if ($scope.loose.addPoint(new Point(xMouse, yMouse))) {
                var boundingPath = $scope.loose.getLastBoundingPath();

                /* A new bounding path has been found. */
                if (boundingPath.length != 0) {

                    if ($scope.maskWand) {
                        $scope.setMaskSelectedArea($scope.loose.width, $scope.loose.height);    
                        var currentLayer = $scope.config.layers.currentLayer;
                        var layer = $scope.renderEngine.layers[currentLayer];
                        $scope.editEngine.setSelectionLayer($scope.marchingAnts, layer);
                        $scope.requestEditEngineUpdate();      
                    }

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

            $scope.config.tools.activeToolFunctions = {
                mouseDown: $scope.mouseDown,
                mouseUp: $scope.mouseUp,
                mouseMove: $scope.mouseMove
            };
        }
        else if (oval) {
            $scope.stop();
        }
    }, true);
});