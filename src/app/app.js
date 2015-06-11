"use strict";

var app = angular.module('ariana', [
    'ui.router',
    'ui.bootstrap',
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
                old : {
                    x : 0,
                    y : 0,
                },
                current: {
                    x: 0,
                    y: 0,
                },
                button: {
                    1: false, // left button
                    2: false, // middle button
                    3: false, // right button
                }
            },
            canvas: {
                x: 128,
                y: 128,
                zoom: 1,
            },
            tools: {
                activeTool: null,
                activeToolFunctions: null,
                activeToolset: null,
                colors: {
                    primary: {
                        r: 255,
                        g: 255,
                        b: 255
                    },
                    secondary: {
                        r: 0,
                        g: 0,
                        b: 0
                    }
                }
            },
            layers: {
                numberOfLayers: 0,
                currentLayer: -1,
                layerInfo: [],
            }
        };

        $scope.renderEngine = null;

        /* This function creates the RenderEngine. It requires the canvas to
         * render on. */
        $scope.startEngine = function(canvas) {
            $scope.renderEngine = new RenderEngine(canvas);
        };

        /* This function creates a new layer from a given Image-object. The new
         * layer is placed on top. */
        $scope.newLayerFromImage = function(image) {
            var layer = $scope.renderEngine.createImageLayer(image);
            
            var height = layer.getHeight();
            var width = layer.getWidth();
            
            layer.setPos(0.5 * width, 0.5 * height);
            
            $scope.renderEngine.addLayer(layer)

            /* set the correct layer info in config. The new layer comes on top
             * and is immediately selected. */
            $scope.setSelection([$scope.config.layers.numberOfLayers]);
            $scope.config.layers.numberOfLayers += 1;
            
            $scope.config.layers.layerInfo[$scope.config.layers.currentLayer] = {
                "name": $scope.config.layers.currentLayer,
                "x": layer.getPosX(),
                "y": layer.getPosY(),
                "rotation": layer.getRotation()
            }

            $scope.renderEngine.render();
        };


        /* This function will apply a given filter on the current or all
         * layers. */
         $scope.applyFilter = function(name, allLayers) {
            
            if (name == "brightness") {
                // TODO start that asks for parameters 
                // TODO actually apply filter on current layer/all layers
                
                //var brightnessFilter = new BrightnessFilter();
                //console.log(brightnessFilter);
            }
        };
        $scope.getSelectedLayers = function() {
            return $scope.renderEngine.getLayers($scope.config.layers.selectedLayers);
        };

        $scope.setSelection = function(indices) {
            $scope.config.layers.selectedLayers = indices;
        };
	}
]);
