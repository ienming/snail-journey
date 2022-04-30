const Header = {
    template: `
        <header class="my-header">
            <img src="./src/img/landmark.png" class="logo"/>
            <nav>
                <ul>
                    <li v-for="page of pages" @click="switchPage(page.name)" :data-text="page.seudo">
                        <img :src="page.src" class="icon"/>
                        <span v-if="!page.src">{{page.name}}</span>
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
                    src: "./src/img/icons/sound.png",
                    name: "toggleMusic",
                    seudo: "切換背景音樂"
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
            if (name == 'toggleMusic'){
                if(this.bgSound.isPlaying){
                    this.bgSound.stop()
                    this.$emit('switch-bg', false)
                    let id = this.pages.findIndex(el => el.name == 'toggleMusic')
                    this.pages[id].src = "./src/img/icons/sound_ban.png"
                }else{
                    this.bgSound.play()
                    this.$emit('switch-bg', true)
                    let id = this.pages.findIndex(el => el.name == 'toggleMusic')
                    this.pages[id].src = "./src/img/icons/sound.png"
                }
            }
        }
    }
}

Vue.component("my-header", Header)