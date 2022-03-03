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
    data(){
        let pages = [
            {
                name: "personalpage",
                src: "./src/img/icons/menu.png"
            }
        ]
        return {
            pages: pages
        }
    },
    methods: {
        switchPage(name){
            this.$emit(`switch-${name}`)
        }
    }
}

Vue.component("my-header", Header)