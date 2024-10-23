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

const linesDrawn: { x: number; y: number; }[][] = [];
const redoLines = [];
let currentLine: { x: number; y: number; }[] | null = null;
const drawing_changed : Event = new Event("drawing_changed");

//add an observer for the canvas to detect mouse clicks
canvas.addEventListener("mousemove", (event) =>{
    //on mousemove, if mouse is active : draw a line from the last coordinates to the current coordinates
    if (mouse.active == true){
        //ctx!.beginPath();
        //ctx!.moveTo(mouse.x, mouse.y);
        //ctx!.lineTo(event.offsetX, event.offsetY)
        //ctx!.stroke();
        //mouse.x = event.offsetX;
        //mouse.y = event.offsetY;
        currentLine!.push({x: event.offsetX, y: event.offsetY});
        console.log("beforedispatch")
        canvas.dispatchEvent(drawing_changed);
    }
});
canvas.addEventListener("mousedown", (event) => {
    //clears redo list
    redoLines.splice(0, linesDrawn.length);

    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
    mouse.active = true;
    currentLine = [];
    linesDrawn.push(currentLine);
    
});
canvas.addEventListener("mouseup", () => {
    mouse.active = false;
    currentLine = null;
    //console.log(linesdrawn);
    
});

//create a button to clear the canvas
const clearbutton = document.createElement("button");
clearbutton.innerHTML = "clear";
app.append(clearbutton);

clearbutton.addEventListener("click", () => {
    linesDrawn.splice(0, linesDrawn.length);
    canvas.dispatchEvent(drawing_changed);
})

//UNDO BUTTON
const undobutton = document.createElement("button");
undobutton.innerHTML = "undo";
app.append(undobutton);

undobutton.addEventListener("click", () => {
    if(linesDrawn.length >= 1){
        redoLines.push(linesDrawn.pop());
        canvas.dispatchEvent(drawing_changed);
    }
})

//REDO BUTTON
const redobutton = document.createElement("button");
redobutton.innerHTML = "redo";
app.append(redobutton);

redobutton.addEventListener("click", () => {
    if(redoLines.length >= 1){
        linesDrawn.push(redoLines.pop());
        canvas.dispatchEvent(drawing_changed);
    }
})

function redraw(){
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    //redraws the canvas based on lines
    for (const line of linesDrawn){
        let prevline = null;
        //for each line in linesdrawn
        for (const point of line){
            //for each point in line
            if (prevline == null){
                prevline = point;
            }

            ctx!.beginPath();
            ctx!.moveTo(prevline.x, prevline.y);
            ctx!.lineTo(point.x, point.y)
            ctx!.stroke();
            prevline = point;
        }
    }
}
canvas.addEventListener("drawing_changed", (e) =>{

    redraw();
})