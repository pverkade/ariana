/*
 * Project Ariana
 * colorFunctions.js
 *
 * This file contains a function for transforming different color formats. 
 *
 */

/* This functions converts an HSV object to an RGB object. */
function HSVtoRGB(hsv) {
    var c, h_a, x, m, s, v;
    s = hsv.s / 100;
    v = hsv.v / 100;

    c = v * s;
    hueIndex = hsv.h / 60;
    x = c * (1 - Math.abs(hueIndex % 2 - 1));
    m = v - c;
    c += m;
    x += m;

    switch (Math.floor(hueIndex)) {
        case 6:
        case 0: r = c, g = x, b = m; break;
        case 1: r = x, g = c, b = m; break;
        case 2: r = m, g = c, b = x; break;
        case 3: r = m, g = x, b = c; break;
        case 4: r = x, g = m, b = c; break;
        case 5: r = c, g = m, b = x; break;
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/* This functions converts an RGB object to an HSV object. */
function RGBtoHSV(rgb) {
    var r, g, b, max, min, h, s, v;
    r = rgb.r / 255;
    g = rgb.g / 255;
    b = rgb.b / 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    
    if (r == max) {
        h = (Math.round(((g - b) / (max - min)) * 60) + 360) % 360;
    }
    else if (g == max) {
        h = Math.round((2 + (b - r) / (max - min)) * 60);
    }
    else {
        h = Math.round((4 + (r - g) / (max - min)) * 60); 
    }
    
    s = (max - min) / max;
    v = max;
    
    if (isNaN(h)) {
        h = 0;
    }
    if (isNaN(s)) {
        s = 0;
    }
    
    return {
        h: h, 
        s: Math.round(s * 100), 
        v: Math.round(v * 100)
    };
}

/* This functions returns the corresponding hexcode from a given RGB object. */
function RGBtoHEX(rgb) {
    return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1).toUpperCase();
}

/* This functions creates an RGB object for a hexcode string. */
function HEXtoRGB(hex) {
    /* Cut away any leading '#'. */
    if (hex.charAt(0) == "#") {
        hex = hex.substring(1,7)
    }
    
    return {
        r: parseInt(hex.substring(0,2), 16),
        g: parseInt(hex.substring(2,4), 16),
        b: parseInt(hex.substring(4,6), 16)
    };
}