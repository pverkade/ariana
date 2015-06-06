/// <reference path="shaders"/>

function compileProgram(gl : WebGLRenderingContext, vertexShader : WebGLShader, fragmentShader : WebGLShader) : WebGLProgram{
	/* Create the shader program */
	var shaderProgram : WebGLProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	gl.linkProgram(shaderProgram);
	
	/* If creating the shader program failed, alert */
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}
	
	return shaderProgram;
}

function compileShaderFromScript(gl : WebGLRenderingContext, id : string) : WebGLShader {
    console.log(id in SHADERS);
    if (! (id in SHADERS)) {
        return null;
    }

    var shaderScript = SHADERS[id];

	if (shaderScript.type == "x-shader/x-fragment") {
		return compileShader(gl, shaderScript.source, gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		return compileShader(gl, shaderScript.source, gl.VERTEX_SHADER);
	} else {
		return null;
	}	
}

function compileShader(gl : WebGLRenderingContext, shaderSource : string, shaderType : number) : WebGLShader {
    console.log('compileShader', shaderSource);
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSource);
		
	/* Compile the shader program */
	gl.compileShader(shader);  
		
	/* See if it compiled successfully */
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
			alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
			return null;
	}
	return shader;
}