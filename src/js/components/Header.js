const Header = {
    template: `
        <header class="my-header">
            <img src="./src/img/logo.png" class="logo"/>
            <nav>
                <ul>
                    <li v-for="page of pages" @click="switchPage(page.name)" :data-lid="page.seudo" class="descrip-lid">
                        <toggle-bg-music :bg-is-playing="bgIsPlaying" v-if="page.name=='toggleMusic'" @switch-bg-music="switchBgMusic"></toggle-bg-music>
                        <span v-else>{{page.name}}</span>
                        <img :src="page.icon" class="icon" />
                    </li>
                </ul>
            </nav>
        </header>
    `,
    props: ['bgSound', 'bgIsPlaying', 'boardHasShown'],
    data(){
        return {
            pages: [
                {
                    name: "showBillBoard",
                    seudo: "綠洲生活公約",
                    icon: "./src/img/icons/exit.png"
                },
                {
                    name: "toggleMusic",
                    seudo: "切換背景音樂",
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
            if (name == 'showBillBoard'){
                if (this.boardHasShown){
                    this.$emit('switch-board', false)
                }else {
                    this.$emit('switch-board', true)
                }
            }
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