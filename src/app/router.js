angular.module('ariana').config(function($stateProvider) {
    $stateProvider
        .state('index', {
            url: "",
            views: {
                "content": {
                    templateUrl: "app/content/content.tpl.html",
                    controller: 'contentCtrl'
                },
                "header": {
                    templateUrl: "app/header/header.tpl.html",
                    controller: 'headerCtrl'
                },
                "layers": {
                    templateUrl: "app/layers/layers.tpl.html",
                    controller: 'layersCtrl'
                },
                "toolbox": {
                    templateUrl: "app/toolbox/toolbox.tpl.html",
                    controller: 'toolboxCtrl'
                }
            }
        });
});