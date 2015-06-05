"use strict";

var app = angular.module('ariana', ['ui.router', 'templates-ariana']);

angular.module('ariana').controller('AppCtrl', function($scope) {
	
	/* Config contains the current state of the settings/tools. */
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
			active: null,
			colors: {
				primary:   '#000000',
				secondary: '#ffffff'
			}
		}
	}
	
	// TODO create render engine
	
	// TODO function to create layer form images
	
	// TODO function to create blank layer
	
	// TODO function to Apply filter to image
	
	// TODO function to get image as file
	
});
