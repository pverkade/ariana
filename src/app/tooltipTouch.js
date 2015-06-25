app.config(['$tooltipProvider',
    function ($tooltipProvider) {
        var tooltipFactory = $tooltipProvider.$get[$tooltipProvider.$get.length - 1];

        // decorate the tooltip getter
        this.$get = [ '$window', '$compile', '$timeout', '$parse', '$document', '$position', '$interpolate',
            function ( $window, $compile, $timeout, $parse, $document, $position, $interpolate ) {
                // for touch devices, don't return tooltips
                if ('ontouchstart' in $window) {
                    console.log('if');
                    return function () {
                        return {
                            compile: function () { }
                        };
                    };
                } else {
                    console.log($interpolate);
                    // run the default behavior
                    return tooltipFactory($window, $compile, $timeout, $parse, $document, $position, $interpolate);
                }
            }
        ];
    }
]);