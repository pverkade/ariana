app.directive('canvasEvents', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            /* Watches canvas zoom changes  */
            scope.$watch('config.canvas.zoom', function(nval, oval) {
                var cw = parseInt(element.attr('width')),
                    ch = parseInt(element.attr('height'));

                element.css('width', cw * scope.config.canvas.zoom + "px");
                element.css('height', ch * scope.config.canvas.zoom + "px");
                
            }, true);

            /* Watches canvas coordiante changes  */
            scope.$watchGroup(['config.canvas.x', 'config.canvas.y'], function(nval, oval) {
                element.css('transform', "translate(" + scope.config.canvas.x + 
                                         "px, " + scope.config.canvas.y + "px)");
            }, true);
        }
    }
});