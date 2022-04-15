const Enter = {
    template: `
        <transition name="fade">
            <div id="loading" v-if="loading">
                <div class="wrapper">
                    <div class="d-flex flex-column">
                        <img src="./src/img/landmark.png" class="logo"/>
                        <div v-if="loaded == false" class="t-a-c mt-2">
                            <img src="./src/img/icons/loading.png" class="icon"/>
                            <h4>???%</h4>
                        </div>
                        <button v-else class="mt-2" @click="startGame">
                            <h1>進入綠洲</h1>
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    `,
    props: ['loading', 'bgSound'],
    data(){
        return {
            loaded: true
        }
    },
    methods: {
        startGame(){
            this.$emit('start-game')
            // this.bgSound.play()
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
                    <div class="popup dialogue">
                        <transition-group name="fade-right">
                            <div v-for="(teach,idx) of teaches" :key="teach.title" v-show="idx == nowStep" class="t-a-c fade-right-item">
                                <h2 class="t-z-4 mb-1">{{teach.title}}</h2>
                                <p>{{teach.content}}</p>
                            </div>
                        </transition-group>
                        <div class="d-flex jcb mt-1">
                            <button class="small t-c t-w-6" @click="moveStep('prev')">前一個</button>
                            <button class="small t-c t-w-6" @click="moveStep('next')">下一個</button>
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
                    title: "新手說明1",
                    content: "說明1內容",
                },{
                    title: "新手說明2",
                    content: "說明2內容",
                },{
                    title: "新手說明3",
                    content: "說明3內容",
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
                <section v-for="cut of cuts" :key="cut.name" v-show="nowCut == cut.name">
                    <img :src=cut.src />
                    <p>分鏡測試</p>
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
                    src: './src/img/open/cut_1.jpg'
                },{
                    name: 2,
                    src: './src/img/open/cut_2.jpg'
                },{
                    name: 3,
                    src: './src/img/open/cut_3.jpg'
                }
            ]
        }
    },
    methods: {
        nxt(){
            if (this.nowCut == this.cuts.length){
                this.narrativeHasShown = false
            }else{
                this.nowCut ++
            }
        }
    }
}
Vue.component("narrative", Narrative)