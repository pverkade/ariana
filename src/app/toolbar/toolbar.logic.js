/* 
 * Project Ariana
 * toolbar.logic.js
 * 
 * This file contains the ToolbarController, which controls the toolbar.
 *
 */
 
app.controller('ToolbarCtrl', ['$scope', '$modal', 'mouse', 'tools', 'layers',
    function ($scope, $modal, mouse, tools, layers) {
      
        $scope.checkVisible = function() {
            return !mouse.checkActive();
        };
        
        $scope.stopTool = function() {
            tools.setTool("pan");
            tools.setToolset(null);
        };
        
        /* This function opens the newfile modal. */
        $scope.openNewFileModal = function() {
            $scope.stopTool();
            
            $modal.open({
                templateUrl: 'app/toolbar/newfile/newfile.tpl.html',
                controller:  'NewFileModalController',
                scope: $scope,
                size: 'sm'
            });
        };
        
        /* This function opens the upload modal. */
        $scope.openUploadModal = function() {
            $scope.stopTool();
            
            $modal.open({
                templateUrl: 'app/toolbar/upload/upload.tpl.html',
                controller:  'UploadModalController',
                scope: $scope,
                size: 'lg'
            });
        };

        /* This function opens the save image modal. */
        $scope.openSaveImageModal = function() {
            $scope.stopTool();
            
            $modal.open({
                templateUrl: 'app/toolbar/save-image/save-image.tpl.html',
                controller: 'SaveImageModalController',
                scope: $scope
            });
        };
        
        /* This object contains the currently selected filter. */
        $scope.filter = {
            filterName: "",
            filterObject: null,
            filterParameters: null,
            currentlayerOnly: false
        };
    
        /* This function opens the filters modal. */
        $scope.openFilterModal = function() {
            $scope.stopTool();
            
            $modal.open({
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

        $scope.cancelFilter = function() {
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

            forEachLayer(function(layer, index) {
                $scope.updateThumbnail(index);
            });

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

            if (layers.getNumLayers() === 0 || !filter) {
                return;
            }

            forEachLayer(function(layer, index) {
                if (layer.getLayerType() !== LayerType.ImageLayer || layer.isHidden()) {
                    return;
                }

                if (index === layers.getCurrentIndex() || !$scope.filter.currentlayerOnly) {
                    layer.applyFilter(filter);
                }
                else {
                    layer.discardFilter();
                }
                $scope.updateThumbnail(index);
            });

            $scope.requestRenderEngineUpdate();
        };

        $scope.$on("newCurrentLayer", function() {
            $scope.applyFilterOnLayers();
        });
        
        $scope.applySelection = function() {
            /* Cut out selection from texture and move to new layer. */
            var newLayer = $scope.renderEngine.createSelectionImageLayer($scope.imgData, 0);
            $scope.addLayer(newLayer);
            $scope.cancelSelection();
        };
        
        $scope.cancelSelection = function() {
            $scope.maskEnabled = false;

            $scope.drawEngine.clearCanvases();
            $scope.editEngine.removeSelectionLayer();

            /* Iterate over all mask wand parsts and remove. */
            var nrWands = $scope.selectionTool.getNrWands();
            for (var i = 0; i < nrWands; i++) {
                var removed = $scope.selectionTool.clearLast();
                if (removed === false) {
                    console.log("Selection tool clear Last returned false");
                }                
            }

            /* Draw shared mask variables to image. */
            if ($scope.maskWand) {
                $scope.setMaskSelectedArea($scope.selectionTool.width, $scope.selectionTool.height);    
                var currentLayer = layers.getCurrentIndex();
                var layer = $scope.renderEngine.getLayer(currentLayer);
                $scope.editEngine.setSelectionLayer($scope.marchingAnts, layer);
                $scope.requestEditEngineUpdate();       
            }
        };
        
        $scope.isSelectionEnabled = function() {
            var tool = tools.getTool();
            return (tool == "magic" || tool == "loose" || tool == "rectangle");
        };
    }
]);
