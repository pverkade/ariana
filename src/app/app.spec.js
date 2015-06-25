/*describe("The app controller", function() {
    beforeEach(module('ariana'));

    var $controller, $scope;

    beforeEach(inject(
        function(_$controller_, _$rootScope_) {
            $scope = _$rootScope_.$new();
            $controller = _$controller_("AppCtrl", {$scope: $scope});
        })
    );

    describe("initial state", function() {
        it("should not be undefined", function() {
            expect($controller).not.toBeUndefined();
        });

        it("should have a properly filled config object", function() {
            expect($scope.config).not.toBeUndefined();

            expect($scope.config.mouse.old.x).not.toBeUndefined();
            expect($scope.config.mouse.old.y).not.toBeUndefined();
            expect($scope.config.mouse.old.global.x).not.toBeUndefined();
            expect($scope.config.mouse.old.global.y).not.toBeUndefined();
            expect($scope.config.mouse.current.x).not.toBeUndefined();
            expect($scope.config.mouse.current.y).not.toBeUndefined();
            expect($scope.config.mouse.current.global.x).not.toBeUndefined();
            expect($scope.config.mouse.current.global.y).not.toBeUndefined();
            expect($scope.config.mouse.button).not.toBeUndefined();

            expect($scope.config.canvas.cursor).not.toBeUndefined();
            expect($scope.config.canvas.x).not.toBeUndefined();
            expect($scope.config.canvas.y).not.toBeUndefined();
            expect($scope.config.canvas.xr).not.toBeUndefined();
            expect($scope.config.canvas.yr).not.toBeUndefined();
            expect($scope.config.canvas.zoom).not.toBeUndefined();
            expect($scope.config.canvas.width).not.toBeUndefined();
            expect($scope.config.canvas.height).not.toBeUndefined();
            expect($scope.config.canvas.visible).not.toBeUndefined();

            expect($scope.config.tools.activeTool).not.toBeUndefined();
            expect($scope.config.tools.activeToolFunctions).not.toBeUndefined();
            expect($scope.config.tools.activeToolset).not.toBeUndefined();
            expect($scope.config.tools.colors.primary.r).not.toBeUndefined();
            expect($scope.config.tools.colors.primary.g).not.toBeUndefined();
            expect($scope.config.tools.colors.primary.b).not.toBeUndefined();
            expect($scope.config.tools.colors.secondary.r).not.toBeUndefined();
            expect($scope.config.tools.colors.secondary.g).not.toBeUndefined();
            expect($scope.config.tools.colors.secondary.b).not.toBeUndefined();

            expect($scope.config.layers.numberOfLayers).not.toBeUndefined();
            expect($scope.config.layers.currentLayer).not.toBeUndefined();
            expect($scope.config.layers.layerInfo).not.toBeUndefined();
        });

        it("should create empty engines", function() {
            expect($scope.renderEngine).not.toBeUndefined();
            expect($scope.drawEngine).not.toBeUndefined();
            expect($scope.editEngine).not.toBeUndefined();
        });
    });

    describe("scope function", function() {
        it("should start the engines", function() {
            var dummyDiv1 = document.createElement('div');
            var dummyDiv2 = document.createElement('div');
            var dummyDiv3 = document.createElement('div');
            dummyDiv1.innerHTML = '<canvas rendertarget="rendertarget" id="main-canvas"></canvas>';
            dummyDiv2.innerHTML = '<canvas id="editing-canvas"></canvas>';
            dummyDiv3.innerHTML = '<canvas id="top-canvas"></canvas>';

            $scope.startEngines(dummyDiv1.firstChild, dummyDiv2.firstChild, dummyDiv3.firstChild);

            expect($scope.renderEngine).not.toBeNull();
            expect($scope.drawEngine).not.toBeNull();
            expect($scope.editEngine).not.toBeNull();
        });

        it("should create a new layer from an image", function() {
            var oldNumberOfLayers = $scope.config.layers.numberOfLayers;
            var oldCurrentLayer = $scope.config.layers.currentLayer;
            var img = new Image();
            var layer, layerInfo;

            createRenderEngine($scope);
            $scope.newLayerFromImage(img); 

            layer = $scope.renderEngine.getLayer(0);
            layerInfo = $scope.config.layers.layerInfo[$scope.config.layers.currentLayer];
            
            expect(layer).not.toBeUndefined();

            expect($scope.config.layers.numberOfLayers).toBeGreaterThan(oldNumberOfLayers);
            expect($scope.config.layers.currentLayer).toBeGreaterThan(oldCurrentLayer);

            expect(layerInfo.name).not.toBeUndefined();
            expect(layerInfo.x).not.toBeUndefined();
            expect(layerInfo.y).not.toBeUndefined();
            expect(layerInfo.originalWidth).not.toBeUndefined();
            expect(layerInfo.originalHeight).not.toBeUndefined();
            expect(layerInfo.width).not.toBeUndefined();
            expect(layerInfo.height).not.toBeUndefined();
            expect(layerInfo.rotation).not.toBeUndefined();
        });

        it("should resize the canvas", function() {
            $scope.renderEngine = {};
            $scope.drawEngine = {};
            $scope.editEngine = {};

            $scope.renderEngine.render = jasmine.createSpy('render')
            $scope.renderEngine.resize = jasmine.createSpy('resize');
            $scope.drawEngine.resize = jasmine.createSpy('resize');
            $scope.editEngine.resize = jasmine.createSpy('resize');
            spyOn(window, 'requestAnimationFrame').and.callThrough();

            $scope.resizeCanvases(100, 100);

            expect($scope.config.canvas.width).toEqual(100);
            expect($scope.config.canvas.height).toEqual(100);

            expect($scope.renderEngine.resize).toHaveBeenCalledWith(100, 100);
            expect($scope.drawEngine.resize).toHaveBeenCalledWith(100, 100);
            expect($scope.editEngine.resize).toHaveBeenCalledWith(100, 100);

            expect($scope.config.layers.numberOfLayers).toEqual(0);
            expect($scope.config.layers.currentLayer).toEqual(-1);
            expect($scope.config.layers.layerInfo).not.toBeUndefined();

            expect($scope.config.canvas.visible).toBeTruthy();

            expect(window.requestAnimationFrame).toHaveBeenCalled();
            // doesn't work.....
            // expect($scope.renderEngine.render).toHaveBeenCalled();
        });
    });
});*/