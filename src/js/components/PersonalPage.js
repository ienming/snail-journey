const PersonalPage = {
    template: `
    <div class="mock">
        <div class="personal-page">
            <close-btn :outer-show-personal-page="outerShowPersonalPage" @switch-personal-page="switchPersonalPage"></close-btn>
            <p>Personal Page</p>
            <div id="personalCanvasContainer"></div>
        </div>
    </div>
    `,
    props: {
        outerShowPersonalPage: Boolean,
        userGotBadges: Object,
        userGotAchievements: Object
    },
    mounted(){
        this.initPersonalPage()
    },
    data(){
        return {
            pixiApp: undefined
        }
    },
    methods: {
        switchPersonalPage(){
            this.$emit(`switch-personal-page`)
        },
        initPersonalPage(){
            let personalCanvasContainer = document.querySelector("#personalCanvasContainer")
            let personalCanvasApp = new PIXI.Application({
                backgroundColor: 0xffffff,
                antialias: true,
            })
            let [paddingWidth, paddingHeight] = [window.innerWidth*0.2, window.innerHeight*0.4]
            personalCanvasApp.renderer.resize(window.innerWidth-paddingWidth, window.innerHeight-paddingHeight)
            personalCanvasContainer.appendChild(personalCanvasApp.view)

            this.pixiApp = personalCanvasApp //把 PIXI app 丟到 component 資料裡面變成元件的全域變數
            this.showBadges() // 顯示使用者有的蝸牛徽章
            this.showAchievements() //顯示使用者探索過的區域
        },
        showBadges(){
            let container = new PIXI.Container()
            let pY = 0
            for (prop in this.userGotBadges){
                if (this.userGotBadges[prop]){
                    let txt = new PIXI.Text(`目前有的蝸牛，${prop}: ${this.userGotBadges[prop]}`)
                    txt.position.y = pY
                    container.addChild(txt)
                    pY += 50
                }
            }
            this.pixiApp.stage.addChild(container)
        },
        showAchievements(){
            let container = new PIXI.Container()
            let pY = 100
            for (prop in this.userGotAchievements){
                if (this.userGotAchievements[prop]){
                    let txt = new PIXI.Text(`目前探索過的區域，${prop}: ${this.userGotAchievements[prop]}`)
                    txt.position.y = pY
                    container.addChild(txt)
                    pY += 50
                }
            }
            this.pixiApp.stage.addChild(container)
        }
    }
}

Vue.component("personal-page", PersonalPage)