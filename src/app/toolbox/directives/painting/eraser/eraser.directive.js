angular.module('ariana').directive('eraser', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/eraser/eraser.tpl.html',
        controller: 'EraserCtrl'
    };
});

angular.module('ariana').controller('EraserCtrl', function($scope) {
	$scope.toolname = 'eraser';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});