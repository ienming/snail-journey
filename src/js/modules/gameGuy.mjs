import { fetchGuys } from './data.mjs'
import { callVueSys } from './global.mjs'
import { app, scale, collisionDetect, guysContainer, getRandom, mapContainer } from './global.mjs'
import { onDragStart, onDragMove, onDragEnd, rwds} from './global.mjs'
import { globalGuySprites } from './npc.mjs'
import { playJudgeSE } from './sound.mjs'

// GV
let guyPositions = []
let toolScale = scale*0.8
let rwd = window.innerWidth
// RWD
if (rwd < rwds.md){ //mobile
    toolScale = scale*0.6
}

// 計時每日評價任務
function startDailyJudge(){
    showGuyJudgeTools()
    createGuys()
    let nowTime = new Date().getMinutes()
    window.setInterval(()=>{
        if (new Date().getMinutes() !== nowTime && new Date().getMinutes()%5 == 0){
            nowTime = new Date().getMinutes()
            console.log("計時重新產生評價角色")
            while(guysContainer.children.length > 0){
                guysContainer.removeChild(guysContainer.children[0])
                // console.log("清掉")
                // console.log(guysContainer.children)
            }
            vm.$data.user.judges = []
            createGuys()
        }
    }, 1000)
}

// 產生 Guys
let globalGuys
function createGuys(){
    // init 所有 guys 會出現的位置
    guyPositions = [
        {
            x: -1225,
            y: -263
        },{
            x: -473,
            y: 62
        },{
            x: -268,
            y: -332
        },{
            x: 571,
            y: -91
        },{
            x: 1163,
            y: 522
        },{
            x: 578,
            y: 744
        },{
            x: -860,
            y: 400
        }
    ]
    globalGuys = []
    let waitGuys = async()=>{
        let res = await fetchGuys()
        let arr = [...res]
        let recordJudges = vm.$data.user.judges // 已經被評價的
        if (recordJudges.length > 0){ //只要畫出還沒評價的就好
            console.log("有被評價的guys")
            globalGuys = [...vm.$data.dailyGuys]
            for (let i=0; i<recordJudges.length; i++){
                globalGuys.splice(globalGuys.findIndex(el=>el == recordJudges[i]), 1)
            }
            let num  = globalGuys.length, prepareds =[]
            for (let i=0; i<num; i++){
                // console.log(globalGuys[i])
                let guy = arr.filter(el=>el.name == globalGuys[i])[0]
                prepareds.push(guy)
            }
            globalGuys = prepareds
            // console.log(globalGuys)
            if (globalGuys.length == 0){
                console.log("今天的評價已經結束了")
            }
        }else{
            // 如果沒有紀錄的資料，就重新隨機抓取
            console.log("重新抓取要出現的guys")
            vm.$data.dailyGuys = [] //刷新題目
            let todayGuysNum = getRandom(1,res.length)
            console.log(`今天要抽出的數量為：${todayGuysNum}`)
            if (arr){
                // console.log("allResponses: ")
                // console.log(res)
                for (let i=0; i<todayGuysNum; i++){
                    let todayGuyId = getRandom(0,arr.length-1)
                    // console.log("todayGuyId: "+todayGuyId)
                    let todayGuy = arr.splice(todayGuyId, 1)[0]
                    // console.log("todayGuyIs: ")
                    // console.log(todayGuy)
                    // console.log("respondArr: ")
                    // console.log(arr)
                    globalGuys.push(todayGuy)
                    // 記錄今天出現的 guys
                    vm.$data.dailyGuys.push(todayGuy.name)
                }
            }
        }
        if (globalGuys.length == 0){
            return
        }else{
            for (let i=0; i<globalGuys.length; i++){
                drawGuy(globalGuys[i])
            }
        }
    }
    waitGuys()
}

