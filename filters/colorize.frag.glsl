precision mediump float;

uniform vec3 color;
uniform sampler2D u_texture;
varying vec2 vTexCoordinate;

void main() {
	gl_FragColor = texture2D(u_texture, vTexCoordinate) + vec4(color, 0.0);
}
