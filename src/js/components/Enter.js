const Enter = {
    template: `
        <transition name="fade">
            <div id="loading" v-if="loading">
                <div class="wrapper">
                    <button>
                        <h1 @click="$emit('start-game')">
                            START
                        </h1>
                    </button>
                </div>
            </div>
        </transition>
    `,
    props: {
        loading: Boolean
    },
    data(){
        return {}
    }
}
Vue.component("enter", Enter)