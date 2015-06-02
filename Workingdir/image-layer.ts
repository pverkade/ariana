/// <reference path="render-helper"/>
/// <reference path="gl-matrix"/>
/// <reference path="layer"/>

class ImageLayer extends Layer {
	matrixLocation : WebGLUniformLocation;
	
	vertexBuffer : WebGLBuffer;
	texture : WebGLTexture;
	
	constructor(image) {
		super();
		
		var vertexShader = compileShaderFromScript("image-shader-vs");
		var fragmentShader = compileShaderFromScript("image-shader-fs");
	
		this.program = compileProgram(vertexShader, fragmentShader);
	
		var positionLocation = gl.getAttribLocation(this.program, "a_position");
		var texCoordLocation = gl.getAttribLocation(this.program, "a_texCoord");
		this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
	
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	 
		// Set up texture so we can render any size image and so we are
		// working with pixels.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	
		gl.enableVertexAttribArray(positionLocation);
		gl.enableVertexAttribArray(texCoordLocation);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
		gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8);
	}
	
	setupRender() {
		gl.useProgram(this.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	};
	
	render() {
		var matrix : Float32Array = mat3.create();
		mat3.identity(matrix);
		mat3.multiply(matrix, matrix, this.translationMatrix);
		mat3.multiply(matrix, matrix, this.rotationMatrix);
		mat3.multiply(matrix, matrix, this.scaleMatrix);
		
		gl.uniformMatrix3fv(this.matrixLocation, false, matrix);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	};
}