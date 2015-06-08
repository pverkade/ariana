angular.module('ariana').directive('rendertarget', function() {
    return function($scope, $element) {
        $scope.rendertarget = $element;
    }
});