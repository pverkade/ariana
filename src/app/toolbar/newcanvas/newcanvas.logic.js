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

        $scope.inputWidth = 800;
        $scope.inputHeight = 600;

        $scope.close = function () {
            $modalInstance.dismiss();
        };

        //TODO: check if the value is accepted (if not, change to number..)
        $scope.$watch('inputWidth', function (newValue, oldValue) {
            if (newValue.length === 0) return;
            if (isNaN(newValue)) {
                $scope.inputWidth = oldValue;
                return;
            }

            if (newValue < 1) {
                $scope.inputWidth = oldValue;
                return;
            }

            if (newValue % 1 !== 0) {
                $scope.inputWidth = newValue - (newValue % 1);
            }
        });

        //TODO: check if the value is accepted (if not, change to number..)
        $scope.$watch('inputHeight', function (newValue, oldValue) {
            if (newValue.length === 0) return;
            if (isNaN(newValue)) {
                $scope.inputHeight = oldValue;
                return;
            }

            if (newValue < 1) {
                $scope.inputHeight = oldValue;
                return;
            }

            if (newValue % 1 !== 0) {
                $scope.inputHeight = newValue - (newValue % 1);
            }
        });
 
        $scope.create = function () {
            console.log("Create canvas ("+ $scope.inputWidth + ", " + $scope.inputHeight + ")");

            $scope.close();
        };
    }
]);