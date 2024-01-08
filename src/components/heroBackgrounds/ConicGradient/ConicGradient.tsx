import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { HeroBackground } from '@/layouts/HeroBackground/HeroBackground'
import styles from './ConicGradient.module.css'

interface IConicGradient {
  scrollPercent?: number;
}

export const ConicGradient = ({ scrollPercent }: IConicGradient) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!scrollPercent) return

    const deg = Math.sin(Math.min(Math.round(scrollPercent % 12), 2));
    gsap.to(ref.current, {
      '--gradient-deg': deg + 'deg',
      duration: 2,
      ease: 'power4.out',
    });

  }, [scrollPercent]);

  return <HeroBackground selfRef={ref} classList={styles.conic} />
}