import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Pepitos from "./Pepitos.js";
import Sizes from "./Utils/Sizes.js";

export default class Camera {
  pepitos: Pepitos;
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  instance!: THREE.OrthographicCamera;
  frustumSize: number | null = null;
  aspect: number | null = null;
  controls: OrbitControls | null = null;

  constructor() {
    this.pepitos = new Pepitos();
    this.sizes = this.pepitos.sizes;
    this.scene = this.pepitos.scene;
    this.canvas = this.pepitos.canvas;

    this.addOrtographicCamera();
    this.setControls();
  }

  addOrtographicCamera() {
    this.frustumSize = 1;
    this.aspect = this.sizes.width / this.sizes.height;
    this.instance = new THREE.OrthographicCamera(
      this.frustumSize / -2,
      this.frustumSize / 2,
      this.frustumSize / 2,
      this.frustumSize / -2,
      1,
      3000
    );

    this.instance.position.set(0, 0, 2);
    this.scene.add(this.instance);
  }

  setControls() {
    if (!this.instance) return;
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {}

  update() {
    if (this.controls) this.controls.update();
  }
}
