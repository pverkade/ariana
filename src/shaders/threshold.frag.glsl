precision mediump float;
varying vec2 v_texCoord;

uniform float u_threshold;
uniform sampler2D u_sampler;

void main() {
	vec4 texColor = texture2D(u_sampler, v_texCoord);

	if (texColor.x + texColor.y + texColor.z < 3.0 * u_threshold) {
	    gl_FragColor = vec4(0.0, 0.0, 0.0, texColor.a);
	    return;
	}
	else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, texColor.a);
        return;
	}
}
