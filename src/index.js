import './sass/style.sass'
import {
    app,
    allContainer,
} from "./js/modules/global.mjs";
import {
    createMap,
} from "./js/modules/map.mjs";
import {
    createSnail,
    createInteractiveItem,
    createNormalHouse,
} from "./js/modules/npc.mjs";

createMap();
createInteractiveItem();
createSnail();
window.setTimeout(()=>{
    createNormalHouse();
}, 500)

app.stage.addChild(allContainer);