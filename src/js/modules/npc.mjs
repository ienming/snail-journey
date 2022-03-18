import {scale, getRandom } from './global.mjs'
import {clickSoundEffect} from './sound.mjs'
import {fetchNPC, normalHouses} from './data.mjs'
import { initMission } from './gameExplore.mjs'
import { npcContainer } from './global.mjs'
import { mapContainer } from './global.mjs'
import { distDefined } from './map.mjs'

let globalNPCs = [], globalGuySprites = []
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
        .on("pointerup", ()=>{
            if (distDefined){
                console.log("now dragging map")
            }else{
                vm.$data.interaction.nowClicked = true
                vm.$data.nowNPC = el
                vm.$data.showMissionBtn = undefined //初始化關閉選項
                if (el.house){
                    // 把是誰的房子這個資料傳出去，準備給 component 接進去
                    vm.$data.interaction.showHouse = true
                    vm.$data.interaction.houseName = el.name
                }else{
                    vm.$data.interaction.showPopup = !vm.$data.interaction.showPopup
                    vm.$data.itemSpeak = el.name
                    // 抽籤決定 NPC 要講哪一句話
                    if (el.speaks){
                        speakRandomly(el)
                    }else{
                        vm.$data.nowSpeak = undefined
                    }
                    // 決定要不要放動畫的角色
                    // if (el.animated == 1){
                    //     vm.$data.animatedSpriteSpeak = true
                    // }else {
                    //     vm.$data.animatedSpriteSpeak = false
                    // }
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
                }
                clickSoundEffect() //點擊音效
                window.setTimeout(()=>{ // 點擊後離開點擊狀態，解決抓住地圖不放的問題
                    vm.$data.interaction.nowClicked = false
                }, 300)
            }
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
    npcContainer.addChild(item)
    globalNPCs.push(item)
    // else if (el.group == 'daily'){
    //     item.mouseover = function(){
    //         guySay(el, el.speaks[0])
    //     }
    //     item.mouseout = function(){
    //         cleanAllGuysSaid()
    //     }
    //     // 每日任務的那些 guys
    //     guysContainer.addChild(item)
    //     guysContainer.addChild(guySayContainer)
    //     globalGuySprites.push(item)
    // }

    mapContainer.addChild(npcContainer)
    // mapContainer.addChild(guysContainer)
}

function speakRandomly(el){
    let randomSentenceNum = getRandom(0, el.speaks.length-1)
    vm.$data.nowSpeak = el.speaks[randomSentenceNum]
}

export {createNPC, createNormalHouse, createItem, globalGuySprites}