import './sass/style.sass'

import {
    app,
    scale,
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
import { createInfo } from './js/modules/npc.mjs';

createMap();
createNPC();
createInfo();
window.setTimeout(()=>{
    // 測試
    createBgHouses();
    //
    createNormalHouse();
    startDailyTrash();
    startDailyJudge();
    window.setTimeout(()=>{
        console.log("原則上都畫好了")
        vm.$data.interaction.nowLoading = false
    }, 800)
}, 500)
fetchFurnitures();
fetchAchievements();

//測試
function createBgHouses(){
    let texture = new PIXI.Texture.from('./src/img/BG.png')
    let sp = new PIXI.Sprite(texture)
    sp.name = "bgHouses"
    sp.anchor.set(0.5)
    sp.scale.set(scale)
    sp.pivot.x = 30
    sp.pivot.y = 30
    sp.alpha = 0.5
    mapContainer.addChild(sp)
}

app.stage.addChild(mapContainer);