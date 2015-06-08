"use strict";

var app = angular.module('ariana', [
    'ui.router',
    'ui.bootstrap',
    'templates-ariana',
    'ngFileUpload'
]);

app.controller('AppCtrl', ['$scope', '$rootScope',
    function($scope, $rootScope) {
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
                click: {down: false}
			},
			tools: {
				activeTool: null,
                activeToolFunctions: null,
				activeToolset: null,
				colors: {
					primary:   {r: 255, g: 255, b: 255},
					secondary: {r: 0,   g: 0,   b: 0},
				}
			},
			layers: {
			    numberOfLayers: 0,
			    currentLayer:   -1,
			    layerInfo: [
			        //{"x": 0, "y": 0, "scale": 1}
			    ]
            }
		};
         
		$scope.renderEngine = null;
        
        $scope.startEngine = function(canvas) {
            $scope.renderEngine = new RenderEngine(canvas);
            console.log("Broom broom!");
        };
        
		$rootScope.newLayerFromImage = function(image) {
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
            layer.setScale(.2,.2);

            $scope.config.layers.layerInfo[$scope.config.layers.currentLayer] = {
                "x": layer.getPosX(), 
                "y": layer.getPosY(), 
                "xScale": layer.getScaleX(), 
                "yScale": layer.getScaleY(), 
                "rotation": layer.getRotation()}

            console.log($scope.renderEngine.layers.length);
            $scope.renderEngine.render();
		};
		
		$scope.getImage = function() {
		    // TODO render image to file
		};
        
        /* This function selects a lower layer if possible. */
        $scope.layerDown = function() {
            if ($scope.config.layers.currentLayer > 0) {
                $scope.config.layers.currentLayer -= 1;
                return true;
            }   
            return false;
        }
        
        /* This function selects a higher layer if possible. */
        $scope.layerUp = function() {
            if ($scope.config.layers.currentLayer < $scope.config.layers.numberOfLayers - 1) {
                $scope.config.layers.currentLayer += 1;
                return true;
            }   
            return false;
        };
        
        /* This function selects a specific layer if possible. */
        $scope.layerSelect = function(newIndex) {
            if (0 <= newIndex && newIndex < $scope.config.layers.numberOfLayers) {
                $scope.config.layers.currentLayer = newIndex;
                return true;
            }   
            return false;
        };
        
        /* FIXME cannot be accesed by FilterModalController
        $scope.applyFilter = function(name) {
            // TODO
            console.log("Apply filter " + name);
        }; */
	}
]);

function start() {
    // SVG FIX FOT STACK OVEFLOW
    $('.svg').each(function() {
        var $img    = $(this);
        var id      = $img.attr('id');
        var src     = $img.attr('src');

        /* Load image src. */
        $.get(src, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof id !== 'undefined') {
                $svg = $svg.attr('id', id);
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns');
            $svg = $svg.removeAttr('xmlns:xlink');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');
    });
}

