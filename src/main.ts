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

const ctx : CanvasRenderingContext2D | null = canvas.getContext("2d");

const mouse = {active: false, x: 0, y: 0};

//add an observer for the canvas to detect mouse clicks
canvas.addEventListener("mousemove", (event) =>{
    //on mousemove, if mouse is active : draw a line from the last coordinates to the current coordinates
    if (mouse.active == true){
        ctx!.beginPath();
        ctx!.moveTo(mouse.x, mouse.y);
        ctx!.lineTo(event.offsetX, event.offsetY)
        ctx!.stroke();
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;
    }
});
canvas.addEventListener("mousedown", (event) => {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
    mouse.active = true;

});
canvas.addEventListener("mouseup", () => {
    mouse.active = false;
});

//create a button to clear the canvas
const clearbutton = document.createElement("button");
clearbutton.innerHTML = "clear";
app.append(clearbutton);

clearbutton.addEventListener("click", () => {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
})