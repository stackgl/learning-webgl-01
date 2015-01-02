precision mediump float;

attribute vec3 aPosition;

uniform mat4 uModelView;
uniform mat4 uProjection;

void main() {
  gl_Position = uProjection * uModelView * vec4(aPosition, 1.0);
}
