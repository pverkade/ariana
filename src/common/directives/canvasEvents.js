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
        link: function(scope, element) {
            
            /* Watches canvas zoom changes  */
            scope.$watch(canvas.getZoom(), function() {
                var cw = canvas.getWidth(),
                    ch = canvas.getHeight();

                element.css('width', cw * canvas.getZoom() + "px");
                element.css('height', ch * canvas.getZoom() + "px");
                
            }, true);

            /* Watches canvas coordinate changes  */
            scope.$watchGroup([getX, getY], function() {
                element.css('-ms-transform', "translate(" + canvas.getX() +
                    "px, " + canvas.getY() + "px)");
                element.css('-webkit-transform', "translate(" + canvas.getX() +
                    "px, " + canvas.getY() + "px)");
                element.css('transform', "translate(" + canvas.getX() + 
                                         "px, " + canvas.getY() + "px)");
            }, true);

            /* Watches canvas coordiante changes  */
            scope.$watchGroup([getWidth, getHeight], function() {
                element.css('width', canvas.getWidth() * canvas.getZoom() + "px");
                element.css('height', canvas.getHeight() * canvas.getZoom() + "px");
            }, true);
            
            function getX() {
                return canvas.getX();
            }
            
            function getY() {
                return canvas.getY();
            }
            
            function getWidth() {
                return canvas.getWidth();
            }
            
            function getHeight() {
                return canvas.getHeight();
            }
        }
    };
}]);