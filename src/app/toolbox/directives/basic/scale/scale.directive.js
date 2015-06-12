angular.module('ariana').directive('scale', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/basic/scale/scale.tpl.html',
        controller: 'ScaleCtrl'
    };
});

angular.module('ariana').controller('ScaleCtrl', function($scope) {
	$scope.toolname = 'scale';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});