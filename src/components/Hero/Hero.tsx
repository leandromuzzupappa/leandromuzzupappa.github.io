import { useRef, useState } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { useLenis } from "@studio-freight/react-lenis";
import { Heading } from "@/components/Heading/Heading";
import { Text } from "@components/Text/Text";
import { HeroBackgrounds } from "@components/heroBackgrounds/HeroBackgrounds";
import styles from "./Hero.module.css";

gsap.registerPlugin(CustomEase);

interface IAnimation<T> {
  target: T;
  targets?: T[];
  scroll: number;
  speed: number;
  direction: number;
  isCollapsed: boolean;
}

export const Hero = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const [scroll, setScroll] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { contextSafe } = useGSAP({
    scope: heroRef,
    dependencies: [isCollapsed, scroll],
  });

  useLenis((lenis) => {
    setScroll(lenis.scroll);

    const hero = heroRef.current;
    const bg = bgRef.current;
    const title = titleRef.current;
    const text = textRef.current;

    if (!hero || !bg || !title || !text) return;

    const isCollapsed = lenis.scroll > hero.offsetHeight / 1.5;
    setIsCollapsed(isCollapsed);

    const config = {
      scroll: lenis.scroll,
      speed: Math.abs(lenis.velocity),
      direction: lenis.direction,
      isCollapsed,
    };

    animateBackground({ target: bg, ...config });
    animateTexts({ targets: [text, title], ...config });
  });

  const animateBackground = contextSafe(
    ({
      scroll,
      direction,
      target,
      isCollapsed,
    }: IAnimation<HTMLDivElement>) => {
      const endConfig = {
        ["--overlay-opacity"]: 0.6,
        borderRadius: 100,
        height: "50px",
        maxWidth: "1360px",
        opacity: 1,
        scale: 1,
        y: 10,
        duration: 1.2,
        ease: "power4.out",
      };

      if (!direction && isCollapsed) {
        gsap.fromTo(
          target,
          {
            y: "-110vh",
          },
          endConfig
        );

        return;
      }

      if (!isCollapsed) {
        gsap.to(target, {
          ["--overlay-opacity"]: 0.2,
          borderRadius: Math.min(scroll / 12, 80),
          height: `${100 - scroll * 0.1}vh`,
          maxWidth: "100vw",
          scaleX: Math.max(1 - scroll / 3000, 0.5),
          y: scroll * 0.05,
          duration: 0.8,
          ease: "power3.out",
        });
      } else {
        gsap.to(target, endConfig);
      }
    }
  );

  const animateTexts = contextSafe(
    ({
      scroll,
      direction,
      targets,
      isCollapsed,
    }: IAnimation<HTMLDivElement>) => {
      const [, title] = targets!;
      const bgRect = bgRef.current?.getBoundingClientRect();

      const ease = CustomEase.create(
        "custom",
        "M0,0 C0,0.507 0.073,0.774 0.2,0.9 0.331,1.031 0.504,1 1,1 "
      );
      const opacity = 1 - scroll / 500;
      const padding = 10;
      const position =
        opacity < 0.1 ? "fixed" : opacity > 0.2 ? "relative" : "fixed";
      const xPosition = (bgRect?.x || 184) + padding;

      const endConfig = {
        fontSize: "clamp(1rem, 0.5rem + 1vw, 2.5rem)",
        opacity: 1,
        position: "fixed",
        width: "20%",
        x: xPosition,
        y: 0 - 25,
        yPercent: -30,
        duration: 1.2,
        ease: "power4.out",
      };

      /* Both texts */
      if (!isCollapsed) {
        if (direction < 0 && scroll > 1) {
          gsap.to(title, {
            fontSize: "clamp(1.5rem, 4rem + 4vw, 16rem)",
            opacity: 0,
            position,
            x: 0,
            y: -500,
            yPercent: 0,
            duration: 0.2,
            ease,
          });

          return;
        }

        gsap.to(title, {
          position,
          delay: 0.4,
        });

        gsap.to(targets!, {
          opacity: opacity < 0.3 ? 0 : opacity > 0.7 ? 1 : opacity,
          y: -scroll * 0.5,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.5,
        });

        return;
      }

      if (direction === 0) {
        gsap.fromTo(
          title,
          {
            x: xPosition,
            y: "-110vh",
          },
          endConfig
        );

        return;
      }

      gsap.fromTo(
        title,
        {
          x: xPosition,
        },
        endConfig
      );
    }
  );

  return (
    <section ref={heroRef} className={`full-width ${styles.hero}`}>
      <Heading
        selfRef={titleRef}
        text="Leandro Muzzupappa"
        classList={styles.heading}
        size="large"
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
