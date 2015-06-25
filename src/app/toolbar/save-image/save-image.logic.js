/**
 * Created by zeta on 6/18/15.
 */

app.controller('SaveImageModalController', ['$scope', '$modalInstance', '$modal', 'tools',
    function($scope, $modalInstance, $modal, tools) {

        $scope.format = "png";
        $scope.quality = 90;
        $scope.filename = "untitled";

        $scope.closeSaveImageModal = function () {
            $modalInstance.dismiss();
        };

        /* This functions saves the canvas to an image-file. */
        $scope.saveImage = function() {
            var toolFunctions = tools.getToolFunctions();

            if (toolFunctions && toolFunctions.stop) {
                toolFunctions.stop();
            }
            
            if (!$scope.filename){
                return;
            }

            /* Receive image data in base64 encoding. */
            var image = $scope.renderEngine.renderToImg();
            var data = image.substr(image.indexOf(',') + 1).toString();
            var url = "/save-image";

            var dataInput = document.createElement("input") ;
            dataInput.setAttribute("name", 'image-data') ;
            dataInput.setAttribute("value", data);
            dataInput.setAttribute("type", "hidden");

            var nameInput = document.createElement("input") ;
            nameInput.setAttribute("name", 'filename') ;
            nameInput.setAttribute("value", $scope.filename);
            nameInput.setAttribute("type", "hidden");

            var formatInput = document.createElement("input") ;
            formatInput.setAttribute("name", 'format') ;
            formatInput.setAttribute("value", $scope.format);
            nameInput.setAttribute("type", "hidden");

            // quality of zero result in quality of 100
            if ($scope.quality === 0) {
                $scope.quality = 1;
            }

            var qualityInput = document.createElement("input");
            qualityInput.setAttribute("name", "quality");
            qualityInput.setAttribute("value", $scope.quality);
            qualityInput.setAttribute("type", "hidden");

        document.body.appendChild(myForm);
        myForm.submit();
        document.body.removeChild(myForm);
        
        $scope.closeSaveImageModal();
    };

    $scope.checkValid = function() {
        return !/\w/.test($scope.filename);
    }
}]);
