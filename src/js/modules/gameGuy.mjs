import { guysContainer } from './global.mjs'
import { app, scale, collisionDetect } from './global.mjs'
import { onDragStart, onDragMove, onDragEnd} from './global.mjs'
import { globalGuys } from './npc.mjs'
import { globalGuySprites } from './npc.mjs'

// guys 在說話
let guySayContainer = new PIXI.Container()
guySayContainer.name = 'guySaidsContainer'
function guySay(guy, txt = '沒有說話'){
    while(guySayContainer.children.length > 0){
        guySayContainer.removeChild(guySayContainer.children[0])
    }
    const style = new PIXI.TextStyle({
        fontSize: 16
    })
    let said = new PIXI.Text(txt, style)
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
let judgeToolsContainer = new PIXI.Container()
judgeToolsContainer.name = 'judgeToolsContainer'
function showGuyJudgeTools(){
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
    let beingJudged = ''
    let toolId = toolsData.findIndex( el => el.name == tool.name )
    for (let i=0; i<globalGuySprites.length; i++){
        if (collisionDetect(tool, globalGuySprites[i])){
            beingJudged = globalGuySprites[i].name
        }
    }
    if (beingJudged !== ''){
        console.log(`給${beingJudged +' '+ tool.name}的評價了`)
        gsap.to(tool, .5, {
            pixi: {
                scale: scale*2,
                alpha: 0
            },
            onComplete: function(){
                // tools 要縮小飛回去
                gsap.to(tool, .5, {
                    pixi: {
                        x: toolsData[toolId].x,
                        y: toolsData[toolId].y,
                        scale: scale,
                        alpha: 1
                    },
                    delay: .5
                })
            }
        })
        let respnodGuy = globalGuys[globalGuys.findIndex( el => el.name == beingJudged)]
        switch (tool.name){
            case 'great':
                guySay(respnodGuy, `${beingJudged}被讚了！`)
                break;
            case 'bad':
                guySay(respnodGuy, `${beingJudged}被罵了......`)
                break;
        }
        window.setTimeout(()=>{
            cleanAllGuysSaid()
        }, 1500)
    }else{
        console.log("什麼事也沒有")
        gsap.to(tool, .5, {
            pixi: {
                x: toolsData[toolId].x,
                y: toolsData[toolId].y,
                scale: scale
            }
        })
    }
}

export {guySay, guySayContainer, cleanAllGuysSaid, showGuyJudgeTools, judgeToolsContainer}