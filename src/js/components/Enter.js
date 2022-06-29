const Enter = {
    template: `
        <transition name="fade" :duration="{ leave: 800 }" v-if="loadingShouldShown">
            <div id="loading">
                <div class="wrapper">
                    <div class="d-flex flex-column aic mb-2 mb-md-0">
                        <img src="./src/img/logo.png" class="logo"/>
                        <transition name="fade">
                            <div class="t-a-c" v-if="!loading">
                                <p class="t-c-g t-z-1 mt-1">Caution to the volume</p>
                                <p class="t-c-g t-z-1 mt-1">Please switch off the ad block extension if you cannot enter</p>
                                <p class="t-c-g t-z-1" style="padding: 8px 16px; background-color: white; border-radius: 50px;">Use computer for the better experience</p>
                                <button class="mt-2 my-btn w-100" @click="startGame">
                                    Enter Oasis
                                </button>
                            </div>
                        </transition>
                    </div>
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
                        <h2 class="t-c-g t-a-c mb-1" style="opacity: 0.5">Notivce Guide</h2>
                        <transition-group name="fade-right">
                            <div v-for="(teach,idx) of teaches" :key="teach.title" v-show="idx == nowStep" class="t-a-c fade-right-item">
                                <h2 class="t-z-4">{{teach.title}}</h2>
                                <img :src="teach.img" style="max-height: 100px;"/>
                                <p>{{teach.content}}</p>
                            </div>
                        </transition-group>
                        <div class="d-flex jcb mt-1">
                            <button class="small t-w-6" @click="moveStep('prev')">Back</button>
                            <button class="small t-w-6" @click="moveStep('next')" v-if="nowStep !== teaches.length-1">Next</button>
                            <button class="small t-w-6" @click="switchNovice()" v-else>Cancel</button>
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
                    title: "Explore Snail Oasis",
                    content: "Drag and drop the map and see what's going on with villagers!",
                    img: "./src/img/teach_explore.png"
                },{
                    title: "Keep the order",
                    content: "Sometimes there will be people who are doing activities in the block. Drag the pattern in the lower left corner to the person with the 'ike icon', protect the order of Snail Oasis, and get Snail Coins!",
                    img: "./src/img/teach_guy.png"
                },{
                    title: "Maintain the environment",
                    content: "Someone is littering! Please help to pick up the rubbish and keep the alleys clean and tidy together.",
                    img: "./src/img/teach_trash.png"
                },{
                    title: "Collect Snail Coins",
                    content: "Guard the order of the neighborhood and keep the environment clean and tidy for Snail Coins, which can be used to decorate the room at home, or exchange for discounts at physical cooperative stores!",
                    img: "./src/img/teach_coin.png"
                },{
                    title: "Decorate your home",
                    content: "Chat with snails, get to know the neighborhood, and use Snail Coins to put furniture in your home! Create a cozy little world!",
                    img: "./src/img/teach_furniture.png"
                },{
                    title: "Take part in local affairs",
                    content: "Villager seems to have some plans going on, are you interested in joining and being a part of it? Adopt action case and become a relation parter of Snail Oasis!",
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
                    <div class="my-2 descrip-container">
                        <p class="descrip" v-html="cut.descrip"></p>
                        <p class="t-z-1 mt-1 mt-md-0 mr-md-2" style="opacity: 0.7" v-if="cut.name !== 4">（click everywhere to continue）</p>
                        <p class="t-z-1" style="opacity: 0.7" v-else>（click everywhere to continue）</p>
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
                    descrip: "I'm living in the busy city...</br>people are always busy for their works and lives"
                },{
                    name: 2,
                    src: './src/img/open/shot2.png',
                    descrip: "Sometimes I think I need the place to take a rest...</br>There comes the invitation one day"
                },{
                    name: 3,
                    src: './src/img/open/shot3.png',
                    descrip: "Farewell to the business</br>I'm going on my vacation..."
                },{
                    name: 4,
                    src: './src/img/open/shot4.png',
                    descrip: "Welcome to Snail Oasis!"
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