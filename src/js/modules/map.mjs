import { app, scale, mapContainer, rwds} from './global.mjs'

// Drag & Drop
let dist = {x:0, y:0} //initialize the distance between event x,y and current map x,y
let distDefined = false 

// from PIXI
function mapDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.95;
    this.dragging = true;
    distDefined = false;
}

function mapDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function mapDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        if (!distDefined){ //if the distance haven't been defined, start to record while the first newPosition is detected
            dist.x = newPosition.x - this.x
            dist.y = newPosition.y - this.y
            distDefined = true // turn to "is defined" for preventing from overwritten
        }
        this.x = newPosition.x - dist.x;
        this.y = newPosition.y - dist.y;
    }
}

function createMap(){
    // set mapContainer (as map) for dragging
    mapContainer.interactive = true
    mapContainer.buttonMode = true
    mapContainer
    .on('pointerdown', mapDragStart)
    .on('pointerup', mapDragEnd)
    .on('pointerupoutside', mapDragEnd)
    .on('pointermove', mapDragMove);
    mapContainer.x = window.innerWidth/2
    mapContainer.y = window.innerHeight/2
    // draw Map
    let mapTexture = new PIXI.Texture.from('./src/img/roads.png')
    let map = new PIXI.Sprite(mapTexture)
    map.name = 'roads'
    // set the transform origin and anchor point of the image which will effect the starting point of the image
    map.anchor.set(0.5) //center center
    map.scale.set(scale)

    mapContainer.addChild(map)
}

function createBgHouses(name){
    let texture = new PIXI.Texture.from(`./src/img/${name}.png`)
    let sp = new PIXI.Sprite(texture)
    sp.name = name
    sp.anchor.set(0.5)
    sp.scale.set(scale)
    sp.pivot.x = 60
    sp.alpha = 0.8
    mapContainer.addChild(sp)
}

export { createMap, createBgHouses, dist, distDefined, createCompass }

// scroll on canvas for zomming
canvasContainer.addEventListener('wheel',(e)=>{
    if (e.deltaY > 0){
        // console.log("up")
        gsap.to(mapContainer, 2, {
            pixi: {
                scale: 1
            }
        })
    }else if (e.deltaY < 0){
        // console.log("down")
        gsap.to(mapContainer, 2, {
            pixi: {
                scale: 1.5
            }
        })
    }
})

// rotating the compass
let deg = 0, cmps
let cmpsX = 100*scale, cmpsY = window.innerHeight*0.7
function createCompass(){
    let container = new PIXI.Container()
    container.name = "compassContainer"
    let compassTexture = new PIXI.Texture.from('./src/img/compass.png')
    cmps = new PIXI.Sprite(compassTexture)
    let cmpsScale
    let rwd = window.innerWidth
    if (rwd < rwds.sm){
        cmpsScale = scale*0.5
        cmpsX = 70*scale
        cmpsY = 70*scale
    }else if (rwd > rwds.sm && rwd < rwds.md){
        cmpsScale = scale*0.8
        cmpsX = 70*scale
        cmpsY = 70*scale
    }else if (rwd > rwds.md){
        cmpsScale = scale
    }
    container.x = cmpsX
    container.y = cmpsY
    cmps.scale.set(cmpsScale)
    container.addChild(cmps)
    // 指針
    let pointerTexture = new PIXI.Texture.from('./src/img/compass_pointer.png')
    let pointer = new PIXI.Sprite(pointerTexture)
    pointer.scale.set(cmpsScale)
    pointer.anchor.set(0.1, 0.5)
    pointer.x = 45*(cmpsScale/scale)
    pointer.y = 45*(cmpsScale/scale)
    container.addChild(pointer)
    app.stage.addChild(container)
    app.ticker.add((delta)=>{
        pointer.rotation = deg
    })
}

canvasContainer.addEventListener('mousemove', (e)=>{
    let hD = e.x - cmpsX, vD = e.y - cmpsY
    deg = Math.atan2(vD, hD)
})