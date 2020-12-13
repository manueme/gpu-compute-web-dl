import { MatrixMultiplyComputeShader, VideoFilterComputeShader } from './shaders'
import { showError } from '../../utils/errors'
import { useEffect, useState } from 'react'

export const useComputeHandler = () => {
  const [offscreenCanvas, setOffscreenCanvas] = useState<OffscreenCanvas | null>()
  const [
    matrixMultiplyComputeShader,
    setMatrixMultiplyComputeShader,
  ] = useState<MatrixMultiplyComputeShader | null>()
  const [
    videoFilterComputeShader,
    setVideoFilterComputeShader,
  ] = useState<VideoFilterComputeShader | null>()

  useEffect(() => {
    const canvas = new OffscreenCanvas(1, 1)
    const context = canvas.getContext('webgl2-compute' as any, {
      antialias: false,
    }) as WebGL2ComputeRenderingContext | null
    if (!context) {
      showError('Could not find context!')
      return
    }
    setOffscreenCanvas(canvas)
    setVideoFilterComputeShader(new VideoFilterComputeShader(context))
    setMatrixMultiplyComputeShader(new MatrixMultiplyComputeShader(context, 64))
  }, [])

  return {
    offscreenCanvas,
    videoFilterComputeShader,
    matrixMultiplyComputeShader,
  }
}
