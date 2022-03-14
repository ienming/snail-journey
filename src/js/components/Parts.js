const CloseBtn = {
    template:
    `<div class="close" @click="switchPage">
        <img src="src/img/icons/close.svg" alt="">
    </div>`,
    props: {
        outerShowPopup: Boolean,
        outerShowPersonalPage: Boolean
    },
    data(){
        return {}
    },
    methods: {
        switchPage(){
            if (this.outerShowPopup){
                this.$emit(`switch-popup`)
            }else if (this.outerShowPersonalPage){
                this.$emit(`switch-personal-page`)
            }
        }
    }
}

Vue.component("close-btn", CloseBtn)

const Link = {
    template: `
    <a :href="url" class="my-link" :class="{ 'highlight' : highlight }" :style="[full ? fullObj : '']" target="_blank">
        {{ title }}
        <div class="icon-container" :style="styleObj">
            <img :src="iconUrl" class="icon">
            <img :src="iconUrl" class="icon">
        </div>
    </a>
    `,
    props: {
        title: {
            title: String,
            default: "Link"
        },
        url: {
            type: String,
            default: ""
        },
        hasIcon: {
            type: Boolean,
            default: true
        },
        full: {
            type: Boolean, 
            default: false
        },
        highlight: {
            type: Boolean, 
            default: false
        }
    },
    data(){
        let display = "none"
        if(this.hasIcon){
            display = "inline-block"
        }
        let iconUrl = "src/img/icons/arrow_rightTop.svg"
        if(this.highlight){
            iconUrl = "src/img/icons/arrow_rightTop_ht.svg"
        }
        return{
            styleObj: {
                display: display
            },
            fullObj: {
                display: "flex",
                "justify-content": "space-between"
            },
            iconUrl: iconUrl
        }
    }
}

Vue.component('basic-link', Link)

const CTA = {
    template: `
        <div class="my-cta-container" :class="{ 'large' : large}">
            <button v-if="!url" class="my-cta cta-link" :class="{ 'fill' : childFill}" @click="$emit('adopting')">
                <span v-html="title"></span>
                <div class="icon-container">
                    <img :src="iconUrl" alt="">
                    <img :src="iconUrl" alt="">
                </div>
            </button>
            <a v-else :href="url" class="my-cta cta-link" :class="{ 'fill' : childFill}" :target="{ '_blank' : outer }">
                <span v-html="title"></span>
                <div class="icon-container">
                    <img :src="iconUrl" alt="">
                    <img :src="iconUrl" alt="">
                </div>
            </a>
        </div>
    `,
    props: {
        title: {
            title: String,
            default: "加入認養"
        },
        large: {
            type: Boolean, 
            default: false
        },
        fill: {
            type: Boolean,
            default: false
        },
        url: {
            type: String,
            default: ""
        },
        outer: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        childFill(){
            let state = this.fill
            if (this.large) {
                state = true
            }
            return state
        },
        iconUrl(){
            let iconUrl = "/src/img/icons/arrow_rightLong_ht.svg"
            // if (this.childFill){
            //     iconUrl = "/assets/img/icons/arrow_rightLong_ht.svg"
            // }
            return iconUrl
        }
    },
    data(){
        return {}
    }
}

Vue.component('cta', CTA)


const Adoption = {
    template: `
        <div class="popup adoption">
            <div class="d-flex justify-between head">
                <div>
                    <h3>{{program.subTitle}}</h3>
                    <h1>{{program.title}}</h1>
                </div>
                <div class="d-flex flex-column jcc">
                    <img src="" alt="" />
                    <span></span>
                </div>
            </div>
            <p class="mt-1">
                <p class="t-w-8 t-z-1">專案目標</p>
                <p class="t-z-2">{{program.goal}}</p>
            </p>
            <div class="d-flex my-1">
                <div v-for="keyword of program.keywords" class="keyword">
                    {{keyword}}
                </div>
            </div>
            <p class="my-2">{{program.intro}}</p>
            <div class="d-flex flex-wrap my-1 action">
                <figure class="m-0 d-flex aic flex-column" v-for="action of program.actions">
                    <img :src="action.imgSrc" alt="" />
                    <figcaption class="mt-1 t-a-c">
                        <h5 class="t-z-2">{{action.title}}</h5>
                        <p class="t-z-2">{{action.intro}}</p>
                    </figcaption>
                </figure>
            </div>
            <cta @adopting="adopt"></cta>
        </div>
    `,
    props: {
        program: {
            type: Object
        }
    },
    data(){
        return {}
    },
    methods: {
        adopt(){
            //判斷是否已經認養過
            if (vm.$data.user.adoptions.every(val => val !== this.program.title)){
                if (this.program.subTitle){
                    //打事件到vm 呼叫 showsys()
                    this.$emit(`adopted`, `已認養方案：「${this.program.subTitle}：${this.program.title}」`)
                }
                else{
                    this.$emit(`adopted`, `已認養方案：「${this.program.title}」`)
                }
                //把認養的資料儲存
                vm.$data.user.adoptions.push(this.program.title)
            }else{
                this.$emit(`adopted`, `已經認養過方案：「${this.program.title}」囉～`)
            }
        },
    }
}
Vue.component('adoption', Adoption)