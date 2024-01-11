"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./MouseIndicator.module.css";

export const MouseIndicator = () => {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  const gsapConfig = {
    duration: 0.3,
    ease: "sin.out",
  }

  useGSAP(() => {

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      xTo.current!(clientX);
      yTo.current!(clientY);
    }

    gsap.to(indicatorRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "sin.out",
      delay: 0.1
    })

    xTo.current = gsap.quickTo(indicatorRef.current, 'x', gsapConfig);
    yTo.current = gsap.quickTo(indicatorRef.current, 'y', gsapConfig);

    window.addEventListener("mousemove", onMouseMove);

  }, { scope: indicatorRef })




  return (
    <>
      <div ref={indicatorRef} className={styles.indicator}></div>
    </>
  );
};
