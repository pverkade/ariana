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
				location: {
					x: 0,
					y: 0
				},
				click: {
					x: 0,
					y: 0
				}
			},
			tools: {
				activeTool:     null,
				activeToolset:  null,
				colors: {
					primary:   '#000000',
					secondary: '#ffffff'
				}
			},
			layers: {
			    numberOfLayers: 0,
			    currentLayer:   -1,
			    layerInfo: {
			        //{"x": 0, "y": 0, "zoom": 1}
			    }
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
            $scope.config.layers.numberOfLayers += 1;
            $scope.config.layers.currentLayer += 1;
            
            console.log($scope.renderEngine.layers);
            console.log($scope.config.layers.currentLayer);
            
            //FIXME cannot set position without Arnold dissapearing
            //$scope.renderEngine.layers[$scope.config.layers.currentLayer].setPos(200, 200);
            $scope.renderEngine.render();
		};
		
		$scope.getImage = function() {
		    // return rendered image
		};
	}
]);
