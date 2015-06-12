angular.module('ariana').directive('Elipse', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/Elipse/Elipse.tpl.html',
        controller: 'ElipseCtrl'
    };
});

angular.module('ariana').controller('ElipseCtrl', function($scope) {
	$scope.toolname = 'elipse';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});