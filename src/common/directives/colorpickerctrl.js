controller("ColorpickerCtrl", function() {
	this.Color.R;
	this.Color.G;
	this.Color.B;
	this.Color.H;
	this.Color.S;
	this.Color.V;
	this.palImage;
	this.hueImage;
	this.marker_x;
	this.marker_y;
	this.bar_y;
	this.palette
	this.hue

	this.init = function() {
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

	this.update_numbers = function() {
	    element = document.getElementsByClassName("rgbhsv");
	    element[0].value = R;
	    element[1].value = G;
	    element[2].value = B;
	    element[3].value = Math.round(H);
	    element[4].value = Math.round(S*100);
	    element[5].value = Math.round(V*100);
	    hex_elem = document.getElementsByClassName("hex")[0];
	    hex_elem.value = RGBtoHEX();
	}

	this.update_preview = function() {
	    preview = document.getElementsByClassName("preview")[0];
	    preview.style.background = "rgb(" + R + "," + G + "," + B + ")";
	}

	this.mousedown_pal = function() {
	    handle_pal();
	    document.body.addEventListener("mousemove", handle_pal);
	    document.body.addEventListener("mouseup", mouseup_pal);
	}

	function mousedown_hue() {
    handle_hue();
    document.body.addEventListener("mousemove", handle_hue);
    document.body.addEventListener("mouseup", mouseup_hue);
}
});