precision mediump float;

varying vec2 v_texCoord;
uniform float u_width;
uniform float u_height;

void main() {
    vec2 texCoord = v_texCoord;
    float x = u_width * ((texCoord.x+1.0) / 2.0);
    float y = u_height * ((texCoord.y+1.0) / 2.0);

    float blockSize = 20.0;
    bool x_true = x / blockSize - floor(x / blockSize) > .5;
    bool y_true = y / blockSize - floor(y / blockSize) > .5;
    if ((x_true && y_true) || (!x_true && !y_true)) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.75, 0.75, 0.75, 1.0);
    }
}