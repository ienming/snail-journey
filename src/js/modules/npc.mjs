import {scale, allContainer, getRandom } from './global.mjs'
import {clickSoundEffect} from './sound.mjs'
import {fetchSnails, fetchItems, normalHouses} from './data.mjs'

// Mission flow map test
let gameFlow = {
    mission1: ['bike', 'house_cinemaroll', 'house_literature']
}

// Snail
function createSnail(){
    let snails
    let waitSnails = async ()=>{
        let res = await fetchSnails()
        snails = res
        for (let i =0; i<snails.length; i++){
            createItem(snails[i])
            // console.log('Snails: '+snails[i])
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
            // console.log('Items: '+items[i])
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
            console.log("點擊到："+el.name)
            vm.$data.itemClicked = true
            vm.$data.popup = !vm.$data.popup
            vm.$data.itemSpeak = el.name
            vm.$data.nowNPC = el
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
            // 是否有可以認養的按鈕
            if (el.adoptable){
                vm.$data.adoptable = true
                vm.$data.program = el.program
            }else{
                vm.$data.adoptable = false
            }
            // 切換遊戲進度中講的話
            switch (el.mission){ //用NPC的資料區域去對應目前使用者在該區塊的遊戲階段
                case 1:
                    console.log(`I'm from mission${el.mission}`)
                    // 首先確認是不是點到開啟新任務的NPC
                    if (el.enterGame == 0 && vm.$data.user.gameProgress.mission1.length == 0){ //而且玩家這條任務還沒開啟
                        vm.$data.nowSpeak = el.gameSpeak.notyet
                        console.log(vm.$data.user.gameProgress.mission1.length)
                        vm.$data.user.gameProgress.mission1.push(el.name)
                        console.log("開啟新任務")
                        console.log(vm.$data.user.gameProgress.mission1.length)
                    }else if (vm.$data.user.gameProgress.mission1.length > 0){  //確認NPC所屬的這條任務是不是開啟
                        console.log("任務已開啟: "+vm.$data.user.gameProgress.mission1.length)
                        let arr = []
                        arr = vm.$data.user.gameProgress.mission1.slice(0)
                        console.log("要被推入的NPC："+el.name)
                        arr.push(el.name)
                        if (arrayEquals(arr, gameFlow.mission1.slice(0, arr.length))){ //確認順序是不是正確的
                            vm.$data.user.gameProgress.mission1.push(el.name)
                            console.log("點對人了")
                        }else{
                            console.log("順序錯了，不是找我")
                            console.log("目前的順序："+arr)
                            console.log("正確的順序："+gameFlow.mission1.slice(0, arr.length))
                        }
                    }else{
                        console.log("任務尚未開啟")
                        speakRandomly(el)
                    }
                    break;
                case 2:
                    console.log("I'm from mission 2")
                    if (vm.$data.user.gameState.mission2 >= el.enterGame){
                        vm.$data.nowSpeak = el.gameSpeak.progress
                    } else {
                        speakRandomly(el)
                    }
                    break;
                case 3:
                    console.log("I'm from mission 3")
                    if (vm.$data.user.gameState.mission3 >= el.enterGame){
                        vm.$data.nowSpeak = el.gameSpeak.progress
                    } else {
                        speakRandomly(el)
                    }
                    break;
            }
            clickSoundEffect() //點擊音效
            window.setTimeout(()=>{ // 點擊後離開點擊狀態，解決抓住地圖不放的問題
                vm.$data.itemClicked = false
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

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

export {createSnail, createInteractiveItem, createNormalHouse, createItem}