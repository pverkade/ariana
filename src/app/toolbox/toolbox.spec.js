describe("The toolbox controller", function() {
    beforeEach(module('ariana'));

    var $controller, $scope;

    beforeEach(inject(
        function(_$controller_, _$rootScope_) {
            $scope = _$rootScope_.$new();

            _$controller_("AppCtrl", {$scope: $scope});
            $controller = _$controller_("ToolboxCtrl", {$scope: $scope});
        })
    );

    describe("initial state", function() {
        it("should not be undefined", function() {
            expect($controller).not.toBeUndefined();
        })
    });

    describe("checkVisible", function() {
        it("should be true default", function() {
            expect($scope.checkVisible()).toBe(true);

            it("should be false for mocked active", function() {
                $scope.config.mouse.button[1] = true;
                expect($scope.checkVisible()).toBe('false');
            })
        })
    });

    describe("getCursor", function() {
        it("should return the cursor", function() {
            expect($scope.getCursor()).toEqual('default');
        })
    });

    describe("setCursor", function() {
        it("should change the cursor", function() {
            $scope.setCursor('test');
            expect($scope.getCursor()).toEqual('test');
        })
    });

    describe("swapColors", function() {
        it("should swap primary and secondary colors", function() {
            var p = $scope.config.tools.colors.primary;
            var s = $scope.config.tools.colors.secondary;

            $scope.swapColors();
            expect($scope.config.tools.colors.primary).toEqual(s);
            expect($scope.config.tools.colors.secondary).toEqual(p);
        })
    });

    describe("selectTool", function() {
        it("should select a different tool", function() {
            $scope.selectTool(null, 'test');
            expect(tools.getTool()).toEqual('test');
            
            it("should return true for 'test'", function() {
                expect($scope.isActive('test')).toBe('true');
            })
        })

    });

    describe("selectToolSet", function() {
        it("should select a different toolset", function() {
            $scope.selectToolSet('test');
            expect(tools.getTool()set).toEqual('test');

            it("should return true for 'test'", function() {
                expect($scope.isActiveToolset('test')).toBe('true');
            })
        })
    });

    describe("getActiveToolFunctions", function() {
        it("should not be undefined", function() {
            expect($scope.getActiveToolFunctions()).not.toBeUndefined();
        })
    });

});