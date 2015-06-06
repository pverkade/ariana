app.controller('UploadModalCtrl', ['$scope', '$modalInstance', 'Upload',
    function ($scope, $modalInstance, Upload) {
        $scope.close = function () {
            $modalInstance.dismiss();
        };
 
        $scope.upload = function () {
            $scope.files.forEach(function (file) {
                console.log(file);
            })
            $scope.close();
        };
    }
])