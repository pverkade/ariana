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