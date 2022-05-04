import { callVueSys, mapContainer, scale, getRandom } from "./global.mjs"

let specialContainer = new PIXI.Container()
specialContainer.name = 'specialContainer'
specialContainer.scale.set(scale)

let poses = [
    {
        x: -1300,
        y: -500
    }, {
        x: 1000,
        y: 800
    }, {
        x: 1500,
        y: 1000
    }
]
let posId = 0, sp, spIsClear = false
function generateSpecial(){
    // 判斷每日更新
    let nowTime = new Date().getMinutes()
    let recordGotSpecial = vm.$data.userRecord.gotSpecial
    if (!recordGotSpecial && nowTime%2 == 0){
        drawSpecial()
        updatePos()
    }else{
        console.log("今天已經抓到特殊蝸牛了")
    }
    window.setInterval(()=>{
        if (new Date().getMinutes() !== nowTime && new Date().getMinutes()%2 == 0){
            nowTime = new Date().getMinutes()
            console.log("新日子，重新產生特殊蝸牛")
            vm.$data.user.gotSpecial = false
            while(specialContainer.children.length > 0){
                specialContainer.removeChild(specialContainer.children[0])
            }
            drawSpecial()
            updatePos()
            vm.$data.user.gotSpecial = false
        }
    }, 1000)
}

function updatePos(){
    let timer  = window.setInterval(()=>{
        if (spIsClear == false){
            posId = getRandom(0, poses.length-1)
            sp.x = poses[posId].x
            sp.y = poses[posId].y
            fastMove(sp)
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

function fastMove(item){
    gsap.to(item, 1, {
        pixi: {
            x: item.x - getRandom(20, 40),
        },
        yoyo: true,
        repeat: -1
    })
    gsap.to(item, 1, {
        pixi: {
            scaleX: 1.08,
            scaleY: 0.96
        },
        yoyo: true,
        repeat: -1
    })
}

export { generateSpecial }