/* 
 * Project Ariana
 * upload.logic.js
 * 
 * This file contains the UploadModalController, which controls the file import
 * modal.
 *
 */
 
app.controller('NewCanvasModalController', ['$scope', '$modalInstance',  
    function ($scope, $modalInstance) {

        $scope.close = function () {
            $modalInstance.dismiss();
        };
 
        /*$scope.upload = function () {
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
        })*/
    }
]);