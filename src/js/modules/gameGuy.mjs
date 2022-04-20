import { fetchGuys } from './data.mjs'
import { callVueSys } from './global.mjs'
import { app, scale, collisionDetect, guysContainer, getRandom, mapContainer } from './global.mjs'
import { onDragStart, onDragMove, onDragEnd} from './global.mjs'
import { globalGuySprites } from './npc.mjs'

// 所有 guys 可能出現的位置
let guyPositions = []

// 計時每日評價任務
function startDailyJudge(){
    showGuyJudgeTools()
    createGuys()
    let nowTime = new Date().getMinutes()
    window.setInterval(()=>{
        if (new Date().getMinutes() !== nowTime){
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
    sp.name = el.name
    sp.x = guyPositions[posId].x*scale
    sp.y = guyPositions[posId].y*scale
    sp.scale.set(scale)
    sp.anchor.set(0.5)
    if (el.interactive !== false){
        sp.interactive = true
        sp.buttonMode = true
    }
    sp.mouseover = function(){
        guySay(el, sp.x, sp.y, el.speaks[0])
    }
    sp.mouseout = function(){
        cleanAllGuysSaid()
    }
    // 放進去 container
    guysContainer.addChild(sp)
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
    judgeToolsContainer.x = 150*scale
    judgeToolsContainer.y = window.innerHeight*0.8
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
                gsap.to(tool, .5, {
                    pixi: {
                        x: toolsData[toolId].x,
                        y: toolsData[toolId].y,
                        scale: scale,
                        alpha: 1
                    }
                })
            }
        })
        let respondGuy = globalGuys[globalGuys.findIndex( el => el.name == beingJudged)]
        let respondSp = guysContainer.children[guysContainer.children.findIndex(el=>el.name == beingJudged)]
        switch (tool.name){
            case 'great':
                // 在這裡判斷是否要給獎勵
                // guySay(respondGuy, respondSp.x, respondSp.y, `${beingJudged}被讚了！`)
                if (beingJudged.indexOf("good") !== -1){
                    let str = "被你讚美的他很開心，之後也一定會持續替綠洲做好事的～"
                    let num = 5
                    callVueSys(str, `獲得${num}個蝸牛幣`, "./src/img/coin.png", num)
                }
                break;
            case 'bad':
                // guySay(respondGuy, respondSp.x, respondSp.y, `${beingJudged}被罵了......`)
                if (beingJudged.indexOf("bad") !== -1){
                    let str = "給臭傢伙一點教訓了！哇哈哈"
                    let num = 5
                    callVueSys(str, `獲得${num}個蝸牛幣`, "./src/img/coin.png", num)
                }
                break;
        }
        window.setTimeout(()=>{
            cleanAllGuysSaid()
            // 只要互動過了就消失
            gsap.to(respondSp, .1, {
                pixi: {
                    scale: 0
                },
                onComplete(){
                    globalGuySprites.splice(globalGuySprites.findIndex(el=>el.name == beingJudged), 1) //把用來比對撞擊的資料也清除
                    respondSp.destroy()
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