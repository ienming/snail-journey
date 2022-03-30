const CloseBtn = {
    template:
    `<div class="close" @click="switchPage">
        <img src="src/img/icons/close.svg" alt="">
    </div>`,
    props: {
        nowShow: String
    },
    data(){
        return {}
    },
    methods: {
        switchPage(){
            if (this.nowShow){
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

const InputText = {
    template: `
    <label :for="id" class="my-inpt-container d-flex flex-column">
        <span class="aid" style="text-align: left;" v-if="labelTitle"><span v-show="required">＊</span>{{labelTitle}}</span>
        <input :value="value" @input="$emit('input', $event.target.value)" :id="id" :name="name" :type="type" :placeholder="placeholder" :required="required" :pattern="pattern ? regExp : false" :title="patternInstruct" class="my-inpt"/>
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
        pattern(){
            if (this.regExp){
                return true
            }else {
                return false
            }
        }
    },
    data(){
        return {
        }
    },
    methods: {
        clearData(){
            this.$emit('input', '')
        }
    }
}

Vue.component('input-text', InputText)