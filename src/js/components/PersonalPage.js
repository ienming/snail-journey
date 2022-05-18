const PersonalPage = {
    template: `
    <div class="mock room">
        <div class="container">
            <div class="room-page">
                <div id="roomCanvasContainer" style="overflow: auto;"></div>
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
            <transition name="fade">
                <div class="mock" v-if="firstHasShown">
                    <div class="card t-a-c w-75 w-md-un">
                        <h3>歡迎來到蝸牛綠洲！</h3>
                        <p class="my-1">這裡是你在綠洲裡的家，雖然現在還空空蕩蕩的，只要和村民聊天、探索完各個區域，就能從上方的櫃子裡挑選喜歡的家具喔。快來佈置蝸牛綠洲裡的溫馨小窩吧！</p>
                        <img src="./src/img/icons/plus.png" style="max-height: 60px;" />
                        <close-btn now-show="first" @switch-first="switchFirst"></close-btn>
                    </div>
                </div>
            </transition>
        </div>
        <template name="fade">
        <buy-confirm v-show="confirmHasShown" :furniture="nowAddFurniture" @close-confirm="closeConfirm"></buy-confirm>
        </template>
        <display-shelf v-if="displayShelfHasShown"
            :userGotAchievements="userGotAchievements"
            :userAdoptions="userAdoptions"
            @switch-display-shelf="displayShelfHasShown = !displayShelfHasShown"></display-shelf>
    </div>
    `,
    props: ['outerShowPersonalPage','userGotAchievements','userCoins','userGotFurnitures','userAdoptions', 'showFirstHint'],
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
            firstHasShown: this.showFirstHint,
        }
    },
    watch: {
        'userGotAchievements': {
            handler: function(newValue, oldValue){
                // console.log("使用者區域探索成就有變，重畫")
                this.drawAchievements()
            }
        },
        'userGotFurnitures': {
            handler: function(newValue, oldValue){
                // console.log("使用者家具有變，重畫家具")
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
            let roomTexture = new PIXI.Texture.from(`./src/img/room/room_personal.jpg`)
            let room = new PIXI.Sprite(roomTexture)
            room.scale.set(roomScale)
            this.pixi.app.stage.addChild(room)
            // 
            this.pixi.achievesContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.achievesContainer)
            this.pixi.furnituresContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.furnituresContainer)
            this.draw() //初始化房間
            // 動畫移動
            window.setTimeout(()=>{
                // let roomCnvs = roomCanvasContainer.querySelector("canvas")
                let value = roomCanvasContainer.offsetWidth/2
                roomCanvasContainer.scroll({
                    left: value,
                    behavior: 'smooth'
                })
            }, 300)
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
            let container = new PIXI.Container()
            container.name = 'triumph'
            container.interactive = true
            container.buttonMode = true
            let texture = new PIXI.Texture.from('./src/img/room/triumph.png')
            let sp = new PIXI.Sprite(texture)
            sp.scale.set(this.pixi.roomScale)
            sp.anchor.set(0.5)
            let sc = this.pixi.roomScale
            container
                .on("pointerdown", ()=>{
                    this.displayShelfHasShown = true
                })
                .on("mouseover", ()=>{ //hover時的放大效果
                    gsap.to(sp, .2, {
                        pixi: {
                            scaleX: sc*0.8,
                        },
                        yoyo: true,
                        repeat: 2,
                        onComplete: function(){
                            sp.scale.set(sc)
                        }
                    })
                })
            // icon
            let iconTexture = new PIXI.Texture.from('./src/img/icons/magnify.png')
            let icon = new PIXI.Sprite(iconTexture)
            icon.name = 'interactiveIcon'
            icon.x = 0
            icon.y = -30
            icon.scale.set(this.pixi.roomScale)
            gsap.to(icon, .5, {
                pixi: {
                    y: -35
                },
                yoyo: true,
                repeat: -1,
            })
            container.x = 460*this.pixi.roomScale/this.pixi.originScale
            container.y = 145*this.pixi.roomScale/this.pixi.originScale
            container.addChild(sp)
            container.addChild(icon)
            this.pixi.app.stage.addChild(container)
        },
        drawFurnitures(){
            while(this.pixi.furnituresContainer.children.length > 0){
                this.pixi.furnituresContainer.removeChild(this.pixi.furnituresContainer.children[0])
            }
            this.userGotFurnitures.forEach(el =>{
                let texture = new PIXI.Texture.from(`./src/img/furnitures/fur_${el.id}.png`)
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
        switchFirst(){
            this.firstHasShown = false
            this.$emit('close-first-hint')
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
            <img src="./src/img/coin.png" alt="蝸牛幣icon" id="coin" />
            <span style="font-size: 24px;">$ {{coins}}</span>
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
                        <div class="mr-1">
                            <div class="img-container">
                                <img :src="item.imgSrc" alt="" />
                            </div>
                            <p class="t-z-1 t-a-c cate" :class="item.cate">{{ item.blockName }}</p>
                        </div>
                        <div class="txt-container">
                            <p class="t-w-5">{{ item.name }}</p>
                            <p class="price">$ {{ item.price }}</p>
                            <p class="t-z-2">{{ item.txt }}</p>
                        </div>
                    </div>
                </div>
                <img src="./src/img/icons/move_right.png" class="icon" />
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
                let blockName = "", cate=""
                switch(el.block*1){
                    case 1:
                        blockName = "文藝生活區",
                        cate = "lit"
                        break;
                    case 2:
                        blockName = "慢活甜點區",
                        cate = "des"
                        break;
                    case 3:
                        blockName = "職人區",
                        cate = "tra"
                        break;
                }
                el.blockName = blockName
                el.cate = cate
                el.imgSrc = `./src/img/furnitures/fur_${el.id}.png`
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
                <p>蝸牛幣似乎不夠喔......常常來維護環境或是加入認養行動，獲取蝸牛幣吧！</p>
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
                        <div class="scroll sm-only">
                            <section>
                                <h3>探索區域徽章</h3>
                                <p v-if="achievedEmpty" class="t-z-2 t-c-g">沒有探索完的區域喔。</br>快去找蝸牛們聊天、認識一下蝸牛綠洲吧！</p>
                                <div class="d-flex jcc mt-1 flex-column flex-md-row">
                                    <div class="badge col-md-4"
                                        :class="{ locked: !el.achieved }"
                                        v-for="el of userAchieved">
                                        <img :src="el.imgSrc" />
                                        <p class="mt-1 t-z-2">{{el.descrip}}</p>
                                    </div>
                                </div>
                            </section>
                            <section class="mt-2">
                                <h3>認養蝸牛綠洲議題</h3>
                                <p v-if="adoptedEmpty" class="t-z-2 t-c-g">沒有加入的認養方案喔。</p>
                                <ul class="d-flex jcc mt-1 adoption-lists" v-else>
                                    <a :href="el.link" target="_blank" v-for="el of userAdopted">
                                        <li class="d-flex aic descrip-lid" data-lid="前往詳細方案內容">
                                                <img src="./src/img/icons/checked.svg" class="icon" />
                                                <p class="mx-1">{{ el.title }}</p>
                                                <p class="t-z-2">
                                                    {{ el.intro }}
                                                </p>
                                        </li>
                                    </a>
                                </ul>
                            </section>
                        </div>
                        <close-btn now-show="display-shelf" @switch-display-shelf="$emit('switch-display-shelf')"></close-btn>
                    </div>
                </div>
            </div>
        </transition>
    `,
    props: ['userGotAchievements','userAdoptions'],
    created(){
        this.allAchievements = {...vm.$data.achievement.descrips}
        this.allAdoptions = [...vm.$data.adoptions]
    },
    data(){
        return {
            allAchievements: {},
            allAdoptions: [],
            achievedNum: 0,
            adoptedNum: 0
        }
    },
    computed: {
        userAchieved(){
            let obj = {...this.userGotAchievements}
            for (prop in obj){
                obj[prop] = {}
                if (this.userGotAchievements[prop].indexOf('finished') !== -1){
                    obj[prop].achieved = true
                    this.achievedNum ++
                }else{
                    obj[prop].achieved = false
                }
                obj[prop].descrip = this.allAchievements[prop]
                switch (prop){
                    case 'block1':
                        obj[prop].badgeName = 'badge_lit'
                        break;
                    case 'block2':
                        obj[prop].badgeName = 'badge_des'
                        break;
                    case 'block3':
                        obj[prop].badgeName = 'badge_tra'
                        break;
                }
                obj[prop].imgSrc = `./src/img/${obj[prop].badgeName}.png`
            }
            return obj
        },
        userAdopted(){
            let arr = [...this.allAdoptions]
            arr.forEach(el=>{
                if (this.userAdoptions.findIndex(adp=>el.title == adp) !== -1){
                    el.adopted = true
                    this.adoptedNum ++
                }else{
                    el.adopted = false
                }
            })
            return arr
        },
        achievedEmpty(){
            if (this.achievedNum !== 0){
                return false
            }else return true
        },
        adoptedEmpty(){
            if (this.userAdoptions.length > 0){
                return false
            }else return true
        }
    }
}
Vue.component("display-shelf", DisplayShelf)