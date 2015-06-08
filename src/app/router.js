angular.module('ariana').config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
    $stateProvider
        .state('index', {
            url: "/",
            views: {
                "content": {
                    templateUrl: "app/content/content.tpl.html",
                    controller: 'contentCtrl'
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
        });
});
