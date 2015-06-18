app.directive('backgroundEvents', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch('config.canvas.cursor', function(nval, oval) {
                element.css('cursor', scope.config.canvas.cursor);
            }, true);
        }
    }
});