import videoFilterShader from './videoFilter.comp'
import matrixMultiplyShader from './matrixMultiply.comp'
import { Shader } from '../../shader'
import { createTextureFromScratch, Texture } from '../../../utils/gl/textures'

export class VideoFilterComputeShader {
  private readonly context: WebGL2ComputeRenderingContext
  private framebuffer: WebGLFramebuffer | null = null
  private program: Shader
  private video: HTMLVideoElement | undefined = undefined
  private videoTexture: Texture | undefined = undefined
  private frameBufferTexture: Texture | undefined = undefined
  private enabled = false

  constructor(context: WebGL2ComputeRenderingContext) {
    this.context = context
    this.program = new Shader(context, [
      {
        source: videoFilterShader,
        shaderType: context.COMPUTE_SHADER,
      },
    ])
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  public setVideo(video: HTMLVideoElement) {
    this.videoTexture = createTextureFromScratch(this.context, video.videoWidth, video.videoHeight)
    this.context.bindTexture(this.context.TEXTURE_2D, this.videoTexture.textureID)
    this.context.pixelStorei(this.context.UNPACK_FLIP_Y_WEBGL, true) // the video is flipped vertically
    this.context.canvas.width = this.videoTexture.width
    this.context.canvas.height = this.videoTexture.height
    this.video = video
    this.framebuffer = this.context.createFramebuffer()
    this.context.bindFramebuffer(this.context.READ_FRAMEBUFFER, this.framebuffer)
    this.frameBufferTexture = createTextureFromScratch(
      this.context,
      video.videoWidth,
      video.videoHeight,
    )
    this.context.framebufferTexture2D(
      this.context.READ_FRAMEBUFFER,
      this.context.COLOR_ATTACHMENT0,
      this.context.TEXTURE_2D,
      this.frameBufferTexture.textureID,
      0,
    )
  }

  public filter() {
    if (this.video && this.videoTexture && this.frameBufferTexture && this.framebuffer) {
      this.program.use()
      this.context.bindImageTexture(
        0,
        this.videoTexture.textureID,
        0,
        false,
        0,
        this.context.READ_ONLY,
        this.context.RGBA8,
      )
      this.context.bindTexture(this.context.TEXTURE_2D, this.videoTexture.textureID)
      this.context.texSubImage2D(
        this.context.TEXTURE_2D,
        0,
        0,
        0,
        this.context.RGBA,
        this.context.UNSIGNED_BYTE,
        this.video,
      )
      this.context.bindFramebuffer(this.context.READ_FRAMEBUFFER, this.framebuffer)
      this.context.bindImageTexture(
        1,
        this.frameBufferTexture.textureID,
        0,
        false,
        0,
        this.context.WRITE_ONLY,
        this.context.RGBA8,
      )
      this.program.setBool('enabled', this.enabled)
      this.context.dispatchCompute(this.videoTexture.width / 16, this.videoTexture.height / 16, 1)
      this.context.memoryBarrier(this.context.SHADER_IMAGE_ACCESS_BARRIER_BIT)
      // show computed texture to Canvas
      this.context.blitFramebuffer(
        0,
        0,
        this.videoTexture.width,
        this.videoTexture.height,
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height,
        this.context.COLOR_BUFFER_BIT,
        this.context.NEAREST,
      )
    }
  }
}

const LOCAL_SIZE = 32
export class MatrixMultiplyComputeShader extends Shader {
  private A: Float32Array = new Float32Array()
  private B: Float32Array = new Float32Array()
  private C_GPU: Float32Array = new Float32Array()
  private C_CPU: Float32Array = new Float32Array()
  private N = 1024

  constructor(context: WebGL2ComputeRenderingContext, size: number) {
    super(context, [
      {
        source: matrixMultiplyShader.replaceAll('LOCAL_SIZE', `${LOCAL_SIZE}u`),
        shaderType: context.COMPUTE_SHADER,
      },
    ])

    this.setSize(size)
  }

  public setSize(size: number) {
    if (this.context) {
      this.N = Math.ceil(size / LOCAL_SIZE) * LOCAL_SIZE
      this.A = new Float32Array(this.N * this.N)
      this.B = new Float32Array(this.N * this.N)
      this.C_GPU = new Float32Array(this.N * this.N)
      this.C_CPU = new Float32Array(this.N * this.N)
      for (let i = 0; i < this.N * this.N; i++) {
        this.A[i] = 100 * Math.random()
        this.B[i] = 100 * Math.random()
      }
      const bufA = this.context.createBuffer()
      this.context.bindBuffer(this.context.SHADER_STORAGE_BUFFER, bufA)
      this.context.bufferData(this.context.SHADER_STORAGE_BUFFER, this.A, this.context.STATIC_DRAW)
      this.context.bindBufferBase(this.context.SHADER_STORAGE_BUFFER, 0, bufA)
      const bufB = this.context.createBuffer()
      this.context.bindBuffer(this.context.SHADER_STORAGE_BUFFER, bufB)
      this.context.bufferData(this.context.SHADER_STORAGE_BUFFER, this.B, this.context.STATIC_DRAW)
      this.context.bindBufferBase(this.context.SHADER_STORAGE_BUFFER, 1, bufB)
      const bufC = this.context.createBuffer()
      this.context.bindBuffer(this.context.SHADER_STORAGE_BUFFER, bufC)
      this.context.bufferData(
        this.context.SHADER_STORAGE_BUFFER,
        this.C_GPU,
        this.context.STATIC_DRAW,
      )
      this.context.bindBufferBase(this.context.SHADER_STORAGE_BUFFER, 2, bufC)

      this.context.memoryBarrier(this.context.SHADER_STORAGE_BARRIER_BIT)
    }
  }

  public multiplyGPU() {
    if (this.context) {
      this.use()
      this.setVec3ui('MNK', [this.N, this.N, this.N])
      this.context.dispatchCompute(this.N / LOCAL_SIZE, this.N / LOCAL_SIZE, 1)
      this.context.memoryBarrier(this.context.SHADER_STORAGE_BARRIER_BIT)
      // target: GLenum, srcByteOffset: GLintptr, dstBuffer: ArrayBufferView, dstOffset?: GLuint, length?: GLuint
      this.context.getBufferSubData(
        this.context.SHADER_STORAGE_BUFFER,
        0,
        this.C_GPU,
        0,
        this.getSize(),
      )
    }
  }

  public multiplyCPU() {
    for (let m = 0; m < this.N; m++) {
      for (let n = 0; n < this.N; n++) {
        let acc = 0.0
        for (let k = 0; k < this.N; k++) {
          // GPU uses 32bit float, in order to compare the Javascript result we use Math.fround
          acc = Math.fround(acc + this.A[k * this.N + m] * this.B[n * this.N + k])
        }
        this.C_CPU[n * this.N + m] = acc
      }
    }
  }

  public getGPUResult() {
    return this.C_GPU
  }

  public getCPUResult() {
    return this.C_CPU
  }

  public getSize() {
    return this.N * this.N
  }
}
