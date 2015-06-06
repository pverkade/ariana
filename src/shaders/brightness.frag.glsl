precision highp float;

varying vec2 v_texCoord;

uniform float u_brightness;
uniform sampler2D u_sampler;

void main() {
	vec4 texColor = texture2D(u_sampler, v_texCoord);
	gl_FragColor = vec4(texColor.rgb*u_brightness, texColor.a);
}
