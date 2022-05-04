import { callVueSys, mapContainer, scale, getRandom } from "./global.mjs"

let specialContainer = new PIXI.Container()
specialContainer.name = 'specialContainer'
specialContainer.scale.set(scale)

let poses = [
    {
        x: 1800,
        y: 700
    }, {
        x: 1000,
        y: 800
    }, {
        x: 1500,
        y: 1000
    }, {
        x: 0,
        y: 1050
    }
]
let posId = 0, sp, spIsClear = false
function generateSpecial(){
    // 判斷每日更新
    // let nowTime = new Date().getMinutes()
    // let recordGotSpecial = vm.$data.userRecord.gotSpecial
    // if (!recordGotSpecial && nowTime%2 == 0){
    //     drawSpecial()
    //     updatePos()
    // }else{
    //     console.log("今天已經抓到特殊蝸牛了")
    // }
    // window.setInterval(()=>{
    //     if (new Date().getMinutes() !== nowTime && new Date().getMinutes()%2 == 0){
    //         nowTime = new Date().getMinutes()
    //         console.log("新日子，重新產生特殊蝸牛")
    //         vm.$data.user.gotSpecial = false
    //         while(specialContainer.children.length > 0){
    //             specialContainer.removeChild(specialContainer.children[0])
    //         }
    //         drawSpecial()
    //         updatePos()
    //         vm.$data.user.gotSpecial = false
    //     }
    // }, 1000)
    drawSpecial()
    updatePos()
}

function updatePos(){
    let timer  = window.setInterval(()=>{
        if (spIsClear == false){
            posId = getRandom(0, poses.length-1)
            fastMove(posId)
        }else {
            clearInterval(timer)
        }
    }, 800)
}

function drawSpecial(){
    let texture = new PIXI.Texture.from("./src/img/snail_special.png")
    sp = new PIXI.Sprite(texture)
    sp.name = "special"
    sp.anchor.set(0.5)
    sp.interactive = true
    sp.buttonMode = true
    gsap.to(sp, .3, { //抖動
        pixi: {
            scaleX: 1.1,
            scaleY: 0.9
        },
        yoyo: true,
        repeat: -1
    })
    sp.on("pointerdown", (el)=>{
        vm.$data.user.gotSpecial = true
        el.target.destroy()
        spIsClear = true
        let str = "特殊獎勵！"
        let imgUrl = "./src/img/coin.png"
        let num = 30
        let abs = `獲得 ${num} 個蝸牛幣`
        callVueSys(str, abs, imgUrl, num)
    })
    sp.mouseover = function(){ //hover時的放大效果
        gsap.to(this, .2, {
            pixi: {
                scaleX: 1.18,
            },
            yoyo: true,
            repeat: 2,
            onComplete: function(){
                sp.scale.set(1)
            }
        })
    }
    specialContainer.addChild(sp)
    mapContainer.addChild(specialContainer)
}

function fastMove(posId){
    gsap.to(sp, .5, {
        pixi: {
            x: poses[posId].x,
            y: poses[posId].y,
        }
    })
}

export { generateSpecial }