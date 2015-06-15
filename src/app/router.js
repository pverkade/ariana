/* 
 * Project Ariana
 * router.js
 * 
 * This file contains the router, which displays the correct template in the 
 * correct ui-view for every given state.
 *
 */

angular.module('ariana').config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $stateProvider
        .state('landing', {
            url: "/",
            views: {
                "content": {
                    templateUrl: "app/landing/landing.tpl.html",
                    controller: 'LandingCtrl'
                }
            }
        })
        .state('ariana', {
            url: "",
            views: {
                "content": {
                    templateUrl: "app/content/content.tpl.html",
                    controller: 'ContentController'
                },
                "content-menu": {
                    templateUrl: "app/content/menu/menu.content.tpl.html",
                    controller: 'MenuContentCtrl'
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
                    controller: 'ToolboxController'
                }
            }
        })
        /*
        .state('settings', {
            url: "/settings",
            views: {
                "content": {
                    templateUrl: "app/content/settings/settings.content.tpl.html",
                    controller: 'SettingsContentCtrl'
                },
                "content-menu": {
                    templateUrl: "app/content/menu/menu.content.tpl.html",
                    controller: 'MenuContentCtrl'
                },
                "toolbar": {
                    templateUrl: "app/toolbar/toolbar.tpl.html",
                    controller: 'toolbarCtrl'
                },
                "layers": {
                    templateUrl: "app/layers/layers.tpl.html",
                    controller: 'layersCtrl'
                },
                "toolbox": {
                    templateUrl: "app/toolbox/toolbox.tpl.html",
                    controller: 'toolBoxController'
                }
            }
        });*/
});
