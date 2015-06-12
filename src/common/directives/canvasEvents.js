angular.module('ariana').directive('canvasEvents', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			scope.$watch('config.canvas.cursor', function(nval, oval) {
				element.css('cursor', scope.config.canvas.cursor);
			}, true);

			/* Watches canvas changes  */
		    scope.$watch('config.canvas', function(nval, oval) {
    			element.css('transform', "translate(" + scope.config.canvas.x + 
    									 "px, " + scope.config.canvas.y + "px)");
    		}, true);
		}
	}
});