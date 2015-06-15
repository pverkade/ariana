app.directive('autosize', function($window) {
    return function($scope, $elem) {
        $scope.initializeWindowSize = function() {
            $elem.css("width",  $(window).outerWidth());
            $elem.css("height", $(window).outerHeight());
        };

        $scope.initializeWindowSize();
        
        return angular.element($window).bind('resize', function() {
            $scope.initializeWindowSize();
            return $scope.$apply();
        });
        
    };
});