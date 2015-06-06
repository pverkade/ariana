/*
 * The toolset controller contains all logic of the toolsets
 */
angular.module('ariana').controller('toolsetCtrl', function($scope) {
    
    // SVG FIX FOT STACK OVEFLOW
    $('.svg-img').each(function(){
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');
    });
    
    $scope.active = false;

    /*
     * Toggles the current state
     */
    $scope.toggle = function(e) {
        if ($scope.active && e.currentTarget.id == $scope.config.tools.activeToolset) {
            $scope.config.tools.activeToolset = null;
            $scope.active = false;
            return;
        }
        $scope.config.tools.activeToolset = e.currentTarget.id;
        $scope.active = true;    
    };
    
    $scope.selectTool = function(tool) {
        config.tools.activeTool = tool;
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
        "basic": {
            "image": 'arrow-all.svg',
            "tools": {
                "translate": {
                    "image": 'arrow-all.svg'
                },
                "scale": {
                    "image": 'arrow-expand.svg'
                },
                "rotate": {
                    "image": 'rotate-left.svg'
                },
                "crop": {
                    "image": 'crop.svg'
                }
            }
        },
        "painting": {
            "image": 'border-color.svg',
            "tools": {
                "color": {
                    "image": 'palette.svg'
                },
                "pencil": {
                    "image": 'pen.svg'
                },
                "brush": {
                    "image": 'brush.svg'
                },
                "eraser": {
                    "image": 'eraser.svg'
                },
                "picker": {
                    "image": 'eyedropper.svg'
                },
                "fill": {
                    "image": 'format-color-fill.svg'
                }
            }
        },
        "select": {
            "image": 'select.svg',
            "tools": {
                "rectangle": {
                    "image": 'select.svg'
                },
                "elipse": {
                    "image": 'checkbox-blank-circle-outline.svg'
                },
                "curve": {
                    "image": 'vector-curve.svg'
                },
                "wand": {
                    "image": 'auto-fix.svg' 
                }
            }
        },
        "text": {
            "image": 'format-size.svg'
        }
    }
});
