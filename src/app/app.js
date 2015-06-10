"use strict";

var app = angular.module('ariana', [
    'ui.router',
    'ui.bootstrap',
    'templates-ariana',
    'ngFileUpload',
    'ngAnimate'
]);

app.controller('AppCtrl', ['$scope',
    function($scope) {
        $scope.config = {
            mouse: {
                old : {
                    x : 0,
                    y : 0
                },
                current: {
                    x: 0,
                    y: 0
                },
                lastClick: {
                    x: 0,
                    y: 0
                },
                click: {
                    down: false
                }
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
                    },
                }
            },
            layers: {
                numberOfLayers: 0,
                currentLayer: -1,
                layerInfo: [
                
                ]
            }
        };

        $scope.renderEngine = null;

        $scope.startEngine = function(canvas) {
            $scope.renderEngine = new RenderEngine(canvas);
            console.log("Broom broom!");
        };

        $scope.newLayerFromImage = function(image) {
            var imageLayer = new ImageLayer($scope.renderEngine.getWebGLRenderingContext(), image);
            $scope.renderEngine.addLayer(imageLayer);

            var width = image.naturalWidth;
            var height = image.naturalHeight;

            /* set the correct layer info in config. The new layer comes on top
             * and is immediately selected. */
            $scope.config.layers.numberOfLayers += 1;
            $scope.config.layers.currentLayer = $scope.config.layers.numberOfLayers - 1;

            var layer = $scope.renderEngine.layers[$scope.config.layers.currentLayer];
            layer.setPos(-0.25, -0.25);
            layer.setScale(.2, .2);

            $scope.config.layers.layerInfo[$scope.config.layers.currentLayer] = {
                "name": $scope.config.layers.currentLayer,
                "x": layer.getPosX(),
                "y": layer.getPosY(),
                "xScale": layer.getScaleX(),
                "yScale": layer.getScaleY(),
                "rotation": layer.getRotation()
            }

            $scope.renderEngine.render();
        };

        $scope.getImage = function() {
            // TODO render image to file
        };

        $scope.applyFilter = function(name) {
            console.log("Apply filter " + name);
            
            if (name == "brightness") {
                // TODO start element with parameters, layer button, 
                // TODO actually apply filter on current layer/all layers
                
                //var brightnessFilter = new BrightnessFilter();
                //console.log(brightnessFilter);
            }
        };
	}
]);
