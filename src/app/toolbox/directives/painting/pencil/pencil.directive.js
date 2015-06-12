angular.module('ariana').directive('pencil', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/pencil/pencil.tpl.html',
        controller: 'PencilCtrl'
    };
});

angular.module('ariana').controller('PencilCtrl', function($scope) {
	$scope.toolname = 'pencil';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});