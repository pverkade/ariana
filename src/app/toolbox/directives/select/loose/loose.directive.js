/* 
 * Project Ariana
 * loose.directive.js
 * 
 * This file contains the LooseController and directive, 
 * which control the loose selection tool in the toolbox.
 *
 */
 
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
    $scope.loose = null;

    $scope.init = function() {
        canvas.setCursor('default');
        $scope.selection.maskEnabled = true;
        var layer = $scope.getCurrentLayer();
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }
        
        $scope.image = layer.getImage();

        $scope.loose = new LooseSelection($scope.image.width, $scope.image.height);

        $scope.mouseBTNDown = false;

        $scope.startSharedSelection($scope.image.width, $scope.image.height);
        $scope.setSelectionTool($scope.loose);
        $scope.loose.setMaskWand($scope.maskWand);
        $scope.loose.setMaskWandParts($scope.maskWandParts);
        $scope.loose.setMaskBorder($scope.maskBorder);

        $scope.drawEngine.setLineWidth(2);
        $scope.drawEngine.setDrawType(drawType.DASHED);

        $scope.setMaskSelectedArea($scope.loose.width, $scope.loose.height);
    };
    
    $scope.stop = function() {
    };

    $scope.mouseDown = function() {
        if (!$scope.loose) return;
        /* x and y coordinates in pixels relative to image. */
        xMouse = mouse.getPosX();
        yMouse = mouse.getPosY();

        /* Calculate x and y coordinates in pixels of the original image */
        var layer = $scope.getCurrentLayer();
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }

        var transformedPoint = $scope.loose.transform(layer, xMouse, yMouse);
        xRelative = transformedPoint.x;
        yRelative = transformedPoint.y;

        $scope.drawEngine.onMousedown(xMouse, yMouse);   
        $scope.mouseBTNDown = true; 
    };

    /* onMouseUp */
    $scope.mouseUp = function() {
        if (!$scope.loose) return;
        $scope.loose.reset();
        $scope.mouseBTNDown = false;

        $scope.drawEngine.onMouseup(xMouse, yMouse);
        $scope.drawEngine.clearCanvases();
    };

    /* onMouseMove */
    $scope.mouseMove = function() {
        if (!$scope.loose) return;
        /* x and y coordinates in pixels relative to image. */
        xMouse = mouse.getPosX();
        yMouse = mouse.getPosY();    

        /* Calculate x and y coordinates in pixels of the original image */
        var layer = $scope.getCurrentLayer();
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }
        
        var transformedPoint = $scope.loose.transform(layer, xMouse, yMouse);
        xRelative = transformedPoint.x;
        yRelative = transformedPoint.y;

        if ($scope.mouseBTNDown === true) {
            if ($scope.loose.addPoint(new Point(xRelative, yRelative))) {
                var boundingPath = $scope.loose.getLastBoundingPath();

                /* A new bounding path has been found. */
                if (boundingPath.length !== 0) {
                    /* Draw shared mask variables to image. */
                    if ($scope.maskWand) {
                        $scope.setMaskSelectedArea($scope.loose.width, $scope.loose.height);
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
