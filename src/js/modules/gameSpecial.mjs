import { callVueSys, mapContainer, scale, getRandom } from "./global.mjs"

let specialContainer = new PIXI.Container()
specialContainer.name = 'specialContainer'
specialContainer.scale.set(scale)

let areas = [
    [
        {
            x: 1680,
            y: 450
        }, {
            x: 1026,
            y: 883
        }, {
            x: 225,
            y: 1268
        }, {
            x: 453,
            y: 879
        }, {
            x: -710,
            y: 987
        }, {
            x: 1660,
            y: 1186
        }, {
            x: 1680,
            y: 480
        }
    ],[
        {
            x: -1713,
            y: 502
        }, {
            x: -1690,
            y: 1159
        }, {
            x: -859,
            y: 908
        }, {
            x: -2073,
            y: 997
        }, {
            x: -1956,
            y: 239
        }, {
            x: -1863,
            y: 821
        }, {
            x: -1713,
            y: 502
        }
    ],[
        {
            x: -1771,
            y: -611
        }, {
            x: -2088,
            y: -1039
        }, {
            x: -1515,
            y: -1248
        }, {
            x: -809,
            y: -1048
        }, {
            x: -248,
            y: -1109
        }, {
            x: -2060,
            y: -1138
        }, {
            x: -1771,
            y: -611
        }
    ]
]
let areaId = 0, sp, spIsClear = false
function generateSpecial(){
    // 判斷每日更新
    let nowTime = new Date().getMinutes()
    let recordGotSpecial = vm.$data.userRecord.gotSpecial
    if (nowTime%2 == 0){
        if (recordGotSpecial){
            console.log("今天已經抓到特殊蝸牛了")
            return
        }else{
            drawSpecial(areaId)
            updateArea()
        }
    }
    window.setInterval(()=>{
        if (new Date().getMinutes() !== nowTime && new Date().getMinutes()%2 == 0){
            nowTime = new Date().getMinutes()
            console.log("新日子，重新產生特殊蝸牛")
            vm.$data.user.gotSpecial = false
            while(specialContainer.children.length > 0){
                specialContainer.removeChild(specialContainer.children[0])
            }
            drawSpecial(areaId)
            updateArea()
            vm.$data.user.gotSpecial = false
        }
    }, 1000)
    // drawSpecial(areaId)
    // updateArea()
}

function updateArea(){
    // let timer  = window.setInterval(()=>{
    //     if (spIsClear == false){
    //         areaId = getRandom(0, areas.length -1)
    //         console.log(`更新路線: ${areaId}`)
    //         fastMove(areaId)
    //     }else {
    //         clearInterval(timer)
    //     }
    // }, 4000)
    if (spIsClear == false){
        areaId = getRandom(0, areas.length -1)
        gsap.to(sp, .3, {
            pixi: {
                alpha: 0
            }
        })
        console.log(`更新路線: ${areaId}`)
        fastMove(areaId)
    }else return
}

function drawSpecial(areaId){
    let texture = new PIXI.Texture.from("./src/img/snail_special.png")
    sp = new PIXI.Sprite(texture)
    sp.name = "special"
    sp.anchor.set(0.5)
    sp.interactive = true
    sp.buttonMode = true
    sp.cursor = "url('./src/img/icons/cursor_pick.png'),auto"
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
    let tl = gsap.timeline({repeat: 0, onComplete: updateArea})
    tl.to(sp, .75, {
        pixi: {
            x: areas[areaId][0].x,
            y: areas[areaId][0].y,
        }
    })
    tl.to(sp, .75, {
        pixi: {
            x: areas[areaId][1].x,
            y: areas[areaId][1].y,
            alpha: 1
        }
    })
    tl.to(sp, .75, {
        pixi: {
            x: areas[areaId][2].x,
            y: areas[areaId][2].y,
        }
    })
    tl.to(sp, .75, {
        pixi: {
            x: areas[areaId][3].x,
            y: areas[areaId][3].y,
            alpha: 0
        }
    })
    tl.to(sp, .75, {
        pixi: {
            x: areas[areaId][4].x,
            y: areas[areaId][4].y,
        }
    })
    tl.to(sp, .75, {
        pixi: {
            x: areas[areaId][5].x,
            y: areas[areaId][5].y,
            alpha: 1
        }
    })
    tl.to(sp, .5, {
        pixi: {
            x: areas[areaId][6].x,
            y: areas[areaId][6].y,
            alpha: 0
        }
    })
}

export { generateSpecial }