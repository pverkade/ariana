/*
 * Project Ariana
 * ngRightClick.js
 *
 * This file contains an Angular directive for disabling right click options.
 *
 */
 
app.directive('ngRightClick', function($parse) {
	return function(scope, element, attrs) {
		var fn = $parse(attrs.ngRightClick);

		element.bind('contextmenu', function(event) {
			scope.$apply(function() {
				event.preventDefault();
				fn(scope, {
					$event: event
				});
			});
		});
	};
});