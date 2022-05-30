const Enter = {
    template: `
        <transition name="fade" :duration="{ leave: 800 }" v-if="loadingShouldShown">
            <div id="loading">
                <div class="wrapper">
                    <div class="d-flex flex-column mb-2 mb-md-0">
                        <img src="./src/img/logo.png" class="logo"/>
                    </div>
                    <transition name="fade">
                        <log-in @log-in="startGame" v-if="!loading"></log-in>
                    </transition>
                </div>
                <toggle-bg-music :bg-is-playing="bgIsPlaying" @switch-bg-music="switchBgMusic" style="position: absolute; right: 24px; top: 24px;"></toggle-bg-music>
            </div>
        </transition>
    `,
    props: ['loading', 'bgIsPlaying'],
    data(){
        return {
            loadingShouldShown: true
        }
    },
    methods: {
        startGame(){
            this.$emit('start-game')
            this.loadingShouldShown = false
        },
        switchBgMusic(v){
            if (v == 'play'){
                this.$emit('switch-bg', true)
            }else{
                this.$emit('switch-bg', false)
            }
        }
    }
}
Vue.component("enter", Enter)

// 新手導引卡片
const NoviceTeach = {
    template: `
        <transition name="fade">
            <div class="mock" v-if="noviceHasShown">
                <div class="wrapper">
                    <div class="popup dialogue novice">
                        <h2 class="t-c-g t-a-c mb-1" style="opacity: 0.5">新手導引</h2>
                        <transition-group name="fade-right">
                            <div v-for="(teach,idx) of teaches" :key="teach.title" v-show="idx == nowStep" class="t-a-c fade-right-item">
                                <h2 class="t-z-4">{{teach.title}}</h2>
                                <img :src="teach.img" style="max-height: 100px;"/>
                                <p>{{teach.content}}</p>
                            </div>
                        </transition-group>
                        <div class="d-flex jcb mt-1">
                            <button class="small t-w-6" @click="moveStep('prev')">前一個</button>
                            <button class="small t-w-6" @click="moveStep('next')" v-if="nowStep !== teaches.length-1">下一個</button>
                            <button class="small t-w-6" @click="switchNovice()" v-else>完成</button>
                        </div>
                        <nav>
                            <ul class="carousel-lids">
                                <li v-for="(num,id) of teaches" :class="id == nowStep ? 'active' : '' " @click="changeStep(id)"></li>
                            </ul>
                        </nav>
                        <close-btn now-show="novice" @switch-novice="switchNovice"></close-btn>
                    </div>
                </div>
            </div>
        </transition>
    `,
    data(){
        return {
            noviceHasShown: true,
            teaches: [
                {
                    title: "探索綠洲",
                    content: "拖曳地圖、到處看看，和蝸牛村民聊聊天。蝸牛綠洲，慢慢行！",
                    img: "./src/img/teach_explore.png"
                },{
                    title: "維護秩序",
                    content: "街區裡有時會出現進行活動的人，拖拉左下角的圖案到有「按讚圖標」的人身上，守護蝸牛綠洲的秩序、獲得蝸牛幣吧！",
                    img: "./src/img/teach_guy.png"
                },{
                    title: "清掃街道",
                    content: "有人亂丟垃圾！請你幫忙把垃圾撿起來，一起保持巷弄的乾淨整潔。",
                    img: "./src/img/teach_trash.png"
                },{
                    title: "蒐集蝸牛幣",
                    content: "守護街區的秩序並維持環境整潔，就能獲得蝸牛幣，可以用在佈置家裡的房間，或是到實體合作店家換取折扣喔！",
                    img: "./src/img/teach_coin.png"
                },{
                    title: "佈置自己的房間",
                    content: "和蝸牛們聊天、認識街區，用「蝸牛幣」把家具放到自己家裡吧！打造舒服的小天地！",
                    img: "./src/img/teach_furniture.png"
                },{
                    title: "認養行動案",
                    content: "店裡的蝸牛村民似乎有什麼計劃正在進行，有興趣加入、成為這裡的一份子嗎？認養行動案，成為蝸牛綠洲的 VIP 吧！",
                    img: "./src/img/teach_adopt.png"
                }
            ],
            nowStep: 0
        }
    },
    methods: {
        switchNovice(){
            this.noviceHasShown = !this.noviceHasShown
        },
        changeStep(id){
            this.nowStep = id
        },
        moveStep(str){
            if (str == 'prev'){
                if (this.nowStep > 0){
                    this.nowStep --
                }else{
                    this.nowStep = this.teaches.length-1
                }
            }else if (str == 'next'){
                if (this.nowStep < this.teaches.length-1){
                    this.nowStep ++
                }else{
                    this.nowStep = 0
                }
            }
        }
    }
}
Vue.component("novice-teach", NoviceTeach)

// 背景劇情說明
const Narrative = {
    template: `
    <transition name="fade">
        <div class="wrapper narrative" @click="nxt" v-if="narrativeHasShown">
            <transition-group name="fade-right">
                <section v-for="cut of cuts" :key="cut.name" v-show="nowCut == cut.name" class="d-flex flex-column flex-md-row aic">
                    <img :src=cut.src />
                    <div class="my-2 t-z-2 descrip-container">
                        <p class="descrip" v-html="cut.descrip"></p>
                        <p class="t-z-1 mt-1 mt-md-0 mr-md-2" style="opacity: 0.7" v-if="cut.name !== 4">（點擊畫面任何地方繼續）</p>
                        <p class="t-z-1" style="opacity: 0.7" v-else>（點擊畫面進入蝸牛綠洲）</p>
                    </div>
                </section>
            </transition-group>
        </div>
    </transition>
    `,
    props: [],
    data(){
        return {
            narrativeHasShown: true,
            nowCut: 1,
            cuts: [
                {
                    name: 1,
                    src: './src/img/open/shot1.png',
                    descrip: "我住在忙碌的城市裡......</br>看著人來人往川流不息，緊繃而快速的生活步調"
                },{
                    name: 2,
                    src: './src/img/open/shot2.png',
                    descrip: "有時也需要一個地方喘息......</br>這天我接收到一個邀請"
                },{
                    name: 3,
                    src: './src/img/open/shot3.png',
                    descrip: "再見喧囂！</br>我要去度假了～"
                },{
                    name: 4,
                    src: './src/img/open/shot4.png',
                    descrip: "來到抓牛綠洲了！"
                }
            ]
        }
    },
    mounted(){
        this.splitText()
    },
    methods: {
        nxt(){
            if (this.nowCut == this.cuts.length){
                this.narrativeHasShown = false
                this.$emit('enter-oasis')
            }else{
                this.nowCut ++
            }
        },
        splitText(){
            let arr = []
            document.querySelectorAll(".narrative .descrip").forEach(el => {
                el.innerText.split("").forEach(t => {
                    let temp = document.createElement("span")
                    temp.innerText = t
                    arr.push(temp)
                })
                el.innerText = ""
                for (let i=0; i<arr.length; i++){
                    el.appendChild(arr[i])
                }
                arr = []
            })
        }
    }
}
Vue.component("narrative", Narrative)