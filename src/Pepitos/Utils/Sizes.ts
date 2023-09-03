import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
  width: number;
  height: number;
  pixelRatio: number;
  viewportAspectRatio: number;

  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.viewportAspectRatio = this.width / this.height;

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.viewportAspectRatio = this.width / this.height;

      this.trigger("resize");
    });
  }
}