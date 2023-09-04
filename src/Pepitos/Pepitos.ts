import * as THREE from "three";
import Time from "./Utils/Time";
import Debug from "./Utils/Debug";
import Sizes from "./Utils/Sizes";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Experience from "./Experience";

let instance: Pepitos | null = null;

export default class Pepitos {
  canvas!: HTMLCanvasElement;
  debug!: Debug;
  sizes!: Sizes;
  time!: Time;
  scene!: THREE.Scene;
  camera!: Camera;
  renderer!: Renderer;
  experience!: Experience;

  constructor(_canvas?: HTMLCanvasElement) {
    if (instance) return instance;

    instance = this;
    window.pepitos = this;

    this.canvas = _canvas!;

    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.experience = new Experience();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.time.on("tick", () => {
      this.update();
    });
  }

  addObjects() {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });

    const plane = new THREE.Mesh(geometry, material);

    this.scene.add(plane);
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.experience.update();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.experience.resize();
  }
}

declare global {
  interface Window {
    pepitos: Pepitos;
  }
}
