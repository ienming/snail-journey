import { guysContainer } from './global.mjs'
import { app, scale } from './global.mjs'

// guys 在說話
let guySayContainer = new PIXI.Container()
function guySay(guy){
    while(guySayContainer.children.length > 0){
        guySayContainer.removeChild(guySayContainer.children[0])
    }
    const style = new PIXI.TextStyle({
        fontSize: 16
    })
    let said = new PIXI.Text(guy.speaks[0], style)
    said.x = guy.x*scale
    said.y = guy.y*scale
    guySayContainer.addChild(said)
}

function cleanAllGuysSaid(){
    while(guySayContainer.children.length > 0){
        guySayContainer.removeChild(guySayContainer.children[0])
    }
}

// 評價 guys 的行為
let judgeToolsContainer = new PIXI.Container()
function showGuyJudgeTools(){
    //
    judgeToolsContainer.visible = true
    let greatTexture = new PIXI.Texture.from(`./src/img/icons/great.png`)
    const greatTool = new PIXI.Sprite(greatTexture)
    greatTool.scale.set(scale)
    let badTexture = new PIXI.Texture.from(`./src/img/icons/bad.png`)
    const badTool = new PIXI.Sprite(badTexture)
    badTool.scale.set(scale)
    badTool.x = 50
    judgeToolsContainer.addChild(greatTool)
    judgeToolsContainer.addChild(badTool)

    judgeToolsContainer.x = 80*scale
    judgeToolsContainer.y = 100*scale
}
app.stage.addChild(judgeToolsContainer)

export {guySay, guySayContainer, cleanAllGuysSaid, showGuyJudgeTools, judgeToolsContainer}