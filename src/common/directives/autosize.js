angular.module('ariana').directive('autosize', function($window) {
    return function($scope, $elem) {
        
        $scope.initializeWindowSize = function() {
            /* Element width */
            $elem.width = $window.innerWidth;
            $elem.height = $window.innerHeight;
            
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
