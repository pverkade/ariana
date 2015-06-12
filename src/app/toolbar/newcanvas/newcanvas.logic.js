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

        //TODO: check if the value is accepted (if not, change to number..)
        $scope.$watch('inputWidth', function () {
            if (!$scope.inputWidth)
            return;

            console.log('Width: ' + $scope.inputWidth);

            if ($scope.inputWidth < 1) $scope.inputWidth = 1;
        });

        //TODO: check if the value is accepted (if not, change to number..)
        $scope.$watch('inputHeight', function () {
            if (!$scope.inputHeight)
            return;

            console.log('Height: ' + $scope.inputHeight);

            if ($scope.inputHeight < 1) $scope.inputHeight = 1;
        });
 
        $scope.create = function () {
            console.log("Create canvas ("+ $scope.inputWidth + ", " + $scope.inputHeight + ")");

            $scope.close();
        };
    }
]);