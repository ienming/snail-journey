import { scale, allContainer} from './global.mjs'

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
    if (!vm.$data.itemClicked){
        this.dragging = true;
    }else{
        this.dragging = false
    }
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
        console.log(dist)
        this.x = newPosition.x - dist.x;
        this.y = newPosition.y - dist.y;
    }
}

function createMap(){
    let mapTexture = new PIXI.Texture.from('/src/img/roads.png')
    let map = new PIXI.Sprite(mapTexture)
    // set the transform origin and anchor point of the image which will effect the starting point of the image
    map.anchor.set(0.5) //center center
    // map.x = this.width/2
    // map.y = this.height/2
    map.scale.set(scale)

    allContainer.addChild(map)
}

export { onDragStart, onDragMove, onDragEnd, createMap, dist, distDefined }

// scroll on canvas for zomming
canvasContainer.addEventListener('wheel',(e)=>{
    if (e.deltaY > 0){
        console.log("up")
        gsap.to(allContainer, 2, {
            pixi: {
                scale: 1
            }
        })
    }else if (e.deltaY < 0){
        console.log("down")
        gsap.to(allContainer, 2, {
            pixi: {
                scale: 1.5
            }
        })
    }
})