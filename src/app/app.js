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
			"mouse": {
				"location": {
					"x": 0,
					"y": 0
				},
				"click": {
					"x": 0,
					"y": 0
				}
			},
			"tools": {
				"activeTool":     null,
				"activeToolset":  null,
				"colors": {
					"primary":   '#000000',
					"secondary": '#ffffff'
				}
			},
			"layers": {
			    "numberOfLayers": 0,
			    "currentLayer": null
			} 
		}
		
		$scope.renderEngine = null;
		
		$scope.newLayerFromImage = function(image) {
		    // TODO add new layer to renderEngine from image
		    // get webgl context
		    // create layer
		    // append layer to renderEngine
		    // update config
		}
		
		$scope.getImage = function() {
		    // return rendered image
		}
	}
]);
