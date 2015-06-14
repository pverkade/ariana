/* 
 * Project Ariana
 * toolbar.logic.js
 * 
 * This file contains the ToolbarController, which controls the toolbar.
 *
 */
 
/* The ToolbarController contains the behaviour of the toolbar. */
app.controller('ToolbarController', ['$scope', '$modal',
    function ($scope, $modal) {
      
        /* This functions returns whether the toolbox should be visible. It is 
         * hidden when the user is clicking on the canvas/background. */
        $scope.checkVisible = function() {
            return (!($scope.config.mouse.button[1] || $scope.config.mouse.button[2] || $scope.config.mouse.button[3]));
        }
      
      
        /* This functions saves the canvas to an image-file. */
        $scope.saveImage = function() {
            /* Receive image data in base64 encoding. */
            var image = $scope.renderEngine.renderToImg();
            var data = image.substr(image.indexOf(',') + 1).toString();
            var url = "/save-image";

            var dataInput = document.createElement("input") ;
            dataInput.setAttribute("name", 'image-data') ;
            dataInput.setAttribute("value", data);
            dataInput.setAttribute("type", "hidden");

            var nameInput = document.createElement("input") ;
            nameInput.setAttribute("name", 'image-name') ;
            nameInput.setAttribute("value", "hello_world" + '.png');

            var myForm = document.createElement("form");
            myForm.method = 'post';
            myForm.action = url;
            myForm.appendChild(dataInput);
            myForm.appendChild(nameInput);

            document.body.appendChild(myForm) ;
            myForm.submit() ;
            document.body.removeChild(myForm) ;
        };
        
        /* This function opens the upload modal. */
        $scope.openUploadModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/upload/upload.tpl.html',
                controller:  'UploadModalCtrl',
                scope: $scope,
                size: 'lg'
            });
        };
        
        /* This function opens the transformation modal. */
        $scope.openTransformationModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/transformations/transformations.tpl.html',
                controller:  'TransformationModalController',
                scope: $scope,
                size: 'lg'
            });
        };
        
        $scope.filter = {
            filterName: "",
            filterObject: null,
            filterParameters: null,
            currentlayerOnly: false,
        };
    
        /* This function opens the filters modal. */
        $scope.openFilterModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/filters/filters.tpl.html',
                controller:  'FilterModalController',
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.cancel = function() {
            $scope.filter.filterObject = null;
            $scope.filter.currentlayerOnly = false;
        };
        
        $scope.allLayers = true;
        
        $scope.apply = function() {
            var filter = $scope.filter.filterObject;
            
            /* Set all filter parameters into the filter object. */
            for (var key in $scope.filter.filterParameters) {
                var value = $scope.filter.filterParameters[key].value;
                filter.setAttribute(key, value);
            }
            
            if (filter) {
                if (filter.currentlayerOnly) {
                    $scope.renderEngine.filterLayers([$scope.config.layers.currentLayer], filter);
                }
                else {
                    var list = [];
                    for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) list.push(i);
                    $scope.renderEngine.filterLayers(list, filter);
                }   
                
                /* Show the result. */
                $scope.renderEngine.render();
            } 
            
            $scope.cancel();
        };
        
        $scope.titlecase = function(string) {
            return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };

    }
]);
