var canvas   = document.body.appendChild(document.createElement('canvas'))
var gl       = require('gl-context')(canvas, render)
var glBuffer = require('gl-buffer')
var mat4     = require('gl-mat4')
var glslify  = require('glslify')

var shader = glslify({
  frag: './shader.frag',
  vert: './shader.vert'
})(gl)

var triangleMatrix   = mat4.create()
var squareMatrix     = mat4.create()
var projectionMatrix = mat4.create()

var triangle = glBuffer(gl, new Float32Array([
  +0.0, +1.0, +0.0,
  -1.0, -1.0, +0.0,
  +1.0, -1.0, +0.0
]))

var square = glBuffer(gl, new Float32Array([
  +1.0, +1.0, +0.0,
  -1.0, +1.0, +0.0,
  +1.0, -1.0, +0.0,
  -1.0, -1.0, +0.0
]))

triangle.length = 3
square.length = 4

function render() {
  var width = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight

  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enableVertexAttribArray(0)

  // Calculate projection matrix
  mat4.perspective(projectionMatrix, Math.PI / 4, width / height, 0.1, 100)
  // Calculate triangle's modelView matrix
  mat4.identity(triangleMatrix, triangleMatrix)
  mat4.translate(triangleMatrix, triangleMatrix, [-1.5, 0, -7])
  // Calculate squares's modelView matrix
  mat4.copy(squareMatrix, triangleMatrix)
  mat4.translate(squareMatrix, squareMatrix, [3, 0, 0])

  // Bind the shader
  shader.bind()
  shader.uniforms.uProjection = projectionMatrix

  // Draw the triangle
  triangle.bind()
  shader.uniforms.uModelView = triangleMatrix
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
  gl.drawArrays(gl.TRIANGLES, 0, triangle.length)

  // Draw the square
  square.bind()
  shader.uniforms.uModelView = squareMatrix
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

// Resize the canvas to fit the screen
window.addEventListener('resize'
  , require('canvas-fit')(canvas)
  , false
)
