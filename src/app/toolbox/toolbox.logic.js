/*
 * Project Ariana
 * toolbox.logic.js
 *
 * This file contains the ToolboxController, which controls the behaviour of
 * the toolbox and the color preview. 
 *
 */

/* This contoller defines the behaviour of the toolbox and the color-preview. */
angular.module('ariana').controller('ToolboxController', function($scope) {
    
    $scope.setCursor = function(cursor) {
        $scope.config.canvas.cursor = cursor;
    };

    /* This function swaps the primary and secondary color. */
    $scope.swapColors = function() {
        var temp = $scope.config.tools.colors.primary;
        $scope.config.tools.colors.primary = $scope.config.tools.colors.secondary;
        $scope.config.tools.colors.secondary = temp;
    };
    
    /* 
     * This functions returns whether the toolbox should be visible. It is 
     * hidden when the user is clicking on the canvas/background.
     */
    $scope.checkVisible = function() {
        return (!($scope.config.mouse.button[1] || $scope.config.mouse.button[2] || $scope.config.mouse.button[3]));
    }

    /* 
     * Returns whether this tool is active
     */
    $scope.isActive = function(name) {
        return $scope.config.tools.activeTool == name;
    }

    /* 
     * Returns whether this tool is active
     */
    $scope.isActiveToolset = function(name) {
        return $scope.config.tools.activeToolset == name;
    }

    /* 
     * This function selects a toolset and therefore opens a toolbox. When
     * a toolset is already elected, it becomes unselected. The pan tool will
     * then be used.
     */
    $scope.selectToolSet = function(name) {
        if ($scope.config.tools.activeToolset == name) {
            $scope.config.tools.activeToolset = null;
            return true;
        }

        $scope.config.tools.activeToolset = name;
    };

    $scope.selectTool = function(event, name) {
        if (event) event.stopPropagation();
        
        $scope.config.tools.activeTool = name;
        return true;
    }
    
    /* This function selects a certain tool. */
    // $scope.selectTool = function(event, tool) {
    //     if (event) event.stopPropagation();

    //     $scope.config.tools.activeTool = tool;
        
    //     /* Find the required tool-functions in the toolbox object. The 
    //      * currrently selected toolset is used. */
    //     var toolset = $scope.config.tools.activeToolset;
    //     if (toolset) toolFunctions = $scope.toolbox[toolset].tools[tool].toolFunctions;
    //     else toolFunctions = $scope.toolbox.basic.tools[tool].toolFunctions;
        
    //     if (toolFunctions) {
    //         $scope.config.tools.activeToolFunctions = toolFunctions;
    //         toolFunctions.start();
    //     }
    //     else {
    //         $scope.config.tools.activeToolFunctions = null;
    //         /* Reset the background cursor. */
    //         $("#background").css("cursor", "default");
    //     }
    // };

    /* 
     * This object contains all the tools that are present in the toolbox. 
     * It also contains the name of the icon and the required functions.
     */
    // $scope.toolbox = {
    //     basic: {
    //         image: 'mdi-arrow-all',
    //         tools: {
    //             pan: {
    //                 image: 'mdi-cursor-pointer',
    //                 toolFunctions: panTool,
    //                 settings: false
    //             },
    //             translate: {
    //                 image: 'mdi-arrow-all',
    //                 toolFunctions: translateTool,
    //                 settings: false
    //             },
    //             scale: {
    //                 image: 'mdi-arrow-expand',
    //                 settings: false
    //             },
    //             rotate: {
    //                 image: 'mdi-rotate-left',
    //                 toolFunctions: rotateTool,
    //                 settings: false
    //             },
    //             crop: {
    //                 image: 'mdi-crop',
    //                 settings: false
    //             }
    //         }
    //     },
    //     painting: {
    //         image: 'mdi-brush',
    //         tools: {
    //             palette: {
    //                 image: 'mdi-palette',
    //                 settings: false
    //             },
    //             pencil: {
    //                 image: 'mdi-pen',
    //                 settings: false
    //             },
    //             brush: {
    //                 image: 'mdi-brush',
    //                 settings: false
    //             },
    //             eraser: {
    //                 image: 'mdi-eraser',
    //                 settings: false
    //             },
    //             picker: {
    //                 image: 'mdi-eyedropper',
    //                 toolFunctions: colorPicker,
    //                 settings: false
    //             },
    //             fill: {
    //                 image: 'mdi-format-color-fill',
    //                 settings: false
    //             }
    //         }
    //     },
    //     select: {
    //         image: 'mdi-select',
    //         tools: {
    //             rectangle: {
    //                 image: 'mdi-select',
    //                 settings: false
    //             },
    //             elipse: {
    //                 image: 'mdi-checkbox-blank-circle-outline',
    //                 settings: false
    //             },
    //             curve: {
    //                 image: 'mdi-vector-curve',
    //                 settings: false
    //             },
    //             magic: {
    //                 image: 'mdi-auto-fix',
    //                 settings: '<div ui-slider="slider.options" ng-model="values">test</div>'
    //             }
    //         }
    //     },
    //     text: {
    //         image: 'mdi-format-size'
    //     }
    // }

    /* The pan tool is selected by default. */
    // $scope.selectTool(null, 'pan');
    $scope.config.tools.activeToolset = 'basic';
});