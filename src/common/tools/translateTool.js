var translateTool = {

    start: function() {
        $("#main-canvas").css("cursor", "move");
    },

    mouseDown: function($scope) {
    },

    mouseUp: function($scope) {
    },

    mouseMove: function($scope) {

        if ($scope.config.mouse.click.down == false) return;

        var selectedLayers = $scope.getSelectedLayers();
        if (selectedLayers == []) return;

        console.log("selected", selectedLayers);

        var width = $scope.renderEngine.width;
        var height = $scope.renderEngine.height;

        function normalize(x) {
            return 2 * (x / width) - 1;
        }

        selectedLayers.forEach(function (layer) {
            var mouse = $scope.config.mouse;

            var dx = normalize(mouse.current.x) - normalize(mouse.old.x);
            var dy = normalize(mouse.current.y) - normalize(mouse.old.y);

            var xOffset = layer.getPosX();
            var yOffset = layer.getPosY();

            layer.setPos(xOffset + dx, yOffset - dy);
        });

        $scope.renderEngine.render();
    }
};
