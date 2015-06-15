app.directive('ngMouseWheelDown', function() {
    return function(scope, element, attrs) {
        element.bind("DOMMouseScroll mousewheel onmousewheel", function(event) {

            // cross-browser wheel delta
            var event = window.event || event; // old IE support
            
            wheelDelta = event.wheelDelta;
            detail    = event.detail;

            if (isNaN(wheelDelta) || isNaN(detail)) {
                wheelDelta = event.originalEvent.wheelDelta;
                detail     = event.originalEvent.detail;
            }

            var delta = Math.max(-1, Math.min(1, (wheelDelta || -detail)));

            if (delta < 0) { 
                scope.$apply(function() {
                    scope.$eval(attrs.ngMouseWheelDown);
                });

                // for IE
                event.returnValue = false;
                // for Chrome and Firefox
                if (event.preventDefault) {
                    event.preventDefault();
                }
            }
            
            scope.$apply(function() {
				event.preventDefault();
				fn(scope, {
					$event: event
				});
			});
        });
    };
});