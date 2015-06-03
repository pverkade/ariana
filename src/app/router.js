angular.module('ariana').config(function($locationProvider, $urlRouterProvider, $stateProvider) {
    $locationProvider.html5Mode(true);
    
    $stateProvider
        .state('index', {
            url: '/',
            views: {
                'content': {
                    templateUrl: 'app/content/content.tpl.html',
                    controller: 'contentCtrl'
                },
                'header': {
                    templateUrl: 'app/header/header.tpl.html',
                    controller: 'headerCtrl'
                },
                'layers': {
                    templateUrl: 'app/layers/layers.tpl.html',
                    controller: 'layersCtrl'
                },
                'toolbox': {
                    templateUrl: 'app/toolbox/toolbox.tpl.html',
                    controller: 'toolboxCtrl'
                }
            }
        })

        .state('about', {
            url: '/about',
            views: {
                'content': {
                    templateUrl: 'app/content/about/about.tpl.html',
                    controller: ''
                },
                'header': {
                    templateUrl: 'app/header/header.tpl.html',
                    controller: 'headerCtrl'
                },
                'layers': {
                    templateUrl: 'app/layers/layers.tpl.html',
                    controller: 'layersCtrl'
                },
                'toolbox': {
                    templateUrl: 'app/toolbox/toolbox.tpl.html',
                    controller: 'toolboxCtrl'
                }
            }
        });
});