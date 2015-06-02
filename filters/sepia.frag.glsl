precision mediump float;

const vec3 gMonoMult = vec3(0.299, 0.587, 0.114);

uniform float depth;
uniform float intensity;
uniform sampler2D u_texture;
varying vec2 v_texCoordinate;

void main() {
	vec4 texColor = texture2D(u_texture, v_texCoordinate);
	vec3 luma = vec3(dot(texColor.xyz, gMonoMult));

	gl_FragColor = vec4(luma + vec3(depth * 2, depth, -intensity), 1.0);
}
