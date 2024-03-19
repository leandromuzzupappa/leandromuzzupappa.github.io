import { useEffect, useRef } from 'react'
import styles from './MouseGL.module.css'
import { initFluid } from './mouse'

export const MouseGL = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    initFluid(canvas);

  }, [])

  return <canvas ref={canvasRef} className={styles.pepitos}></canvas>
}