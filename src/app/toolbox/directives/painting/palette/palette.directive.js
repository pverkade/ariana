angular.module('ariana').directive('palette', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/painting/palette/palette.tpl.html',
        controller: 'PaletteCtrl'
    };
});

angular.module('ariana').controller('PaletteCtrl', function($scope) {
	$scope.toolname = 'palette'
	$scope.active = $scope.config.tools.activeTool == $scope.toolname;
});