"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useMousePosition } from "@/hooks/useMousePosition";
import styles from "./MouseIndicator.module.css";

export const MouseIndicator = () => {
  const { x, y } = useMousePosition();

  const indicatorRef = useRef<HTMLDivElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  const gsapConfig = {
    duration: 0.3,
    ease: "sin.out",
  }

  useGSAP(() => {
    gsap.to(indicatorRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "sin.out",
      delay: 0.1
    })

    xTo.current = gsap.quickTo(indicatorRef.current, 'x', gsapConfig);
    yTo.current = gsap.quickTo(indicatorRef.current, 'y', gsapConfig);

    xTo.current!(x);
    yTo.current!(y);
  }, { scope: indicatorRef, dependencies: [x, y] })

  return <div ref={indicatorRef} className={styles.indicator}></div>;
};
