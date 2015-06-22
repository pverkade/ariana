/* 
 * Project Ariana
 * app.js
 * 
 * This file contains the AppController, which controls the entire application.
 * It also contain the global configuration settings.
 *
 */

"use strict";

var app = angular.module('ariana', [
    'ui.router',
    'ui.bootstrap',
    'cfp.hotkeys',
    'templates-ariana',
    'ngFileUpload',
    'ngAnimate'
]);

/* The AppController is the main controller of the application. */
app.controller('AppCtrl', ['$scope',
    function($scope) {

        /* The config object contains the current state of the layers, tools, 
         * canvas and the mouse. It is accessed by all kinds of controllers. */
        $scope.config = {
            mouse: {
                old: {
                    x : 0,
                    y : 0,
                    global: {
                        x : 0,
                        y : 0,
                    },
                },
                current: {
                    x: 0,
                    y: 0,
                    global: {
                        x : 0,
                        y : 0,
                    },
                },
                button: {
                    1: false, // left button
                    2: false, // middle button
                    3: false // right button
                }
            },
            canvas: {
                cursor: 'default',
                x: 128,
                y: 128,
                xr: 1,
                yr: 1,
                zoom: 1,
                width: 800,
                height: 600,
                visible: false
            },
            tools: {
                activeTool: 'pan',
                activeToolFunctions: null,
                activeToolset: null,
                colors: {
                    primary: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    secondary: {
                        r: 255,
                        g: 255,
                        b: 255
                    }
                }
            },
            layers: {
                numberOfLayers: 0,
                currentLayer: -1,
                layerInfo: []
            }
        };

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
            console.log(width, height);
            if ($scope.maskWand == null) {
                $scope.maskWand = new Uint8Array(width * height);
                $scope.maskBorder = new Uint8Array(width * height);
                $scope.marchingAnts = new MarchingAnts(width, height);
                $scope.marchingAnts.setMaskBorder($scope.maskBorder);
            }
        }

        /* This function creates a new layer from a given Image-object. The new
         * layer is placed on top. */
        $scope.newLayerFromImage = function(image) {
            var layer = $scope.renderEngine.createImageLayer(image);
            $scope.addLayer(layer);

            var height = layer.getHeight();
            var width  = layer.getWidth();
            layer.setPos(0.5 * width, 0.5 * height);
        };

        $scope.addLayer = function(layer) {
            var height = layer.getHeight();
            var width  = layer.getWidth();

            $scope.renderEngine.addLayer(layer);

            /* set the correct layer info in config. The new layer comes on top
             * and is immediately selected. */
            $scope.config.layers.numberOfLayers += 1;
            $scope.config.layers.currentLayer = $scope.config.layers.numberOfLayers - 1;

            /* Store information about the layers in the config object. */
            $scope.config.layers.layerInfo[$scope.config.layers.currentLayer] = {
                "name": 'Layer ' + $scope.config.layers.numberOfLayers,
                "x": layer.getPosX(),
                "y": layer.getPosY(),
                "originalWidth": width,
                "originalHeight": height,
                "width": width,
                "height": height,
                "rotation": layer.getRotation()
            };

            $scope.requestRenderEngineUpdate();
        };

        $scope.resizeCanvases = function(width, height) {
            var toolFunctions = $scope.config.tools.activeToolFunctions;

            $scope.config.canvas.width = width;
            $scope.config.canvas.height = height;
            $scope.renderEngine.resize($scope.config.canvas.width, $scope.config.canvas.height);
            $scope.drawEngine.resize($scope.config.canvas.width, $scope.config.canvas.height);
            $scope.editEngine.resize($scope.config.canvas.width, $scope.config.canvas.height);

            if (toolFunctions && toolFunctions.init) {
                toolFunctions.init();
            }

            $scope.config.layers.numberOfLayers = 0;
            $scope.config.layers.currentLayer = -1;
            $scope.config.layers.layerInfo = [];

            if (!$scope.config.canvas.visible) {
                $scope.config.canvas.visible = true;
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

        $scope.getCurrentLayerIndex = function () {
            return $scope.config.layers.currentLayer;
        };

        $scope.getCurrentLayer = function () {
            var index = $scope.config.layers.currentLayer;
            if (index === -1) {
                return null;
            }

            return $scope.renderEngine.getLayer(index);
        };

        $scope.setCurrentLayerIndex = function (layerIndex) {
            $scope.config.layers.currentLayer = layerIndex;
            $scope.$broadcast('newCurrentLayer', layerIndex);
        }
	}
]);
