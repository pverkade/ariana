precision mediump float;

uniform float brightness = 0;
uniform sampler2D u_texture;
varying vec2 v_texCoordinate;

void main() {
	vec4 texColor = texture2D(u_texture, v_texCoordinate);
	gl_FragColor = texColor * brightness + vec4(0, 0, 0, 1.0);
}
