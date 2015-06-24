/* 
 * Project Ariana
 * newfile.logic.js
 * 
 * This file contains the NewFileModalController, which controls the creation of a new screen
 * modal.
 *
 */
 
app.controller('NewFileModalController', ['$scope', '$modalInstance', '$modal', 'canvas',
    function ($scope, $modalInstance, $modal, canvas) {

        $scope.inputWidth = 800;
        $scope.inputHeight = 600;

        $scope.closeNewFileModal = function () {
            $modalInstance.dismiss();
        };

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
            if (canvas.getVisibility()) {
                $scope.openNoticeModal();
            }
            else {
                $scope.resizeCanvases($scope.inputWidth, $scope.inputHeight);
                $scope.closeNewFileModal();
            }
        };
    }
]);