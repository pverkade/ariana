angular.module('ariana').directive('autosize', function($window) {
    return function($scope, $elem) {
        
        $scope.initializeWindowSize = function() {
            // TODO handle HDPI
            // https://www.khronos.org/webgl/wiki/HandlingHighDPI
            
            /* HTML width (resolution) */
            //TODO also use $elem
            // jQuery width() and height() also set css sizes
            
            var canvas = document.getElementById("main-canvas");
            canvas.width = $window.innerWidth;
            canvas.height = $window.innerHeight;
            
            /* CSS width */
            $elem.context.style.width = $window.innerWidth + 'px';
            $elem.context.style.height = $window.innerHeight + 'px';
        };

        $scope.initializeWindowSize();
        
        return angular.element($window).bind('resize', function() {
            $scope.initializeWindowSize();
            return $scope.$apply();
        });
        
    };
});
