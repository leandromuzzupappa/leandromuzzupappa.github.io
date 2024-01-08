import { useRef, useState } from "react";
import gsap from "gsap";
import { useLenis } from "@studio-freight/react-lenis";
import { Heading } from "@/components/Heading/Heading";
import { Text } from "@components/Text/Text";
import { ConicGradient } from "@components/heroBackgrounds/ConicGradient/ConicGradient";
import styles from "./Hero.module.css";

export const Hero = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  const [scroll, setScroll] = useState(0);


  useLenis((lenis) => {
    const height = lenis.dimensions.height;

    const borderRadius = Math.min(lenis.scroll / 12, 80);

    if (lenis.scroll > height / 1.5) {
      gsap.to(bgRef.current, {
        borderRadius,
        height: '50px',
        maxWidth: '1360px',
        scale: 1,
        xPercent: -50,
        y: 10,
        duration: 1.2,
        ease: "power4.out",
      })
    } else {
      gsap.to(bgRef.current, {
        borderRadius,
        height: '100vh',
        maxWidth: '100vw',
        scaleX: Math.max(1 - lenis.scroll / 3000, .5),
        scaleY: Math.max(1 - lenis.scroll / 900, .1),
        xPercent: -50,
        y: lenis.scroll * 0.01,
        duration: 0.8,
        ease: "power3.out",
      });

    }

    setScroll(lenis.scroll);
  })


  return (
    <section className={`full-width ${styles.hero}`}>
      <Heading
        text="Leandro Muzzupappa"
        classList={styles.heading}
        size="large"
      />
      <Text
        text="Frontend Developer and UI Designer \n Empowered by technology \n curious by nature."
        classList={styles.copy}
        align="right"
      />
      <div ref={bgRef} className={styles.bg}>
        <ConicGradient scrollPercent={scroll} />
      </div>
    </section>
  );
};
