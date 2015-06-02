/*
 * Project ariana
 * File: upload.ts
 * Author: Sjoerd Wenker
 * Date: June 2th, 2015
 * Description: this file allows users to upload their image
 */

class UploadImage {
    constructor(public uploadbutton: HTMLDivElement,
                public imageupload: HTMLInputElement,
                public canvas: HTMLCanvasElement) {

        uploadbutton.addEventListener("click", this.uploadButtonClick);
        imageupload.addEventListener("change", this.onFilesChanged);

        this.initDragnDrop();
    }

    /*
     * Function to click the upload button
     */
    uploadButtonClick = (e: Event) => {
        this.imageupload.click();
    }

    /*
     * Handler function for changed files (dragged or uploaded)
     */
    onFilesChanged = (e) => {
        e.preventDefault();

        var files: FileList = e.target.files || e.dataTransfer.files;

        for (var i = 0; i < files.length; i++) {
            if (this.isFileSupported(files[i])) {
                this.readFile(files[i]);
            }
            else {
                window.alert('Unsupported file ' + files[i].name);
            }
        }
    }

    /*
     * Function to check if a file is supported by searching for the filetype in
     * our whitelist of filetypes.
     */
    isFileSupported = (file: File):boolean => {
        var types = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp',
                     'image/svg+xml', 'image/tiff', 'image/vnd.dvju', 'image/pjpeg'];
        return file.type != undefined && types.indexOf(file.type) > -1;
    }

    /*
     * Function that reads the image file
     */
    readFile = (file: File) => {
        var reader: FileReader;
        reader = new FileReader();
        reader.addEventListener("loadend", this.loadImage);
        reader.readAsDataURL(file);
    }

    /*
     * Function that loads an image
     * This function is called if a file is read
     */
    loadImage = (e: ProgressEvent) => {
        var img = new Image();
        img.addEventListener("load", this.imageLoaded);
        img.src = (<FileReader>e.target).result;
    }

    /*
     * Function that adds the image to the canvas
     * This function is called if a image is being load
     */
    imageLoaded = (e) => {
        /* Find the image (for some reason chrome uses path[0]) */
        var img = e.target || e.path[0];

        /* Get pixel data by adding the image to a new canvas */
        var canvas = <HTMLCanvasElement>document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var context = <CanvasRenderingContext2D>canvas.getContext("2d");
        context.drawImage(img,0,0);

        /*
         * ImageData imageData contains the width, length and data.
         * data is an Uint8ClampedArray of size width*height*4 which contains
         *  rgba values for each pixel at index x*width+y+i
         *  (value of i is 0=red, 1=green, 2=blue or 3=alpha)
         * Values of data array are in 0-255
         */
        var imageData: ImageData;
        imageData = context.getImageData(0, 0, img.width, img.height);
        console.log(imageData);

        /* Just for the lulz, set the image to the center of the background canvas */
        var x = this.canvas.width / 2 - img.width / 2;
        var y = this.canvas.height / 2 - img.height / 2;
        (<CanvasRenderingContext2D>this.canvas.getContext("2d")).drawImage(img, x, y);
    }

    /*
     * Function that enables the drag n drop functionality (if supported)
     * For this to work, the size of the body must be filling the screen..
     *
     * TODO: add feedback to the user so he/se knows filedrop is supported
     */
    initDragnDrop = () => {
        if ('draggable' in document.body) {
            document.body.addEventListener("dragover", this.onDragOver, false);
            document.body.addEventListener("drop", this.onFilesChanged, false);
        }
    }

    /*
     * on dragover
     */
    onDragOver = (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    }
}

/* on load, start the Upload functionality */
window.onload = function() {
    var uploadbutton = <HTMLDivElement>document.getElementById('uploadbutton');
    var imageupload = <HTMLInputElement>document.getElementById('imageupload');
    var canvas = <HTMLCanvasElement>document.getElementById('imageframe');

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    var classstart = new UploadImage(uploadbutton, imageupload, canvas);
}