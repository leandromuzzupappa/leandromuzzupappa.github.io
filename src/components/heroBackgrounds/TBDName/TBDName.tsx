import { useLayoutEffect } from 'react';
import { HeroBackground } from '@/layouts/HeroBackground/HeroBackground';
import { useHydra } from '@/hooks/useHydra';
import styles from './TBDName.module.css';

export const TBDName = () => {
  const { canvasRef, loaded } = useHydra();

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!loaded || !canvas) return;

    const w = window;

    w.osc(60, 0.1, -0.4)
      .modulateRotate(w.o0, .20)
      .scrollX(0.1)
      .rotate(.1)
      .scrollY(() => w.mouse.y * 0.0001)
      .scrollX(() => w.mouse.x * 0.0001)
      .out()
    w.osc(33, 0.7, 10)
      .mult(w.o3, 10)
      .out(w.o1)
    w.osc(3, 0.3, 1)
      .modulateKaleid(w.o3, 50)
      .diff(w.o0)
      .out(w.o2)
    w.src(w.o0, 3)
      .mult(w.o1)
      .kaleid(4)
      .rotate(() => (-w.time % 360) * 0.1)
      .out(w.o3)
    w.render(w.o2)

  }, [loaded, canvasRef]);


  return <HeroBackground classList={styles.tbd}>
    <canvas ref={canvasRef} className={styles.tbd}></canvas>
  </HeroBackground>
}