const House = {
    template: `
    <section class="mock room">
        <div class="room-page">
            <div id="houseCnvsContainer" style="overflow: auto;"></div>
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
                originScale: 0.349375, //(719-80*2)/1600 macBook 螢幕大小作為原點
                itemSpeakContainer: null
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
                        intro: d[keyMap.intro]
                    };
                    if (d[keyMap.link]){
                        obj.link = d[keyMap.link]
                    }
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
            let houseTexture = new PIXI.Texture.from(`./src/img/room/room_${this.hostName}.jpg`)
            let house = new PIXI.Sprite(houseTexture)
            house.scale.set(houseScale)
            house.alpha = 0.8
            this.pixi.app.stage.addChild(house)
            // 
            this.pixi.itemsContainer = new PIXI.Container()
            this.pixi.itemSpeakContainer = new PIXI.Container()
            this.pixi.itemSpeakContainer.name = 'itemSpeakContainer'
            this.pixi.app.stage.addChild(this.pixi.itemsContainer)
            this.pixi.app.stage.addChild(this.pixi.itemSpeakContainer)
            this.draw() //初始化房間
        },
        draw(){
            this.drawSnail()
            this.drawItems()
        },
        drawItems(){
            this.items.forEach(item=>{
                // icon
                let iconTexture = new PIXI.Texture.from('./src/img/icons/magnify.png')
                let icon = new PIXI.Sprite(iconTexture)
                icon.name = `${item.name}_icon`
                icon.x = 20
                icon.y = 5
                icon.scale.set(this.pixi.houseScale)
                gsap.to(icon, .5, {
                    pixi: {
                        y: -5
                    },
                    yoyo: true,
                    repeat: -1,
                })
                // container
                let container = new PIXI.Container()
                container.name = item.name
                container.interactive = true
                container.buttonMode = true
                container
                    .on("pointerdown", ()=>{
                        this.checkWhomClicked(container.name)
                    })
                container.x = item.x*this.pixi.houseScale/this.pixi.originScale
                container.y = item.y*this.pixi.houseScale/this.pixi.originScale
                container.addChild(icon)
                // 增加互動
                this.pixi.itemsContainer.addChild(container)
                container.on("mouseover", ()=>{
                    // 說明hover 的放大鏡是啥
                    this.itemHoverSpeak(container.name, container.x, container.y, item.intro)
                })
                container.on("mouseout", ()=>{
                    this.cleanAllItemSpeak()
                })
            })
        },
        drawSnail(){
            let el = this.npc
            let snailContainer = new PIXI.Container()
            snailContainer.name = this.hostNAme
            let texture = new PIXI.Texture.from(`./src/img/${this.hostName}.png`)
            let sp = new PIXI.Sprite(texture)
            sp.anchor.set(0.5)
            sp.name = this.hostName
            snailContainer.addChild(sp)
            snailContainer.x = 800*this.pixi.houseScale
            snailContainer.y = 1200*this.pixi.houseScale
            snailContainer.scale.set(this.pixi.houseScale*2)
            snailContainer.interactive = true
            snailContainer.cursor = "url('./src/img/icons/cursor_speak.png'),auto"
            snailContainer.on("pointerdown", ()=>{
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
            if (el.adoptable){
                // 加上燈泡 icon
                let iconTexture = new PIXI.Texture.from('./src/img/icons/lightbulb.png')
                let icon = new PIXI.Sprite(iconTexture)
                icon.name = "adoptable_icon"
                icon.anchor.set(0.5)
                icon.x = 100
                icon.y = -105
                let animDelay = Math.random()
                gsap.to(icon, .5, {
                    pixi: {
                        y: -95
                    },
                    yoyo: true,
                    repeat: -1,
                    delay: animDelay
                })
                snailContainer.addChild(icon)
            }
            this.pixi.app.stage.addChild(snailContainer)
        },
        checkWhomClicked(name){
            if (name == "commentBoard"){
                this.commentHasShown = !this.commentHasShown
            }else {
                let url 
                this.items.forEach(item=>{
                    if (item.name == name){
                        url = item.link
                    }
                })
                window.open(url, '_blank').focus()
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
        },
        cleanAllItemSpeak(){
            while(this.pixi.itemSpeakContainer.children.length > 0){
                this.pixi.itemSpeakContainer.removeChild(this.pixi.itemSpeakContainer.children[0])
            }
        },
        itemHoverSpeak(item, x, y, txt = '沒有說話'){
            // 清掉目前畫面上的所有
            this.cleanAllItemSpeak()
            // 說話的內容
            let arr = [], step = 12, line = 0, padding = 12, fz = 16, r=16
            for (let i=0; i<txt.length; i+=step){
                arr.push(txt.slice(i, i+step))
                line ++
            }
            let str = arr.join("\n")
            const style = new PIXI.TextStyle({
                fontSize: fz
            })
            let said = new PIXI.Text(str, style)
            said.x = padding
            said.y = padding
            // 對話框
            let rect = new PIXI.Graphics()
            let w, h
            if (line == 1){
                w = fz*txt.length+padding*2
            }else {
                w = fz*step+padding*2
            }
            h = line*(fz*1.25)+padding*2
            rect.beginFill(0xf4f3ed)
            rect.drawRoundedRect(0, 0, w, h, r)
            rect.endFill()
            this.pixi.itemSpeakContainer.addChild(rect)
            this.pixi.itemSpeakContainer.addChild(said)
            // 動畫
            this.pixi.itemSpeakContainer.x = x
            this.pixi.itemSpeakContainer.y = y
            this.pixi.itemSpeakContainer.alpha = 0
            this.pixi.itemSpeakContainer.scale = 0
            this.pixi.itemSpeakContainer.pivot.set(-20, 5)
            gsap.to(this.pixi.itemSpeakContainer, .4, {
                pixi: {
                    scale: 1,
                    alpha: 1,
                }
            })
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
                    <div class="popup t-a-c w-md-50 comment-board">
                        <div class="scroll">
                            <h2>{{program.title}}</h2>
                            <p>留言板討論認養議題區</p>
                            <p class="t-c-g">*目前留言僅供學術研究測試用，本地商家不會收到資訊，您的留言在網頁重新整理後便會被清除*</p>
                            <section>
                                <div class="comment">
                                    <div class="avatar">
                                        <img src="./src/img/snail_hito.png" />
                                    </div>
                                    <div class="message input">
                                        <input-text v-model="message" class="w-100" placeholder="留言......" :id="commentInputId" :name="commentInputId"></input-text>
                                        <button class="my-btn mt-1" @click="sendMsg">送出留言</button>
                                    </div>
                                </div>
                            </section>
                            <div class="comment-lists">
                                <div class="comment" v-for="comment of comments">
                                    <div class="avatar">
                                        <img src="./src/img/snail_hito.png" />
                                    </div>
                                    <div class="message">
                                        <p class="t-w-6">{{comment.nickName}}</p>
                                        <p>{{comment.message}}</p>
                                        <p class="t-z-1 t-c-g mt-1">{{comment.time}}</p>
                                    </div>
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
                    nickName: "綠洲蝸牛",
                    message: "喜歡這個方案！期待可以辦屬於蝸牛巷的文學新詩比賽",
                    time: "2022-5-26"
                },{
                    nickName: "小王",
                    message: "想知道認養之後能幹嘛？",
                    time: "2022-5-19"
                }
            ]
        }
    },
    methods: {
        sendMsg(){
            if (this.message !== ""){
                let obj = {}, day = new Date()
                obj.nickName = "使用者測試"
                obj.message = this.message
                obj.time = `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`
                this.comments.unshift(obj)
            }
        }
    }
}
Vue.component('comment-board', CommentBoard)