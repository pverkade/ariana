/* 
 * Project Ariana
 * newfile.logic.js
 * 
 * This file contains the NewFileModalController, which controls the creation of a new screen
 * modal.
 *
 */
 
app.controller('NewFileModalController', ['$scope', '$modalInstance', '$modal',  
    function ($scope, $modalInstance, $modal) {

        $scope.inputWidth = 800;
        $scope.inputHeight = 600;

        $scope.closeNewFileModal = function () {
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

        $scope.openNoticeModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/newfile/notice.tpl.html',
                controller:  'NewFileNoticeModalController',
                scope: $scope,
                size: 'sm'
            });
        };
 
        $scope.create = function () {
            if ($scope.config.canvas.width > 0) {
                $scope.openNoticeModal();
            }
            else {
                $scope.resizeCanvases($scope.inputWidth, $scope.inputHeight);
                $scope.closeNewFileModal();
            }
        };
    }
]);