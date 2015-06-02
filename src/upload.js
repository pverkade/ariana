/*
 * Project ariana
 * File: upload.ts
 * Author: Sjoerd Wenker
 * Date: June 2th, 2015
 * Description: this file allows users to upload their image
 */
var UploadImage = (function () {
    function UploadImage(uploadbutton, imageupload, canvas) {
        var _this = this;
        this.uploadbutton = uploadbutton;
        this.imageupload = imageupload;
        this.canvas = canvas;
        /*
         * Function to click the upload button
         */
        this.uploadButtonClick = function (e) {
            _this.imageupload.click();
        };
        /*
         * Handler function for changed files (dragged or uploaded)
         */
        this.onFilesChanged = function (e) {
            e.preventDefault();
            var files = (e.target.files || e.dataTransfer.files);
            for (var i = 0; i < files.length; i++) {
                if (_this.isFileSupported(files[i])) {
                    _this.readFile(files[i]);
                }
                else {
                    window.alert('Unsupported file ' + files[i].name);
                }
            }
        };
        /*
         * Function to check if a file is supported by searching for the filetype in
         * our whitelist of filetypes.
         */
        this.isFileSupported = function (file) {
            var types = ['image/jpeg', 'image/gif', 'image/png', 'image/bmp',
                'image/svg+xml', 'image/tiff', 'image/vnd.dvju', 'image/pjpeg'];
            return file.type != undefined && types.indexOf(file.type) > -1;
        };
        /*
         * Function that reads the image file
         */
        this.readFile = function (file) {
            var reader;
            reader = new FileReader();
            reader.addEventListener("loadend", _this.loadImage);
            reader.readAsDataURL(file);
        };
        /*
         * Function that loads an image
         * This function is called if a file is read
         */
        this.loadImage = function (e) {
            var img = new Image();
            img.addEventListener("load", _this.imageLoaded);
            img.src = e.target.result;
        };
        /*
         * Function that adds the image to the canvas
         * This function is called if a image is being load
         */
        this.imageLoaded = function (e) {
            /* Find the image (for some reason chrome uses path[0]) */
            var img = e.target || e.path[0];
            /* Get pixel data by adding the image to a new canvas */
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            /*
             * Array of size width*height*4 which contains rgba values for each pixel
             *  at index x*width+y+i (where i is 0=r, 1=g, 2=b, 3=alpha)
             */
            console.log(context.getImageData(0, 0, img.width, img.height));
            /* Just for the lulz, set the image to the center of the background canvas */
            var x = _this.canvas.width / 2 - img.width / 2;
            var y = _this.canvas.height / 2 - img.height / 2;
            _this.canvas.getContext("2d").drawImage(img, x, y);
        };
        /*
         * Function that enables the drag n drop functionality (if supported)
         * For this to work, the size of the body must be filling the screen..
         *
         * TODO: add feedback to the user so he/se knows filedrop is supported
         */
        this.initDragnDrop = function () {
            if ('draggable' in document.body) {
                document.body.addEventListener("dragover", _this.onDragOver, false);
                document.body.addEventListener("drop", _this.onFilesChanged, false);
            }
        };
        /*
         * on dragover
         */
        this.onDragOver = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        uploadbutton.addEventListener("click", this.uploadButtonClick);
        imageupload.addEventListener("change", this.onFilesChanged);
        this.initDragnDrop();
    }
    return UploadImage;
})();
/* on load, start the Upload functionality */
window.onload = function () {
    var uploadbutton = document.getElementById('uploadbutton');
    var imageupload = document.getElementById('imageupload');
    var canvas = document.getElementById('imageframe');
    var classstart = new UploadImage(uploadbutton, imageupload, canvas);
};
