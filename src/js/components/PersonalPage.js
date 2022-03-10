const PersonalPage = {
    template: `
    <div class="mock personal-page">
        <div class="por d-flex">
            <div id="personalPage">
                <div id="personalCanvasContainer"></div>
                <personal-coin @switch-furnitures="switchFurnitures" :coins="userCoins"></personal-coin>
            </div>
            <template name="fade">
            <furnitures-page v-if="furnitureHasShown" :user-got-furnitures="userGotFurnitures" @show-confirm="showConfirm"></furnitures-page>
            </template>
            <close-btn :outer-show-personal-page="outerShowPersonalPage" @switch-personal-page="switchPersonalPage"></close-btn>
        </div>
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
                console.log("使用者徽章有變，重畫徽章")
                this.drawBadges()
            }
        },
        'userGotFurnitures': {
            handler: function(newValue, oldValue){
                console.log("使用者家具有變，重畫家具")
                this.drawFurnitures()
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
            this.pixi.furnituresContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.furnituresContainer)
            this.draw() //初始化房間
        },
        draw(){
            this.drawBadges()
            this.drawAchievements()
            this.drawFurnitures()
        },
        drawBadges(){
            while(this.pixi.badgesContainer.children.length > 0){
                this.pixi.badgesContainer.removeChild(this.pixi.badgesContainer.children[0])
            }
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
        drawAchievements(){
            while(this.pixi.achievesContainer.children.length > 0){
                this.pixi.achievesContainer.removeChild(this.pixi.achievesContainer.children[0])
            }
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
        drawFurnitures(){
            while(this.pixi.furnituresContainer.children.length > 0){
                this.pixi.furnituresContainer.removeChild(this.pixi.furnituresContainer.children[0])
            }
            this.userGotFurnitures.forEach(el =>{
                let txt = new PIXI.Text(el.name)
                txt.position.x = el.x
                txt.position.y = el.y
                this.pixi.furnituresContainer.addChild(txt)
            })
        },
        switchFurnitures(){
            console.log("personalPage 收到，切換傢俱櫃顯示！")
            this.furnitureHasShown = !this.furnitureHasShown
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
            <img src="./src/img/icons/menu.png" alt="" @click="switchFurniture"/>
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
        switchFurniture(){
            this.$emit("switch-furnitures")
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
            allFurnitures: []
        }
    },
    computed: {
        allFurnituresState(){
            let lists = [...this.allFurnitures]
            if (this.userGotFurnitures){
                // 比較已經有的家具和所有家具
                this.userGotFurnitures.forEach(gotItem=>{
                    let idx = this.allFurnitures.findIndex(el => el.name == gotItem.name)
                    lists[idx].bought = true
                })
            }
            return lists
        }
    },
    created(){
        this.init()
    },
    methods: {
        init(){
            // fetch all furnitures data
            this.allFurnitures = vm.$data.allFurnitures
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
                let obj = {
                    name: this.furniture.name,
                    x: this.furniture.x,
                    y: this.furniture.y
                }
                vm.$data.user.furnitures.push(obj)
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