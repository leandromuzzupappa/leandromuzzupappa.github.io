import "./style.css";
import Pepitos from "./Pepitos";

const canvas = document.createElement("canvas");
canvas.classList.add("pepitos");
document.body.appendChild(canvas);

const pepitos = new Pepitos(canvas);
