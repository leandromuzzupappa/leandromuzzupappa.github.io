import "./assets/styles/style.css";
import Pepitos from "./Pepitos/Pepitos";

const canvas = document.createElement("canvas");
canvas.classList.add("pepitos");
document.body.appendChild(canvas);

const pepitos = new Pepitos(canvas);
