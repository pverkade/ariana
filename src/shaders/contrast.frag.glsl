precision mediump float;

const vec3 gHalf = vec3(.5, .5, .5);
varying vec2 v_texCoord;

uniform float u_contrastValue ;
uniform sampler2D u_texture;

void main() {
	vec4 texColor = texture2D(u_texture, v_texCoord);
	vec3 result = (texColor.xyz - gHalf) * u_contrastValue + gHalf;
	gl_FragColor = vec4(result, texColor.a);
}
