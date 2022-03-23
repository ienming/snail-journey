const House = {
    template: `
    <section class="mock room">
        <div class="room-page">
            <div id="houseCnvsContainer"></div>
            <img src="./src/img/icons/exit.png" alt="離開房間" @click="$emit('switch-house-page')" class="game-ui icon" />
        </div>
        <comment-board :program="npc.program" :name="npc.name" v-if="commentHasShown" @switch-comment-board="switchCommentBoard"></comment-board>
    </section>
    `,
    props: ['npc'],
    data(){
        return {
            pixi: {
                app: undefined,
                houseScale: 0,
                originScale: 0.349375 //(719-80*2)/1600 macBook 螢幕大小作為原點
            },
            items: undefined,
            sprites: {},
            commentHasShown: false
        }
    },
    computed: {
        hostName(){
            let id = this.npc.name.indexOf("_house")
            return this.npc.name.slice(0, id)
        }
    },
    async mounted(){
        let d = await this.fetchData()
        this.items = d.filter(el=>el.hostName == this.hostName) //過濾不是這間房間的資料
        this.init()
    },
    methods: {
        fetchData: async() => {
            let response;
            try {
                response = await axios
                    .get("src/data/data_house.csv", {})
                    console.log("async completed get House data")
            } catch (e) {
                throw new Error(e.message)
            }

            if (response.data){
                let rows = response.data.split("\n")
                let output = [];
                let keyMap = {};
                for (let i =0; i<rows[0].length; i++){
                    if (rows[0].split(",")[i] !== undefined){
                        keyMap[rows[0].split(",")[i].trim()] = i
                        // console.log("key: "+rows[0].split(",")[i])
                    }
                }
                rows.shift()
                rows.forEach(el=>{
                    let d = el.split(",");
                    let obj = {
                        name: d[keyMap.name],
                        hostName: d[keyMap.host_name],
                        x: d[keyMap.x],
                        y: d[keyMap.y],
                    };
                    output.push(obj)
                })
                return output
            }
        },
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
            this.pixi.itemsContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.itemsContainer)
            this.draw() //初始化房間
        },
        draw(){
            this.drawSnail()
            this.drawItems()
        },
        drawItems(){
            this.items.forEach(item=>{
                let texture = new PIXI.Texture.from(`./src/img/${item.name}.jpg`)
                let sp = new PIXI.Sprite(texture)
                sp.name = item.name
                sp.interactive = true
                sp.buttonMode = true
                sp
                    .on("pointerdown", ()=>{
                        this.checkWhomClicked(sp.name)
                    })
                sp.x = item.x*this.pixi.houseScale/this.pixi.originScale
                sp.y = item.y*this.pixi.houseScale/this.pixi.originScale
                sp.scale.set(this.pixi.houseScale)
                // 增加互動
                this.sprites[item.name] = sp
            })

            for (prop in this.sprites){
                this.pixi.itemsContainer.addChild(this.sprites[prop])
            }
        },
        drawSnail(){
            let el = this.npc
            let texture = new PIXI.Texture.from(`./src/img/${this.hostName}.png`)
            let sp = new PIXI.Sprite(texture)
            sp.name = this.hostName
            sp.x = 800*this.pixi.houseScale
            sp.y = 1200*this.pixi.houseScale
            sp.scale.set(this.pixi.houseScale)
            sp.anchor.set(0.5)
            sp.interactive = true
            sp.buttonMode = true
            sp.on("pointerdown", ()=>{
                vm.$data.interaction.showPopup = !vm.$data.interaction.showPopup
                vm.$data.itemSpeak = this.hostName
                if (el.speaks){
                    this.speakRandomly(el)
                }else{
                    vm.$data.nowSpeak = undefined
                }
                if (el.gameSpeaks){
                    this.initMission(el) // 主線探索遊戲邏輯
                }else{
                    // 是否有可以認養的按鈕
                    if (el.adoptable){
                        vm.$data.adoptable = true
                        vm.$data.program = el.program
                        vm.$data.btnTxt = undefined
                    }else{
                        vm.$data.adoptable = false
                        vm.$data.btnTxt = "關閉"
                    }
                    console.log("講一下廢話")
                }
            })
            this.pixi.app.stage.addChild(sp)
        },
        checkWhomClicked(name){
            if (name == "commentBoard"){
                this.commentHasShown = !this.commentHasShown
            }else{
                console.log(`與${name}互動`)
            }
        },
        speakRandomly(el){
            let randomSentenceNum = this.getRandom(0, el.speaks.length-1)
            vm.$data.nowSpeak = el.speaks[randomSentenceNum]
        },
        getRandom(min, max){
            return Math.floor(Math.random()*(max-min+1))+min
        },
        initMission(el){
            let nowUserMissionProgress = vm.$data.user.missions[`mission${el.mission}`]
            if (el.mission && nowUserMissionProgress.indexOf('finished') == -1){ //此NPC有任務而且該任務還沒完成
                // 首先確認是不是點到開啟新任務的NPC
                if (el.enterGame == 1 && nowUserMissionProgress.length == 0){ //而且玩家這條任務還沒開啟
                    vm.$data.nowSpeak = el.gameSpeaks[0]
                    vm.$data.btnTxt = "下一步"
                    vm.$data.adoptable = false
                    vm.$data.interaction.nowAns = true
                }
            }else if (el.mission){  // 此 NPC 的任務對話完成了
                // 是否有可以認養的按鈕
                if (el.adoptable){
                    vm.$data.adoptable = true
                    vm.$data.program = el.program
                }else{
                    vm.$data.adoptable = false
                    vm.$data.btnTxt = "關閉"
                }
                console.log(`任務${el.mission}結束，講一下廢話`)
            }
        },
        switchCommentBoard(){
            this.commentHasShown = !this.commentHasShown
        }
    }
}
Vue.component('house', House)

