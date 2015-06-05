"use strict";

var app = angular.module('ariana', ['ui.router', 'ui.bootstrap', 'templates-ariana']);

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
			}
		}
	}
	
	// TODO create render engine
	
	// TODO function to create layer form images
	
	// TODO function to create blank layer
	
	// TODO function to Apply filter to image
	
	// TODO function to get image as file
]);
