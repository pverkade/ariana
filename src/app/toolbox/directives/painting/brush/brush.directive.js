angular.module('ariana').directive('brush', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/brush/brush.tpl.html',
        controller: 'BrushCtrl'
    };
});

angular.module('ariana').controller('BrushCtrl', function($scope) {
	$scope.toolname = 'brush';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});