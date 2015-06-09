app.controller('UploadModalCtrl', ['$scope', '$modalInstance', 'Upload', 
    function ($scope, $modalInstance, Upload) {
        $scope.imageUrls = [];

        $scope.close = function () {
            $modalInstance.dismiss();
        };
 
        $scope.upload = function () {
            $scope.imageUrls.forEach(function(url) {
                var image = new Image();
                image.src = url;
                image.onload = function() {
                    $scope.newLayerFromImage(image);
                };
            });

            $scope.close();
        };

        $scope.$watch('files', function () {
            if (!$scope.files)
            return;

            $scope.files.forEach(function (file) {
                $scope.imageUrls.push(URL.createObjectURL(file));
            })
        })
    }
])