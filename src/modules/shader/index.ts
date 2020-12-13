import { showError } from '../../utils/errors'
import { checkGlError } from '../../utils/gl/errors'

export function loadShader(
  context: WebGL2ComputeRenderingContext,
  shaderSource: string,
  shaderType: GLenum,
): WebGLShader | null {
  const shader = context.createShader(shaderType)
  if (!shader) {
    showError('Could not load shader!')
    return null
  }
  context.shaderSource(shader, shaderSource)
  context.compileShader(shader)
  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    showError(context.getShaderInfoLog(shader))
    context.deleteShader(shader)
    return null
  }
  return shader
}

export function createShaderProgram(
  gl: WebGL2ComputeRenderingContext,
  shaders: WebGLShader[],
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) {
    showError('Could not create shader program!')
    return null
  }
  shaders.forEach(function (shader) {
    gl.attachShader(program, shader)
  })
  gl.linkProgram(program)

  // Check the link status
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    showError(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }
  return program
}

interface ShaderProgramSource {
  source: string
  shaderType: GLenum
}

export function createShaderProgramFromSources(
  gl: WebGL2ComputeRenderingContext,
  shaderSources: ShaderProgramSource[],
) {
  const shaders: WebGLShader[] = []
  shaderSources.forEach((sc) => {
    const shader = loadShader(gl, sc.source, sc.shaderType)
    if (shader) {
      shaders.push(shader)
    }
  })
  return createShaderProgram(gl, shaders)
}

export type Vec3 = [number, number, number]

export class Shader {
  protected program: WebGLProgram | null
  protected context: WebGL2ComputeRenderingContext | null
  constructor(context: WebGL2ComputeRenderingContext, shaderSources: ShaderProgramSource[]) {
    this.context = context
    this.program = createShaderProgramFromSources(context, shaderSources)
  }

  public use() {
    this.context?.useProgram(this.program)
    checkGlError(this.context, 'trying to use shader')
  }

  public setInt(name: string, value: number) {
    if (this.program) {
      this.context?.uniform1i(this.context.getUniformLocation(this.program, name), value)
      checkGlError(this.context, 'setting uniform ' + name)
    }
  }

  public setBool(name: string, value: boolean) {
    if (this.program) {
      this.context?.uniform1i(this.context.getUniformLocation(this.program, name), value ? 1 : 0)
      checkGlError(this.context, 'setting uniform ' + name)
    }
  }

  public setVec3ui(name: string, value: Vec3 | Float32Array) {
    if (this.program) {
      this.context?.uniform3uiv(this.context.getUniformLocation(this.program, name), value)
      checkGlError(this.context, 'setting uniform ' + name)
    }
  }
}
