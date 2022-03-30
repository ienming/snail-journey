const Header = {
    template: `
        <header class="my-header">
            <nav>
                <ul>
                    <li v-for="page of pages" @click="switchPage(page.name)">
                        <img :src="page.src" class="icon"/>
                        <span>{{page.name}}</span>
                    </li>
                </ul>
            </nav>
        </header>
    `,
    props: ['bgSound'],
    data(){
        let pages = [
            {
                name: "personalpage",
                src: "./src/img/icons/menu.png"
            },{
                name: "toggleBgMusic"
            },{
                name: "clearData"
            }
        ]
        return {
            pages: pages
        }
    },
    methods: {
        switchPage(name){
            this.$emit(`switch-${name}`)
            if (name == 'clearData'){
                localStorage.clear()
                window.location.reload()
            }
            if (name == 'toggleBgMusic'){
                if(this.bgSound.isPlaying){
                    this.bgSound.stop()
                }else{
                    this.bgSound.play()
                }
            }
        }
    }
}

Vue.component("my-header", Header)