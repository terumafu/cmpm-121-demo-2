import "./style.css";

const APP_NAME = "Jerry's game";
const app = document.querySelector<HTMLDivElement>("#app")!;
document.title = APP_NAME;

const header = document.createElement("h1");
header.innerHTML = "Jerry's Drawing Tool";

app.append(header);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
app.append(canvas);