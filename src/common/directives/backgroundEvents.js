/*
 * Project Ariana
 * backgroundEvents.js
 *
 * This file contains an Angular directive for catching mouse input on the 
 * background. 
 *
 */
 
app.directive('backgroundEvents', ['canvas', function(canvas) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.$watch(getCursor, function() {
                element.css('cursor', canvas.getCursor());
            }, true);

            function getCursor() {
            	return canvas.getCursor();
            }
        }
    };
}]);