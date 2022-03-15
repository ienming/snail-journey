import { trashes } from "./data.mjs"
import { collisionDetect, getRandom } from "./global.mjs"
import { canvasWidth, canvasHeight, scale, allContainer} from "./global.mjs"
import { npcsG } from "./npc.mjs"

// 主線探索遊戲邏輯
function initMission(el){
    let nowUserMissionProgress = vm.$data.user.missions[`mission${el.mission}`]
    if (el.mission && nowUserMissionProgress.indexOf('finished') == -1){ //此NPC有任務而且該任務還沒完成
        // 首先確認是不是點到開啟新任務的NPC
        if (el.enterGame == 1 && nowUserMissionProgress.length == 0){ //而且玩家這條任務還沒開啟
            vm.$data.nowSpeak = el.gameSpeaks[0]
            vm.$data.btnTxt = "下一步"
            vm.$data.adoptable = false
            vm.$data.interaction.nowAns = true
        }
    }else if (el.mission){  // 此 NPC 的任務對話完成了
        // 是否有可以認養的按鈕
        if (el.adoptable){
            vm.$data.adoptable = true
            vm.$data.program = el.program
        }else{
            vm.$data.adoptable = false
            vm.$data.btnTxt = "關閉"
        }
        console.log(`任務${el.mission}結束，講一下廢話`)
    }
}

// 撿垃圾
let trashContainer = new PIXI.Container()
function startDailyTrash(){
    let nowTime = new Date().getMinutes()
    generateTrash() // init trashes
    window.setInterval(()=>{
        if (new Date().getMinutes() !== nowTime){
            nowTime = new Date().getMinutes()
            console.log("重新產生垃圾")
            while(trashContainer.children.length > 0){
                trashContainer.removeChild(trashContainer.children[0])
            }
            generateTrash()
            vm.$data.user.daily.gotTrashes = 0
        }
    }, 1000)
}

function generateTrash(){
    let todayTrashNum = getRandom(1,10)
    vm.$data.user.daily.trashNum = todayTrashNum
    let scale = .1;
    for (let i=0; i<todayTrashNum; i++){
        console.log(`製造第${i}個垃圾`)
        let trashTexture = new PIXI.Texture.from("./src/img/board.png")
        let trashSp = new PIXI.Sprite(trashTexture)
        trashSp.x = trashes[i].x
        trashSp.y = trashes[i].y
        trashSp.scale.set(scale)
        trashSp.interactive = true
        trashSp.buttonMode = true
        trashSp.on("pointerdown", (el)=>{
            console.log("撿到垃圾了")
            vm.$data.user.daily.gotTrashes ++
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
            if (vm.$data.user.daily.gotTrashes == todayTrashNum){
                console.log("今天的垃圾撿完了！謝謝光臨！")
            }
        })
        trashSp.mouseover = function(){ //hover時的放大效果
            gsap.to(this, .2, {
                pixi: {
                    scaleX: scale*1.18,
                },
                yoyo: true,
                repeat: 2,
                onComplete: function(){
                    trashSp.scale.set(scale)
                }
            })
        }
        trashContainer.addChild(trashSp)
    }
    trashContainer.x = -window.innerWidth/2
    trashContainer.y = -window.innerHeight/2
    allContainer.addChild(trashContainer)
}

export {initMission, startDailyTrash}

// Achievement Map for mapping whether get badges or not
// let achievementMap = {
//     block1: ['bike', 'house_literature'],
//     block2: []
// }
// 把這邊改成某一區全區講完話就有徽章

// function initMission(el){
//     let nowUserMissionProgress = vm.$data.user.missions[`mission${el.mission}`]
//     if (el.mission && nowUserMissionProgress.indexOf('finished') == -1){ //此NPC有任務而且該任務還沒完成
//         // 首先確認是不是點到開啟新任務的NPC
//         if (el.enterGame == 1 && nowUserMissionProgress.length == 0){ //而且玩家這條任務還沒開啟
//             vm.$data.showMissionBtn = 'notyet'
//             vm.$data.nowSpeak = el.gameSpeak.notyet
//         }else if (nowUserMissionProgress.length > 0){  //確認NPC所屬的這條任務是不是開啟
//             console.log("任務已開啟，目前階段： "+nowUserMissionProgress.length)
//             let arr = []
//             arr = vm.$data.user.missions[`mission${el.mission}`].slice(0)
//             if (el.name == arr[arr.length-1]) { //如果點到的跟上一個一樣
//                 vm.$data.nowSpeak = el.gameSpeak.progress //再講一次一樣的提示
//                 console.log("同一NPC, 尚未前往下一階段")
//                 return
//             }
//             console.log("要被推入的NPC："+el.name)
//             arr.push(el.name)
//             if (arrayEquals(arr, gameFlow[`mission${el.mission}`].slice(0, arr.length))){ //確認順序是不是正確的
//                 vm.$data.user.missions[`mission${el.mission}`].push(el.name)
//                 vm.$data.nowSpeak = el.gameSpeak.progress
//                 console.log("點對人了")
//                 // 結束遊戲
//                 if (arr.length == gameFlow[`mission${el.mission}`].length){
//                     console.log(`任務${el.mission}完成！`)
//                     vm.$data.nowSpeak = el.gameSpeak.complete
//                     vm.$data.user.missions[`mission${el.mission}`].push('finished')
//                 }
//             }else{
//                 console.log("順序錯了，不是找我")
//                 console.log("目前的順序："+arr)
//                 console.log("正確的順序："+gameFlow[`mission${el.mission}`].slice(0, arr.length))
//             }
//         }else{
//             console.log(`任務${el.mission}尚未開啟`)
//         }
//     }else{
    //         console.log("沒有任務喔～")
    //         return
    //     }
    // }