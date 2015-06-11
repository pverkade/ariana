/* The router displays the correct tamplate in the correct ui-view for every
 * given state. */
angular.module('ariana').config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $stateProvider
        .state('index', {
            url: "/",
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
        .state('landing', {
            url: "/landing",
            views: {
                "content": {
                    templateUrl: "app/content/landing/landing.content.tpl.html",
                    controller: 'LandingContentCtrl'
                },
                "toolbar": {
                    templateUrl: "app/toolbar/landing/landing.toolbar.tpl.html",
                    controller: 'LandingToolbarCtrl'
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
