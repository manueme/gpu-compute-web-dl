import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles/app.module.scss'
import { VideoFilterComputeShader } from '../../../modules/compute-handler/shaders'
import { accessWebcam } from '../../../utils/webcam'

interface WebCamFilterDemoProps {
  offscreenCanvas: OffscreenCanvas
  videoFilterComputeShader: VideoFilterComputeShader
}

const WebCamFilterDemo: React.FC<WebCamFilterDemoProps> = ({
  offscreenCanvas,
  videoFilterComputeShader,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enableFilter, setEnableFilter] = useState(false)
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  function updateVideo(enable: boolean) {
    const render2d = canvasRef.current?.getContext('2d')
    if (!render2d) {
      return
    }
    videoFilterComputeShader.filter()
    render2d.clearRect(0, 0, render2d.canvas.width, render2d.canvas.height)
    render2d.drawImage(offscreenCanvas, 0, 0)
  }

  function render(time: number) {
    if (previousTimeRef.current != undefined) {
      updateVideo(enableFilter)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(render)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render)
    return () => cancelAnimationFrame(requestRef.current as number)
  }, []) // Make sure the effect runs only once

  function requestWebCam() {
    if (videoRef.current) {
      accessWebcam(videoRef.current).then(() => {
        videoFilterComputeShader.setVideo(videoRef.current!)
        canvasRef.current!.width = videoRef.current!.videoWidth
        canvasRef.current!.height = videoRef.current!.videoHeight
      })
    }
  }

  function onChangeEnableFilter() {
    setEnableFilter((current) => {
      videoFilterComputeShader.setEnabled(!current)
      return !current
    })
  }

  return (
    <div className={styles.demo}>
      <button onClick={requestWebCam}>Request WebCam</button>
      <div className={styles.check} onClick={onChangeEnableFilter}>
        <input type={'checkbox'} checked={enableFilter} readOnly={true} />
        <label>Enable Filter</label>
      </div>

      <video ref={videoRef}></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default WebCamFilterDemo
