/*
 * Project Ariana
 * interface.js
 *
 * This face contains the interface between the GUI and the functionality.
 *
 */
 
var tool = 0;

/* Set the current tool to the desired number. */
function setTool(toolNumber){
    if (toolNumber > 0) {
        tool = toolNumber;
        return true;
    }
    return false;
}

function getTool(){
    return tool;
}

var leftColor  = "#000000";
var rightColor = "#ffffff";

function switchColors(){
    var temp = leftColor;
    leftColor = rightColor;
    rightColor = temp;
    find('preview').updatePreview();
    return true;
}

function setLeftColor(newLeftColor){
    leftColor = newLeftColor;
    find('preview').updatePreview();
    return true;
}

function setRightColor(newRightColor){
    rightColor = newRightColor;
    find('preview').updatePreview();
    return true;
}

function getLeftColor(){
    return leftColor;
}

function getRightColor(){
    return rightColor;
}

var viewZoom = 1;
var viewLocationX = 0;
var viewLocationY = 0;

function setViewZoom(newViewZoom){
    if (newViewZoom > 0 && newViewZoom < 64) {
        viewZoom = newViewZoom;
    }
}

//TODO code for setting and getting viewLocation

/* This function is called whenever the left mouse button is pressed down on 
the canvas. The values (x, y) are the coordinates of the mouse.*/
function mouseLeftClick(x, y) {
    var currentTool = getTool();
    
    console.log("mouseLeftClick", x, y);
    
    if (currentTool == "pan") {
        // call code for panning, move the viewLocation etc...
        return true;
    }
    
    if (currentTool == "pencil") {
        // call code for drawing
        return true;
    }
    
    return false;   
}

/* This function is called whenever the mouse moves over tha canvas. The
 * values (x, y) are the new coordinates of the mouse. */
function mouseMove(x, y) {

    console.log("mouseMove", x, y);

    // perform code on move (show tool preview or something?)

    return false;
}
