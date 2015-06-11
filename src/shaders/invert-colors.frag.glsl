precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_texCoord;

void main() {
    vec4 texColor = texture2D(u_texture, v_texCoord);
    gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) - texColor.rgb, texColor.a);
}

