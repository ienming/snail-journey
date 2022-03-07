import {scale, allContainer, getRandom } from './global.mjs'
import {clickSoundEffect} from './sound.mjs'
import {fetchNPC, normalHouses} from './data.mjs'
import {initMission} from './game.mjs'

// Snail
// function createSnail(){
//     let snails
//     let waitSnails = async ()=>{
//         let res = await fetchSnails()
//         snails = res
//         for (let i =0; i<snails.length; i++){
//             createItem(snails[i])
//         }
//     }
//     waitSnails()
// }

function createNPC(){
    let npcs
    let waitNPC = async ()=>{
        let res = await fetchNPC()
        npcs = res
        for (let i =0; i<npcs.length; i++){
            createItem(npcs[i])
        }
    }
    waitNPC()
}

function createNormalHouse(){
    for (let i =0; i<normalHouses.length; i++){
        let obj = {
            name: 'house_normal',
            interactive: false,
            x: normalHouses[i].x,
            y: normalHouses[i].y
        }
        createItem(obj)
    }
}

function createItem(el){
    let texture = new PIXI.Texture.from(`./src/img/${el.name}.png`)
    let item = new PIXI.Sprite(texture)
    item.name = el.name
    item.x = el.x*scale
    item.y = el.y*scale
    item.scale.set(scale)
    item.anchor.set(0.5)
    if (el.interactive !== false){
        item.interactive = true
        item.buttonMode = true
    }
    item
        .on("pointerdown", ()=>{
            vm.$data.interaction.nowClicked = true
            vm.$data.interaction.showPopup = !vm.$data.interaction.showPopup
            vm.$data.interaction.cursorImg = "src/img/icons/checked.svg"
            vm.$data.itemSpeak = el.name
            vm.$data.nowNPC = el
            vm.$data.showMissionBtn = undefined //初始化關閉選項
            // 抽籤決定 NPC 要講哪一句話
            if (el.speaks){
                speakRandomly(el)
            }else{
                vm.$data.nowSpeak = undefined
            }
            // 決定要不要放動畫的角色
            if (el.animated == 1){
                vm.$data.animatedSpriteSpeak = true
            }else {
                vm.$data.animatedSpriteSpeak = false
            }
            if (el.gameSpeaks){
                initMission(el) // 主線探索遊戲邏輯
            }else{
                // 是否有可以認養的按鈕
                if (el.adoptable){
                    vm.$data.adoptable = true
                    vm.$data.program = el.program
                    vm.$data.btnTxt = undefined
                }else{
                    vm.$data.adoptable = false
                    vm.$data.btnTxt = "關閉"
                }
                console.log("講一下廢話")
            }
            clickSoundEffect() //點擊音效
            window.setTimeout(()=>{ // 點擊後離開點擊狀態，解決抓住地圖不放的問題
                vm.$data.interaction.nowClicked = false
            }, 300)
        })
    item.mouseover = function(){ //hover時的放大效果
        gsap.to(this, .2, {
            pixi: {
                scaleX: scale*1.18,
            },
            yoyo: true,
            repeat: 2,
            onComplete: function(){
                item.scale.set(scale)
            }
        })
    }

    allContainer.addChild(item)
}

function speakRandomly(el){
    let randomSentenceNum = getRandom(0, el.speaks.length-1)
    vm.$data.nowSpeak = el.speaks[randomSentenceNum]
}

export {createNPC, createNormalHouse, createItem}