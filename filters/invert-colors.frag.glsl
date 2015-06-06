precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0) - texture2D(u_texture, v_texCoord) + vec4(0, 0, 0, 1.0);
}

