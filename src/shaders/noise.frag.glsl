precision mediump float;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

uniform vec3 u_seed;
uniform float u_noiseValue;
uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    float randF = rand(v_texCoord.xy + u_seed.xy);
	vec3 result = u_noiseValue * 2.0 * (vec3(randF) - 0.5);

    gl_FragColor = vec4(texColor.rgb + result, texColor.a);
}
