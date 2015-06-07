/*
 * The toolset controller contains all logic of the toolsets
 */
angular.module('ariana').controller('toolsetCtrl', function($scope) {
    
    // SVG FIX FOT STACK OVEFLOW
    $('.svg').each(function(){
        var $img    = $(this);
        var id      = $img.attr('id');
        var src     = $img.attr('src');

        /* Load image src. */
        $.get(src, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof id !== 'undefined') {
                $svg = $svg.attr('id', id);
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns');
            $svg = $svg.removeAttr('xmlns:xlink');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');
    });

    /* This function selects a toolset and therefore opens a toolbox. */
    $scope.selectToolSet = function(name) {
        if ($scope.config.tools.activeToolset == name) $scope.config.tools.activeToolset = null;
        else $scope.config.tools.activeToolset = name;;    
    };
    
    /* This function selects a tool. */
    $scope.selectTool = function(tool) {
        $scope.config.tools.activeTool = tool;
        console.log("selected tool: " + $scope.config.tools.activeTool);
        
        /* Set the cursor over the canas. */
        if (tool == "pan")              $("#main-canvas").css("cursor", "grab");
        else if (tool == "translate")   $("#main-canvas").css("cursor", "move");
        else                            $("#main-canvas").css("cursor", "default")
    };
});

/*
 * The toolbox controller contains all logic of the whole toolbar!
 */
angular.module('ariana').controller('toolboxCtrl', function($scope) {
    $scope.primary = $scope.config.tools.colors.primary;
    $scope.secondary = $scope.config.tools.colors.secondary;
    $scope.active = $scope.config.tools.active;

    $scope.setPrimary = function(color) {
        $scope.primary = color;
    }

    $scope.setSecondary = function(color) {
        $scope.secondary = color;
    }

    $scope.swapColors = function() {
        var temp = $scope.primary;
        $scope.primary = $scope.secondary;
        $scope.secondary = temp;
    }

    /*
     * Toolsets
     */
    $scope.toolbox = {
        basic: {
            image: 'arrow-all.svg',
            tools: {
                pan: {
                    image: 'cursor-pointer.svg'
                },
                translate: {
                    image: 'arrow-all.svg'
                },
                scale: {
                    image: 'arrow-expand.svg'
                },
                rotate: {
                    image: 'rotate-left.svg'
                },
                crop: {
                    image: 'crop.svg'
                }
            }
        },
        painting: {
            image: 'border-color.svg',
            tools: {
                color: {
                    image: 'palette.svg'
                },
                pencil: {
                    image: 'pen.svg'
                },
                brush: {
                    image: 'brush.svg'
                },
                eraser: {
                    image: 'eraser.svg'
                },
                picker: {
                    image: 'eyedropper.svg'
                },
                fill: {
                    image: 'format-color-fill.svg'
                }
            }
        },
        select: {
            image: 'select.svg',
            tools: {
                rectangle: {
                    image: 'select.svg'
                },
                elipse: {
                    image: 'checkbox-blank-circle-outline.svg'
                },
                curve: {
                    image: 'vector-curve.svg'
                },
                wand: {
                    image: 'auto-fix.svg' 
                }
            }
        },
        text: {
            image: 'format-size.svg'
        }
    }
});
