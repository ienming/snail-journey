import './sass/style.sass'

import {
    app,
    mapContainer,
} from "./js/modules/global.mjs";
import {
    createMap,
} from "./js/modules/map.mjs";
import {
    createNPC,
    createNormalHouse,
} from "./js/modules/npc.mjs";
import { fetchFurnitures, fetchAchievements } from './js/modules/data.mjs';
import { startDailyTrash } from './js/modules/gameTrash.mjs';
import { startDailyJudge } from './js/modules/gameGuy.mjs'

createMap();
createNPC();
window.setTimeout(()=>{
    createNormalHouse();
    startDailyTrash();
    startDailyJudge();
}, 500)
fetchFurnitures();
fetchAchievements();

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
//     mapContainer.addChild(cursorSprite)
// }, 1500)

app.stage.addChild(mapContainer);