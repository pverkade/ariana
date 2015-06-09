/* global vars */
var R = 0;
var G = 0;
var B = 0;
var H;
var S;
var V;
var palImage;
var hueImage;
var marker_x;
var marker_y;
var bar_y;
var palette
var hue

/* called when page loads */
function init() {
    palette = document.getElementsByClassName("palette")[0];
    hue = document.getElementsByClassName("hue")[0];

    /* add listeners to palette and hue bar */
    palette.addEventListener("mousedown", mousedown_pal);
    hue.addEventListener("mousedown", mousedown_hue)

    /* Initialize all values from hsv values */
    RGBtoHSV();
    update_numbers();
    HSVtoLoc(palette, hue);
    update_preview();

    /*load images */
    palImage = new Image();
    palImage.src = "bgGradient.png";
    

    hueImage = new Image();
    hueImage.src = "hueBar.png";

    /* draw markers */
    palImage.onload = function () {  
        draw_marker(palette.getBoundingClientRect());
        draw_bar(hue.getBoundingClientRect());
    };
}

/* update the values in the text winput fields */
function update_numbers() {
    element = document.getElementsByClassName("rgbhsv");
    element[0].value = R;
    element[1].value = G;
    element[2].value = B;
    element[3].value = Math.floor(H);
    element[4].value = Math.floor(S*100);
    element[5].value = Math.floor(V*100);
    hex_elem = document.getElementsByClassName("hex")[0];
    hex_elem.value = RGBtoHEX();
}

function update_preview() {
    preview = document.getElementsByClassName("preview")[0];
    preview.style.background = "rgb(" + R + "," + G + "," + B + ")";
}

/* called when mouse press on palatte */
function mousedown_pal() {
    handle_pal();
    document.body.addEventListener("mousemove", handle_pal);
    document.body.addEventListener("mouseup", mouseup_pal);
}

/* called when mouse press on hue bar*/
function mousedown_hue() {
    handle_hue();
    document.body.addEventListener("mousemove", handle_hue);
    document.body.addEventListener("mouseup", mouseup_hue);
}

/* called when mouse release after mouse press palette */
function mouseup_pal() {
    document.body.removeEventListener("mousemove", handle_pal);
}

/* called when mouse release after mouse press hue bar */
function mouseup_hue() {
    document.body.removeEventListener("mousemove", handle_hue);
}

/* input: RGB = [0,255] */
/* output: #H3XC0D E */
function RGBtoHEX() {
    return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1).toUpperCase();
}

/* input: (#)hexcode */
/* output: R,G,B = [0,255] */
function HEXtoRGB(hex) {
    //cut away '#', if any.
    if (hex.charAt(0)=="#") {
        hex = hex.substring(1,7)
    }
    R = parseInt(hex.substring(0,2), 16);
    G = parseInt(hex.substring(2,4), 16);
    B = parseInt(hex.substring(4,6), 16);
}

/* input:
 * H = [0,360] 
 * S,V = [0,1]
 * output:
 * R,G,B = [0,255]
 */
function HSVtoRGB() {
    var c, h_a, x;
    c = V * S;
    h_a = H/60;
    x = c * (1 - Math.abs(h_a%2 - 1));
    m = V - c;
    c += m;
    x += m;

    switch (Math.floor(h_a)) {
        case 6:
        case 0: r = c, g = x, b = m; break;
        case 1: r = x, g = c, b = m; break;
        case 2: r = m, g = c, b = x; break;
        case 3: r = m, g = x, b = c; break;
        case 4: r = x, g = m, b = c; break;
        case 5: r = c, g = m, b = x; break;
    }
    R = Math.floor(r * 255);
    G = Math.floor(g * 255);
    B = Math.floor(b * 255);
}

/* input:
 * R,G,B = [0,255] 
 * output:
 * H = [0,360]
 * S,V = [0,1]
 */
function RGBtoHSV() {
    r = R/255;
    g = G/255;
    b = B/255;
    max = Math.max(r,g,b);
    min = Math.min(r,g,b);
    if (r == max) {
        H = (Math.floor(((g - b) / (max - min)) * 60) + 360) % 360;
        //console.log("r", H, g, b, max, min)
    }
    else if (g == max) {
        H = Math.floor((2 + (b - r) / (max - min)) * 60);
        //console.log("g", H, b, r, max, min)
    }
    else {
        H = Math.floor((4 + (r - g) / (max - min)) * 60); 
        //console.log("b", H, r, g, max, min)
    }
    S = (max - min) / max;
    V = max;
    if (isNaN(H)) {
        H = 0;
    }
    if (isNaN(S)) {
        S = 0;
    }
}

