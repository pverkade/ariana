angular.module('ariana').controller('toolBoxController', function($scope) {
    
    $scope.swapColors = function() {
        var temp = $scope.config.tools.colors.primary;
        $scope.config.tools.colors.primary = $scope.config.tools.colors.secondary;
        $scope.config.tools.colors.secondary = temp;
        console.log($scope.config.tools.colors.primary);
    };
    
    $scope.checkVisible = function() {
        return (!($scope.config.mouse.button[1] || $scope.config.mouse.button[2] || $scope.config.mouse.button[3]));
    }

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
                color: {
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
                wand: {
                    image: 'mdi-auto-fix' 
                }
            }
        },
        text: {
            image: 'mdi-format-size'
        }
    }

    /* This function selects a toolset and therefore opens a toolbox. */
    $scope.selectToolSet = function(name) {
        if ($scope.config.tools.activeToolset == name) {
            $scope.config.tools.activeToolset = null;
            $scope.selectTool(null, "pan");
        }
        else {
            $scope.config.tools.activeToolset = name;
        }
    };
    
    /* This function selects a tool. */
    $scope.selectTool = function(e, tool) {
        if (e) e.stopPropagation();

        $scope.config.tools.activeTool = tool;

        var toolset = $scope.config.tools.activeToolset;
        
        if (toolset) {
            toolFunctions = $scope.toolbox[toolset].tools[tool].toolFunctions;
        }
        else {
            // exception for basic tools
            toolFunctions = $scope.toolbox.basic.tools[tool].toolFunctions;
        }
        
        if (toolFunctions) {
            $scope.config.tools.activeToolFunctions = toolFunctions;
            toolFunctions.start();
        }
        else {
            $scope.config.tools.activeToolFunctions = null;
            $("#background").css("cursor", "default");
        }
    };
    $scope.selectTool(null, "pan");

    setTimeout(function() {
        $("img").each(function () {
            var img = $(this);
            var id = img.attr('id');
            var src = img.attr('data');

            //$scope.sources.push(src);
            $(this).removeClass("svg");

            $.get(src, function (data) {
                // Get the SVG tag, ignore the rest
                var svg = $(data).find('svg');

                // Add replaced image's ID to the new SVG
                if (typeof id !== 'undefined') {
                    svg = svg.attr('id', id);
                }

                // Remove any invalid XML tags as per http://validator.w3.org
                svg = svg.removeAttr('xmlns');
                svg = svg.removeAttr('xmlns:xlink');

                // Replace image with new SVG
                img.replaceWith(svg);

            }, 'xml');
        });
    }, 1);
    //$scope.loadImages();
});