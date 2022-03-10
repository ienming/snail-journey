import { onDragStart, onDragMove, onDragEnd } from './map.mjs';

let canvasContainer = document.querySelector("#canvasContainer"),
canvasWidth = canvasContainer.offsetWidth,
canvasHeight = canvasContainer.offsetHeight
// PIXI init
let app = new PIXI.Application({
backgroundColor: 0xe2dcc6,
antialias: true,
autoResize: true
})
app.renderer.resize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(app.view)
// PIXI size for resizing
let scale = 0.3;

app.renderer.autoResize = true; //隨視窗改變大小
app.renderer.resize(window.innerWidth, window.innerHeight); //全螢幕

// create container for map
let allContainer = new PIXI.Container()
allContainer.interactive = true
allContainer.buttonMode = true
allContainer
.on('pointerdown', onDragStart)
.on('pointerup', onDragEnd)
.on('pointerupoutside', onDragEnd)
.on('pointermove', onDragMove);
allContainer.x = window.innerWidth/2
allContainer.y = window.innerHeight/2

// get random stences
function getRandom(min, max){
    return Math.floor(Math.random()*(max-min+1))+min
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

function collisionDetect(a, b){
    let aBox = a.getBounds()
    let bBox = b.getBounds()

    return aBox.x + aBox.width > bBox.x &&
            aBox.y + aBox.height > bBox.y &&
            aBox.x < bBox.x + bBox.width &&
            aBox.y < bBox.y + bBox.height
}
export {canvasContainer, canvasWidth, canvasHeight, app, scale, allContainer, getRandom, arrayEquals, collisionDetect}