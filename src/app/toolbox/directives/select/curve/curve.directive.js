angular.module('ariana').directive('curve', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/curve/curve.tpl.html',
        controller: 'CurveCtrl'
    };
});

angular.module('ariana').controller('CurveCtrl', function($scope) {
	$scope.toolname = 'curve';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});