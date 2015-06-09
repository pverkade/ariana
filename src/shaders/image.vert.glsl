attribute vec2 a_position;
attribute vec2 a_texCoord;

varying highp vec2 v_texCoord;

uniform mat3 u_matrix;

void main(void) {
  gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 1, 1);
  v_texCoord = a_texCoord;
}