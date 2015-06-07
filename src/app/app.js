"use strict";

var app = angular.module('ariana', [
	'ui.router', 
	'ui.bootstrap', 
	'templates-ariana',
	'ngFileUpload'
]);

app.controller('AppCtrl', ['$scope', 
	function ($scope) {
		$scope.config = {
			mouse: {
				current: {
					x: 0,
					y: 0
				},
                lastClick: {
					x: 0,
					y: 0
				},
                click: {down: false}
			},
			tools: {
				activeTool:     "pan",
				activeToolset:  null,
				colors: {
					primary:   '#000000',
					secondary: '#ffffff'
				}
			},
			layers: {
			    numberOfLayers: 0,
			    currentLayer:   -1,
			    layerInfo: [
			        //{"x": 0, "y": 0, "zoom": 1}
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
            
            /* set the correct layer info in config. */
            $scope.config.layers.numberOfLayers += 1;
            $scope.config.layers.currentLayer += 1;
            $scope.config.layers.layerInfo[$scope.config.layers.currentLayer] = {"x": -0.25, "y": -0.25, "zoom": 1}
            
            $scope.renderEngine.layers[$scope.config.layers.currentLayer].setPos(-0.25, -0.25);
            //FIXME scale only works for arnold 
            $scope.renderEngine.layers[$scope.config.layers.currentLayer].setScale(0.4, 0.65);
            $scope.renderEngine.render();
		};
		
		$scope.getImage = function() {
		    // TODO
		};
        
        $scope.layerDown = function() {
            if ($scope.config.layers.currentLayer > 0) {
                $scope.config.layers.currentLayer -= 1;
                return true;
            }   
            return false;
        }
        
        $scope.layerUp = function() {
            if ($scope.config.layers.currentLayer < $scope.config.layers.numberOfLayers - 1) {
                $scope.config.layers.currentLayer += 1;
                return true;
            }   
            return false;
        };
        
        $scope.layerSelect = function(newIndex) {
            if (0 <= newIndex && newIndex < $scope.config.layers.numberOfLayers) {
                $scope.config.layers.currentLayer = newIndex;
                return true;
            }   
            return false;
        };
	}
]);
