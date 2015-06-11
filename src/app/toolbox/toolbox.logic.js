/* This contoller defines the behaviour of the toolbox and the color-preview. */
angular.module('ariana').controller('ToolboxController', function($scope) {
    
    /* This function swaps the primary and secondary color. */
    $scope.swapColors = function() {
        var temp = $scope.config.tools.colors.primary;
        $scope.config.tools.colors.primary = $scope.config.tools.colors.secondary;
        $scope.config.tools.colors.secondary = temp;
    };
    
    /* This functions returns whether the toolbox should be visible. It is 
     * hidden when the user is clicking on the canvas/background. */
    $scope.checkVisible = function() {
        return (!($scope.config.mouse.button[1] || $scope.config.mouse.button[2] || $scope.config.mouse.button[3]));
    }

    /* This object contains all the tools that are present in the toolbox. 
     * It also contains the name of the icon and the required functions. */
    // FIXME the tools are sorted alphabetically before being shown.
    $scope.toolbox = {
        basic: {
            image: 'mdi-arrow-all',
            tools: {
                pan: {
                    image: 'mdi-cursor-pointer',
                    toolFunctions: panTool,
                },
                translate: {
                    image: 'mdi-arrow-all',
                    toolFunctions: translateTool,
                },
                scale: {
                    image: 'mdi-arrow-expand'
                },
                rotate: {
                    image: 'mdi-rotate-left',
                    toolFunctions: rotateTool,
                },
                crop: {
                    image: 'mdi-crop'
                }
            }
        },
        painting: {
            image: 'mdi-brush',
            tools: {
                palette: {
                    image: 'mdi-palette'
                },
                pencil: {
                    image: 'mdi-pen'
                },
                brush: {
                    image: 'mdi-brush'
                },
                eraser: {
                    image: 'mdi-eraser'
                },
                picker: {
                    image: 'mdi-eyedropper',
                    toolFunctions: colorPicker,
                },
                fill: {
                    image: 'mdi-format-color-fill'
                }
            }
        },
        select: {
            image: 'mdi-select',
            tools: {
                rectangle: {
                    image: 'mdi-select'
                },
                elipse: {
                    image: 'mdi-checkbox-blank-circle-outline'
                },
                curve: {
                    image: 'mdi-vector-curve'
                },
                magic: {
                    image: 'mdi-auto-fix' 
                }
            }
        },
        text: {
            image: 'mdi-format-size'
        }
    }

    /* This function selects a toolset and therefore opens a toolbox. When
     * a toolset is already elected, it becomes unselected. The pan tool will
     * then be used. */
    $scope.selectToolSet = function(name) {
        if ($scope.config.tools.activeToolset == name) {
            $scope.config.tools.activeToolset = null;
            $scope.selectTool(null, "pan");
            return;
        }
        $scope.config.tools.activeToolset = name;
    };
    
    /* This function selects a certain tool. */
    $scope.selectTool = function(event, tool) {
        if (event) event.stopPropagation();

        $scope.config.tools.activeTool = tool;
        
        /* Find the required tool-functions in the toolbox object. The 
         * currrently selected toolset is used. */
        var toolset = $scope.config.tools.activeToolset;
        if (toolset) toolFunctions = $scope.toolbox[toolset].tools[tool].toolFunctions;
        else toolFunctions = $scope.toolbox.basic.tools[tool].toolFunctions;
        
        if (toolFunctions) {
            $scope.config.tools.activeToolFunctions = toolFunctions;
            toolFunctions.start();
        }
        else {
            $scope.config.tools.activeToolFunctions = null;
            /* Reset the background cursor. */
            $("#background").css("cursor", "default");
        }
    };
    
    /* The pan tool is selected by default. */
    $scope.selectTool(null, "pan");
});