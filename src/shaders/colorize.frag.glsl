precision mediump float;

uniform vec3 u_color;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
	gl_FragColor = texture2D(u_texture, v_texCoord) + vec4(u_color, 0.0);
}
