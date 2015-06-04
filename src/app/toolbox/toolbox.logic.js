/*
 * The toolset controller contains all logic of the toolsets
 */
angular.module('ariana').controller('toolsetCtrl', function($scope) {
    $scope.collapsed = true;

    /*
     * Toggles the current state
     */
    $scope.toggle = function(e) {
        $scope.collapsed = !$scope.collapsed;
        $scope.config.tools.active = e.currentTarget.id;
        
        if ($scope.collapsed) $scope.expand(e);
        else $scope.collapse(e);
    }

    /*
     * Expands this toolset
     */
    $scope.expand = function(e) {

        var target = e.currentTarget;

        /* Set all other category-selection tools as disabled. */
        // var toolset = document.getElementById('toolset').children;
        // for (var i = 0; i < toolset.length; i++) {
        //     if (i == setnumber) toolset[i].toolEnabled = true;
        //     else toolset[i].toolEnabled = false;
        // }

        //  Move the desired toolblock in view. Move all tool blocks to their 
        //  * original position. 
        // var subtoolsets = document.getElementById('sub-toolsets').children;
        // for (var i = 0; i < subtoolsets.length; i++) {
        //     if (i == setnumber) subtoolsets[i].style.transform = "translate(144px, 0px)";
        //     else subtoolsets[i].style.transform = "translate(-144px, 0px)";
        // }
    }

    /*
     * Collapses this toolset
     */
    $scope.collapse = function(e) {
        // TODO
    }
});

/*
 * The toolbox controller contains all logic of the whole toolbar
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
            image: 'brush.svg',
            tools: {
                color: {
                    image: 'close.svg'
                },
                pencil: {
                    image: 'border-color.svg'
                },
                brush: {
                    image: 'brush.svg'
                },
                eraser: {
                    image: 'eraser.svg'
                },
                picker: {
                    image: 'close.svg'
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

    /* Make tools. */
    // var toolset = document.getElementById('toolset');
    // tools = toolset.children;

    /* For every tool in the toolset, get the inner HTML and use it as filename
    for the icon. Load the icon using a new Request. */
    // for (var i = 0; i < tools.length; i++) {
    //     tool = tools[i];
    //     icon = tool.innerHTML.trim();
    //     tool.innerHTML = "";
    //     filename = "assets/vectors/" + icon;

    //     var request = new XMLHttpRequest();
    //     request.open('GET', filename, true);
    //     request.icon_i = i;
    //     request.onload = function() {
    //         if (this.status >= 200 && this.status < 400) {
    //             parser = new DOMParser();
    //             svg = parser.parseFromString(this.response, "text/xml").getElementsByTagName("svg")[0];
    //             tools[this.icon_i].appendChild(svg);
    //         }
    //     };
    //     request.onerror = function() {
    //         // ...
    //     };
    //     request.send();
    // }

    // var subtoolsets = document.getElementById('sub-toolsets').children;
    // var n = [];

    // /* Add onClick handlers for each category-button. */
    // for (var i = 0; i < tools.length; i++) {

    //     /* Add variables to button. */
    //     tools[i].toolNumber = i;
    //     tools[i].toolEnabled = false;

    //     tools[i].onclick = function (){
    //         if (this.toolEnabled) {
    //             this.toolEnabled = false;
    //             hideSubToolsets();
    //         }
    //         else {
    //             this.toolEnabled = true;
    //             showSubToolset(this.toolNumber);
    //         }
    //     };
    // }    

    // for (var i = 0; i < subtoolsets.length; i++) {
    //     var subtoolset = subtoolsets[i].children;
    //     n.push(subtoolset);
    // }

    /* For every subtool, load the svg to show as icon. */
    // for (var i = 0; i < n.length; i++) {
    //     for (var j = 0; j < n[i].length; j++) {

    //         tool = n[i][j];

    //         icon = tool.innerHTML.trim();
    //         tool.innerHTML = "";
    //         filename = "assets/vectors/" + icon;

    //         var request = new XMLHttpRequest();
    //         request.open('GET', filename, true);
    //         request.icon_i = i;
    //         request.icon_j = j;
    //         request.onload = function() {
    //             if (this.status >= 200 && this.status < 400) {
    //                 parser = new DOMParser();
    //                 svg = parser.parseFromString(this.response, "text/xml").getElementsByTagName("svg")[0];
    //                 n[this.icon_i][this.icon_j].appendChild(svg);
    //             }
    //         };
    //         request.onerror = function() {
    //             //
    //         };
    //         request.send();
    //     }
    // }

    //document.getElementById('color-preview').onclick = switchColors();  

    /* This function shows a certain toolblock. */
    function showSubToolset(setnumber) {

        /* Set all other category-selection tools as disabled. */
        var toolset = document.getElementById('toolset').children;
        for (var i = 0; i < toolset.length; i++) {
            if (i == setnumber) toolset[i].toolEnabled = true;
            else toolset[i].toolEnabled = false;
        }

        /* Move the desired toolblock in view. Move all tool blocks to their 
         * original position. */
        var subtoolsets = document.getElementById('sub-toolsets').children;
        for (var i = 0; i < subtoolsets.length; i++) {
            if (i == setnumber) subtoolsets[i].style.transform = "translate(144px, 0px)";
            else subtoolsets[i].style.transform = "translate(-144px, 0px)";
        }

        return;
    }

    /* This function hides all toolsets. */
    function hideSubToolsets() {

        /* Set all category-selection tools as disabled. */
        var toolset = document.getElementById('toolset').children;
        for (var i = 0; i < toolset.length; i++) {
            toolset[i].toolEnabled = false;
        }

        /* Move all tool blocks to their original position. */
        var subtoolsets = document.getElementById('sub-toolsets').children;
        for (var i = 0; i < subtoolsets.length; i++) {
            subtoolsets[i].style.transform = "translate(-144px, 0px)";
        }

        return;
    }
    
    $scope.switchColors = function() {
        leftColor  = getLeftColor();
        rightColor = getRightColor();
        setLeftColor(rightColor);
        setRightColor(leftColor);
        updatePreview();
    }
});