import * as THREE from "three";
import Pepitos from "../Pepitos";

export default class Pixelation {
  pepitos: Pepitos;
  scene: THREE.Scene;
  material!: THREE.MeshBasicMaterial;
  geometry!: THREE.BoxGeometry;
  mesh!: THREE.Mesh;

  constructor() {
    this.pepitos = new Pepitos();
    this.scene = this.pepitos.scene;

    this.addMaterial();
    this.addGeometry();
  }

  addMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      color: 0x030330,
    });
  }

  addGeometry() {
    this.geometry = new THREE.BoxGeometry(0.4, 1, 1);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
