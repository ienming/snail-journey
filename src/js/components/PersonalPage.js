const PersonalPage = {
    template: `
    <div class="mock room">
        <div class="container">
            <div class="room-page">
                <div id="roomCanvasContainer"></div>
                <personal-coin @switch-furnitures="switchFurnitures" :coins="userCoins"></personal-coin>
                <img src="./src/img/icons/exit.png" alt="離開房間" @click="$emit('switch-personal-page')" class="game-ui icon" />
            </div>
            <template name="fade">
            <furnitures-page v-if="furnitureHasShown" 
                :user-got-furnitures="userGotFurnitures"
                :user-got-achievements="userGotAchievements"
                @show-confirm="showConfirm"
                @switch-furnitures="switchFurnitures"></furnitures-page>
            </template>
        </div>
        <template name="fade">
        <buy-confirm v-show="confirmHasShown" :furniture="nowAddFurniture" @close-confirm="closeConfirm"></buy-confirm>
        </template>
        <display-shelf v-if="displayShelfHasShown"
            :userGotAchievements="userGotAchievements"
            @switch-display-shelf="displayShelfHasShown = !displayShelfHasShown"></display-shelf>
    </div>
    `,
    props: ['outerShowPersonalPage','userGotAchievements','userCoins','userGotFurnitures'],
    mounted(){
        this.init()
    },
    data(){
        return {
            pixi: {
                app: undefined,
                roomScale: 0,
                originScale: 0.349375 //(719-80*2)/1600 macBook 螢幕大小作為原點
            },
            furnitureHasShown: false,
            confirmHasShown: false,
            displayShelfHasShown: false,
            nowAddFurniture: undefined,
        }
    },
    watch: {
        'userGotAchievements': {
            handler: function(newValue, oldValue){
                console.log("使用者區域探索成就有變，重畫")
                this.drawAchievements()
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
            this.pixi.achievesContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.achievesContainer)
            this.pixi.furnituresContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.furnituresContainer)
            this.draw() //初始化房間
        },
        draw(){
            // this.drawAchievements()
            this.drawFurnitures()
            this.drawDisplayShelf()
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
        drawDisplayShelf(){
            let texture = new PIXI.Texture.from('./src/img/displayShelf.jpg')
            let sp = new PIXI.Sprite(texture)
            sp.interactive = true
            sp.buttonMode = true
            sp.x = 300*this.pixi.roomScale/this.pixi.originScale
            sp.y = 300*this.pixi.roomScale/this.pixi.originScale
            sp.scale.set(this.pixi.roomScale)
            sp
                .on("pointerdown", ()=>{
                    this.displayShelfHasShown = true
                })
            this.pixi.app.stage.addChild(sp)
        },
        drawFurnitures(){
            while(this.pixi.furnituresContainer.children.length > 0){
                this.pixi.furnituresContainer.removeChild(this.pixi.furnituresContainer.children[0])
            }
            this.userGotFurnitures.forEach(el =>{
                let texture = new PIXI.Texture.from(`./src/img/fur_${el.id}.png`)
                let furniture = new PIXI.Sprite(texture)
                furniture.x = el.x*this.pixi.roomScale/this.pixi.originScale
                furniture.y = el.y*this.pixi.roomScale/this.pixi.originScale
                furniture.scale.set(this.pixi.roomScale)
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
                    <div class="furniture"
                        v-for="item of allFurnituresState"
                        :class="{ bought: item.bought, locked: locked['block'+item.block] }"
                        @click="buyFurniture(item)">
                        <div class="img-container">
                        <img :src="item.imgSrc" alt="" />
                        </div>
                        <div class="txt-container">
                            <p class="t-w-5">{{ item.name }}</p>
                            <p class="t-z-1" style="margin-bottom: 8px">{{ item.blockName }}</p>
                            <p>{{ item.txt }}</p>
                            <p class="price">{{ item.price }}</p>
                        </div>
                    </div>
                </div>
                <close-btn now-show="furnitures" @switch-furnitures="$emit('switch-furnitures')"></close-btn>
            </div>
        </transition>
    `,
    props: ['userGotFurnitures', 'userGotAchievements'],
    data(){
        return {
            allFurnitures: undefined
        }
    },
    computed: {
        allFurnituresState(){
            let lists = this.allFurnitures
            // 對應區塊名稱
            lists.forEach(el=>{
                let blockName = ""
                switch(el.block*1){
                    case 1:
                        blockName = "文藝生活區"
                        break;
                    case 2:
                        blockName = "慢活甜點區"
                        break;
                }
                el.blockName = blockName
                el.imgSrc = `./src/img/fur_${el.id}.png`
            })
            if (this.userGotFurnitures){
                // 比較已經有的家具和所有家具
                this.userGotFurnitures.forEach(gotItem=>{
                    let idx = this.allFurnitures.findIndex(el => el.id == gotItem.id)
                    lists[idx].bought = true
                })
            }
            return lists
        },
        locked(){
            let lockMap = {}
            for (prop in this.userGotAchievements){
                if (this.userGotAchievements[prop].indexOf("finished") !== -1){
                    lockMap[prop] = false
                }else{
                    lockMap[prop] = true
                }
            }
            return lockMap
        }
    },
    created(){
        this.allFurnitures = [...vm.$data.allFurnitures]
        alert(this.allFurnitures === vm.$data.allFurnitures)
    },
    methods: {
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

// 
// 
// 個人展示櫃
const DisplayShelf = {
    template: `
        <transition name="fade">
            <div class="mock">
                <div class="wrapper">
                    <div class="popup t-a-c w-md-50">
                        <p>個人成就、認養展示櫃</p>
                        <section>
                            <h3>探索區域徽章</h3>
                            <div class="d-flex jcc">
                                <div class="img-container badge"
                                    :class="{ locked: !el.achieved }"
                                    :data-descrip="el.descrip"
                                    v-for="el of userAchieved">
                                    <img src="./src/img/board.png" alt="" />
                                </div>
                            </div>
                        </section>
                        <close-btn now-show="display-shelf" @switch-display-shelf="$emit('switch-display-shelf')"></close-btn>
                    </div>
                </div>
            </div>
        </transition>
    `,
    props: ['userGotAchievements'],
    created(){
        this.allAchievements = {...vm.$data.achievement.descrips}
    },
    data(){
        return {
            allAchievements: {}
        }
    },
    computed: {
        userAchieved(){
            let obj = {...this.userGotAchievements}
            for (prop in obj){
                obj[prop] = {}
                if (this.userGotAchievements[prop].indexOf('finished') !== -1){
                    obj[prop].achieved = true
                }else{
                    obj[prop].achieved = false
                }
                obj[prop].descrip = this.allAchievements[prop]
            }
            return obj
        }
    }
}
Vue.component("display-shelf", DisplayShelf)