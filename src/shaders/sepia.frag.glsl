precision mediump float;

const vec3 gMonoMult = vec3(0.299, 0.587, 0.114);

uniform float u_depth;
uniform float u_intensity;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
	vec4 texColor = texture2D(u_texture, v_texCoord);
	vec3 luma = vec3(dot(texColor.xyz, gMonoMult));

	gl_FragColor = vec4(luma + vec3(u_depth * 2.0, u_depth, - u_intensity), texColor.a);
}
