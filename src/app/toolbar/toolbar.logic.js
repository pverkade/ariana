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

        function forEachLayer(f) {
            for (var i = 0; i < $scope.renderEngine.getNumberOfLayers(); i ++) {
                f($scope.renderEngine.getLayer(i), i);
            }
        }

        $scope.cancel = function() {
            $scope.filter.filterObject = null;
            $scope.filter.currentlayerOnly = false;

            forEachLayer(function(layer) {
                if (layer.getLayerType() === LayerType.ImageLayer) {
                    layer.discardFilter();
                }
            });

            $scope.requestRenderEngineUpdate();
        };

        /* Set all filter parameters into the filter object. */
        $scope.applyFilterChanges = function () {
            var filter = $scope.filter.filterObject;
            if (!filter) {
                return;
            }

            for (var key in $scope.filter.filterParameters) {
                var value = $scope.filter.filterParameters[key].value;
                filter.setAttribute(key, value);
            }

            $scope.requestRenderEngineUpdate();
        };

        $scope.commitFilterOnLayers = function () {
            forEachLayer(function(layer, index) {
                if (layer.getLayerType() === LayerType.ImageLayer) {
                    layer.commitFilter();
                    $scope.updateThumbnail(index);
                }
            });

            $scope.requestRenderEngineUpdate();
        };
        
        $scope.applyFilterOnLayers = function() {
            var filter = $scope.filter.filterObject;

            if ($scope.config.layers.numberOfLayers == 0 || !filter) {
                $scope.cancel();
                return;
            }

            forEachLayer(function(layer, index) {
                if (layer.getLayerType() !== LayerType.ImageLayer || layer.isHidden()) {
                    return;
                }

                if (index === $scope.config.layers.currentLayer || !$scope.filter.currentlayerOnly) {
                    layer.applyFilter(filter);
                }
                else {
                    layer.discardFilter();
                }
            });

            $scope.requestRenderEngineUpdate();
        };

        $scope.$on("newCurrentLayer", function() {
            $scope.applyFilterOnLayers();
        });
    }
]);