// 畫所有的 guys
function drawGuy(el){
    let texture = new PIXI.Texture.from(`./src/img/${el.name}.png`)
    let sp = new PIXI.Sprite(texture)
    let posId = getRandom(0,guyPositions.length-1)
    let [guyPosX, guyPosY] = [guyPositions[posId].x*scale, guyPositions[posId].y*scale]
    sp.name = el.name
    sp.scale.set(scale)
    sp.anchor.set(0.5)
    // guy icon
    let iconTexture = new PIXI.Texture.from('./src/img/icons/judge.png')
    let icon = new PIXI.Sprite(iconTexture)
    icon.name = 'guysicon'
    icon.x = 20
    icon.y = -50
    icon.scale.set(scale*1.4)
    let animDelay = Math.random()
    gsap.to(icon, .5, {
        pixi: {
            y: -55
        },
        yoyo: true,
        repeat: -1,
        delay: animDelay
    })
    let eachGuyContainer = new PIXI.Container()
    eachGuyContainer.name = el.name
    eachGuyContainer.x = guyPosX
    eachGuyContainer.y = guyPosY
    if (el.interactive !== false){
        eachGuyContainer.interactive = true
        eachGuyContainer.buttonMode = true
    }
    eachGuyContainer.mouseover = function(){
        guySay(el, guyPosX, guyPosY, el.speaks[0])
    }
    eachGuyContainer.mouseout = function(){
        cleanAllGuysSaid()
    }
    eachGuyContainer.addChild(sp)
    eachGuyContainer.addChild(icon)
    // 放進去 container
    guysContainer.addChild(eachGuyContainer)
    guysContainer.addChild(guySayContainer)
    console.log(`把${sp.name}放進去guysContainer`)
    globalGuySprites.push(sp)
    mapContainer.addChild(guysContainer)
    // 把已經有 guy 站的位置移除，所以畫下一個 guy 的時候不會重疊
    guyPositions.splice(posId, 1)
}

// guys 在說話
let guySayContainer = new PIXI.Container()
guySayContainer.name = 'guySaidsContainer'
function guySay(guy, x, y, txt = '沒有說話'){
    while(guySayContainer.children.length > 0){
        guySayContainer.removeChild(guySayContainer.children[0])
    }
    // 說話的內容
    let arr = [], step = 12, line = 0, padding = 12, fz = 16, r=16
    for (let i=0; i<txt.length; i+=step){
        arr.push(txt.slice(i, i+step))
        line ++
    }
    let str = arr.join("\n")
    const style = new PIXI.TextStyle({
        fontSize: fz
    })
    let said = new PIXI.Text(str, style)
    said.x = padding
    said.y = padding
    // 對話框
    let rect = new PIXI.Graphics()
    let w, h
    if (line == 1){
        w = fz*txt.length+padding*2
    }else {
        w = fz*step+padding*2
    }
    h = line*(fz*1.25)+padding*2
    rect.beginFill(0xf4f3ed)
    rect.drawRoundedRect(0, 0, w, h, r)
    rect.endFill()
    guySayContainer.addChild(rect)
    guySayContainer.addChild(said)
    // 動畫
    guySayContainer.x = x
    guySayContainer.y = y
    guySayContainer.alpha = 0
    guySayContainer.scale = 0
    guySayContainer.pivot.set(-20, 5)
    gsap.to(guySayContainer, .4, {
        pixi: {
            scale: 1,
            alpha: 1,
        }
    })
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
        y: 100,
        sm: {
            x: 20,
            y: 100
        }
    },{
        name: 'bad',
        x: 70,
        y: 100,
        sm: {
            x: 20,
            y: 190
        }
    }
]
let judgeToolsContainer = new PIXI.Container()
judgeToolsContainer.name = 'judgeToolsContainer'

