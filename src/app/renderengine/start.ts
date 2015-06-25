/*
 * Project Ariana
 * start.ts
 *
 * This file contains functions to debug the renderengine, without the angular interface.
 *
 */

/// <reference path="render-engine"/>

function start() {
    var image = new Image();
    var image2 = new Image();

    var canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("glcanvas");
    var overlayContext = document.getElementById("overlaycanvas").getContext("2d");
    var topContext = document.getElementById("topcanvas").getContext("2d");

    var renderEngine = new RenderEngine(canvas);

    function enterDrawMode(index : number) {
        var numLayers : number = renderEngine.getNumberOfLayers();

        var upperIndices : number[] = [];
        for (var i = index; i < numLayers; i++) {
            upperIndices.push(i);
            renderEngine.getLayer(i).setHidden(true);
        }

        var topLayers : String = renderEngine.renderIndicesToImg(upperIndices);
        var topLayersImage = new Image();
        topLayersImage.src = topLayers.toString();
        //console.log(topLayers);

        topLayersImage.onload = function() {
            topContext.save();
            topContext.scale(-1.0, 1.0);
            topContext.drawImage(topLayersImage, -canvas.width, 0, canvas.width, canvas.height);
            topContext.restore();

            renderEngine.render();
        }
    }

    function closeDrawMode() {
        topContext.clearRect(0, 0, canvas.width, canvas.height);

        var numLayers : number = renderEngine.getNumberOfLayers();
        for (var i = 0; i < numLayers; i++) {
            renderEngine.getLayer(i).setHidden(false);
        }
        renderEngine.render();
    }

    var counter = 1;
    function done() {
        if (counter === 1) {
            counter --;
        }
        else {
            var imageLayer = renderEngine.createImageLayer(image);
            var imageLayer2 = renderEngine.createImageLayer(image2);
            imageLayer.setPos(400, 240);
            imageLayer.setDimensions(800, 480);
            imageLayer.setRotation(1);
            renderEngine.addLayer(imageLayer);
            renderEngine.addLayer(imageLayer2);

            /*var filter = new ColorizeFilter();
            renderEngine.filterLayers([0], filter);*/
            //renderEngine.render();

            enterDrawMode(1);

            /*{
                overlayContext.save();
                overlayContext.strokeStyle = "#FF0000";
                overlayContext.translate(imageLayer.getPosX(), imageLayer.getPosY());
                overlayContext.rotate(-imageLayer.getRotation());
                overlayContext.strokeRect(
                    imageLayer.getWidth()/-2.0,
                    imageLayer.getHeight()/-2.0,
                    imageLayer.getWidth(),
                    imageLayer.getHeight()
                );
                overlayContext.restore();
            }*/
        }
    }

    image2.src = "wall.png";
    image2.onload = done;

    image.src = "image.jpg";
    image.onload = done;
}