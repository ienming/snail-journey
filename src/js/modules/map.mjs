import { npcContainerIsClicking } from './global.mjs';
import { scale, mapContainer} from './global.mjs'

// Drag & Drop
let dist = {x:0, y:0} //initialize the distance between event x,y and current map x,y
let distDefined = false 

// from PIXI
function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.95;
    this.dragging = true;
    distDefined = false;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
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
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);
    mapContainer.x = window.innerWidth/2
    mapContainer.y = window.innerHeight/2
    // draw Map
    let mapTexture = new PIXI.Texture.from('./src/img/roads.png')
    let map = new PIXI.Sprite(mapTexture)
    // set the transform origin and anchor point of the image which will effect the starting point of the image
    map.anchor.set(0.5) //center center
    map.scale.set(scale)

    mapContainer.addChild(map)
}

export { onDragStart, onDragMove, onDragEnd, createMap, dist, distDefined }

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