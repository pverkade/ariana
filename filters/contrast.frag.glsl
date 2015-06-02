precision mediump float;

const vec3 gHalf = vec3(.5, .5, .5);
varying vec2 vTexCoordinate;

uniform float contrastValue ;
uniform sampler2D u_texture;

void main() {
	vec4 texColor = texture2D(u_texture, vTexCoordinate);
	vec3 result = (texColor.xyz - gHalf) * contrastValue + gHalf;
	gl_FragColor = vec4(result, 1.0);
}
