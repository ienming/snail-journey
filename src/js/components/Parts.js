const ToggleBGMusic = {
    template: `
        <img :src="bgIsPlaying ? './src/img/icons/sound.png' : './src/img/icons/sound_ban.png'" class="toggle-sound-icon" @click="switchBgMusic"/>
    `,
    props: ['bgIsPlaying'],
    data() {
        return {}
    },
    methods: {
        switchBgMusic() {
            let value = 'play'
            if (this.bgIsPlaying) {
                value = 'stop'
            }
            this.$emit('switch-bg-music', value)
        }
    }
}
Vue.component('toggle-bg-music', ToggleBGMusic)

const CloseBtn = {
    template:
        `<div class="close" @click="switchPage">
        <img src="src/img/icons/close.svg" alt="">
    </div>`,
    props: {
        nowShow: String
    },
    data() {
        return {}
    },
    methods: {
        switchPage() {
            if (this.nowShow) {
                this.$emit(`switch-${this.nowShow}`)
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
    data() {
        let display = "none"
        if (this.hasIcon) {
            display = "inline-block"
        }
        let iconUrl = "src/img/icons/arrow_rightTop.svg"
        if (this.highlight) {
            iconUrl = "src/img/icons/arrow_rightTop_ht.svg"
        }
        return {
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
        childFill() {
            let state = this.fill
            if (this.large) {
                state = true
            }
            return state
        },
        iconUrl() {
            let iconUrl = "/src/img/icons/arrow_rightLong_ht.svg"
            // if (this.childFill){
            //     iconUrl = "/assets/img/icons/arrow_rightLong_ht.svg"
            // }
            return iconUrl
        }
    },
    data() {
        return {}
    }
}

Vue.component('cta', CTA)

const InputText = {
    template: `
    <label :for="id" class="my-inpt-container d-flex flex-column">
        <span class="aid" style="text-align: left;" v-if="labelTitle"><span v-show="required">＊</span>{{labelTitle}}<img v-if="type == 'password'" @click="switchPwdType" :src="showPwdUrl" class="icon" style="margin-left: 8px" /></span>
        <input :value="value" @input="$emit('input', $event.target.value)" :id="id" :name="name" :type="computedType" :placeholder="placeholder" :required="required" :pattern="pattern ? regExp : false" :title="patternInstruct" class="my-inpt"/>
        <transition name="fade">
            <img class="clear-data icon" src="./src/img/icons/close_dark.svg" @click="clearData" v-show="value !== ''" />
        </transition>
    </label>
    `,
    props: {
        value: {
            type: String,
        },
        labelTitle: {
            type: String,
            default: ""
        },
        placeholder: {
            type: String,
            default: "內容說明文字"
        },
        id: {
            type: String,
            default: "inputText1"
        },
        name: {
            type: String,
            default: "testInputText"
        },
        type: {
            type: String,
            default: "text"
        },
        required: {
            type: Boolean,
            default: true
        },
        regExp: {
            type: String
        },
        patternInstruct: {
            type: String
        }
    },
    computed: {
        pattern() {
            if (this.regExp) {
                return true
            } else {
                return false
            }
        },
        computedType() {
            if (this.type == 'password') {
                if (this.showPwd) {
                    this.showPwdUrl = './src/img/icons/pwd_show.svg' //張開眼睛
                    return "text"
                } else {
                    this.showPwdUrl = './src/img/icons/pwd_hide.svg' //閉上眼睛
                    return "password"
                }
            } else return this.type
        }
    },
    data() {
        return {
            showPwd: false,
            showPwdUrl: ''
        }
    },
    methods: {
        clearData() {
            this.$emit('input', '')
        },
        switchPwdType() {
            this.showPwd = !this.showPwd
        }
    }
}

Vue.component('input-text', InputText)

const Accordion = {
    template: `
        <section class="scroll">
            <div class="my-accordion" v-for="(accordion, idx) of accordions" @click="switchAccordion(idx, $event)">
                <div class="accordion-header d-flex jcb aic">
                    <h4>{{accordion.title}}</h4>
                    <div class="plus-icon"><span></span><span></span></div>
                </div>
                <div class="accordion-body" @click.stop>
                    <div>
                        <p v-html="accordion.content"></p>
                        <img :src="accordion.img" v-if="accordion.img" style="max-height: 100px;"/>
                    </div>
                </div>
            </div>
        </section>
    `,
    props: ['accordions'],
    data() {
        return {}
    },
    methods: {
        switchAccordion: function (id, evt) {
            let el = evt.currentTarget
            let contentDiv = el.querySelector(".accordion-body")
            let content = contentDiv.querySelector("div")
            let resultHeight = content.clientHeight + 8
            if (el.classList.contains("is-open")) {
                el.classList.remove("is-open")
                contentDiv.style.height = '0px'
            } else {
                el.classList.add("is-open")
                contentDiv.style.height = resultHeight + 'px'
            }
        }
    }
}
Vue.component('accordion', Accordion)

const ProgressHint = {
    template: `
    <ul class="progress-hint-lists">
        <transition-group name="fade" class="d-flex flex-column">
            <div class="progress-hint" :class="hint.hide ? 'hide' : ''" v-for="hint of hints" :key="hint.id">
                <p class="t-z-2">{{hint.say}}</p>
            </div>
        </transition-group>
    </ul>
    `,
    props: ['hints'],
    data() {
        return {
            timer: null
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            if (this.hints.length > 0) {
                this.$emit(`hint-hide`)
            }
        }, 2500)
    },
    beforeDestroy() {
        clearInterval(this.timer)
        this.timer = null;
    }
}
Vue.component('progress-hint', ProgressHint)

const BillBoard = {
    template: `
        <transition name="fade">
            <div class="mock" v-if="boardHasShown">
                <aside class="bill-board card w-100 w-md-un">
                    <div class="px-2">
                        <h2 class="t-a-c mb-1">蝸牛綠洲生活公約</h2>
                        <p>歡迎來到「蝸牛綠洲」！作為這個社區的新成員，除了享受慢活的氣氛之外，有什麼問題只要點開畫面右上方的公布欄就能看到囉！</p>
                        <accordion :accordions="rules" class="pt-2"></accordion>
                    </div>
                    <close-btn nowShow="board" @switch-board="switchBoard"></close-btn>
                </aside>
            </div>
        </transition>
    `,
    props: ['boardHasShown'],
    data(){
        return {
            rules: [
                {
                    title: "隨手撿起街道垃圾，維護純淨綠洲",
                    content: "尋找散落在街道裡的垃圾，當游標變成「垃圾桶」的時候可以撿起垃圾、獲得蝸牛幣！",
                    img: "./src/img/billboard_trash.png"
                },{
                    title: "打抱不平、堤防危害秩序的蛇和青蛙",
                    content: "拖拉畫面左下方的「讚」和「倒讚」圖標，到蛇、青蛙或清掃街道的人身上吧！",
                    img: "./src/img/teach_guy.png"
                },{
                    title: "敦親睦鄰、和村民聊天親近地方",
                    content: "當滑鼠游標變成「對話的樣子」時，可以開始和村民聊天、認識地方喔。",
                    img: "./src/img/teach_explore.png"
                },{
                    title: "賺取蝸牛幣，佈置房間",
                    content: "畫面左方有「房屋」圖標的黃色房子是你的新家，存夠蝸牛幣之後，就能在房間裡透過打開「櫥櫃」圖標添購新的傢俱囉！",
                    img: "./src/img/teach_furniture.png"
                },{
                    title: "加入社區行動案",
                    content: "當村民頭上出現「燈泡」圖標時，表示有可以加入的社區行動案發布了！有興趣的話，直接和蝸牛巷的居民接洽，一起維護實體環境吧！",
                    img: "./src/img/teach_adopt.png"
                }
            ]
        }
    },
    methods: {
        switchBoard(){
            if (this.boardHasShown){
                this.$emit('switch-board', false)
            }else{
                this.$emit('switch-board', true)
            }
        }
    }
}
Vue.component('bill-board', BillBoard)