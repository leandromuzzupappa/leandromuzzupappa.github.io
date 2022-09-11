import "./assets/styles/styles.css";
import matcapImage from "./assets/images/matcap.png";

import * as Three from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const SCREENSIZES = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / SCREENSIZES.width - 0.5;
  cursor.y = -(event.clientY / SCREENSIZES.height - 0.5);
});

const canvas: HTMLElement | null = document.querySelector(".webgl");
if (!canvas) throw new Error("Canvas not found");

const scene = new Three.Scene();

const axesHelper = new Three.AxesHelper();
scene.add(axesHelper);

const textureLoader = new Three.TextureLoader();
const matcapTexture = textureLoader.load(matcapImage);

const textMesh = new Three.Mesh();
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const material = new Three.MeshMatcapMaterial({ matcap: matcapTexture });

  textMesh.geometry = new TextGeometry("Lenny", {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });

  textMesh.geometry.computeBoundingBox();
  textMesh.geometry.center();

  textMesh.material = material;
  scene.add(textMesh);
});

const camera = new Three.PerspectiveCamera(
  75,
  SCREENSIZES.width / SCREENSIZES.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);

scene.add(camera);

const renderer = new Three.WebGLRenderer({ canvas });
renderer.setSize(SCREENSIZES.width, SCREENSIZES.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x2b2b2b);

const tick = () => {
  camera.position.x = cursor.x * 8;
  camera.position.y = cursor.y * 8;
  camera.lookAt(textMesh.position);

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