/* convert hsv values in marker and bar positions */
function HSVtoLoc() {
    boxPal = palette.getBoundingClientRect();
    boxHue = hue.getBoundingClientRect();

    bar_y = boxHue.bottom - H * (boxHue.bottom - boxHue.top)/360;
    marker_x = boxPal.left + S * (boxPal.right - boxPal.left);
    marker_y = boxPal.top + (1 - V) * (boxPal.bottom - boxPal.top);
}

/* handle mouse input on palatte */
function handle_pal() {
    var pageX, pageY, Lightness, Saturation;

    event = event || window.event; // IE-ism

    // get mouse position
    marker_x = event.pageX;
    marker_y = event.pageY;
    
    box = palette.getBoundingClientRect();

    //prevent marker going off palette
    if (marker_x <= box.left) {
        marker_x = box.left;
    }
    if (marker_y <= box.top) {
        marker_y = box.top;
    }
    if (marker_x >= box.right) {
        marker_x = box.right;
    }
    if (marker_y >= box.bottom) {
        marker_y = box.bottom;
    }
    
    S = (marker_x - box.left)/(box.right - box.left);
    V = 1-(marker_y - box.top)/(box.bottom - box.top);

    HSVtoRGB();

    draw_marker(box);

    update_preview();
    update_numbers();
}

/* handle mouse input on hue bar */
function handle_hue() {
    var pageY;

    event = event || window.event; // IE-ism

    bar_y = event.pageY;
    
    box = hue.getBoundingClientRect();

    if (bar_y <= box.top) {
        bar_y = box.top;
    }
    if (bar_y >= box.bottom) {
        bar_y = box.bottom;
    }

    H = Math.floor(360 - (360/(box.bottom - box.top))*(bar_y - box.top));

    palette.style.background = "hsl(" + H + ",100%, 50%)";    

    HSVtoRGB();

    draw_bar(box);
    draw_marker(palette.getBoundingClientRect());
    
    update_preview();
    update_numbers();
}

/* draw marker on palette */
function draw_marker(box) {
    context = palette.getContext("2d");
    context.clearRect(0, 0, palette.width, palette.height);
    palette.style.background = "hsl(" + H + ",100%, 50%)";
    context.drawImage(palImage, 0, 0);
    context.beginPath();
    context.arc(marker_x-box.left+1,marker_y-box.top+1,5,0,2*Math.PI, false);
    context.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
    context.lineWidth = 1;
    context.strokeStyle = "white";
    context.stroke();
}

/* draw bar on hue bar */
function draw_bar(box) {
    context = hue.getContext("2d");
    context.clearRect(0, 0, hue.width, hue.height);
    context.drawImage(hueImage, 0, 0);
    context.beginPath();
    context.rect(0,bar_y-box.top-3,32,6);
    context.fillStyle = "hsl(" + H + ", 100%, 50%)";
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = "black";
    context.stroke();
}

/* validate text input and update values */
function update_val(evt) {
    value = parseInt(evt.path[0].value);
    min = parseInt(evt.target.min);
    max = parseInt(evt.target.max);
    
    console.log(value);
    /* validate */
    if ((value < min) || (value > max) || (isNaN(value))) {
        evt.path[0].value = 0;
        return false;
    }

    /* update */
    if (evt.path[0].name == "R") {
        R = value;
        RGBtoHSV();
    }
    else if (evt.path[0].name == "G") {
        G = value;
        RGBtoHSV();
    }
    else if (evt.path[0].name == "B") {
        B = value;
        RGBtoHSV();
    }
    else if (evt.path[0].name == "H") {
        H = value;
        HSVtoRGB();
    }
    else if (evt.path[0].name == "S") {
        S = value/100;
        HSVtoRGB();
    }
    else if (evt.path[0].name == "V") {
        V = value/100;
        HSVtoRGB();
    }

    update_numbers();
    update_preview();
    HSVtoLoc();

    palette.style.background = "hsl(" + H + ",100%, 50%)";  
    draw_marker(palette.getBoundingClientRect());
    draw_bar(hue.getBoundingClientRect());
}

function update_hex(evt) {
    value = evt.path[0].value;

    /* validate */
    if (/^#?[0-9A-F]{6}$/i.test(value)) {

        HEXtoRGB(value);
        RGBtoHSV();

        update_numbers();
        update_preview();
        HSVtoLoc();

        palette.style.background = "hsl(" + H + ",100%, 50%)";  
        draw_marker(palette.getBoundingClientRect());
        draw_bar(hue.getBoundingClientRect());
    }
}