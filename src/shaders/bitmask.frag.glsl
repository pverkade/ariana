precision mediump float;

varying vec2 v_texCoord;
uniform sampler2D u_bitmask;

void main() {
    vec4 texColor = texture2D(u_bitmask, v_texCoord);
    //float mask = texture2D(u_bitmask, v_texCoord).a;

    if (texColor.r == 0.0) {
        discard;
    }

    gl_FragColor = texColor;
}