import * as THREE from "three";
import Pepitos from "../Pepitos";
import Sizes from "../Utils/Sizes";
import { fragmentShaderData, vertexShaderData } from "../Shaders/pixelation";
import video from "/videos/room.mp4";
import clamp from "../../utils/clamp";

export default class Pixelation {
  pepitos: Pepitos;
  scene: THREE.Scene;
  material!: THREE.ShaderMaterial;
  geometry!: THREE.PlaneGeometry;
  mesh!: THREE.Mesh;
  sizes: Sizes;
  videoElement: HTMLVideoElement | undefined;
  videoTexture: THREE.VideoTexture | undefined;
  uniforms: any;

  mouse: IMouse = {
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vX: 0,
    vY: 0,
  };
  settings: Settings = {} as Settings;
  size: number = 0;
  dataTexture: THREE.DataTexture | undefined;

  constructor() {
    this.pepitos = new Pepitos();
    this.scene = this.pepitos.scene;
    this.sizes = this.pepitos.sizes;

    this.setVideo();
    this.setSettings();
    this.addMaterial();
    this.addGeometry();
    this.generateDataTexture();

    window.addEventListener("mousemove", this.handleMousemove.bind(this));
  }

  setSettings() {
    this.settings = {
      grid: 16,
      mouse: 0.1,
      mouseSize: 4,
      strength: 0.76,
      relaxation: 0.9,
      animateOnStart: true,
    };
  }

  setVideo() {
    this.videoElement = document.createElement("video");
    this.videoElement.src = video;
    this.videoElement.loop = true;
    this.videoElement.muted = true;
    this.videoElement.play();

    this.videoTexture = new THREE.VideoTexture(this.videoElement);
    this.videoTexture.minFilter = THREE.LinearFilter;
  }

  addMaterial() {
    this.uniforms = {
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uProgress: { value: 0 },
      uTexture: { value: this.videoTexture },
      uDataTexture: { value: this.dataTexture },
      uResolution: { value: new THREE.Vector4() },
    };

    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      fragmentShader: fragmentShaderData,
      vertexShader: vertexShaderData,
      uniforms: this.uniforms,
    });
  }

  addGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  generateDataTexture() {
    this.size = this.settings.grid;
    const width = this.size;
    const height = this.size;
    const size = width * height;

    const data = new Float32Array(size * 4);

    if (this.settings.animateOnStart) {
      for (let i = 0; i < size; i++) {
        const stride = i * 4;
        let r = Math.random() * 255;
        let r1 = Math.random() * 255;

        data[stride] = r; // red, and also X
        data[stride + 1] = r1; // green, and also Y
        data[stride + 2] = 0; // blue
        data[stride + 3] = 0; // alpha
      }
    }

    this.dataTexture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    this.dataTexture.magFilter = this.dataTexture.minFilter =
      THREE.NearestFilter;

    if (this.uniforms) {
      this.uniforms.uDataTexture.value = this.dataTexture;
      this.uniforms.uDataTexture.needsUpdate = true;
    }
  }

  updateDataTexture() {
    if (!this.dataTexture) return;

    let data = this.dataTexture.image.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] *= this.settings.relaxation;
      data[i + 1] *= this.settings.relaxation;
    }

    let gridMouseX = this.settings.grid * this.mouse.x;
    let gridMouseY = this.settings.grid * (1 - this.mouse.y);
    let maxDist = this.settings.grid * this.settings.mouse;
    let aspect = this.sizes.height / this.sizes.height;

    for (let i = 0; i < this.settings.grid; i++)
      for (let j = 0; j < this.settings.grid; j++) {
        let distance = (gridMouseX - i) ** 2 / aspect + (gridMouseY - j) ** 2;
        let maxDistSq = maxDist ** this.settings.mouseSize;
        if (distance < maxDistSq) {
          let index = 4 * (i + this.settings.grid * j);
          let power = maxDist / Math.sqrt(distance);
          power = clamp(power, 0, 2);
          // if (distance < this.settings.grid / 32) power = 1;
          // power = 1;
          data[index] += this.settings.strength * 100 * this.mouse.vX * power;
          data[index + 1] -=
            this.settings.strength * 100 * this.mouse.vY * power;
        }
      }

    this.mouse.vX *= 0.9;
    this.mouse.vY *= 0.9;
    this.dataTexture.needsUpdate = true;
  }

  handleMousemove(e: MouseEvent) {
    this.mouse.x = e.clientX / this.sizes.width;
    this.mouse.y = e.clientY / this.sizes.height;

    this.mouse.vX = this.mouse.x - this.mouse.prevX;
    this.mouse.vY = this.mouse.y - this.mouse.prevY;

    this.mouse.prevX = this.mouse.x;
    this.mouse.prevY = this.mouse.y;
  }

  update() {
    this.updateDataTexture();
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}

interface IMouse {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  vX: number;
  vY: number;
}

interface Settings {
  grid: number;
  mouse: number;
  mouseSize: number;
  strength: number;
  relaxation: number;
  animateOnStart: boolean;
}
