var gl, squareVertexBuffer;

function createGLContext(id : string) : void {
	var canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById(id);

	try {
		// Try to grab the standard context. If it fails, fallback to experimental.
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
	}
	catch(e) {
		console.log(e.stack);
		return;
	}
}

function compileProgram(vertexShader : WebGLShader, fragmentShader : WebGLShader) : WebGLProgram{
	// Create the shader program
	var shaderProgram : WebGLProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	gl.linkProgram(shaderProgram);
	
	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}
	
	return shaderProgram;
}

function compileShaderFromScript(id : string) : WebGLShader {
	var shaderScript, theSource, currentChild, shader;
	
	shaderScript = document.getElementById(id);
	
	if (!shaderScript) {
		alert("Shader not found in DOM!");
		return null;
	}
	
	theSource = "";
	currentChild = shaderScript.firstChild;
	
	while(currentChild) {
		if (currentChild.nodeType == currentChild.TEXT_NODE) {
			theSource += currentChild.textContent;
		}
		
		currentChild = currentChild.nextSibling;
	}

	if (shaderScript.type == "x-shader/x-fragment") {
		return compileShader(theSource, gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		return compileShader(theSource, gl.VERTEX_SHADER);
	} else {
		return null;
	}	
}

function compileShader(shaderSource : string, shaderType : number) : WebGLShader {
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSource);
		
	// Compile the shader program
	gl.compileShader(shader);  
		
	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
			alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
			return null;
	}
	return shader;
}