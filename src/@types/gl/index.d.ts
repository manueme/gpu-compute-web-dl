declare module '*.vert' {
  const content: string
  export default content
}
declare module '*.frag' {
  const content: string
  export default content
}
declare module '*.comp' {
  const content: string
  export default content
}
declare module '*.glsl' {
  const content: string
  export default content
}

type WebGL2ComputeRenderingContext = WebGL2RenderingContext & {
  readonly COMPUTE_SHADER: GLenum
  readonly WRITE_ONLY: GLenum
  readonly READ_ONLY: GLenum
  readonly READ_WRITE: GLenum
  readonly SHADER_IMAGE_ACCESS_BARRIER_BIT: GLenum
  readonly SHADER_STORAGE_BARRIER_BIT: GLenum
  readonly SHADER_STORAGE_BUFFER: GLenum

  // https://www.khronos.org/registry/webgl/specs/latest/2.0-compute/#dom-webgl2computerenderingcontextbase-bindimagetexture-unit-texture-level-layered-layer-access-format-level
  bindImageTexture(
    unit: GLuint,
    texture: WebGLTexture | null,
    level: GLint,
    layered: GLboolean,
    layer: GLint,
    access: GLenum,
    format: GLenum,
  ): void

  // https://www.khronos.org/registry/webgl/specs/latest/2.0-compute/#dom-webgl2computerenderingcontextbase-dispatchcompute-num_groups_x-num_groups_y-num_groups_z-num_groups_z
  dispatchCompute(numGroupsX: GLuint, numGroupsY: GLuint, numGroupsZ: GLuint): void

  memoryBarrier(barriers: GLbitfield): void
}
