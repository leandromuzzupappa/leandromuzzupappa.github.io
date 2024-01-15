import { Material, Mesh, Vector2 } from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { fragmentShaderData, vertexShaderData } from "@/webgl/shaders/TheThing";

const ColorShiftMaterial = shaderMaterial(
  {
    uMouse: new Vector2(0, 0),
    uResolution: new Vector2(window.innerWidth, window.innerHeight),
    uTime: 0,
  },
  vertexShaderData,
  fragmentShaderData
);

extend({ ColorShiftMaterial });

function Plane() {
  const meshRef = useRef<Mesh>(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const material = mesh.material as Material & { uniforms: any };
    material.uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <colorShiftMaterial />
    </mesh>
  );
}

export const TheThing = () => {
  return (
    <Canvas>
      <Plane />
    </Canvas>
  );
};
