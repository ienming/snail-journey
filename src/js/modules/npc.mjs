import {scale, allContainer, getRandom } from './global.mjs'
import {clickSoundEffect} from './sound.mjs'
import {fetchSnails, fetchItems, normalHouses} from './data.mjs'

// Snail
function createSnail(){
    let snails
    let waitSnails = async ()=>{
        let res = await fetchSnails()
        snails = res
        for (let i =0; i<snails.length; i++){
            createItem(snails[i])
            console.log(snails[i])
        }
    }
    waitSnails()
}

function createInteractiveItem(){
    let items
    let waitItems = async ()=>{
        let res = await fetchItems()
        items = res
        for (let i =0; i<items.length; i++){
            createItem(items[i])
            console.log(items[i])
        }
    }
    waitItems()
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
    let texture = new PIXI.Texture.from(`../src/img/${el.name}.png`)
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
            console.log("點擊到："+el.name)
            vm.$data.itemClicked = true
            vm.$data.popup = !vm.$data.popup
            vm.$data.itemSpeak = el.name
            // 抽籤決定 NPC 要講哪一句話
            if (el.speaks){
                let randomSentenceNum = getRandom(0, el.speaks.length-1)
                vm.$data.nowSpeak = el.speaks[randomSentenceNum]
            }else{
                vm.$data.nowSpeak = undefined
            }
            // 決定要不要放動畫的角色
            console.log(el.animated)
            if (el.animated == 1){
                vm.$data.animatedSpriteSpeak = true
            }else {
                vm.$data.animatedSpriteSpeak = false
            }
            // 是否有可以認養的按鈕
            if (el.adoptable){
                vm.$data.adoptable = true
                vm.$data.program = el.program
            }else{
                vm.$data.adoptable = false
            }
            // 切換遊戲進度中講的話
            if (el.gameSpeak){
                switch (vm.$data.gameState){
                    case 'notyet': 
                        vm.$data.gameSpeak = el.gameSpeak.notyet
                        break;
                    case 'progress':
                        vm.$data.gameSpeak = el.gameSpeak.progress
                        break;
                    case 'finished':
                        vm.$data.gameSpeak = el.gameSpeak.finished
                        break;
                }
            }
            clickSoundEffect() //點擊音效
            window.setTimeout(()=>{ // 點擊後離開點擊狀態，解決抓住地圖不放的問題
                vm.$data.itemClicked = false
            }, 300)
        })
    item.mouseover = function(){
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

export {createSnail, createInteractiveItem, createNormalHouse, createItem}