import './sass/style.sass'

import {
    app,
    scale,
    mapContainer,
} from "./js/modules/global.mjs";
import {
    createMap,
    createBgHouses
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
// 測試
createBgHouses("BG_BTM");
//
createNPC();
createInfo();
window.setTimeout(()=>{
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

app.stage.addChild(mapContainer);