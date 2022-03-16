import { guysContainer } from './global.mjs'
import {scale } from './global.mjs'

// guys 在說話
let guySayContainer = new PIXI.Container()
function guySay(guy){
    console.log(`${guy.name}is speaking~~~`)
    while(guySayContainer.children.length > 0){
        guySayContainer.removeChild(guySayContainer.children[0])
    }
    let said = new PIXI.Text(guy.speaks[0])
    said.x = guy.x*scale
    said.y = guy.y*scale
    guySayContainer.addChild(said)
}
guysContainer.addChild(guySayContainer)

function showGuyJudgeTools(){
    //
}

export {guySay, guySayContainer}