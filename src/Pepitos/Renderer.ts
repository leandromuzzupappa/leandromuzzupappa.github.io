import * as THREE from "three";
import Pepitos from "./Pepitos";
import Camera from "./Camera";
import Sizes from "./Utils/Sizes";

export default class Renderer {
  pepitos: Pepitos;
  canvas: HTMLCanvasElement;
  sizes: Sizes;
  scene: THREE.Scene;
  camera: Camera;
  instance: THREE.WebGLRenderer | null = null;

  constructor() {
    this.pepitos = new Pepitos();
    this.canvas = this.pepitos.canvas;
    this.sizes = this.pepitos.sizes;
    this.scene = this.pepitos.scene;
    this.camera = this.pepitos.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor(0x000000);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance?.setSize(this.sizes.width, this.sizes.height);
    this.instance?.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance?.render(this.scene, this.camera.instance);
  }
}
