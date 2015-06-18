/* 
 * Project Ariana
 * notice.logic.js
 * 
 * This file contains the NewFileNoticeModalController, which shows an alert if a new file is
 *   created while current work is not yet saved.
 *
 */
 
app.controller('NewFileNoticeModalController', ['$scope', '$modalInstance',  
    function ($scope, $modalInstance) {

        $scope.close = function () {
            $modalInstance.dismiss();
        };
 
        $scope.submit = function () {
            $scope.resizeCanvases($scope.inputWidth, $scope.inputHeight);
            $scope.close();
            $scope.closeNewFileModal();
        };
    }
]);