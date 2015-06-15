app.controller('MenuContentCtrl', function($scope, $state) {
    $scope.tabs = [{
        title: 'Project 1',
    }];

    $scope.changeTab = function() {
        $state.go('index');
    }

    $scope.toSettings = function() {
        $state.go('settings', [], {location: false});
    }
});