function showGuyJudgeTools(){
    let tools = []
    let toolsContainerX = 200*scale, toolsContainerY = window.innerHeight*0.77
    let judgeCase = new PIXI.Graphics()
    let jc = {
        sm: {
            p: 10,
            h: 125,
            r: 200
        },
        md: {
            p: 14,
            h: 80,
            r: 200
        }
    }
    judgeCase.beginFill(0xa09776)
    judgeCase.alpha = 0.6
    // RWD
    if (rwd < rwds.md){ //mobile
        toolsContainerX = 100*scale
        toolsContainerY = window.innerHeight - 220
        // judgeCase
        judgeCase.drawRoundedRect(20-(340*toolScale/2)-jc.sm.p/2, 50-jc.sm.p, 230*toolScale+jc.sm.p*2, jc.sm.h, jc.sm.r)
        judgeCase.endFill()
    }else if (rwd > rwds.md){
        judgeCase.drawRoundedRect(0-(230*toolScale/2)-jc.md.p, 100-(230*toolScale/2)-jc.md.p, 500*toolScale+jc.md.p*2, jc.md.h, jc.md.r)
        judgeCase.endFill()
    }
    judgeToolsContainer.addChild(judgeCase)

    for (let i=0; i<toolsData.length; i++){
        let texture = new PIXI.Texture.from(`./src/img/icons/${toolsData[i].name}.png`)
        const tool = new PIXI.Sprite(texture)
        tool.name = toolsData[i].name
        tool.interactive = true
        tool.buttonMode = true
        tool.anchor.set(0.5)
        // RWD
        let toolX = toolsData[i].x , toolY = toolsData[i].y
        if (rwd < rwds.md){ //mobile
            toolX = toolsData[i].sm.x * 0.7
            toolY = toolsData[i].sm.y * 0.7
        }
        tool.scale.set(toolScale)
        tool.x = toolX
        tool.y = toolY
        tool.cursor = "url('./src/img/icons/cursor_pick.png'),auto"
        tool
            .on('pointerdown', onDragStart)
            .on('pointermove', onDragMove)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointerup', ()=>{
                console.log("from pointerup to checkJudged")
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

    judgeToolsContainer.x = toolsContainerX
    judgeToolsContainer.y = toolsContainerY
    app.stage.addChild(judgeToolsContainer)
}

function checkJudged(tool){
    let beingJudged = ''
    let toolId = toolsData.findIndex( el => el.name == tool.name )
    for (let i=0; i<globalGuySprites.length; i++){
        console.log('globalGuySprites[i] name:')
        console.log(globalGuySprites[i].name)
        if (collisionDetect(tool, globalGuySprites[i])){
            beingJudged = globalGuySprites[i].name
        }
    }
    if (beingJudged !== ''){
        // console.log(`給${beingJudged +' '+ tool.name}的評價了`)
        // 儲存資料給 Vue watch 記錄今天的 judges 已經結束了
        vm.$data.user.judges.push(beingJudged)
        gsap.to(tool, .5, {
            pixi: {
                scale: scale*2,
                alpha: 0
            },
            onComplete: function(){
                // tools 要縮小飛回去
                if (rwd < rwds.md){
                    gsap.to(tool, .5, {
                        pixi: {
                            x: toolsData[toolId].sm.x*0.7,
                            y: toolsData[toolId].sm.y*0.7,
                            scale: toolScale,
                            alpha: 1
                        }
                    })
                }else if (rwd > rwds.md){
                    gsap.to(tool, .5, {
                        pixi: {
                            x: toolsData[toolId].x,
                            y: toolsData[toolId].y,
                            scale: toolScale,
                            alpha: 1
                        }
                    })
                }
            }
        })
        let respondGuy = globalGuys[globalGuys.findIndex( el => el.name == beingJudged)]
        let respondSp = guysContainer.children[guysContainer.children.findIndex(el=>el.name == beingJudged)]
        let str="", num = 0
        switch (tool.name){
            case 'great':
                // 在這裡判斷是否要給獎勵
                // guySay(respondGuy, respondSp.x, respondSp.y, `${beingJudged}被讚了！`)
                if (beingJudged.indexOf("good") !== -1){
                    str = "被你讚美的他很開心，之後也一定會持續替綠洲做好事的～"
                    num = 10
                    callVueSys(str, `獲得${num}個蝸牛幣`, "./src/img/coin.png", num)
                }else{
                    str = "破壞秩序的人繼續任性妄為了"
                    callVueSys(str, `維持秩序失敗...`)
                }
                break;
            case 'bad':
                // guySay(respondGuy, respondSp.x, respondSp.y, `${beingJudged}被罵了......`)
                if (beingJudged.indexOf("bad") !== -1){
                    str = "謝謝你幫忙維持秩序！替大家打抱不平！"
                    num = 10
                    callVueSys(str, `獲得${num}個蝸牛幣`, "./src/img/coin.png", num)
                }else{
                    str = "替綠洲做好事的人覺得很受傷"
                    callVueSys(str, `維持秩序失敗...`)
                }
                break;
        }
        window.setTimeout(()=>{
            cleanAllGuysSaid()
            // 只要互動過了就消失
            globalGuySprites.splice(globalGuySprites.findIndex(el=>el.name == beingJudged), 1) //把用來比對撞擊的資料也清除
            gsap.to(respondSp, .4, {
                pixi: {
                    scale: 0
                },
                // onComplete(){
                    // respondSp.destroy()
                // }
            })
        }, 1500)
        // 音效
        playJudgeSE()
    }else{
        console.log("什麼事也沒有")
        // tools 要縮小飛回去
        if (rwd < rwds.md){
            gsap.to(tool, .5, {
                pixi: {
                    x: toolsData[toolId].sm.x*0.7,
                    y: toolsData[toolId].sm.y*0.7,
                    scale: toolScale,
                    alpha: 1
                }
            })
        }else if (rwd > rwds.md){
            gsap.to(tool, .5, {
                pixi: {
                    x: toolsData[toolId].x,
                    y: toolsData[toolId].y,
                    scale: toolScale,
                    alpha: 1
                }
            })
        }
    }
}

export {guySay, guySayContainer, cleanAllGuysSaid, showGuyJudgeTools, judgeToolsContainer}
export {startDailyJudge}