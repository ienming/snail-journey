import { fetchGuys } from './data.mjs'
import { app, scale, collisionDetect, guysContainer } from './global.mjs'
import { onDragStart, onDragMove, onDragEnd} from './global.mjs'
import { globalGuySprites, createItem } from './npc.mjs'

// 計時每日評價任務
function startDailyJudge(){
    createGuys()
    let nowTime = new Date().getMinutes()
    window.setInterval(()=>{
        if (new Date().getMinutes() !== nowTime){
            nowTime = new Date().getMinutes()
            console.log("計時重新產生評價角色")
            while(guysContainer.children.length > 0){
                guysContainer.removeChild(guysContainer.children[0])
            }
            vm.$data.user.judges = []
            createGuys()
        }
    }, 1000)
}

// 產生 Guys
let globalGuys = []
function createGuys(){
    let waitGuys = async()=>{
        let res = await fetchGuys()
        if (vm.$data.user.judges){ //只要畫出還沒評價的就好
            let recordJudges = vm.$data.user.judges
                globalGuys = [...res]
                for (let i=0; i<recordJudges.length; i++){
                    globalGuys.splice(globalGuys.findIndex(el=>el.name == recordJudges[i]), 1)
                }
                if (globalGuys.length == 0){
                    console.log("今天的評價已經結束了")
                }
                // console.log("有記錄的資料，現在只要畫：")
                // console.log(globalGuys)
        }else{
            globalGuys = res // 如果沒有紀錄的資料，就全部畫出來
        }
        for (let i=0; i<globalGuys.length; i++){
            createItem(globalGuys[i])
        }
        showGuyJudgeTools()
    }
    waitGuys()
}

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
        let respondSp = guysContainer.children[guysContainer.children.findIndex(el=>el.name == beingJudged)]
        switch (tool.name){
            case 'great':
                // 在這裡判斷是否要給獎勵
                guySay(respnodGuy, `${beingJudged}被讚了！`)
                break;
            case 'bad':
                guySay(respnodGuy, `${beingJudged}被罵了......`)
                break;
        }
        window.setTimeout(()=>{
            cleanAllGuysSaid()
            // 只要互動過了就消失
            gsap.to(respondSp, .5, {
                pixi: {
                    scale: 0
                },
                onComplete(){
                    respondSp.destroy()
                    globalGuySprites.splice(globalGuySprites.findIndex(el=>el.name == beingJudged), 1) //把用來比對撞擊的資料也清除
                    // 儲存資料給 Vue watch 記錄今天的 respondSp 已經結束了
                    vm.$data.user.judges.push(beingJudged)
                }
            })
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
export {startDailyJudge}