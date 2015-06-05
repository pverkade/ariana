precision highp float;
varying vec2 v_texCoord;
uniform sampler2D u_bitmask;

void main() {
    vec4 texColor = texture2D(u_sampler, v_texCoord);
    float mask = texture2D(u_bitmask, v_texCoord).a;

    if (mask == 0) {
        discard;
    }

    gl_FragColor = vec4(0.3, 0.6, 0.8, 0.35);
}