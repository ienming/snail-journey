import { callVueSys, mapContainer, scale, getRandom } from "./global.mjs"

let specialContainer = new PIXI.Container()
specialContainer.name = 'specialContainer'
specialContainer.scale.set(scale)

let areas = [
    [
        {
            x: 1800,
            y: 700
        }, {
            x: 1800,
            y: 500
        }, {
            x: 1500,
            y: 500
        }, {
            x: 1800,
            y: 700
        }
    ]
]
let areaId = 0, sp, spIsClear = false
function generateSpecial(){
    // 判斷每日更新
    // let nowTime = new Date().getMinutes()
    // let recordGotSpecial = vm.$data.userRecord.gotSpecial
    // if (!recordGotSpecial && nowTime%2 == 0){
    //     drawSpecial()
    //     updateArea()
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
    //         updateArea()
    //         vm.$data.user.gotSpecial = false
    //     }
    // }, 1000)
    drawSpecial(areaId)
    // updateArea()
}

// function updateArea(){
//     let timer  = window.setInterval(()=>{
//         if (spIsClear == false){
//             areaId = getRandom(0, areas.length -1)
//             fastMove(areaId)
//         }else {
//             clearInterval(timer)
//         }
//     }, 3000)
// }

function drawSpecial(areaId){
    let texture = new PIXI.Texture.from("./src/img/snail_special.png")
    sp = new PIXI.Sprite(texture)
    sp.name = "special"
    sp.anchor.set(0.5)
    sp.interactive = true
    sp.buttonMode = true
    sp.x = areas[areaId][0].x,
    sp.y = areas[areaId][0].y,
    gsap.to(sp, .3, { //抖動
        pixi: {
            scaleX: 1.1,
            scaleY: 0.9
        },
        yoyo: true,
        repeat: -1
    })
    fastMove(areaId)
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

function fastMove(areaId){
    let tl = gsap.timeline({repeat: -1})
    tl.to(sp, .5, {
        pixi: {
            x: areas[areaId][0].x,
            y: areas[areaId][0].y,
        }
    })
    tl.to(sp, .5, {
        pixi: {
            x: areas[areaId][1].x,
            y: areas[areaId][1].y,
        }
    })
    tl.to(sp, .5, {
        pixi: {
            x: areas[areaId][2].x,
            y: areas[areaId][2].y,
        }
    })
    tl.to(sp, .5, {
        pixi: {
            x: areas[areaId][3].x,
            y: areas[areaId][3].y,
        }
    })
}

export { generateSpecial }