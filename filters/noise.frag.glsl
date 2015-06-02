precision mediump float;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

uniform vec3 seed;
uniform float noiseValue;
uniform sampler2D u_texture;
varying vec2 v_texCoordinate;

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoordinate);
    float randF = rand(v_texCoordinate.xy + seed.xy);
	vec3 result = noiseValue * 2.0 * (vec3(randF) - 0.5);

    gl_FragColor = vec4(texColor.rgb + result, texColor.a);
}
