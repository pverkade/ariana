var rotateTool = {
    
    start: function() {
        $("#main-canvas").css("cursor", "grab");
    },
    
    mouseDown: function($scope) {
        $("#main-canvas").css("cursor", "grabbing");
    },
    
    mouseUp: function($scope) {
        $("#main-canvas").css("cursor", "grab");
    },

    mouseMove: function($scope) {
        var selectedLayers = $scope.getSelectedLayers();
        if (selectedLayers == []) return;

        var mouse = $scope.config.mouse;
        var canvas = document.getElementById("main-canvas");
        var width = canvas.width;
        var height = canvas.height;
        var ratio = width / height;

        selectedLayers.forEach(function(layer) {
            var x = (layer.getPosX()+1)/2 * canvas.width;
            var y = (-1.*layer.getPosY()+1)/2. * canvas.height;

            var dx = x-mouse.current.x;
            var dy = y+50-mouse.current.y;

            var angle = Math.atan2(dx, dy);
            layer.setRotation(angle);
        });

        $scope.renderEngine.render();

    }
};