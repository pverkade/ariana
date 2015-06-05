app.controller('UploadModalCtrl', ['$scope', '$modalInstance', 
    function ($scope, $modalInstance) {
        console.log('in UploadModalCtrl');

        $scope.close = function () {
            $modalInstance.dismiss();
        };
    }
])