import "./assets/styles/styles.css";

import * as Three from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

interface IGenerateRandomMesh {
  geometry: Three.OctahedronGeometry | Three.TorusGeometry | Three.ConeGeometry;
  material: Three.Material;
  count: number;
}

const SCREENSIZES = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const cursor = {
  x: 0,
  y: 0,
};

const canvas: HTMLElement | null = document.querySelector(".webgl");
if (!canvas) throw new Error("Canvas not found");

const scene = new Three.Scene();

/* const axesHelper = new Three.AxesHelper();
scene.add(axesHelper); */

const material = new Three.MeshNormalMaterial();

const textMesh = new Three.Mesh();
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  textMesh.geometry = new TextGeometry("Lenny — \nDeveloper\n&& Designer", {
    font,
    size: 0.8,
    height: 0.9,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.03,
    bevelOffset: 0.02,
    bevelSegments: 10,
  });

  textMesh.geometry.computeBoundingBox();
  textMesh.geometry.center();

  textMesh.material = material;
  scene.add(textMesh);
});

const nearDist = 0.1;
const farDist = 10000;
const camera = new Three.PerspectiveCamera(
  70,
  SCREENSIZES.width / SCREENSIZES.height,
  nearDist,
  farDist
);

camera.position.set(-2 * farDist, 0, 7);
camera.lookAt(textMesh.position);
scene.add(camera);

const renderer = new Three.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(SCREENSIZES.width, SCREENSIZES.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const generateRandomMesh = ({
  geometry,
  material,
  count,
}: IGenerateRandomMesh) => {
  for (let i = 0; i < count; i++) {
    const mesh = new Three.Mesh(geometry, material);
    const dist = farDist / 3;
    const distDouble = dist * 2;

    mesh.position.x = Math.random() * distDouble - dist;
    mesh.position.y = Math.random() * distDouble - dist;
    mesh.position.z = Math.random() * distDouble - dist;
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.z = Math.random() * Math.PI;

    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add(mesh);
  }
};

const group = new Three.Group();
const octahedronGeometry = new Three.OctahedronGeometry(80);
const torusGeometry = new Three.TorusGeometry(40, 25, 16, 40);
const coneGeometry = new Three.ConeGeometry(40, 80, 80);
generateRandomMesh({ geometry: octahedronGeometry, material, count: 300 });
generateRandomMesh({ geometry: torusGeometry, material, count: 230 });
generateRandomMesh({ geometry: coneGeometry, material, count: 180 });
scene.add(group);

const tick = () => {
  if (!cursor.x && !cursor.y) {
    camera.position.x += (cursor.x - camera.position.x) * 0.1;
    camera.position.y += (cursor.y * -1 - camera.position.y) * 0.1;
  } else {
    camera.position.x = cursor.x * 12;
    camera.position.y = cursor.y * 12;
  }

  camera.lookAt(textMesh.position);

  const t = Date.now() * 0.001;
  const rx = Math.sin(t * 0.7) * 0.5;
  const ry = Math.sin(t * 0.3) * 0.5;
  const rz = Math.sin(t * 0.2) * 0.5;
  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;
  textMesh.rotation.x = rx;
  textMesh.rotation.y = ry;
  textMesh.rotation.z = rx;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  SCREENSIZES.width = window.innerWidth;
  SCREENSIZES.height = window.innerHeight;

  camera.aspect = SCREENSIZES.width / SCREENSIZES.height;
  camera.updateProjectionMatrix();

  renderer.setSize(SCREENSIZES.width, SCREENSIZES.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener(
  "mousemove",
  (event) => {
    cursor.x = event.clientX / SCREENSIZES.width - 0.5;
    cursor.y = -(event.clientY / SCREENSIZES.height - 0.5);
  },
  false
);
