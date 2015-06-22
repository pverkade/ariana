describe("The brush directive controller", function() {
    beforeEach(module('ariana'));

    var $controller, $scope;

    beforeEach(inject(
        function(_$controller_, _$rootScope_) {
            $scope = _$rootScope_.$new();

            _$controller_("AppCtrl", {$scope: $scope});
            _$controller_("ToolboxCtrl", {$scope: $scope});
            $controller = _$controller_("BrushCtrl", {$scope: $scope});
        })
    );

    describe("initial state", function() {
        it("should not be undefined", function() {
            expect($controller).not.toBeUndefined();
        });
    });

    describe("default variable", function() {
        it("toolname should match", function() {
            expect($scope.toolname).toEqual('brush');
        });
        it("tool should not be active", function() {
            expect($scope.active).toBe(false);
        });
        it("draw settings should exist", function() {
            expect($scope.thickness).not.toBeUndefined();
            expect($scope.opacity).not.toBeUndefined();
        });
    });

    describe("init", function() {
        it("changes active state", function() {
            $scope.active = true;

            it("should not change cursor", function() {
                $scope.init();
                expect($scope.getCursor()).toEqual('default');
            });

            it("should change tool functions", function() {
                $scope.init();
                expect($scope.getActiveToolFunctions().mouseDown).toBe($scope.mouseDown());
                expect($scope.getActiveToolFunctions().mouseUp).toBe($scope.mouseUp());
                expect($scope.getActiveToolFunctions().mouseMove).toBe($scope.mouseMove());
            });

            it("should have access to drawEngine", function() {
                $scope.init();
                expect($scope.drawEngine).not.toBeUndefined();
            });

            it("should initialize draw variables", function() {
                $scope.init();
                expect($scope.drawing).not.toBeUndefined();
                expect($scope.hasDrawn).not.toBeUndefined();
            });

            it("should change brushtype", function() {
                $scope.init();
                expect($scope.drawEngine.getBrush()).toBe(brushType.THIN);
                console.log($scope.drawEngine.getBrush());
            });

            it("should change color", function() {
                $scope.init();
                expect($scope.drawEngine.getColor()).toBe(true);
            });
        });
    });

});