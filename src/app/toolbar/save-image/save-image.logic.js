/**
 * Created by zeta on 6/18/15.
 */

app.controller('SaveImageModalController', ['$scope', '$modalInstance', '$modal',  function($scope, $modalInstance, $modal) {
    $scope.format = "png";
    $scope.quality = 90;
    $scope.filename = "untitled";

    $scope.closeSaveImageModal = function () {
        $modalInstance.dismiss();
    };

    /* This functions saves the canvas to an image-file. */
    $scope.saveImage = function() {
        var toolFunctions = $scope.config.tools.activeToolFunctions;

        if (toolFunctions && toolFunctions.stop) {
            toolFunctions.stop();
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

        var formatInput = document.createElement("input") ;
        formatInput.setAttribute("name", 'format') ;
        formatInput.setAttribute("value", $scope.format);

        var myForm = document.createElement("form");
        myForm.method = 'post';
        myForm.action = url;
        myForm.appendChild(dataInput);
        myForm.appendChild(nameInput);

        document.body.appendChild(myForm) ;
        myForm.submit() ;
        document.body.removeChild(myForm) ;
    };
}]);
