/* 
 * Project Ariana
 * scale.directive.js
 * 
 * This file contains the ScaleController and directive, 
 * which control the scale tool in the toolbox.
 *
 */
 
app.directive('scale', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/basic/scale/scale.tpl.html',
        controller: 'ScaleCtrl'
    };
});

app.controller('ScaleCtrl', ['$scope', 'tools', 'canvas', 'layers', 'mouse', function($scope, tools, canvas, layers, mouse) {
    $scope.toolname = 'scale';
    $scope.active = tools.getTool() == $scope.toolname;
    $scope.cursorTypes = ["e-resize", "ne-resize", "n-resize", "nw-resize", "w-resize",
        "sw-resize", "s-resize", "se-resize", "e-resize"];
    $scope.keepAR = true;

    /* init */
    $scope.init = function() {
        $scope.scaling = false;
        
        var layer = $scope.getCurrentLayer();
        if (!layer || layer.getLayerType() != LayerType.ImageLayer) {
            return;
        }
        $scope.editEngine.setEditLayer(layer, EditMode.scale);
        $scope.editEngine.drawScaleTool(layer);
        $scope.requestEditEngineUpdate();
    };

    /* onMouseDown */
    $scope.mouseDown = function() {
        $scope.scaling = true;
    };

    /* onMouseUp */
    $scope.mouseUp = function() {
        $scope.scaling = false;
        $scope.updateThumbnail(layers.getCurrentIndex());
    };

    /* onMouseMove */
    $scope.mouseMove = function() {

        var mouseCurrentX = mouse.getPosX();
        var mouseCurrentY = mouse.getPosY();

        var mouseOldX = mouse.getOldPosX();
        var mouseOldY = mouse.getOldPosY();

        var layer = $scope.getCurrentLayer();
        if (!layer) {
            return;
        }

        var x = layer.getPosX();
        var y = layer.getPosY();

        var dimensions = layer.getTransformedDimensions();
        var ratio = dimensions[1] / dimensions[0];
        
        var angle = (Math.atan2((y - mouseCurrentY) / ratio, mouseCurrentX - x) + 2 * Math.PI) % (2 * Math.PI);

        if ($scope.scaling) {

            var width  = layer.getWidth();
            var height = layer.getHeight();

            var originalWidth = width;
            var originalHeight = height;

            var newWidth = width;
            var newHeight = height;

            var xScaleFactor, yScaleFactor;

            if ($scope.scaleToolIndex != 2 && $scope.scaleToolIndex != 6) {
                xScaleFactor = (mouseCurrentX - mouseOldX ) / (mouseOldX - x) + 1;

                if (xScaleFactor && isFinite(xScaleFactor)) {
                    newWidth *= xScaleFactor;
                }
                else if (isNaN(xScaleFactor)) {
                    newWidth *= -1;
                }
                else if (!isFinite(xScaleFactor)) {
                    newWidth *= Math.sign(xScaleFactor);
                }
            }

            if ($scope.scaleToolIndex !== 0 && $scope.scaleToolIndex != 4) {
                yScaleFactor = (mouseCurrentY - mouseOldY ) / (mouseOldY - y) + 1;

                if (yScaleFactor && isFinite(yScaleFactor)) {
                    newHeight *= yScaleFactor;
                }
                else if (isNaN(yScaleFactor)) {
                    newHeight *= -1;
                }
                else if (!isFinite(yScaleFactor)) {
                    newHeight *= Math.sign(yScaleFactor);
                }
            }

            if ($scope.keepAR) {
                if ($scope.scaleToolIndex === 0 || $scope.scaleToolIndex == 4) {
                    ratio = newWidth / originalWidth;
                    newHeight = height * ratio;
                }
                else {
                    ratio = newHeight / originalHeight;
                    newWidth = width * ratio;
                }
            }

            layer.setWidth(newWidth );
            layer.setHeight(newHeight);

            $scope.editEngine.setEditLayer(layer, EditMode.scale);
            $scope.editEngine.drawScaleTool(layer);
            $scope.requestEditEngineUpdate();
            $scope.requestRenderEngineUpdate();

        }
        else {
            var differenceX = mouseCurrentX - x;
            var differenceY = y - mouseCurrentY;

            /* Update the index and the cursor. */
            if (!(mouse.getMiddle() || mouse.getSecondary())) {

                ratio = Math.abs(differenceY) / Math.abs(differenceX);

                $scope.scaleToolIndex = Math.round(8 * (angle / (2 * Math.PI)));
                canvas.setCursor($scope.cursorTypes[$scope.scaleToolIndex]);

                if ($scope.scaleToolIndex === 8) {
                    $scope.scaleToolIndex = 0;
                }

                return;
            }
        }

        /* Update old mouse. */
        mouse.setOldPos(mouse.getPosX(), mouse.getPosY());
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
        else {
            $scope.editEngine.clear();
        }

        if (oval) {
            $scope.editEngine.removeEditLayer();
            var layer = $scope.getCurrentLayer();
            layer.commitDimensions();
            $scope.editEngine.clear();
            $scope.updateThumbnail(layers.getCurrentIndex());
        }
    }, true);
}]);
