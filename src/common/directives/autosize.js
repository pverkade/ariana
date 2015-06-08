angular.module('ariana').directive('autosize', function($window) {
    return function($scope, $elem) {
        $scope.initializeWindowSize = function() {
            var aspectRatio = 1280./720.;
            var width, height;
            if ($window.innerWidth > aspectRatio * $window.innerHeight) {
                width = $window.innerHeight * aspectRatio;
                height = $window.innerHeight;
            } else {
                width = $window.innerWidth;
                height = $window.innerWidth / aspectRatio;
            }
            width = Math.round(width);
            height = Math.round(height);

            $scope.renderEngine.resize(width, height);
            $scope.renderEngine.render();
        };

        $scope.initializeWindowSize();
        
        return angular.element($window).bind('resize', function() {
            $scope.initializeWindowSize();
            return $scope.$apply();
        });
        
    };
});
