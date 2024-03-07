import { Vector2 } from "three";
import { shaderMaterial } from "@react-three/drei";
import fragmentShaderData from "./fs.glsl?raw";
import vertexShaderData from "./vs.glsl?raw";

export const MeltGradientMaterial = shaderMaterial(
  {
    uPixelRatio: window.devicePixelRatio,
    uResolution: new Vector2(1000, 1000),
    uTime: 0,
  },
  vertexShaderData,
  fragmentShaderData
);
