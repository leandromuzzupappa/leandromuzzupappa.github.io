import { Vector2 } from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import fragmentShaderData from "./fs.glsl?raw";
import vertexShaderData from "./vs.glsl?raw";

export const TheThingMaterial = shaderMaterial(
  {
    uMouse: new Vector2(0, 0),
    uResolution: new Vector2(window.innerWidth, window.innerHeight),
    uTime: 0,
  },
  vertexShaderData,
  fragmentShaderData
);

extend({ TheThingMaterial });