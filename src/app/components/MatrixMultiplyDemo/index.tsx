import React, { useEffect, useState } from 'react'
import styles from '../../styles/app.module.scss'
import { MatrixMultiplyComputeShader } from '../../../modules/compute-handler/shaders'

interface MatrixDemoProps {
  matrixMultiplyComputeShader: MatrixMultiplyComputeShader
}

const MatrixMultiplyDemo: React.FC<MatrixDemoProps> = ({ matrixMultiplyComputeShader }) => {
  const [gpuTimeResult, setGPUTime] = useState<string>('--')
  const [cpuTimeResult, setCPUTime] = useState<string>('--')
  const [currentMatrixSize, setCurrentMatrixSize] = useState(32)

  useEffect(() => {
    setSize(32)
  }, [])

  function setSize(size: number) {
    matrixMultiplyComputeShader.setSize(size)
    setGPUTime('--')
    setCPUTime('--')
    setCurrentMatrixSize(matrixMultiplyComputeShader.getSize())
  }

  function onChangeSelection(evt: React.ChangeEvent<HTMLSelectElement>) {
    setSize(Number(evt.currentTarget.value))
  }

  function computeCPU(event: React.MouseEvent) {
    const now = performance.now()
    matrixMultiplyComputeShader.multiplyCPU()
    const time = Math.round(performance.now() - now)
    setCPUTime(`${time}`)
  }

  function computeGPU() {
    const now = performance.now()
    matrixMultiplyComputeShader.multiplyGPU()
    const time = Math.round(performance.now() - now)
    setGPUTime(`${time}`)
  }

  const values: number[] = [20, 40, 80, 100, 250, 500, 1000, 1500, 2000]
  const maxList = 10000
  const GPUValues = () => {
    let values = 'Matrix as a list:\n\n'
    const mat = matrixMultiplyComputeShader.getGPUResult()
    mat.slice(0, Math.min(currentMatrixSize, maxList)).forEach((v) => {
      values += v + '\n'
    })
    if (mat.length > maxList) {
      values += '...'
    }
    return <div className={styles.result_list}>{values}</div>
  }
  const CPUValues = () => {
    let values = 'Matrix as a list:\n\n'
    const mat = matrixMultiplyComputeShader.getCPUResult()
    mat.slice(0, Math.min(currentMatrixSize, maxList)).forEach((v) => {
      values += v + '\n'
    })
    if (mat.length > maxList) {
      values += '...'
    }
    return <div className={styles.result_list}>{values}</div>
  }

  return (
    <div className={styles.demo}>
      <div className={styles.size_input}>
        Matrix Size:
        <select onChange={onChangeSelection}>
          {values.map((v) => {
            return <option key={v} value={v}>{`${v} x ${v}`}</option>
          })}
        </select>
      </div>
      <div className={styles.results}>
        <div className={styles.result}>
          <div className={styles.result_header}>
            <button onClick={computeGPU}>Multiply on GPU</button>
            GPU Execution Time: {gpuTimeResult}ms
          </div>
          <GPUValues />
        </div>
        <div className={styles.result}>
          <div className={styles.result_header}>
            <button onClick={computeCPU}>Multiply on CPU</button>
            CPU Execution Time: {cpuTimeResult}ms
          </div>
          <CPUValues />
        </div>
      </div>
    </div>
  )
}

export default MatrixMultiplyDemo
