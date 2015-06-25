app.directive('canvasEvents', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            /* Watches canvas zoom changes  */
            scope.$watch('config.canvas.zoom', function(nval, oval) {
                var cw = scope.config.canvas.width,
                    ch = scope.config.canvas.height;

                element.css('width', cw * scope.config.canvas.zoom + "px");
                element.css('height', ch * scope.config.canvas.zoom + "px");
                
            }, true);

            /* Watches canvas visibility changes  */
            scope.$watch('config.canvas.visible', function(nval, oval) {
                element.removeClass("ng-hide");
                element.css('display', nval ? "block" : "none");
            }, true);

            /* Watches canvas coordinate changes  */
            scope.$watchGroup(['config.canvas.x', 'config.canvas.y'], function(nval, oval) {
                element.css('-ms-transform', "translate(" + scope.config.canvas.x +
                    "px, " + scope.config.canvas.y + "px)");
                element.css('-webkit-transform', "translate(" + scope.config.canvas.x +
                    "px, " + scope.config.canvas.y + "px)");
                element.css('transform', "translate(" + scope.config.canvas.x +
                    "px, " + scope.config.canvas.y + "px)");
            }, true);

            /* Watches canvas coordiante changes  */
            scope.$watchGroup(['config.canvas.width', 'config.canvas.height'], function(nval, oval) {
                element.css('width', scope.config.canvas.width * scope.config.canvas.zoom + "px");
                element.css('height', scope.config.canvas.height * scope.config.canvas.zoom + "px");
            }, true);
        }
    }
});