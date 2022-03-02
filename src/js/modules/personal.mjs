// init
function initPersonalPage(){
    let personalCanvasContainer = document.querySelector("#personalCanvasContainer")
    let personalCanvasApp = new PIXI.Application({
        backgroundColor: 0x000000,
        antialias: true,
        // backgroundAlpha: 0
    })
    personalCanvasApp.renderer.resize(300, 300)
    personalCanvasContainer.appendChild(personalCanvasApp.view)

    console.log("personalCanvasApp: "+personalCanvasContainer)
}

export {initPersonalPage}