// 有房產 NPC 家裡的留言板
const CommentBoard = {
    template: `
        <transition name="fade">
            <div class="mock">
                <div class="wrapper">
                    <div class="popup t-a-c w-50">
                        <h2>{{program.title}}</h2>
                        <p>留言板討論認養議題區</p>
                        <form>
                            <div class="comment">
                                <div class="avatar">
                                    <img src="./src/img/snail_oasis.png" />
                                </div>
                                <div class="message input">
                                    <input-text v-model="message" class="w-100" placeholder="留言......" :id="commentInputId" :name="commentInputId"></input-text>
                                </div>
                            </div>
                        </form>
                        <div class="comment-lists">
                            <div class="comment" v-for="comment of comments">
                                <div class="avatar">
                                    <img src="./src/img/snail_oasis.png" />
                                </div>
                                <div class="message">
                                    <p class="t-w-6">{{comment.id}}</p>
                                    <p>{{comment.message}}</p>
                                </div>
                            </div>
                        </div>
                        <close-btn now-show="comment-board" @switch-comment-board="$emit('switch-comment-board')"></close-btn>
                    </div>
                </div>
            </div>
        </transition>
    `,
    props: ['program', 'name'],
    computed: {
        commentInputId(){
            return this.name + '_message'
        }
    },
    data(){
        return {
            message: "",
            comments: [
                {
                    id: "路人甲",
                    message: "Hi"
                },{
                    id: "路人乙",
                    message: "HI"
                },{
                    id: "路人丙",
                    message: "Hi~"
                },{
                    id: "路人丙",
                    message: "Hi~"
                },{
                    id: "路人丙",
                    message: "Hi~"
                },{
                    id: "路人丙",
                    message: "Hi~"
                },{
                    id: "路人丙",
                    message: "Hi~"
                },{
                    id: "路人丙",
                    message: "Hi~"
                },
            ]
        }
    }
}
Vue.component('comment-board', CommentBoard)