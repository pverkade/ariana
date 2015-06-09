varying highp vec2 v_texCoord;

uniform sampler2D u_sampler;

void main(void) {
    gl_FragColor = texture2D(u_sampler, v_texCoord);
}
