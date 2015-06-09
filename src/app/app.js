"use strict";

var app = angular.module('ariana', [
    'ui.router',
    'ui.bootstrap',
    'templates-ariana',
    'ngFileUpload'
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
                    }
                }
            },
            layers: {
                selectedLayers: [],
                numberOfLayers: 0
            }
        };

        $scope.renderEngine = null;
        $scope.drawEngine = null;

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
            $scope.setSelection([$scope.config.layers.numberOfLayers]);
            $scope.config.layers.numberOfLayers += 1;

            imageLayer.setPos(-0.25, -0.25);
            imageLayer.setScale(.2, .2);

            $scope.renderEngine.render();
        };

        $scope.getSelectedLayers = function() {
            return $scope.renderEngine.getLayers($scope.config.layers.selectedLayers);
        };

        $scope.setSelection = function(indices) {
            $scope.config.layers.selectedLayers = indices;
        };

        /* FIXME cannot be accesed by FilterModalController
        $scope.applyFilter = function(name) {
            // TODO
            console.log("Apply filter " + name);
        }; */
	}
]);
