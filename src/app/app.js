/* 
 * Project Ariana
 * app.js
 * 
 * This file contains the AppController, which controls the entire application.
 * It also contain the global configuration settings.
 *
 */

var app = angular.module('ariana', [
    'ui.router',
    'ui.bootstrap',
    'cfp.hotkeys',
    'templates-ariana',
    'ngFileUpload',
    'ngAnimate',
    'ngTouch'
]);

/* The AppController is the main controller of the application. */
app.controller('AppCtrl', ['$scope', 'layers', 'canvas', 'tools',
    function($scope, layers, canvas, tools) {

        /* The config object contains the current state of the layers, tools, 
         * canvas and the mouse. It is accessed by all kinds of controllers. */
        $scope.renderEngine = null;
        $scope.drawEngine = null;
        $scope.editEngine = null;
        $scope.maskWand = null;
        $scope.maskBorder = null;
        $scope.marchingAnts = null;

        /* This function creates the RenderEngine. It requires the canvas to
         * render on. */
        $scope.startEngines = function(renderCanvas, drawCanvas) {
            $scope.renderEngine = new RenderEngine(renderCanvas);
            $scope.drawEngine = new DrawEngine(drawCanvas);
            $scope.editEngine = new EditEngine(drawCanvas);
        };

        $scope.startSharedSelection = function(width, height) {
            if ($scope.maskWand == null) {
                $scope.maskWand = new Uint8Array(width * height);
                $scope.maskBorder = new Uint8Array(width * height);
                $scope.marchingAnts = new MarchingAnts(width, height);
                $scope.marchingAnts.setMaskBorder($scope.maskBorder);
            }
        };

        /* This function creates a new layer from a given Image-object. The new
         * layer is placed on top. */
        $scope.newLayerFromImage = function(image) {
            var layer = $scope.renderEngine.createImageLayer(image);
            $scope.addLayer(layer);

            var dimensions = layer.getTransformedDimensions();
            layer.setPos(0.5 * dimensions[0], 0.5 * dimensions[1]);
        };

        $scope.addLayer = function (layer) {
            $scope.renderEngine.addLayer(layer);

            /* set the correct layer info in config. The new layer comes on top
             * and is immediately selected. */
            layers.setNumCreatedLayers(layers.getNumCreatedLayers() + 1);
            layers.setNumLayers($scope.renderEngine.getNumberOfLayers());
            layers.setCurrentIndex(layers.getNumberOfLayers - 1);

            /* Store information about the layers in the config object. */
            layers.addLayer({
                "name": "Layer " + layers.getNumCreatedLayers()
            });

            $scope.requestRenderEngineUpdate();
        };

        $scope.resizeCanvases = function (width, height) {
            canvas.setDim(width, height);
            $scope.renderEngine.resize(canvas.getWidth(), canvas.getHeight());
            $scope.drawEngine.resize(canvas.getWidth(), canvas.getHeight());
            $scope.editEngine.resize(canvas.getWidth(), canvas.getHeight());

            if (tools.getToolFunctions() && tools.getToolFunctions().init) {
                tools.getToolFunctions().init();
            }

            layers.setNumLayers(0);
            layers.setCurrentIndex(-1);
            layers.overwriteLayers([]);

            if (!canvas.getVisibility()) {
                canvas.setVisibility(true);
            }
            
            $scope.requestRenderEngineUpdate();
        };

        $scope.updates = {
            renderEngine: false,
            drawEngine: false,
            editEngine: false,
            animationFrameCallback: null,
            animationFrameFunction: function() {
                if ($scope.updates.renderEngine) {
                    $scope.renderEngine.render();
                    $scope.updates.renderEngine = false;
                }

                if ($scope.editEngine) {
                    $scope.editEngine.render();
                    $scope.updates.editEngine = false;
                }

                if ($scope.editEngine.needsAnimating()) {
                    $scope.updates.editEngine = true;
                    $scope.updates.animationFrameCallback =
                        requestAnimationFrame($scope.updates.animationFrameFunction);
                } else {
                    $scope.updates.animationFrameCallback = null;
                }
            }
        };

        $scope.requestRenderEngineUpdate = function() {
            $scope.updates.renderEngine = true;
            if (!$scope.updates.animationFrameCallback) {
                $scope.updates.animationFrameCallback =
                    requestAnimationFrame($scope.updates.animationFrameFunction);
            }
        };

        $scope.requestEditEngineUpdate = function() {
            $scope.updates.editEngine = true;
            if (!$scope.updates.animationFrameCallback) {
                $scope.updates.animationFrameCallback =
                    requestAnimationFrame($scope.updates.animationFrameFunction);
            }
        };

        $scope.getCurrentLayer = function() {

        
            var index = layers.getCurrentIndex();
            if (index == -1) return;

            return $scope.renderEngine.getLayer(index);
        };

        $scope.setCurrentLayerIndex = function(layerIndex) {
            layers.setCurrentIndex(layerIndex);
            $scope.$broadcast('newCurrentLayer', layerIndex);

            $scope.editEngine.setEditLayer($scope.renderEngine.getLayer(layerIndex), $scope.editEngine.getEditMode());
            $scope.requestEditEngineUpdate();
        };

        $scope.updateThumbnail = function(index) {
            if (0 <= index && index < $scope.renderEngine.getNumberOfLayers()) {
                var layer = $scope.renderEngine.getLayer(index);
                $scope.renderEngine.createThumbnail(layer);
            }
        };
    }
]);
