const PersonalPage = {
    template: `
    <div class="mock personal-page">
        <div id="personalPage">
            <close-btn :outer-show-personal-page="outerShowPersonalPage" @switch-personal-page="switchPersonalPage"></close-btn>
            <div id="personalCanvasContainer"></div>
            <personal-coin @show-furnitures="showFurnitures" :coins="userCoins"></personal-coin>
        </div>
        <template name="fade">
            <furnitures-page v-show="furnitureHasShown" @show-confirm="showConfirm"></furnitures-page>
        </template>
        <template name="fade">
            <buy-confirm v-if="confirmHasShown" :furniture="nowAddFurniture" @close-confirm="closeConfirm"></buy-confirm>
        </template>
    </div>
    `,
    props: {
        outerShowPersonalPage: Boolean,
        userGotBadges: Object,
        userGotAchievements: Object,
        userCoins: Number
    },
    mounted(){
        this.init()
    },
    data(){
        return {
            pixiApp: undefined,
            furnitureHasShown: false,
            confirmHasShown: false,
            nowAddFurniture: undefined
        }
    },
    methods: {
        switchPersonalPage(){
            this.$emit("switch-personal-page")
        },
        init(){
            let personalCanvasContainer = document.querySelector("#personalCanvasContainer")
            let personalCanvasApp = new PIXI.Application({
                backgroundColor: 0xffffff,
                antialias: true,
            })
            let [paddingWidth, paddingHeight] = [window.innerWidth*0.2, window.innerHeight*0.4]
            // personalCanvasApp.renderer.resize(window.innerWidth-paddingWidth, window.innerHeight-paddingHeight)
            personalCanvasApp.renderer.resize(300, 500)
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
        },
        showFurnitures(){
            console.log("personalPage 收到，打開傢俱櫃！")
            this.furnitureHasShown = true
        },
        showConfirm(item){
            console.log("personalPage 收到，開啟確認購買視窗")
            this.confirmHasShown = true
            // 從家具櫃子拉出來的資料要塞到這裡 prop 給確認購買視窗
            this.nowAddFurniture = item
        },
        closeConfirm(){
            this.confirmHasShown = false
        }
    }
}
Vue.component("personal-page", PersonalPage)

//
//
// 蝸牛幣顯示
const PersonalCoin = {
    template: `
        <div id="coinContainer">
            <span>{{ coins }}</span>
            <img src="./src/img/icons/menu.png" alt="" @click="showFurnitures"/>
        </div>
    `,
    props: {
        coins: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            pixiApp: undefined,
        }
    },
    methods: {
        showFurnitures(){
            // 顯示家具櫃子的function, 點擊裡面的icon後呼叫這個函式，然後 emit 給 PersonalPage
            this.$emit("show-furnitures")
        }
    }
}
Vue.component("personal-coin", PersonalCoin)

//
//
// 家具櫃子
const Furnitures = {
    template: `
        <div id="furnitureContainer">
            <p>這是家具櫃子</p>
            <div class="d-flex flex-column">
                <div class="furniture" :class="" v-for="item of furnitures" @click="buyFurniture(item)">
                    <div class="img-container">
                        <img :src="item.imgSrc" alt="" />
                    </div>
                    <div class="txt-container">
                        <p>{{ item.name }}</p>
                        <p>{{ item.txt }}</p>
                        <p class="price">{{ item.price }}</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    // 判斷哪些家具已經有了
    // 已經有的家具透明度降低、無法點擊
    props: [],
    data(){
        return {
            furnitures: [
                {
                    imgSrc: '',
                    name: '烤箱',
                    txt: '我是一台普通的烤箱',
                    price: 100
                },{
                    imgSrc: '',
                    name: '書桌',
                    txt: '我是一張普通的書桌',
                    price: 300
                }
            ]
        }
    },
    mounted(){
        // this.init()
    },
    methods: {
        init(){
            // fetch all furnitures data
        },
        buyFurniture(item){
            console.log(`準備購買${item}`)
            console.log(item)
            // emit 給確認購買的 component
            this.$emit("show-confirm", item)
        }
    }
}
Vue.component("furnitures-page", Furnitures)

//
//
// 確認購買視窗
const BuyConfirm = {
    template: `
    <div class="mock">
        <div id="buyConfirm">
            <template v-if="buyable == 'able'">
                <p>確定要將 {{ furniture.name }} 加入房間內嗎？</p>
            </template>
            <template v-else-if="buyable == 'bought'">
                <p>已將 {{ furniture.name }} 加入房間！</p>
            </template>
            <template v-else>
                <p>錢不夠買不起><</p>
            </template>
            <div class="mt-1">
                <template v-if="buyable == 'able'">
                    <button class="my-btn" @click="buy">確認</button>
                    <button class="my-btn outline" @click="discard">放棄</button>
                </template>
                <template v-else>
                    <button class="my-btn" @click="discard">關閉</button>
                </template>
            </div>
        </div>
    </div>
    `,
    props: {
        furniture: {
            type: Object,
            default(){return{txt: "國王的家具", price: 10}}
        }
    },
    data(){
        return {
            buyable: "able"
        }
    },
    methods: {
        buy(){
            console.log(`確認購買${this.furniture}`)
            // 判斷蝸牛幣夠不夠
            if (vm.$data.user.coins >= this.furniture.price){
                // 計算蝸牛幣扣款
                vm.$data.user.coins -= this.furniture.price
                console.log(`現在剩下：${vm.$data.user.coins}`)
                // 把資料送到外層的 Vue app
                vm.$data.user.furnitures.push(this.furniture.name)
                // 顯示已購買、關閉視窗
                this.buyable = "bought"
            }else{
                console.log("錢不夠買不起><")
                this.buyable = "disable"
            }
        },
        discard(){
            console.log(`放棄購買${this.furniture}`)
            // 關閉購買確認視窗
            this.$emit("close-confirm")
            // 是否要把 buyable 切換回來
        }
    }
}
Vue.component("buy-confirm", BuyConfirm)