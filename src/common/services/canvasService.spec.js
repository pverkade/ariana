describe("The canvas service", function() {
    beforeEach(module('ariana'));

    var canvas;

    beforeEach(
        inject(function(_canvas_) {
            canvas = _canvas_;
        })
    );

    it("should not be undefined", function() {
        expect(canvas).not.toBeUndefined();
    });

    describe("parameters", function() {
        it("should not be undefined", function() {
            expect(canvas._params).not.toBeUndefined();
        });

        it("should have coordinates", function() {
            expect(canvas._params.x).not.toBeUndefined();
            expect(canvas._params.y).not.toBeUndefined();
        });

        it("should have sizes", function() {
            expect(canvas._params.width).not.toBeUndefined();
            expect(canvas._params.height).not.toBeUndefined();
        });

        it("should have misc", function() {
            expect(canvas._params.zoom).not.toBeUndefined();
            expect(canvas._params.visible).not.toBeUndefined();
            expect(canvas._params.cursor).not.toBeUndefined();
        });
    });

    describe("getters", function() {
        it("should not be undefined", function() {
            expect(canvas.getPos).not.toBeUndefined();
            expect(canvas.getX).not.toBeUndefined();
            expect(canvas.getY).not.toBeUndefined();
            expect(canvas.getZoom).not.toBeUndefined();
            expect(canvas.getDim).not.toBeUndefined();
            expect(canvas.getWidth).not.toBeUndefined();
            expect(canvas.getHeight).not.toBeUndefined();
            expect(canvas.getVisibility).not.toBeUndefined();
            expect(canvas.getCursor).not.toBeUndefined();
        });

        it("getPos should return position", function() {
            var pos = canvas.getPos();
            expect(pos.x).toEqual(canvas._params.x);
            expect(pos.y).toEqual(canvas._params.y);
        });

        it("getX should return x", function() {
            var x = canvas.getX();
            expect(x).toEqual(canvas._params.x);
        });

        it("getY should return y", function() {
            var y = canvas.getY();
            expect(y).toEqual(canvas._params.y);
        });

        it("getZoom should return zoom", function() {
            var zoom = canvas.getZoom();
            expect(zoom).toEqual(canvas._params.zoom);
        });

        it("getDim should return dimensions", function() {
            var dim = canvas.getDim();
            expect(dim.width).toEqual(canvas._params.width);
            expect(dim.height).toEqual(canvas._params.height);
        });

        it("getWidth should return width", function() {
            var width = canvas.getWidth();
            expect(width).toEqual(canvas._params.width);
        });

        it("getHeight should return height", function() {
            var height = canvas.getHeight();
            expect(height).toEqual(canvas._params.height);
        });

        it("getVisibility should return visibility", function() {
            var visible = canvas.getVisibility();
            expect(visible).toEqual(canvas._params.visible);
        });

        it("getCursor should return cursor", function() {
            var cursor = canvas.getCursor();
            expect(cursor).toEqual(canvas._params.cursor);
        });
    });

    describe("setters", function() {
        it("should not be undefined", function() {
            expect(canvas.setPos).not.toBeUndefined();
            expect(canvas.setX).not.toBeUndefined();
            expect(canvas.setY).not.toBeUndefined();
            expect(canvas.setZoom).not.toBeUndefined();
            expect(canvas.setDim).not.toBeUndefined();
            expect(canvas.setWidth).not.toBeUndefined();
            expect(canvas.setHeight).not.toBeUndefined();
            expect(canvas.setVisibility).not.toBeUndefined();
            expect(canvas.setCursor).not.toBeUndefined();
        });

        it("setPos should set position", function() {
            canvas.setPos(1337, 1337);
            expect(canvas._params.x).toEqual(1337);
            expect(canvas._params.y).toEqual(1337);
        });

        it("setX should set x", function() {
            canvas.setX(1337);
            expect(canvas._params.x).toEqual(1337);
        });

        it("setY should set y", function() {
            canvas.setY(1337);
            expect(canvas._params.y).toEqual(1337);
        });

        it("setZoom should set zoom", function() {
            canvas.setZoom(1337);
            expect(canvas._params.zoom).toEqual(1337);
        });

        it("setDim should set dimensions", function() {
            canvas.setDim(1337, 1337);
            expect(canvas._params.width).toEqual(1337);
            expect(canvas._params.height).toEqual(1337);
        });

        it("setWidth should set width", function() {
            canvas.setWidth(1337);
            expect(canvas._params.width).toEqual(1337);
        });

        it("setHeight should set height", function() {
            canvas.setHeight(1337);
            expect(canvas._params.height).toEqual(1337);
        });

        it("setVisibility should set visibility", function() {
            canvas.setVisibility(true);
            expect(canvas._params.visible).toEqual(true);
        });

        it("setCursor should set cursor", function() {
            canvas.setCursor('1337');
            expect(canvas._params.cursor).toEqual('1337');
        });
    });
});