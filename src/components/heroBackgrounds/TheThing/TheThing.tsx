import { Material, Mesh, ShaderMaterial } from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree, ThreeElements, extend } from "@react-three/fiber";
import { useMousePosition } from "@/hooks/useMousePosition";
import styles from "./TheThing.module.css";
import { TheThingMaterial } from "@/webgl/shaders/TheThing";
extend({ TheThingMaterial });

const Plane = (props: ThreeElements['mesh']) => {
  const meshRef = useRef<Mesh>(null);
  const { viewport } = useThree();
  const { x, y } = useMousePosition();

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as Material & ShaderMaterial;
    material.uniforms.uTime.value += delta;

    material.uniforms.uMouse.value.x = x;
    material.uniforms.uMouse.value.y = y;
  });

  return (
    <mesh ref={meshRef} {...props} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <theThingMaterial key={TheThingMaterial.key} />
    </mesh>
  );
}

export const TheThing = () => {
  return (
    <Canvas className={styles.canvas} style={{ width: window.innerWidth, height: window.innerHeight }} >
      <Plane />
    </Canvas>
  );
};