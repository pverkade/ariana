angular.module('ariana').directive('fill', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/fill/fill.tpl.html',
        controller: 'FillCtrl'
    };
});

angular.module('ariana').controller('FillCtrl', function($scope) {
	$scope.toolname = 'fill';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});