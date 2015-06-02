/*
 * Project ariana
 * File: upload.ts
 * Author: Sjoerd Wenker
 * Date: June 1th, 2015
 * Description: this file allows users to upload their image
 */

/*
class UploadPage {
    uploadbutton: HTMLDivElement;
    imageupload: HTMLInputElement;
    canvas: HTMLCanvasElement;

    constructor() {
        this.uploadbutton = <HTMLDivElement>document.getElementById('uploadbutton');
        this.imageupload = <HTMLInputElement>document.getElementById('imageupload');
        this.canvas = <HTMLCanvasElement>document.getElementById('imageframe');


        this.uploadbutton.addEventListener("click", this.imageupload.click);

        console.log(this.uploadbutton);
        console.log(this.imageupload);
    }
}

window.onload = function() { new UploadPage(); }*/

/*
class UploadImage {
    constructor(public uploadbutton: HTMLDivElement, public imageupload: HTMLInputElement, public canvas: HTMLCanvasElement)
}*/

var uploadbutton, imageupload, canvas, context;

// Function to click on the upload button
function uploadButtonClicked() {
    imageupload.click();
}

// Function that ads an image to a new layer
function addLayerImage(file: File) {
    var reader;

    console.log(file);

    reader = new FileReader();
    reader.onloadend = function () {
        var img = new Image();
        img.onload = function(){
            context.drawImage(img,0,0);

            /* get pixel data by adding the image to a new canvas */
            var tempcanvas = document.createElement("canvas");
            tempcanvas.width = img.width;
            tempcanvas.height = img.height;
            var tempcontext = <CanvasRenderingContext2D>tempcanvas.getContext("2d");
            tempcontext.drawImage(img,0,0);

            /* array van width*height*4 waarbij %4 0=r, 1=g, 2=b, 3=alpha */
            console.log(tempcontext.getImageData(0, 0, img.width, img.height));
        }
        img.src = reader.result;
    }
    reader.readAsDataURL(file);
}

// Function to check if a given file is an image
function isImage(file: File) {
    var types = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp', 'image/svg+xml', 'image/tiff', 'image/vnd.dvju', 'image/pjpeg'];
    return file.type != undefined && types.indexOf(file.type) > -1;
}

// Function that handles the event of a changed file
function filesChanged() {
    console.log(this);
    if (this.files) {
        // The input element is limited to 1 image per upload, but this could be altered
        for (var i = 0; i < this.files.length; i++) {
            if (isImage(this.files[i])) {
                addLayerImage(this.files[i]);
            }
            else {
                window.alert('Unsupported file ' + this.files[i].name);
            }
        }
    }
}

function initDragnDrop() {
    if ('draggable' in document.body) {
        var ondragover = function(e) {
            e.stopPropagation();
            e.preventDefault();
        }
        document.body.addEventListener("dragover", ondragover, false);
        var ondrop = function (e) {
            e.preventDefault();
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                if (isImage(e.dataTransfer.files[i])) {
                    addLayerImage(e.dataTransfer.files[i]);
                }
                else {
                    window.alert('Unsupported file ' + e.dataTransfer.files[i].name);
                }
            }
        }
        document.body.addEventListener("drop", ondrop, false);
    }
}

window.onload = function() {
    uploadbutton = <HTMLDivElement>document.getElementById('uploadbutton');
    imageupload = <HTMLInputElement>document.getElementById('imageupload');
    canvas = <HTMLCanvasElement>document.getElementById('imageframe');
    context = <CanvasRenderingContext2D>canvas.getContext("2d");

    uploadbutton.addEventListener("click", uploadButtonClicked);
    imageupload.addEventListener("change", filesChanged);

    initDragnDrop();
}