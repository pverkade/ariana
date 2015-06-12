angular.module('ariana').directive('magic', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/select/magic/magic.tpl.html',
        controller: 'MagicCtrl'
    };
});

angular.module('ariana').controller('MagicCtrl', function($scope) {
	$scope.toolname = 'magic';
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});