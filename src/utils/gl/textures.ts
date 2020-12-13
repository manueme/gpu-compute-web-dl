export interface Texture {
  width: number
  height: number
  textureID: WebGLTexture | null
}

export function createTextureFromScratch(
  context: WebGL2ComputeRenderingContext,
  width: number,
  height: number,
): Texture {
  if (context) {
    const tex = context.createTexture()
    context.bindTexture(context.TEXTURE_2D, tex)
    context.texStorage2D(context.TEXTURE_2D, 1, context.RGBA8, width, height)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST)
    return {
      textureID: tex,
      height,
      width,
    }
  }
  return {
    textureID: null,
    height: 1,
    width: 1,
  }
}
