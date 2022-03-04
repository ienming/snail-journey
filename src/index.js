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
// import { test } from './js/modules/test.mjs';

createMap();
createNPC();
window.setTimeout(()=>{
    createNormalHouse();
}, 500)


// test()

app.stage.addChild(allContainer);