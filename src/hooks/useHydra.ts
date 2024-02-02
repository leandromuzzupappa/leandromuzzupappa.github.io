/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { useEffect, useRef, useState } from "react";
import Hydra from "hydra-synth";

export const useHydra = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    const hydra = new Hydra({
      canvas: canvasRef.current,
      detectAudio: false,
    });

    window.hydra = hydra;
    setLoaded(true);

    return () => hydra.hush();
  }, [canvasRef])

  return { canvasRef, loaded };
}

declare global {
  interface Window {
    diff: any;
    gradient: any;
    hydra: Hydra;
    mouse: any;
    noise: any;
    osc: any;
    out: any;
    o0: any;
    o1: any;
    o2: any;
    o3: any;
    render: any;
    src: any;
    shape: any;
    s0: any;
    s1: any;
    s2: any;
    s3: any;
    time: number;
    voronoi: any;
  }
}