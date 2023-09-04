import * as THREE from "three";
import Pepitos from "./Pepitos";
import Debug from "./Utils/Debug";
import Test from "./Experiences/Test";
import Pixelation from "./Experiences/Pixelation";

export default class Experience {
  pepitos: Pepitos;
  scene: THREE.Scene;
  debug: Debug;
  test: Test | undefined;
  pixelation: Pixelation | undefined;
  experiencesArr: string[];
  currentExperience: string;
  debugFolder: any;

  constructor() {
    this.pepitos = new Pepitos();
    this.scene = this.pepitos.scene;
    this.debug = this.pepitos.debug;

    this.experiencesArr = ["Test", "Pixelation"];
    this.currentExperience = "";

    this.runExperience();
    this.setDebug();
  }

  get randomExperience() {
    return this.experiencesArr[
      Math.floor(Math.random() * this.experiencesArr.length)
    ];
  }

  runExperience(experienceName?: string) {
    this.clearExperiences();

    this.currentExperience = experienceName || this.randomExperience;

    switch (this.currentExperience) {
      case "Pixelation":
        this.pixelation = new Pixelation();
        break;
      default:
        this.test = new Test();
        break;
    }
  }

  setDebug() {
    if (!this.debug || !this.debug.ui) return;

    this.debugFolder = this.debug.ui.addFolder("Experience");
    this.debugFolder.open();

    this.debugFolder
      .add(this, "currentExperience", this.experiencesArr)
      .onChange((value: string) => {
        this.currentExperience = value;
        this.runExperience(value);
      });
  }

  clearExperiences() {
    if (this.test) this.test.destroy();
    if (this.pixelation) this.pixelation.destroy();
  }

  resize() {}
  update() {}
}
