import React, { useState } from 'react'
import styles from './styles/app.module.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useComputeHandler } from '../modules/compute-handler'
import WebCamFilterDemo from './components/WebCamFilterDemo'
import MatrixMultiplyDemo from './components/MatrixMultiplyDemo'

const App: React.FC = () => {
  const {
    videoFilterComputeShader,
    matrixMultiplyComputeShader,
    offscreenCanvas,
  } = useComputeHandler()
  const [visibleDemo, setVisibleDemo] = useState('MATRIX')

  function onChangeDemo(evt: React.ChangeEvent<HTMLSelectElement>) {
    setVisibleDemo(evt.target.value)
  }

  return (
    <div className={styles.app_wrapper}>
      <div className={styles.header}>
        <img src={'./bg_logo_dl.svg'} />
        Compute Demo
      </div>
      <select onChange={onChangeDemo}>
        <option value={'MATRIX'}>MATRIX</option>
        <option value={'FILTER_VIDEO'}>FILTER VIDEO</option>
      </select>
      {visibleDemo === 'FILTER_VIDEO' && videoFilterComputeShader && (
        <WebCamFilterDemo
          offscreenCanvas={offscreenCanvas!}
          videoFilterComputeShader={videoFilterComputeShader}
        />
      )}
      {visibleDemo === 'MATRIX' && matrixMultiplyComputeShader && (
        <MatrixMultiplyDemo matrixMultiplyComputeShader={matrixMultiplyComputeShader} />
      )}
      <ToastContainer />
    </div>
  )
}

export default App
