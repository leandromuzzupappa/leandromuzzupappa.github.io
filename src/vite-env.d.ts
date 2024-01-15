/// <reference types="vite/client" />
declare module "*.glsl";
declare module "*.glsl?raw";

import { TheThingMaterial } from "./webgl/shaders/TheThing";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      theThingMaterial: ReactThreeFiber.Object3DNode<CustomMaterial, typeof TheThingMaterial>
    }
  }
}