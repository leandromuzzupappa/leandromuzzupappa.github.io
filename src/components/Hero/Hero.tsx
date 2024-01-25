import { useRef } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Heading } from "@/components/Heading/Heading";
import { Text } from "@components/Text/Text";
import { HeroBackgrounds } from "@components/heroBackgrounds/HeroBackgrounds";
import styles from "./Hero.module.css";

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollTrigger);

export const Hero = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleCollapsedRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (window.innerWidth < 768) return;

    const bg = bgRef.current;
    const title = titleRef.current;
    const titleCollapsed = titleCollapsedRef.current;
    const text = textRef.current;

    if (!bg || !title || !titleCollapsed || !text) return;

    const { left } = title.getBoundingClientRect();

    const tl = gsap.timeline({
      scrollTrigger: {
        markers: { startColor: "red", endColor: "red", fontSize: "18px", fontWeight: "bold", indent: 20 },
        trigger: heroRef.current,
        start: "0%",
        end: "100%",
        scrub: true,
      },
    });

    tl.to(bg, {
      borderRadius: "50px",
      height: "50px",
      width: "1360px",
      y: 10,
    });

    tl.to(title, {
      y: -300,
      opacity: 0,
    }, 0);

    tl.to(text, {
      y: -400,
      opacity: 0,
    }, 0);

    tl.fromTo(titleCollapsed, {
      x: left - 20,
      y: 800,
      opacity: 0,
    }, {
      y: -titleCollapsed.offsetHeight - 7,
      opacity: 1,
      scrollTrigger: {
        trigger: heroRef.current,
        start: "50%",
        end: "100%",
        scrub: true,
      }
    }, 0);

  }, { scope: heroRef })

  return (
    <section ref={heroRef} className={`full-width ${styles.hero}`}>
      <Heading
        selfRef={titleRef}
        text="Leandro Muzzupappa"
        classList={styles.heading}
        size="large"
      />

      <Heading
        selfRef={titleCollapsedRef}
        text="Leandro Muzzupappa"
        classList={styles.headingCollapsed}
        size="small"
      />

      <Text
        text="Frontend Developer and UI Designer \n Empowered by technology \n curious by nature."
        classList={styles.copy}
        align="right"
        selfRef={textRef}
      />
      <div ref={bgRef} className={styles.bg}>
        <HeroBackgrounds />
      </div>
    </section>
  );
};
