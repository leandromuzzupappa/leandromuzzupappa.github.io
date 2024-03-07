import { Mesh, ShaderMaterial } from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree, ThreeElements, extend } from "@react-three/fiber";
import styles from "./MeltGradient.module.css";
import { MeltGradientMaterial } from "@/webgl/shaders/MeltGradient";
extend({ MeltGradientMaterial });

const Plane = (props: ThreeElements['mesh']) => {
  const meshRef = useRef<Mesh>(null);
  const { size } = useThree();

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as ShaderMaterial;
    material.uniforms.uTime.value += delta;

  });

  return (
    <mesh ref={meshRef} {...props}>
      <planeGeometry args={[size.width, size.height]} />
      <meltGradientMaterial />
    </mesh>
  );
}

export const MeltGradient = () => {
  return (
    <Canvas className={styles.canvas} style={{ width: window.innerWidth, height: window.innerHeight }} >
      <Plane />
    </Canvas>
  );
};