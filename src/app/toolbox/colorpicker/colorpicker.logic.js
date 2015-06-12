app.controller("ColorpickerCtrl", ['$scope', 
	function($scope) {
		$scope.color = {
			R: 0,
			G: 0,
			B: 0,
			H: 180,
			S: 0,
			V: 0,
			hex: "#000000",
		}

		var palette = document.getElementById("palette");
		var palImg = new Image();
		palImg.src = "assets/img/bgGradient.png";

		var hue = document.getElementById("hue");
		var hueImg = new Image();
		hueImg.src = "assets/img/hueBar.png";

		hueImg.onload = function() {
			palette.getContext('2d').drawImage(palImg,0,0);
			hue.getContext('2d').drawImage(hueImg,0,0);
		};

		


		//
	    //hue = document.getElementsByClassName("hue")[0];

	    /* add listeners to palette and hue bar */
	    //palette.addEventListener("mousedown", mousedown_pal);
	    //hue.addEventListener("mousedown", mousedown_hue)

	    /* Initialize all values from hsv values */
	    //RGBtoHSV();
	    //HSVtoLoc(palette, hue);

	    /*load images */
	    //palImage 

	    //hueImage = new Image();
	    //hueImage.src = "hueBar.png";

	    /* draw markers */
        //draw_marker(palette.getBoundingClientRect());
        //draw_bar(hue.getBoundingClientRect());

		console.log('hi');

/*


	this.palImage;
	this.hueImage;
	this.marker_x;
	this.marker_y;
	this.bar_y;
	this.palette
	this.hue

	this.init = function() {
	    
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
*/
	}
]);