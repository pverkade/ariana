angular.module('ariana').directive('rectangle', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/rectangle/rectangle.tpl.html',
        controller: 'RectangleCtrl'
    };
});

angular.module('ariana').controller('RectangleCtrl', function($scope) {
	$scope.toolname = 'rectangle';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});