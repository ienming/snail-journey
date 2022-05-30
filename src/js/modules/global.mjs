let canvasContainer = document.querySelector("#canvasContainer"),
canvasWidth = canvasContainer.offsetWidth,
canvasHeight = canvasContainer.offsetHeight

let rwds = {
    sm: 576,
    md: 992
}

// PIXI init
let app = new PIXI.Application({
backgroundColor: 0xe2dcc6,
antialias: true,
autoResize: true
})
app.renderer.resize(window.innerWidth, window.innerHeight);
canvasContainer.appendChild(app.view)
// PIXI size for resizing
let scale = 0.3

app.renderer.autoResize = true; //隨視窗改變大小
app.renderer.resize(window.innerWidth, window.innerHeight); //全螢幕

// create container for map
let mapContainer = new PIXI.Container()
mapContainer.name = 'mapContainer'
mapContainer.scale.set(0.35)
mapContainer.alpha = 0
vm.$data.app.map = mapContainer

// container for all NPCs (except guys)
let npcContainerIsClicking = false
let npcContainer = new PIXI.Container()
npcContainer.name = 'npcContainer'
npcContainer.scale.set(scale)
npcContainer.on("pointer", ()=>{
    npcContainerIsClicking = true
})

// container for Guys
let guysContainer = new PIXI.Container()
guysContainer.name = 'guysContainer'

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

// call Vue methods
function callVueSys(str, abs='', imgUrl='', coinsNum=0){
    vm.$data.sys.popup = true
    vm.$data.sys.say = str
    vm.$data.sys.abs = abs
    vm.$data.sys.img = imgUrl
    vm.$data.user.coins += coinsNum
}

// from PIXI
function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}
export {canvasContainer, canvasWidth, canvasHeight, app, scale, mapContainer, 
    npcContainer, guysContainer, npcContainerIsClicking, getRandom, arrayEquals, collisionDetect,
    callVueSys, onDragStart, onDragMove, onDragEnd, rwds}