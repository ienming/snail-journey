const PersonalPage = {
    template: `
    <div class="mock personal-page">
        <div class="container">
            <div id="personalPage">
                <div id="roomCanvasContainer"></div>
                <personal-coin @switch-furnitures="switchFurnitures" :coins="userCoins"></personal-coin>
                <span @click="switchPersonalPage">離開房間</span>
            </div>
            <template name="fade">
            <furnitures-page v-if="furnitureHasShown" :user-got-furnitures="userGotFurnitures" :outer-show-furnitures="furnitureHasShown" @show-confirm="showConfirm" @switch-furnitures="switchFurnitures"></furnitures-page>
            </template>
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
                app: undefined,
                roomScale: 0
            },
            furnitureHasShown: false,
            confirmHasShown: false,
            nowAddFurniture: undefined,
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
            let paddingY = 80
            let roomScale = (window.innerHeight-paddingY*2)/1600
            this.pixi.roomScale = roomScale //傳給 global Variable
            let roomCanvasContainer = document.querySelector("#roomCanvasContainer")
            let personalCanvasApp = new PIXI.Application({
                backgroundColor: 0xffffff,
                antialias: true,
            })
            personalCanvasApp.renderer.resize(1771*roomScale, 1600*roomScale)
            roomCanvasContainer.appendChild(personalCanvasApp.view)

            this.pixi.app = personalCanvasApp //把 PIXI app 丟到 component 資料裡面變成元件的全域變數
            // 初始化房間背景
            let roomTexture = new PIXI.Texture.from(`./src/img/room.jpg`)
            let room = new PIXI.Sprite(roomTexture)
            room.scale.set(roomScale)
            this.pixi.app.stage.addChild(room)
            // 
            this.pixi.badgesContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.badgesContainer)
            this.pixi.achievesContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.achievesContainer)
            this.pixi.furnituresContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.furnituresContainer)
            this.draw() //初始化房間
        },
        draw(){
            // this.drawBadges()
            // this.drawAchievements()
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
                let texture = new PIXI.Texture.from(`./src/img/fur_${el.id}.png`)
                let furniture = new PIXI.Sprite(texture)
                furniture.scale.set(this.pixi.roomScale)
                furniture.x = el.x
                furniture.y = el.y
                this.pixi.furnituresContainer.addChild(furniture)
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
        },
    }
}
Vue.component("personal-page", PersonalPage)

//
//
// 蝸牛幣顯示
const PersonalCoin = {
    template: `
        <div id="coinContainer">
            <img src="./src/img/coin.png" alt="蝸牛幣icon" id="coin" />
            <span style="font-size: 24px;">{{ coins }}</span>
            <img src="./src/img/icons/plus.png" class="icon" alt="plus icon" @click="switchFurniture"/>
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
        <transition name="fade">
            <div id="furnitureContainer">
                <div class="d-flex furnitures">
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
                <close-btn :outer-show-furnitures="outerShowFurnitures" @switch-furnitures="switchFurnitures"></close-btn>
            </div>
        </transition>
    `,
    props: {
        userGotFurnitures: {
            type: Array
        },
        outerShowFurnitures: Boolean
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
                    let idx = this.allFurnitures.findIndex(el => el.id == gotItem.id)
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
        },
        switchFurnitures(){
            this.$emit("switch-furnitures")
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
                <p>確定要將「{{ furniture.name }}」加入房間內嗎？</p>
            </template>
            <template v-else-if="buyable == 'bought'">
                <p>已將「{{ furniture.name }}」加入房間！</p>
            </template>
            <template v-else>
                <p>錢不夠買不起><</p>
            </template>
            <div class="mt-1 t-a-c">
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
            console.log(`確認購買${this.furniture.id}`)
            // 判斷蝸牛幣夠不夠
            if (vm.$data.user.coins >= this.furniture.price){
                // 計算蝸牛幣扣款
                vm.$data.user.coins -= this.furniture.price
                // 把資料送到外層的 Vue app
                let obj = {
                    id: this.furniture.id,
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