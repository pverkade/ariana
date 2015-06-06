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
			    currentLayer: null,
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
            console.log("new layer!!");
            console.log("image", image);
            console.log("engine", $scope.renderEngine);
            
		    var context = $scope.renderEngine.getWebGLRenderingContext();
            console.log("context", context);
            var layer = new ImageLayer(context, image);
            console.log("layer", layer);
            
		    // create layer
		    // append layer to renderEngine
		    // update config
            
            console.log("finished");
		};
		
		$scope.getImage = function() {
		    // return rendered image
		};
	}
]);
