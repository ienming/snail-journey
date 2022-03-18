const House = {
    template: `
    <section class="mock room">
        <div class="room-page">
            <div id="houseCnvsContainer"></div>
            <img src="./src/img/icons/exit.png" alt="離開房間" @click="switchHousePage" class="game-ui icon" />
        </div>
    </section>
    `,
    props: ['houseName'],
    data(){
        return {
            pixi: {
                app: undefined,
                houseScale: 0,
                originScale: 0.349375 //(719-80*2)/1600 macBook 螢幕大小作為原點
            }
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            let paddingY = 80
            let houseScale = (window.innerHeight-paddingY*2)/1600
            this.pixi.houseScale = houseScale //傳給 global Variable
            let houseCnvsContainer = document.querySelector("#houseCnvsContainer")
            let houseApp = new PIXI.Application({
                backgroundColor: 0xffffff,
                antialias: true,
            })
            houseApp.renderer.resize(1771*houseScale, 1600*houseScale)
            houseCnvsContainer.appendChild(houseApp.view)

            this.pixi.app = houseApp //把 PIXI app 丟到 component 資料裡面變成元件的全域變數
            // 初始化房間背景
            let houseTexture = new PIXI.Texture.from(`./src/img/room.jpg`)
            let house = new PIXI.Sprite(houseTexture)
            house.scale.set(houseScale)
            this.pixi.app.stage.addChild(house)
            // 
            // this.pixi.badgesContainer = new PIXI.Container()
            // this.pixi.app.stage.addChild(this.pixi.badgesContainer)
            // this.pixi.achievesContainer = new PIXI.Container()
            // this.pixi.app.stage.addChild(this.pixi.achievesContainer)
            // this.pixi.furnituresContainer = new PIXI.Container()
            // this.pixi.app.stage.addChild(this.pixi.furnituresContainer)
            this.draw() //初始化房間
        },
        draw(){
            this.showName()
        },
        showName(){
            let txt = new PIXI.Text(`歡迎來到${this.houseName}的家`)
            this.pixi.app.stage.addChild(txt)
        },
        switchHousePage(){
            this.$emit("switch-house-page")
        }
    }
}

Vue.component('house', House)