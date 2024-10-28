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
canvas.style.cursor = "none"; 
app.append(canvas);
//divs
const div = document.createElement("div");
app.append(div);
const divbutton = document.createElement("div");
app.append(divbutton);
const custombuttondiv = document.createElement("div");
app.append(custombuttondiv);

const ctx : CanvasRenderingContext2D | null = canvas.getContext("2d");

const mouse = {active: false, x: 0, y: 0};

const tool_moved : Event = new Event("tool_moved");
const drawing_changed : Event = new Event("drawing_changed");
const eventHandler = new EventTarget();

let toolOutline = null;

let currentLineCommand : LineCommand | StickerCommand | null = null;
const commands = [];
const commandsRedo = [];
const stickerlist = [];

let stickerBrush : string | null = null;
let customLineWidth = 1;
class LineCommand{
    points : { x: number; y: number; }[] = [];
    context : CanvasRenderingContext2D;
    linewidth : number = 1;
    constructor(x:number,y:number, context: CanvasRenderingContext2D){
        this.points.push({x:x, y:y});
        this.context = context;
        this.linewidth = customLineWidth
    }
    execute(){
        this.context.beginPath();
        this.context.lineWidth = this.linewidth;
        //execute to draw the entire line, replaces bulk of redraw
        this.context.moveTo(this.points[0].x, this.points[1].y);
        for (let i = 1; i < this.points.length; i ++){
            this.context.lineTo(this.points[i].x, this.points[i].y);
        }
        this.context.stroke();
    }
    draw(x:number,y:number){
        this.points.push({x:x, y:y});
    }
}
class StickerCommand{
    point : {x: number, y:number};
    context : CanvasRenderingContext2D;
    emoji : string;
    constructor(x:number,y:number, context: CanvasRenderingContext2D, emoji: string){
        this.point = {x:x, y:y};
        this.context = context;
        this.emoji = emoji;
    }
    execute(){
        this.context.font = "30px serif";
        this.context.fillText(this.emoji, this.point.x, this.point.y,);
    }
}
class ToolMovedCommand{
    x : number;
    y : number;
    constructor(x : number,y : number){
        this.x = x;
        this.y = y;
    }
    execute(){
        ctx!.font = customLineWidth + 10 + "px monospace";
        let tempstring = "I";
        if (stickerBrush){
            ctx!.font = 30 + "px serif";
            tempstring = stickerBrush;
        }
        ctx!.fillText(tempstring, this.x, this.y);
    }
}

//MOUSE OBSERVERS
canvas.addEventListener("mousemove", (event) =>{
    //on mousemove, if mouse is active : draw a line from the last coordinates to the current coordinates
    if (mouse.active == true && stickerBrush == null){
        currentLineCommand!.draw(event.offsetX, event.offsetY);
        
        eventHandler.dispatchEvent(drawing_changed);
        
    }
    else{
        toolOutline = new ToolMovedCommand(event.offsetX, event.offsetY);
        eventHandler.dispatchEvent(tool_moved);
    }
});
canvas.addEventListener("mousedown", (event) => {
    //clears redo list
    
    commandsRedo.splice(0, commandsRedo.length);
    //initializes LineCommand Obj
    if (!stickerBrush){
        currentLineCommand = new LineCommand(event.offsetX,event.offsetY,ctx!);
    }
    else{
        currentLineCommand = new StickerCommand(event.offsetX, event.offsetY, ctx!, stickerBrush);
    }
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
    mouse.active = true;


    commands.push(currentLineCommand);
    toolOutline = null;
    
    eventHandler.dispatchEvent(drawing_changed);
});
canvas.addEventListener("mouseup", () => {

    currentLineCommand = null;
    mouse.active = false;
    //console.log(linesdrawn);
    
});
canvas.addEventListener("mouseout", (event) => {
    toolOutline = new ToolMovedCommand(-10, -10);
    redraw();
  });


//create a button to clear the canvas
const clearbutton = document.createElement("button");
clearbutton.innerHTML = "clear";
div.append(clearbutton);

clearbutton.addEventListener("click", () => {
    commands.splice(0, commands.length);
    commandsRedo.splice(0,commandsRedo.length);
    eventHandler.dispatchEvent(drawing_changed);
})

//BUTTONS
//UNDO BUTTON
const undobutton = document.createElement("button");
undobutton.innerHTML = "undo";
div.append(undobutton);

undobutton.addEventListener("click", () => {
    if(commands.length >= 1){
        commandsRedo.push(commands.pop());
        eventHandler.dispatchEvent(drawing_changed);
    }
})

//REDO BUTTON
const redobutton = document.createElement("button");
redobutton.innerHTML = "redo";
div.append(redobutton);

redobutton.addEventListener("click", () => {
    if(commandsRedo.length >= 1){
        commands.push(commandsRedo.pop());
        eventHandler.dispatchEvent(drawing_changed);
    }
})
//thinline button
const thinLineButton = document.createElement("button");
thinLineButton.innerHTML = "thin";
div.append(thinLineButton);

thinLineButton.addEventListener("click", () => {
    stickerBrush = null;
    customLineWidth = 1;
})
//thickline button
const thickLineButton = document.createElement("button");
thickLineButton.innerHTML = "thick";
div.append(thickLineButton);
thickLineButton.addEventListener("click", () => {
    stickerBrush = null;
    customLineWidth = 10;
})
//emoji buttons


createSticker("😀");
createSticker("🥹");
createSticker("😆");

function createSticker(sticker:string){
    let temp = document.createElement("button");
    temp.innerHTML = sticker;
    divbutton.append(temp);
    temp.addEventListener("click", () => {
        stickerBrush = temp.innerHTML;
    })

    stickerlist.push(temp);
}
//customemoji button

const customSticker = document.createElement("button");
customSticker.innerHTML = "Custom Sticker";
custombuttondiv.append(customSticker);
customSticker.addEventListener("click", () => {
    const text = prompt("Custom Sticker Text", "");
    if (text != ""){
        createSticker(text);
    }
})
function redraw(){
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    
    commands.forEach((cmd) => cmd.execute());

    if (toolOutline){
        toolOutline.execute();
    }
}

eventHandler.addEventListener("drawing_changed",redraw);

eventHandler.addEventListener("tool_moved",redraw);