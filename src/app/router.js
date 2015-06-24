/* 
 * Project Ariana
 * router.js
 * 
 * This file contains the router, which displays the correct template in the 
 * correct ui-view for every given state.
 *
 */

app.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $stateProvider
        .state('index', {
            url: "/",
            views: {
                "content": {
                    templateUrl: "app/content/content.tpl.html",
                    controller: 'ContentController'
                },
                "toolbar": {
                    templateUrl: "app/toolbar/toolbar.tpl.html",
                    controller: 'ToolbarController'
                },
                "layers": {
                    templateUrl: "app/layers/layers.tpl.html",
                    controller: 'layersCtrl'
                },
                "toolbox": {
                    templateUrl: "app/toolbox/toolbox.tpl.html",
                    controller: 'ToolboxCtrl'
                }
            }
        })
        .state('drawtest', {
            url: "/drawtest",
            views: {
                "content": {
                    templateUrl: "common/draw/drawtest.tpl.html",
                    controller: 'drawtestCtrl'
                },
                "toolbar": {
                    templateUrl: "app/toolbar/toolbar.tpl.html",
                    controller: 'ToolbarController'
                },
                "layers": {
                    templateUrl: "app/layers/layers.tpl.html",
                    controller: 'layersCtrl'
                },
                "toolbox": {
                    templateUrl: "app/toolbox/toolbox.tpl.html",
                    controller: 'ToolboxCtrl'
                }
            }
        })
        .state('landing', {
            url: "/landing",
            views: {
                "content": {
                    templateUrl: "app/content/landing/landing.content.tpl.html",
                    controller: 'LandingContentCtrl'
                }
            }
        })
});
