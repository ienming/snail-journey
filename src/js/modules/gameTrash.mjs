import { trashes } from "./data.mjs"
import { callVueSys, getRandom, scale } from "./global.mjs"
import { mapContainer} from "./global.mjs"
import { playPickTrashSE } from "./sound.mjs"

// 撿垃圾
let trashContainer = new PIXI.Container()
trashContainer.name = 'trashesContainer'
trashContainer.scale.set(scale)
let trashesMap = ['trash_bottle', 'trash_paper', 'trash_pet', 'trash_tabaco']
function startDailyTrash(){
    // 這邊 init 要先判斷有沒有已經撿垃圾的資料，如果有那就是產生那幾個而已
    let recordTrashes = vm.$data.userRecord.gotTrashes
    let dailyTrashesQues = vm.$data.dailyTrashes
    if (recordTrashes && recordTrashes.length > 0){
        if (recordTrashes.length < vm.$data.dailyTrashes.length){
            console.log("依據資料產生垃圾")
            let notYetIds = [...dailyTrashesQues], notYetGotTrashes = []
            for (let i=0; i<recordTrashes.length; i++){
                let removeId = notYetIds.indexOf(recordTrashes[i])
                notYetIds.splice(removeId, 1)
            }
            notYetIds.forEach(nyid=>{
                trashes.forEach(trash=>{
                    if (trash.id == nyid){
                        notYetGotTrashes.push(trash)
                    }
                })
            })
            notYetGotTrashes.forEach(trash=>{
                drawTrash(trash)
            })
            mapContainer.addChild(trashContainer)
        }else{
            console.log("今天的垃圾已經清完了")
        }
    }else{
        // 如果一切都還沒開始（新玩家）
        console.log("新開始產生垃圾")
        vm.$data.dailyTrashes = []
        vm.$data.user.gotTrashes = []
        generateTrash()
    }
    // 判斷每日更新
    let nowTime = new Date().getMinutes()
    window.setInterval(()=>{
        if (new Date().getMinutes() !== nowTime){
            nowTime = new Date().getMinutes()
            console.log("計時重新產生垃圾")
            while(trashContainer.children.length > 0){
                trashContainer.removeChild(trashContainer.children[0])
            }
            vm.$data.dailyTrashes = []
            generateTrash()
            vm.$data.user.gotTrashes = []
        }
    }, 1000)
}

function generateTrash(){
    let todayTrashNum = getRandom(0,10)
    let readyTrashes = [...trashes]
    for (let i=0; i<todayTrashNum; i++){
        console.log(`製造第${i}個垃圾`)
        let id = getRandom(0,readyTrashes.length -1)
        drawTrash(readyTrashes[id])
        vm.$data.dailyTrashes.push(readyTrashes[id].id) //儲存新題目
        readyTrashes.splice(id, 1) //移除已經畫過的，所以不會再抽到一樣的位置
    }
    mapContainer.addChild(trashContainer)
}

function drawTrash(trash){
    let trashName = trashesMap[getRandom(0,trashesMap.length-1)]
    let trashTexture = new PIXI.Texture.from(`./src/img/${trashName}.png`)
    let trashSp = new PIXI.Sprite(trashTexture)
    trashSp.anchor.set(0.5)
    let animDelay = Math.random()
    gsap.to(trashSp, 1, {
        pixi: {
            y: -10
        },
        yoyo: true,
        repeat: -1,
        delay: animDelay
    })
    // 垃圾影子
    let trashShadowTex = new PIXI.Texture.from(`./src/img/trashes_shadow.png`)
    let trashShdw = new PIXI.Sprite(trashShadowTex)
    trashShdw.y = 160
    trashShdw.alpha = 0.5
    trashShdw.anchor.set(0.5)
    gsap.to(trashShdw, 1, {
        pixi: {
            scale: 0.5
        },
        yoyo: true,
        repeat: -1,
        delay: animDelay
    })
    // 
    let eachTrshCont = new PIXI.Container()
    eachTrshCont.x = trash.x
    eachTrshCont.y = trash.y
    eachTrshCont.scale.set(scale)
    eachTrshCont.addChild(trashShdw)
    eachTrshCont.addChild(trashSp)
    eachTrshCont.interactive = true
    eachTrshCont.buttonMode = true
    eachTrshCont.on("pointerdown", (el)=>{
        // console.log("撿到垃圾了")
        vm.$data.user.gotTrashes.push(trash.id) //讓 Vue watch 撿垃圾的資料
        //做動畫變小消失
        // gsap.to(el.target, .2, {
        //     pixi: {
        //         scale: 0
        //     },
        //     onComplete(){
        //         //確定動畫完成後destroy
        //     }
        // })
        //增加蝸牛幣、計算總共撿了多少垃圾？
        el.target.destroy()
        // 判斷是否完成每日撿垃圾任務
        if (vm.$data.user.gotTrashes.length == vm.$data.dailyTrashes.length){
            let str = "謝謝你幫忙清理街道上的垃圾！因為有你，蝸牛綠洲變得更清新了。"
            let imgUrl = "./src/img/coin.png"
            let num = 0
            if (vm.$data.dailyTrashes.length < 3){
                num = vm.$data.dailyTrashes.length
            }else if (vm.$data.dailyTrashes.length > 3 && vm.$data.dailyTrashes.length < 7){
                num = 4
            }else {
                num = 5
            }
            let abs = `獲得 ${num} 個蝸牛幣`
            callVueSys(str, abs, imgUrl, num)
        }
        // 播放音效
        playPickTrashSE()
    })
    eachTrshCont.on("mouseover", ()=>{ //hover 放大
        console.log(eachTrshCont)
        gsap.to(eachTrshCont, .2, {
            pixi: {
                scaleX: scale*1.18,
            },
            yoyo: true,
            repeat: 2,
            onComplete: function(){
                eachTrshCont.scale.set(scale)
            }
        })
    })
    trashContainer.addChild(eachTrshCont)
}

export {startDailyTrash}