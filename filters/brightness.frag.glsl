precision mediump float;

uniform float u_brightness = 0;
uniform sampler2D u_texture;
varying vec2 v_texCoordinate;

void main() {
	vec4 texColor = texture2D(u_texture, v_texCoordinate);
	gl_FragColor = texColor * u_brightness + vec4(0, 0, 0, 1.0);
}
