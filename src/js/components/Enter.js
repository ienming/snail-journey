const Enter = {
    template: `
        <transition name="fade">
            <div id="loading" v-if="loading">
                <div class="wrapper">
                    <button>
                        <h1 @click="startGame">
                            START
                        </h1>
                    </button>
                </div>
            </div>
        </transition>
    `,
    props: ['loading', 'bgSound'],
    data(){
        return {}
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
        }
    }
}
Vue.component("novice-teach", NoviceTeach)