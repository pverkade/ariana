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
        
        $scope.stopTool = function() {
            $scope.config.tools.activeTool = "pan";
            $scope.config.tools.activeToolset = null;
        }
        
        /* This function opens the newfile modal. */
        $scope.openNewFileModal = function() {
            $scope.stopTool();
            
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/newfile/newfile.tpl.html',
                controller:  'NewFileModalController',
                scope: $scope,
                size: 'sm'
            });
        };
        
        /* This function opens the upload modal. */
        $scope.openUploadModal = function() {
            $scope.stopTool();
            
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/upload/upload.tpl.html',
                controller:  'UploadModalController',
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.openSaveImageModal = function() {
            $scope.stopTool();
            
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
            $scope.stopTool();
            
            var modalInstance = $modal.open({
                templateUrl: 'app/toolbar/filters/filters.tpl.html',
                controller:  'FilterModalController',
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.cancelFilters = function() {
            $scope.filter.filterObject = null;
            $scope.filter.currentlayerOnly = false;

            for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
                var layer = $scope.renderEngine.getLayer(i);
                if (layer.getLayerType() === LayerType.ImageLayer) {
                    layer.discardFilter();
                }
            }
            window.requestAnimationFrame(function() {
                $scope.renderEngine.render();
            });
        };
        
        $scope.allLayers = true;

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

            window.requestAnimationFrame(function() {
                $scope.renderEngine.render();
            });
        };

        $scope.commitFilterOnLayers = function () {
            for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
                var layer = $scope.renderEngine.getLayer(i);
                if (layer.getLayerType() === LayerType.ImageLayer) {
                    layer.commitFilter();
                }
            }

            window.requestAnimationFrame(function() {
                $scope.renderEngine.render();
            });
        };
        
        $scope.applyFilterOnLayers = function() {
            var filter = $scope.filter.filterObject;

            if ($scope.config.layers.numberOfLayers == 0 || !filter) {
                $scope.cancelFilters();
                return;
            }

            for (var i = 0; i < $scope.config.layers.numberOfLayers; i++) {
                var layer = $scope.renderEngine.getLayer(i);
                if (layer.getLayerType() !== LayerType.ImageLayer || layer.isHidden()) {
                    continue;
                }

                if (i === $scope.config.layers.currentLayer || !$scope.filter.currentlayerOnly) {
                    layer.applyFilter(filter);
                }
                else {
                    layer.discardFilter();
                }
            }

            window.requestAnimationFrame(function () {
                $scope.renderEngine.render();
            });

        };

        $scope.$on("newCurrentLayer", function() {
            $scope.applyFilterOnLayers();
        });
        
        $scope.applySelection = function() {
            // cut out selection from texture -> move to new layer
            // throw away selection bitmask
            $scope.drawEngine.clearCanvases();
            var newLayer = $scope.renderEngine.createSelectionImageLayer($scope.imgData, 0);
            $scope.addLayer(newLayer);
            $scope.maskEnabled = false;
            console.log("DONE!");
        }
        
        $scope.cancelSelection = function() {
            $scope.maskEnabled = false;

            var currentLayer = $scope.config.layers.currentLayer;
            var layer = $scope.renderEngine.layers[currentLayer];

            $scope.drawEngine.clearCanvases();
            $scope.editEngine.removeSelectionLayer();

            var nrWands = $scope.selectionTool.getNrWands();
            console.log("in cancel selection");
            console.log(nrWands);

            for (var i = 0; i < nrWands; i++) {
                console.log(i);
                if (i==1) {
                    console.log("i is 1");
                }
                var bitmask = $scope.selectionTool.maskWandParts[nrWands - i - 1];

                for (var y = 0; y < $scope.selectionTool.height; y++) {
                    for (var x = 0; x < $scope.selectionTool.width; x++) {
                        if (bitmask[y * $scope.selectionTool.width + x]) {
                            var j = ($scope.selectionTool.height - y) * $scope.selectionTool.width + x;
                            $scope.imgData.data[4 * j] = 0;
                            $scope.imgData.data[4 * j + 1] = 0;
                            $scope.imgData.data[4 * j + 2] = 0;
                            $scope.imgData.data[4 * j + 3] = 255;
                        }
                    }
                }

                var removed = $scope.selectionTool.clearLast();
                console.log("waarde removed");
                console.log(removed);
                if (removed == false) {
                    console.log("Selection tool clear Last returned false");
                }                
            }
            
            // $scope.startSharedSelection(layer.getWidth(), layer.getHeight());
            // $scope.selectionTool.setMaskWand($scope.maskWand);
            // $scope.selectionTool.setMaskBorder($scope.maskBorder);
            // throw away selection bitmask
            console.log("DENIED!");
        }
    }
]);
