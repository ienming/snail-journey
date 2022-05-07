const Header = {
    template: `
        <header class="my-header">
            <img src="./src/img/logo.png" class="logo"/>
            <nav>
                <ul>
                    <li v-for="page of pages" @click="switchPage(page.name)" :data-text="page.seudo">
                        <toggle-bg-music :bg-is-playing="bgIsPlaying" v-if="page.icon" @switch-bg-music="switchBgMusic"></toggle-bg-music>
                        <span v-else>{{page.name}}</span>
                    </li>
                </ul>
            </nav>
        </header>
    `,
    props: ['bgSound', 'bgIsPlaying'],
    data(){
        return {
            pages: [
                {
                    name: "toggleMusic",
                    seudo: "切換背景音樂",
                    icon: true
                },{
                    name: "clearData",
                    seudo: "清除資料（測試用）"
                }
            ]
        }
    },
    methods: {
        switchPage(name){
            this.$emit(`switch-${name}`)
            if (name == 'clearData'){
                localStorage.clear()
                window.location.reload()
            }
            // if (name == 'toggleMusic'){
            //     if(this.bgSound.isPlaying){
            //         this.$emit('switch-bg', false)
            //     }else{
            //         this.$emit('switch-bg', true)
            //     }
            // }
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

Vue.component("my-header", Header)