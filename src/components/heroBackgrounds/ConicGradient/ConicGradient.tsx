import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLenis } from "@studio-freight/react-lenis";
import { HeroBackground } from '@/layouts/HeroBackground/HeroBackground'
import styles from './ConicGradient.module.css'

export const ConicGradient = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [scroll, setScroll] = useState(0);

  useLenis((lenis) => setScroll(lenis.scroll));

  useGSAP(() => {
    if (!scroll) return

    const deg = Math.sin(Math.min(Math.round(scroll % 12), 2));
    gsap.to(ref.current, {
      '--gradient-deg': deg + 'deg',
      duration: 2,
      ease: 'power4.out',
    });

  }, [scroll]);

  return <HeroBackground selfRef={ref} classList={styles.conic} />
}