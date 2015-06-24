/*
 * Project Ariana
 * canvasEvents.js
 *
 * This file contains an Angular directive for catching mouse input on the 
 * canvas. 
 *
 */
 
app.directive('canvasEvents', ['canvas', function(canvas) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            /* Watches canvas zoom changes  */
            scope.$watch(canvas.getZoom(), function(nval, oval) {
                var cw = canvas.getWidth(),
                    ch = canvas.getHeight();

                element.css('width', cw * canvas.getZoom() + "px");
                element.css('height', ch * canvas.getZoom() + "px");
                
            }, true);

            /* Watches canvas coordinate changes  */
            scope.$watchGroup([canvas.getX(), canvas.getY()], function(nval, oval) {
                element.css('transform', "translate(" + canvas.getX() + 
                                         "px, " + canvas.getY() + "px)");
            }, true);

            /* Watches canvas coordiante changes  */
            scope.$watchGroup([canvas.getWidth(), canvas.getHeight()], function(nval, oval) {
                element.css('width', canvas.getWidth() * canvas.getZoom() + "px");
                element.css('height', canvas.getHeight() * canvas.getZoom() + "px");
            }, true);
        }
    }
}]);