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
            this.bgSound.play()
        }
    }
}
Vue.component("enter", Enter)