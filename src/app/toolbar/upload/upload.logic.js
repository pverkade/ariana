app.controller('UploadModalCtrl', ['$scope', '$rootScope', '$modalInstance', 'Upload', 
    function ($scope, $rootScope, $modalInstance, Upload) {
        $scope.previewImgs = [];

        $scope.close = function () {
            $modalInstance.dismiss();
        };
 
        $scope.upload = function () {
            $scope.previewImgs.forEach($rootScope.newLayerFromImage);
            $scope.close();
        };

        $scope.$watch('files', function () {
            $scope.files.forEach(function (file) {
                $scope.previewImgs.push(URL.createObjectURL(file));
            })
        })
    }
])