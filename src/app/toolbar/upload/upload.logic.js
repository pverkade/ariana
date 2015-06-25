/* 
 * Project Ariana
 * upload.logic.js
 * 
 * This file contains the UploadModalController, which controls the file import
 * modal.
 *
 */
 
app.controller('UploadModalController', ['$scope', '$modalInstance', 'Upload', 'canvas',
    function ($scope, $modalInstance, Upload, canvas) {
        $scope.imageUrls = [];

        $scope.close = function () {
            $modalInstance.dismiss();
        };
 
        $scope.upload = function () {

            if (!canvas.getVisibility()) {
                var image = new Image();
                image.onload = function() {
                    $scope.resizeCanvases(image.width, image.height);
                    //FIXME: canvas goes out of screen if the image is too big.
                };
                image.src = $scope.imageUrls[0];
            }

            $scope.imageUrls.forEach(function(url) {
                var image = new Image();
                image.onload = function() {
                    $scope.newLayerFromImage(image);

                    window.setTimeout(function() {$scope.renderEngine.render();}, 500);
                };
                image.src = url;
            });

            $scope.close();
        };

        $scope.$watch('files', function () {
            if (!$scope.files) {return;}

            $scope.files.forEach(function (file) {
                $scope.imageUrls.push(URL.createObjectURL(file));
            });
        });
    }
]);