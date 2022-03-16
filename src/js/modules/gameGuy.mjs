import { guysContainer } from './global.mjs'
import { app, scale, collisionDetect } from './global.mjs'
import { onDragStart, onDragMove, onDragEnd} from './global.mjs'
import { globalGuys } from './npc.mjs'

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
    let toolsData = [
        {
            name: 'great',
            x: 0,
            y: 100
        },{
            name: 'bad',
            x: 50,
            y: 100
        }
    ]
    let tools = []

    for (let i=0; i<toolsData.length; i++){
        let texture = new PIXI.Texture.from(`./src/img/icons/${toolsData[i].name}.png`)
        const tool = new PIXI.Sprite(texture)
        tool.name = toolsData[i].name
        tool.interactive = true
        tool.buttonMode = true
        tool.anchor.set(0.5)
        tool.scale.set(scale)
        tool.x = toolsData[i].x
        tool.y = toolsData[i].y
        tool
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointerup', ()=>{
                checkJudged(tool)
            })
            .on('pointerupoutside', ()=>{
                checkJudged(tool)
            })
        tools.push(tool)
    }

    tools.forEach(tool=>{
        judgeToolsContainer.addChild(tool)
    })
    judgeToolsContainer.x = 80*scale
    judgeToolsContainer.y = 100*scale
    app.stage.addChild(judgeToolsContainer)
}

function checkJudged(tool){
    for (let i=0; i<globalGuys.length; i++){
        if (collisionDetect(tool, globalGuys[i])){
            console.log(`給${globalGuys[i].name +' '+ tool.name}的評價了`)
        }else{
            console.log("什麼事也沒有")
        }
    }
}

export {guySay, guySayContainer, cleanAllGuysSaid, showGuyJudgeTools, judgeToolsContainer}