angular.module('ariana').directive('crop', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'app/toolbox/directives/basic/crop/crop.tpl.html',
        controller: 'CropCtrl'
    };
});

angular.module('ariana').controller('CropCtrl', function($scope) {
	$scope.toolname = 'crop'
	$scope.active = ($scope.config.tools.activeTool == $scope.toolname);
	
});