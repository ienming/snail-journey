const PersonalPage = {
    template: `
    <div class="mock personal-page">
        <div id="personalPage">
            <close-btn :outer-show-personal-page="outerShowPersonalPage" @switch-personal-page="switchPersonalPage"></close-btn>
            <div id="personalCanvasContainer"></div>
            <personal-coin @show-furnitures="showFurnitures" :coins="userCoins"></personal-coin>
        </div>
        <template name="fade">
            <furnitures-page v-if="furnitureHasShown" :user-got-furnitures="userGotFurnitures" @show-confirm="showConfirm"></furnitures-page>
        </template>
        <template name="fade">
            <buy-confirm v-show="confirmHasShown" :furniture="nowAddFurniture" @close-confirm="closeConfirm"></buy-confirm>
        </template>
    </div>
    `,
    props: {
        outerShowPersonalPage: Boolean,
        userGotBadges: Object,
        userGotAchievements: Object,
        userCoins: Number,
        userGotFurnitures: Array
    },
    mounted(){
        this.init()
    },
    data(){
        return {
            pixi: {
                app: undefined
            },
            furnitureHasShown: false,
            confirmHasShown: false,
            nowAddFurniture: undefined
        }
    },
    watch: {
        'userGotBadges': {
            handler: function(newValue, oldValue){
                console.log("使用者徽章有變，重畫")
                this.draw()
            }
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
            personalCanvasApp.renderer.resize(800, 500)
            personalCanvasContainer.appendChild(personalCanvasApp.view)

            this.pixi.app = personalCanvasApp //把 PIXI app 丟到 component 資料裡面變成元件的全域變數
            this.pixi.badgesContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.badgesContainer)
            this.pixi.achievesContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.achievesContainer)
            this.draw()//開始畫房間
        },
        draw(){
            // this.pixi.app.ticker.add(delta=>{
            //     console.log("重畫房間")
            // })
            this.showBadges() // 顯示使用者有的蝸牛徽章
            this.showAchievements() //顯示使用者探索過的區域
        },
        showBadges(){
            let pY = 0
            for (prop in this.userGotBadges){
                if (this.userGotBadges[prop]){
                    let txt = new PIXI.Text(`目前有的蝸牛，${prop}: ${this.userGotBadges[prop]}`)
                    txt.position.y = pY
                    this.pixi.badgesContainer.addChild(txt)
                    pY += 50
                }
            }
        },
        showAchievements(){
            let pY = 100
            for (prop in this.userGotAchievements){
                if (this.userGotAchievements[prop]){
                    let txt = new PIXI.Text(`目前探索過的區域，${prop}: ${this.userGotAchievements[prop]}`)
                    txt.position.y = pY
                    this.pixi.achievesContainer.addChild(txt)
                    pY += 50
                }
            }
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
                <div class="furniture" :class="item.bought ? 'bought' : ''" v-for="item of allFurnituresState" @click="buyFurniture(item)">
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
    props: {
        userGotFurnitures: {
            type: Array
        }
    },
    data(){
        return {
            allFurnitures: [
                {
                    imgSrc: '',
                    name: '烤箱',
                    txt: '我是一台普通的烤箱',
                    price: 100
                },{
                    imgSrc: '',
                    name: '書桌',
                    txt: '我是一張普通的書桌',
                    price: 3000
                }
            ]
        }
    },
    computed: {
        allFurnituresState(){
            let lists = [...this.allFurnitures]
            if (this.userGotFurnitures){
                // 比較已經有的家具和所有家具
                this.userGotFurnitures.forEach(name=>{
                    let idx = this.allFurnitures.findIndex(el => el.name == name)
                    lists[idx].bought = true
                })
            }
            return lists
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
                // 把資料送到外層的 Vue app
                vm.$data.user.furnitures.push(this.furniture.name)
                // 顯示已購買、關閉視窗
                this.buyable = "bought"
            }else{
                this.buyable = "disable"
            }
        },
        discard(){
            // console.log(`放棄購買${this.furniture}`)
            this.$emit("close-confirm")
            this.buyable = 'able'
        }
    }
}
Vue.component("buy-confirm", BuyConfirm)