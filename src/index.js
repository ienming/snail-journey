import './sass/style.sass'

import {
    app,
    allContainer,
} from "./js/modules/global.mjs";
import {
    createMap,
} from "./js/modules/map.mjs";
import {
    createNPC,
    createNormalHouse,
} from "./js/modules/npc.mjs";

createMap();
createNPC();
window.setTimeout(()=>{
    createNormalHouse();
}, 500)

// create cursor following
// let cursorTexture = new PIXI.Texture.from(vm.$data.interaction.cursorImg)
// let cursorSprite = new PIXI.Sprite(cursorTexture)
// cursorSprite.anchor.set(0.5)
// window.addEventListener("mousemove", (evt)=>{
//     console.log(evt)
//     cursorSprite.x = evt.clientX
//     cursorSprite.y = evt.clientY
// })
// window.setTimeout(()=>{
//     allContainer.addChild(cursorSprite)
// }, 1500)

app.stage.addChild(allContainer);