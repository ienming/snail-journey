import './sass/style.sass'

import {
    canvasContainer,
    canvasWidth,
    canvasHeight,
    app,
    scale,
    allContainer,
} from "./js/modules/global.mjs";
import {
    onDragStart,
    onDragMove,
    onDragEnd,
    createMap,
    dist,
    distDefined,
} from "./js/modules/map.mjs";
import {
    createSnail,
    createInteractiveItem,
    createNormalHouse,
} from "./js/modules/npc.mjs";
import { initPersonalPage } from './js/modules/personal.mjs';

createMap();
createInteractiveItem();
createSnail();
createNormalHouse();

initPersonalPage();

app.stage.addChild(allContainer);

console.log("hello webpack")