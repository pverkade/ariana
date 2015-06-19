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
        };
        
        /* This function opens the newfile modal. */
        $scope.openNewFileModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/newfile/newfile.tpl.html',
                controller:  'NewFileModalController',
                scope: $scope,
                size: 'sm'
            });
        };
        
        /* This function opens the upload modal. */
        $scope.openUploadModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/upload/upload.tpl.html',
                controller:  'UploadModalController',
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

        $scope.openSaveImageModal = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/save-image/save-image.tpl.html',
                controller: 'SaveImageModalController',
                scope: $scope
            })
        };
        
        $scope.filter = {
            filterName: "",
            filterObject: null,
            filterParameters: null,
            currentlayerOnly: false
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
            
            if ($scope.config.layers.numberOfLayers == 0) {
                $scope.cancel();
                return;
            }
            
            var filter = $scope.filter.filterObject;
            
            /* Set all filter parameters into the filter object. */
            for (var key in $scope.filter.filterParameters) {
                var value = $scope.filter.filterParameters[key].value;
                filter.setAttribute(key, value);
            }
            
            if (filter) {
                if ($scope.filter.currentlayerOnly) {
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
    }
]);
