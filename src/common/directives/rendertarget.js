app.directive('rendertarget', function() {
    return function($scope, $element) {
        $scope.rendertarget = $element;
    }
});