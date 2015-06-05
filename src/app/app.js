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
				active: null,
				colors: {
					primary: '#000000',
					secondary: '#ffffff'
				}
			}
		}
	}
]);
