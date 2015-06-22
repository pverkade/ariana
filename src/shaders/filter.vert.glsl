attribute vec2 a_position;
attribute vec2 a_texCoord;

varying highp vec2 v_texCoord;

void main(void) {
  gl_Position = vec4(vec2(1, -1) * a_position, 0, 1);
  v_texCoord = a_texCoord;
}