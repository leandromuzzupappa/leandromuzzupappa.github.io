import * as THREE from "three";
import Pepitos from "./Pepitos";
import Debug from "./Utils/Debug";
import Test from "./Experiences/Test";

export default class Experience {
  pepitos: Pepitos;
  scene: THREE.Scene;
  debug: Debug;
  test: Test;

  constructor() {
    this.pepitos = new Pepitos();
    this.scene = this.pepitos.scene;
    this.debug = this.pepitos.debug;

    this.test = new Test();
  }

  resize() {}
  update() {}
}
