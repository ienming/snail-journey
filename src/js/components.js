const BasicButton = {
    template: `
        <button class="my-btn" :class="mybtnClasses">{{ title }}</button>
    `,
    props: {
        title: {
            type: String,
            default: "Button"
        },
        highlight: {
            type: Boolean,
            default: false
        },
        outline: {
            type: Boolean,
            default: false
        },
        small: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            mybtnClasses: {
                "highlight": this.highlight,
                "outline": this.outline,
                "small": this.small
            }
        }
    }
}

Vue.component('basic-button', BasicButton)

const CTA = {
    template: `
        <div class="my-cta-container" :class="{ 'large' : large}">
        <a :href="url" class="my-cta" :class="{ 'fill' : childFill}" :target="{ '_blank' : outer }">
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
            default: "我要參加"
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
            let iconUrl = "/assets/img/icons/arrow_rightLong_ht.svg"
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
        let iconUrl = "assets/img/icons/arrow_rightTop.svg"
        if(this.highlight){
            iconUrl = "assets/img/icons/arrow_rightTop_ht.svg"
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

const FileLink = {
    template: `
    <a :href="url" class="my-link file-link" target="_blank">
        <p class="title">
            <span>{{ title }}</span>
            <span class="sub-title">{{ subTitle }}</span>
        </p>
        <div class="info">
            <span class="cate">{{ cate }}</span>
            <div class="icon-container" :style="styleObj">
                <img :src="iconUrl" class="icon">
                <img :src="iconUrl" class="icon">
            </div>
        </div>
    </a>
    `,
    props: {
        title: {
            title: String,
            default: "File Link"
        },
        url: {
            type: String,
            default: ""
        },
        cate: {
            type: String,
            default: "PDF"
        },
        hasIcon: {
            type: Boolean,
            default: true
        },
        subTitle: {
            type: String,
            default: ""
        }
    },
    data(){
        let display = "none"
        if(this.hasIcon){
            display = "inline-block"
        }
        let iconUrl = "assets/img/icons/arrow_rightTop.svg"
        return{
            styleObj: {
                display: display
            },
            iconUrl: iconUrl
        }
    }
}

Vue.component('file-link', FileLink)

const ButtonLink = {
    template: `
    <a :href="url" class="my-btn link" :class="mybtnClasses" target="_blank">
        {{ title }}
        <div class="icon-container" :style="styleObj">
            <img src="assets/img/icons/arrow_rightTop.svg" class="icon">
            <img src="assets/img/icons/arrow_rightTop.svg" class="icon">
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
        highlight: {
            type: Boolean,
            default: false
        },
        outline: {
            type: Boolean,
            default: false
        },
        small: {
            type: Boolean,
            default: false
        }
    },data: function () {
        let display = "none"
        if(this.hasIcon){
            display = "inline-block"
        }
        return {
            mybtnClasses: {
                "highlight": this.highlight,
                "outline": this.outline,
                "small": this.small
            },
            styleObj: {
                display: display
            }
        }
    }
}

Vue.component('button-link', ButtonLink)

const checkBox = {
    template: `
    <label :for="id" class="d-flex aic my-inpt-container">
        <input type="checkbox" :name="name" :id="id" class="my-inpt" v-model="checked" @input="switchChecked"></input>
        <span v-html="title"></span>
    </label>
    `,
    props: {
        title: {
            type: String,
            default: "核取方塊"
        },
        id: {
            type: String,
            default: "checkbox1"
        },
        name: {
            type: String,
            default: "testcheckbox"
        },
        isChecked: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            checked: this.isChecked
        }
    },
    methods: {
        switchChecked(){
            this.$emit('child-switch-check', !this.checked)
        }
    }
}

Vue.component('input-checkbox', checkBox)

const InputText = {
    template: `
    <label :for="id" class="my-inpt-container d-flex flex-column">
        <span class="aid"><span v-show="required">＊</span>{{labelTitle}}</span>
        <input :id="id" :name="name" :type="type" :placeholder="placeholder" @input="$emit('input', $event.target.value)" :required="required" :pattern="pattern ? regExp : false" :title="patternInstruct" class="my-inpt"/>
    </label>
    `,
    props: {
        labelTitle: {
            type: String,
            default: "說明文字"
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
    }
}

Vue.component('input-text', InputText)

const InputTextArea = {
    template: `
    <label :for="id" class="my-inpt-container d-flex flex-column">
        <span class="aid"><span v-show="required">＊</span>{{title}}</span>
        <textarea :id="id" :name="name" class="my-inpt" :placeholder="placeholder" :required="required" v-model="txtContent" v-bind="$attrs">{{content}}</textarea>
    </label>
    `,
    props: {
        title: {
            type: String,
            default: "說明文字"
        },
        id: {
            type: String,
            default: "inputTextArea1"
        },
        name: {
            type: String,
            default: "testTextArea"
        },
        placeholder: {
            type: String,
            default: "請輸入訊息"
        },
        required: {
            type: Boolean,
            default: true
        },
        content: {
            type: String
        }
    },
    data(){
        return {}
    },
    computed:{
        txtContent: {
            get(){
                return this.content
            },
            set: function(value){
                this.$emit("update:content", value)
            }
        }
    }
}

Vue.component('input-text-area', InputTextArea)

const inputSelect = {
    template: `
    <label :for="id" class="my-inpt-container d-flex flex-column">
        <span class="aid"><span>＊</span>{{title}}</span>
        <select :name="name" :id="id" class="my-inpt" :value="value" @input="$emit('input', $event.target.value)" :required="required">
            <option :value="option.value" v-for="(option, idx) of options" :disabled="idx == 0 ? true : false">{{ option.content }}</option>
        </select>
    </label>
    `,
    props: {
        title: {
            type: String,
            default: "說明文字"
        },
        id: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            default: "testInputSelect"
        },
        value: {
            type: String
        },
        required: {
            type: Boolean,
            default: true
        },
        options: {
            type: Array,
            default(){
                return [
                    {
                        value: "",
                        content: "--請選擇--"
                    }
                ]
            }
        }
    },
    data(){
        return {}
    }
}

Vue.component('input-select', inputSelect)

const DropDown = {
    template: `
    <nav class="dpd-container">
        <span class="dpd-head">{{title}}
            <div class="icon-container">
                <img src="assets/img/icons/arrow_down.svg" alt="" class="icon">
                <img src="assets/img/icons/arrow_down.svg" alt="" class="icon">
            </div>
        </span>
        <ul class="dpd-lists">
            <li class="dpd-list" v-for="list of lists" :key="list.content">{{list.content}}</li>
        </ul>
    </nav>
    `,props: {
        title: {
            type: String,
            default: "Drop Down List"
        },lists: {
            type: Array,
            default(){
                return [
                    {
                        content: ""
                    }
                ]
            }
        }
    },data(){
        return {}
    }
}

Vue.component('drop-down', DropDown)


const Footer = {
    template: `
        <footer class="flexable t-z-3">
            <div class="col-md-4">
                <img src="/assets/img/logo.png" alt="Logo" class="logo">
                <div class="sns my-1">
                    <a href="" target="_blank"><img src="/assets/img/icons/fb_negative.svg" alt="Facebook" class="icon mr-1"></a>
                    <a href="" target="_blank"><img src="/assets/img/icons/yt_negative.svg" alt="Youtube" class="icon"></a>
                </div>
                <p class="mb-2 t-z-3">
                    台北市南港區研究院路一段 130 巷 99 號</br>
                    國家生技研究園區 B 棟 2 樓</br>
                    電話 : (02) 2652-3580</br>
                    Email : biobank@gate.sinica.edu.tw</br>
                </p>
                <span class="t-z-3">免付費諮詢專線：0800-018-810</span>
            </div>
            <div class="col-md-4">
                <span class="t-w-5 mb-1 d-inline-block t-z-4">快速連結</span>
                <a :href="links.contact" class="d-block mb-1 t-z-3">聯絡我們</a>
                <a :href="links.jobs" class="d-block mb-1 t-z-3">徵才資訊</a>
                <a :href="links.privacy" class="d-block mb-1 t-z-3">隱私權保護及安全政策</a>
            </div>
            <div class="col-md-4">
                <div>
                    <basic-link title="衛生福利部" :url="links.mohw" :has-icon="true" :full="true" :highlight="false" class="mb-2 mb-md-1 d-block"></basic-link>
                    <basic-link title="中央研究院" :url="links.sinica" :has-icon="true" :full="true" :highlight="false" class="mb-2 mb-md-1 d-block"></basic-link>
                    <basic-link title="國家生技研究園區" :url="links.nbrp" :has-icon="true" :full="true" :highlight="false" class="mb-2 mb-md-1 d-block"></basic-link>
                    <basic-link title="國家高速網路與計算中心" :url="links.nchc" :has-icon="true" :full="true" :highlight="false" class="mb-2 mb-md-1 d-block"></basic-link>
                    <basic-link title="台灣人體生物資料庫學會" :url="links.biobanksociety" :has-icon="true" :full="true" :highlight="false" class="mb-2 mb-md-1 d-block"></basic-link>
                </div>
                <span class="t-z-1 mt-5">Copyrights©2021</br>臺灣人體生物資料庫版權所有</span>
            </div>
        </footer>
    `,
    data(){
        return{
            links: {
                contact: "contact.php",
                jobs: "jobs.php",
                privacy: "privacy.php",
                mohw: "https://www.mohw.gov.tw/mp-1.html",
                sinica: "https://www.sinica.edu.tw/ch",
                nbrp: "https://nbrp.sinica.edu.tw/",
                nchc: "https://www.nchc.org.tw/",
                biobanksociety: "http://biobanksociety.tw/"
            }
        }
    }
}

Vue.component('my-footer', Footer)

const Header = {
    template: `
    <header class="my-header" :class="{ 'out' : childIsScrollDown }">
    <div>
    <h1>
        <a href="./index.html">
            <img src="/assets/img/logo.png" alt="Taiwan Biobank 台灣人體生物資料庫" class="logo">
        </a>
    </h1>
    <nav class="desk-menu">
        <ul class="pages">
            <nav class="dpd-container" v-for="page of pages">
                <span class="dpd-head t-z-2" :class="{ 'active' : nowPage == page.heading }"> {{ page.heading }}
                    <div class="icon-container">
                        <img src="assets/img/icons/arrow_down.svg" alt="" class="icon">
                        <img src="assets/img/icons/arrow_down.svg" alt="" class="icon">
                    </div>
                </span>
                <ul class="dpd-lists" v-if="page.subs">
                    <a :href="subpage.url" v-for="subpage of page.subs"><li class="dpd-list t-z-2">{{ subpage.title }}</li></a>
                </ul>
            </nav>
        </ul>
        <div class="sns">
            <a href="https://www.facebook.com/%E8%87%BA%E7%81%A3%E4%BA%BA%E9%AB%94%E7%94%9F%E7%89%A9%E8%B3%87%E6%96%99%E5%BA%AB-230755568245143" target="_blank"><img src="/assets/img/icons/fb_negative.svg" alt="Facebook" class="icon mr-1"></a>
            <a href="https://www.youtube.com/channel/UCgdxnBSRB9dGIj0mSgB4otw" target="_blank"><img src="/assets/img/icons/yt_negative.svg" alt="Youtube" class="icon"></a>
        </div>
        <button-link title="我要參加" :has-icon="false" url="./join.php"></button-link>
        <button>
            <img src="/assets/img/icons/search.svg" alt="Search" class="icon">
        </button>
    </nav>
    <nav class="mobile-menu">
        <button>
            <img src="/assets/img/icons/search.svg" alt="Search">
        </button>
        <button @click="openMobile">
            <img src="/assets/img/icons/menu.png" alt="Menu">
        </button>
        <div class="menu" :class="{ 'show' : mobileShow }">
            <header>
                <h1>
                    <img src="/assets/img/logo.png" alt="Taiwan Biobank 台灣人體生物資料庫" class="logo">
                </h1>
                <button><img src="/assets/img/icons/close.svg" alt="Close" @click="closeMobile"/></button>
            </header>
            <div style="height: 90vh; overflow: scroll; padding-bottom: 50px;">
                <nav>
                    <ul class="nav">
                        <li v-for="(page, idx) of pages" @click="toggleSubs(idx, $event)" class="mobile-nav">
                            <span class="heading">
                                {{ page.heading }}
                                <img src="/assets/img/icons/arrow_down_ht.svg" alt="" class="icon" />
                            </span>
                            <ul v-if="page.subs" class="subs">
                                <a :href="subpage.url" v-for="subpage of page.subs" @click="closeMobile"><li class="">{{ subpage.title }}</li></a>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <button-link title="我要參加" url="./join.php" :has-icon="false" :highlight="true" class="cta"></button-link>
                <img src="/assets/img/logo.png" alt="Taiwan Biobank 台灣人體生物資料庫" class="logo">
                <div class="sns">
                    <a href=""><img src="/assets/img/icons/fb_highlight.svg" alt="Facebook" class="icon mr-1"></a>
                    <a href=""><img src="/assets/img/icons/yt_highlight.svg" alt="Youtube" class="icon"></a>
                </div>
                <p>
                    台北市南港區研究院路一段 130 巷 99 號 </br>
                    國家生技研究園區 B 棟 2 樓</br>
                    電話 : (02) 2652-3580</br>
                    Email : biobank@gate.sinica.edu.tw  
                </p>
                <span class="d-inline-block mt-3">免付費諮詢專線：0800-018-810</span>
            </div>
        </div>
    </nav>
    </div>
    <button-link title="國家級人體生物資料庫整合平台" url="https://nbct.nhri.org.tw/" :small="true" :outline="true" :has-icon="true" class="fl-r"></button-link>
</header>
    `,
    props: {
        isScrollDown: {
            type: Boolean,
            default: false
        },
        nowPage: {
            type: String
        }
    },
    data(){
        let pages = [
            {
                heading: "認識我們",
                subs: [
                    {
                        title: "使命與願景",
                        url: "about.html"
                    },{
                        title: "主管團隊",
                        url: "about_directors.html"
                    },{
                        title: "生物檢體數量",
                        url: "about_biodata.html"
                    },{
                        title: "個資及資安",
                        url: "about_is.php"
                    },{
                        title: "歷史",
                        url: "about_history.php"
                    },{
                        title: "相關規範",
                        url: "about_regulations.php"
                    },{
                        title: "倫理委員會",
                        url: "about_egc.php"
                    }
                ]
            },{
                heading: "話題分享",
                subs: [
                    {
                        title: "動態追蹤",
                        url: "news.php"
                    },{
                        title: "健談智庫",
                        url: "news_health.php"
                    },{
                        title: "推廣園地",
                        url: "news_pub.html"
                    }
                ]
            },{
                heading: "參加指南",
                subs: [
                    {
                        title: "參與須知",
                        url: "attendance_intro.html"
                    },{
                        title: "駐站資訊",
                        url: "attendance_locs.php"
                    },{
                        title: "滿意度調查",
                        url: "attendance_stf.php"
                    },{
                        title: "常見問答",
                        url: "attendance_qa.html"
                    },{
                        title: "變更資訊",
                        url: "attendance_change.html"
                    },{
                        title: "相關下載",
                        url: "attendance_fd.php"
                    }
                ]
            },{
                heading: "資料釋出",
                subs: [
                    {
                        title: "資料釋出成果",
                        url: "dtrls.php"
                    },{
                        title: "資料釋出連結",
                        url: "dtrls_link.html"
                    }
                ]
            }
        ]
        return {
            pages: pages,
            mobileShow: false,
            lastScrollTop: 0
        }
    },
    computed: {
        childIsScrollDown(){
            let childIsScrollDown = this.isScrollDown
            if (this.mobileShow){
                childIsScrollDown = false
            }
            return childIsScrollDown
        }
    },
    methods: {
        openMobile(){
            this.mobileShow = true
            this.$emit('mobile-is-open')
        },
        closeMobile(){
            this.mobileShow = false
            TweenMax.to(".scroll", .5, {
                y: 0
            })
            this.$emit('mobile-is-close')
        },
        toggleSubs(id, evt){
            let el = evt.currentTarget
            let subs = el.querySelector("ul")
            let subPage = subs.querySelectorAll("li")
            let subsHeight = Array.from(subPage).map(el => el.clientHeight + 24)
            let resultHeight = subsHeight.reduce((a,b)=>a+b)
            if (el.classList.contains("is-open")){
                el.classList.remove("is-open")
                subs.style.height = '0px'
            }else{
                el.classList.add("is-open")
                subs.style.height = resultHeight+'px'
            }
        }
    }
}

Vue.component("my-header", Header)

const Snake = {
    template: `
    <div class="snake-banner" :class="{ 'hide' : childIsScrollDown }">
    <p class="t-z-2 m-0">＊ 每天02：00～03：00為系統更新時間，此期間暫停報名事宜</p>
    <button><img src="/assets/img/icons/close.svg" alt="close" class="icon" @click="closeSnake"></button>
    </div>
    `,
    data(){
        return {
            childIsScrollDown: this.isScrollDown,
        }
    },
    props: {
        isScrollDown: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        isScrollDown(){
            this.childIsScrollDown = true
        }
    },
    methods: {
        closeSnake(){
            this.childIsScrollDown = true
        }
    }
}

Vue.component("snake", Snake)


const Table = {
    template: `
    <div class="my-table">
    <nav class="dpd-container" :style="hasFilter?'':hideFilter">
        <span class="dpd-head">{{nowFilter}}
            <div class="icon-container">
                <img src="assets/img/icons/arrow_down.svg" alt="" class="icon">
                <img src="assets/img/icons/arrow_down.svg" alt="" class="icon">
            </div>
        </span>
        <ul class="dpd-lists">
            <li class="dpd-list" v-for="filter of filters" @click="filterTable(filter)">{{filter}}</li>
        </ul>
    </nav>
    <div class="my-table-container">
        <table class="table">
            <thead class="table-heads">
                <tr class="table-head">
                    <th v-for="head of tableContent.heads">{{head}}</th>
                </tr>
            </thead>
            <tbody class="table-rows" :class="{'striped':isStriped}" v-for="(newTable, idx) of newTables" v-show="idx == nowTable" :key="newTable.key">
                <tr v-for="(row, value, idx) of newTable.rows">
                    <td><span v-if="row.name">{{row.name}}</span></td>
                    <td><span v-if="row.addr">{{row.addr}}</span></td>
                    <td><span v-if="row.county">{{row.county}}</span></td>
                    <td><span v-if="row.tele">{{row.tele}}</span></td>
                    <td><span v-if="row.fax">{{row.fax}}</span></td>
                    <td><a :href="row.link" target="_blank" v-if="row.link">連結</a></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="my-paginations">
        <button class="pagination" :class="{ 'active' : nowTable == idx }" v-for="(locatePage, idx) of newTables" @click="changePage(idx)">{{idx+1}}</button>
    </div>
    </div>
    `,
    props: {
        tableContent: {
            type: Object,
            default(){
                return {}
            }
        },
        hasFilter: {
            type: Boolean,
            default: true
        },
        isStriped: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        newTables(){
            let [newTables, showCount, filterRows] = [[], 8, []]
            filterRows = this.tableContent.rows
            if (this.nowFilter !== "全台灣"){
                filterRows = this.tableContent.rows.filter(el=>el.county == this.nowFilter)
            }
            for (let i=0; i<Math.ceil(filterRows.length/showCount); i++){
                newTables.push(
                    {
                        rows: filterRows.slice(i*showCount,(i+1)*showCount),
                        key: Math.random()+i
                    }
                )
            }
            return newTables
        },
        filters(){
            let filters = ["全台灣"]
            this.tableContent.rows.forEach(el=>{
                filters.push(el.county)
            })
            filters = [...new Set(filters)]
            return filters
        }
    },
    data(){
        return {
            nowTable: 0,
            nowFilter: "全台灣",
            hideFilter: {
                display: 'none'
            }
        }
    },
    methods: {
        changePage(id){
            this.nowTable = id
        },
        filterTable(filter){
            this.nowFilter = filter
            this.changePage(0)
        },
    }
}

Vue.component('my-table', Table)


const JobTable = {
    template: `
    <div class="my-table">
    <nav class="dpd-container" :style="hasFilter?'':hideFilter">
        <span class="dpd-head">{{nowFilter}}
            <div class="icon-container">
                <img src="assets/img/icons/arrow_down.svg" alt="" class="icon">
                <img src="assets/img/icons/arrow_down.svg" alt="" class="icon">
            </div>
        </span>
        <ul class="dpd-lists">
            <li class="dpd-list" v-for="filter of filters" @click="filterTable(filter)">{{filter}}</li>
        </ul>
    </nav>
    <div class="my-table-container wide">
        <table class="table">
            <thead class="table-heads">
                <tr class="table-head">
                    <th v-for="head of tableContent.heads" :style="{ 'width' : head.width }">{{ head.th }}</th>
                </tr>
            </thead>
            <tbody class="table-rows" :class="{'striped':isStriped}" v-for="(newTable, idx) of newTables" v-show="idx == nowTable" :key="newTable.key">
                <tr v-for="row of newTable.rows">
                    <td class="table-row" v-if="row.branch">{{row.branch}}</td>
                    <td class="table-row" v-if="row.jobTitle">{{row.jobTitle}}</td>
                    <td class="table-row" v-if="row.jobContent">{{row.jobContent}}</td>
                    <td class="table-row" v-if="row.start">{{row.start}}</td>
                    <td class="table-row" v-if="row.end">{{row.end}}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="my-paginations">
        <button class="pagination" :class="{ 'active' : nowTable == idx }" v-for="(locatePage, idx) of newTables" @click="changePage(idx)">{{idx+1}}</button>
    </div>
    </div>
    `,
    props: {
        tableContent: {
            type: Object,
            default(){
                return {}
            }
        },
        hasFilter: {
            type: Boolean,
            default: true
        },
        isStriped: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        newTables(){
            let [newTables, showCount, filterRows] = [[], 8, []]
            filterRows = this.tableContent.rows
            if (this.nowFilter !== "全部"){
                filterRows = this.tableContent.rows.filter(el=>el.county == this.nowFilter)
            }
            for (let i=0; i<Math.ceil(filterRows.length/showCount); i++){
                newTables.push(
                    {
                        rows: filterRows.slice(i*showCount,(i+1)*showCount),
                        key: Math.random()+i
                    }
                )
            }
            return newTables
        },
        filters(){
            let filters = ["全部"]
            this.tableContent.rows.forEach(el=>{
                filters.push(el.county)
            })
            filters = [...new Set(filters)]
            return filters
        }
    },
    data(){
        return {
            nowTable: 0,
            nowFilter: "全部",
            hideFilter: {
                display: 'none'
            }
        }
    },
    methods: {
        changePage(id){
            this.nowTable = id
        },
        filterTable(filter){
            this.nowFilter = filter
            this.changePage(0)
        },
    }
}

Vue.component('job-table', JobTable)


const Meshi = {
    template: `
    <div class="my-meshi">
        <div class="content">
            <div class="descrip">
                <p class="title mb-1">
                    <span class="d-block">{{ name }}</span>
                    <span> {{ engName }} </span>
                </p>
                <p class="t-z-2">{{ jobTitle }}</p>
            </div>
            <figure>
                <div class="mask">
                    <img :src="portrait" alt="">
                </div>
            </figure>
        </div>
        <a :href="url" class="my-link" target="_blank">
            <div class="icon-container">
                <img :src="iconUrl" class="icon">
                <img :src="iconUrl" class="icon">
            </div>
        </a>
    </div>
    `,
    props: {
        url: {
            type: String,
            default: ""
        },
        portrait: {
            type: String,
            default: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"
        },
        name: {
            type: String,
            default: "你的名字"
        },
        jobTitle: {
            type: String,
            default: "職稱"
        },
        engName: {
            type: String,
            default: "Your Name"
        }
    },
    data(){
        return{
            iconUrl: "assets/img/icons/arrow_rightTop_ht.svg"
        }
    }
}

Vue.component("my-meshi", Meshi)


const News = {
    template: `
    <div class="my-news">
        <a :href="url" target="_blank">
            <div class="cover">
                <figure>
                    <img :src="cover" alt="">
                </figure>
                <span class="cate" v-if="cate">{{ cate }}</span>
                <div class="my-link">
                    <div class="icon-container">
                        <img :src="iconUrl" class="icon">
                        <img :src="iconUrl" class="icon">
                    </div>
                </div>
            </div>
            <div class="text">
            <h6 class="t-z-4">{{ title }}</h6>
            <p class="t-z-3 t-c-g" v-if="subTitle" style="margin-top: 8px;">{{ subTitle }}</p>
            <p class="t-z-1 t-c-g" v-if="date">{{ date }}</p>
            </div>
        </a>
    </div>
    `,
    props: {
        url: {
            type: String,
            default: "https://www.twbiobank.org.tw/new_web/"
        },
        cover: {
            type: String,
            default: "./assets/img/news/default-news.jpg"
        },
        cate: {
            type: String
        },
        title: {
            type: String,
            default: "新聞標題"
        },
        subTitle: {
            type: String
        },
        date: {
            type: String
        }
    },
    data(){
        return{
            iconUrl: "assets/img/icons/arrow_rightTop_ht.svg"
        }
    }
}

Vue.component('my-news', News)

const Carousel = {
    template: `
    <div class="overlay" v-if="childOpen">
        <div class="step-descrip">
            <div class="close">
                <img src="assets/img/icons/close_dark.svg" alt="" @click="closeCarousel">
            </div>
            <transition-group name="fade">
                <div class="row" v-for="(step, idx) of steps" :key="step.count" v-show="idx+1 == childStep">
                    <div class="col col-12 col-lg-5">
                        <img :src="step.imgLink" alt="">
                    </div>
                    <div class="col col-12 col-lg-7 d-flex aic">
                        <div>
                            <span class="d-block">{{ step.count }}</span>
                            <h4>{{ step.name }}</h4>
                            <p v-html="step.content"></p>
                        </div>
                    </div>
                </div>
            </transition-group>
            <div class="btn-controls">
                <button @click="prevStep">＜</button>
                <button @click="nxtStep">＞</button>
            </div>
        </div>
    </div>
    `,
    props: {
        carouselOpen: {
            type: Boolean,
            default: false
        },
        steps: {
            type: Array,
            default(){
                return []
            }
        },
        nowStep: {
            type: Number,
            default: 1
        }
    },
    computed: {
        childOpen(){
            return this.carouselOpen
        }
    },
    watch: {
        childOpen(){
            if (this.childOpen){
                this.childStep = this.nowStep
            }
        }
    },
    data(){
        return {
            childStep: this.nowStep,
        }
    },
    methods: {
        nxtStep(){
            this.childStep ++
            if (this.childStep >= 10){
                this.childStep = 9
            }
        },
        prevStep(){
            this.childStep --
            if (this.childStep <= 0){
                this.childStep = 1
            }
        },
        closeCarousel(){
            if (this.childOpen){
                this.childOpen = false
            }
            this.$emit('close-carousel')
        }
    }
}

Vue.component('my-carousel', Carousel)


const Tabs = {
    template: `
    <div class="tab-container">
        <div class="tab-head-container">
            <div class="tabs" v-for="(tab, idx) of tabs">
                <button :class="{ 'active': nowTab == idx }" @click="switchTab(idx)">{{ tab }}</button>
            </div>
        </div>
    </div>
    `,
    props: {
        tabs: {
            type: Array,
            default(){
                return [ "tab1", "tab2"]
            }
        }
    },
    data(){
        return {
            nowTab: 0
        }
    },
    methods: {
        switchTab(id){
            this.nowTab = id
            this.$emit('switch-tab', id)
        }
    }
}

Vue.component('my-tabs', Tabs)


const KOL = {
    template: `
    <div class="kol-card">
        <div class="img-container">
            <img :src="imgSrc" alt="">
        </div>
        <div class="head">
            <h4 class="t-z-4 t-w-5">{{ title }}</h4>
            <h3 class="t-z-6">{{ name }}</h3>
        </div>
        <div class="content t-a-j">
            <h5 class="t-z-5 mb-1">{{ contentTitle }}</h5>
            <p>{{ content }}</p>
        </div>
    </div>
    `,
    props: {
        title: {
            type: String,
            default: "職稱"
        },contentTitle: {
            type: String,
            default: "內文標題"
        },name: {
            type: String,
            default: "名字"
        },content: {
            type: String,
            default: "說的話"
        },imgSrc: {
            type: String,
            default: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"
        }
    },
    data(){
        return {}
    }
}

Vue.component('kol', KOL)


const ButtonControlls = {
    template: `
    <div class="btn-controls">
        <button @click="prev" class="ctrl"> ＜ </button>
        <button @click="next" class="ctrl"> ＞ </button>
        <button @click="pause" class="ctrl" v-if="hasPaused"> {{ pausedOrNot }} </button>
    </div>
    `,
    props: {
        duration: {
            type: Number,
            default: 1000
        },
        hasPaused: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            // paused: false,
            pausedOrNot: "||",
            autoMode: true
        }
    },
    created(){
        this.$emit('auto-play', this.duration)
    },
    methods: {
        prev(){
            // if (this.paused){
            //     // this.paused = false
            //     this.pausedOrNot = "||"
            // }
            this.$emit('prev')
        },
        next(){
            // if (this.paused){
            //     // this.paused = false
            //     this.pausedOrNot = "||"
            // }
            this.$emit('next')
        },
        pause(){
            if (this.autoMode){
                this.pausedOrNot = "▶"
            }else{
                this.pausedOrNot = "||"
            }
            this.autoMode = !this.autoMode
            // this.paused = !this.paused
            this.$emit('pause')
        }
    }
}

Vue.component('btn-controls', ButtonControlls)


const StageCarousel = {
    template: `
    <div class="stage-carousel-container">
        <div class="carousel">
            <btn-controls :duration="3000" @prev="handlePrev" @next="handleNext" @pause="handlePause" @auto-play="handleAuto"></btn-controls>
            <transition-group name="fade">
                <div class="row vue-transition" v-for="kol of computedKols" v-show="kol.no == nowShow" :key="kol.no">
                    <kol :title="kol.title" :name="kol.name" :content="kol.content" :img-src="kol.imgSrc" :content-title="kol.contentTitle"></kol>
                </div>
            </transition-group>
        </div>
    </div>
    `,
    props: {
        kols: {
            type: Array,
            default(){
                return [
                    {
                        title: "職稱",
                        name: "姓名",
                        content: "說了什麼",
                        imgSrc: ""
                    }
                ]
            }
        }
    },
    computed: {
        computedKols(){
            let arr = this.kols
            arr.forEach((el, id)=>{
                el.no = id
            })
            return arr
        }
    },
    data(){
        return {
            nowShow: 0,
            manual: false,
            paused: false,
            autoMode: true,
        }
    },
    methods: {
        autoPlay(){
            // if (!this.manual && !this.paused){
            //     if (this.nowShow < this.kols.length-1){
            //         this.nowShow ++
            //     }else{
            //         this.nowShow = 0
            //     }
            // }else if (this.manual && !this.paused){
            //     setTimeout(()=>{
            //         this.manual = false
            //     }, 1500)
            // }
            if (this.autoMode){
                if (this.nowShow < this.kols.length-1){
                    this.nowShow ++
                }else{
                    this.nowShow = 0
                }
            }
        },
        handleAuto(duration){
            setInterval(this.autoPlay, duration)
        },
        handlePrev(){
            this.nowShow --
            if (this.nowShow < 0){
                this.nowShow = this.kols.length-1
            }
            this.manual = true
            // this.paused = false
        },
        handleNext(){
            this.nowShow ++
            if (this.nowShow > this.kols.length-1){
                this.nowShow = 0
            }
            this.manual = true
            // this.paused = false
        },
        handlePause(){
            // this.paused = !this.paused
            this.autoMode = !this.autoMode
        }
    }
}

Vue.component('my-stage-carousel', StageCarousel)

const AsideNav = {
    template: `
    <aside class="aside" :class="{ 'scroll-over': nowScrollOver }">
        <div class="head d-flex">
            <div class="line"></div>
            <h3>{{ pageTitle }}</h3>
        </div>
        <ul>
            <li v-for="(page, idx) of pages" @click="toggleSubs(idx, $event)" class="aside-nav">
                <span class="heading" :class="{ 'active':nowHeading == page.heading}" @click="switchPage(page)">{{page.heading}}</span>
                <ul class="subs">
                    <li v-for="sub of page.subs">{{sub}}</li>
                </ul>
            </li>
        </ul>
    </aside>
    `,
    props: {
        pageTitle: {
            type: String,
            default: "網頁標題"
        },
        pages: {
            type: Array,
            default(){
                return [
                    {
                        heading: "分類1",
                    },{
                        heading: "分類2",
                        subs: ["2-1", "2-2", "2-3"]
                    },{
                        heading: "分類3"
                    }
                ]
            }
        }
    },
    data(){
        return {
            nowHeading: this.pages[0].heading,
            nowScroll: 0,
            nowScrollOver: false
        }
    },
    methods:{
        toggleSubs(id, evt){
            if (this.pages[id].subs){
                let el = evt.currentTarget
                let subs = el.querySelector("ul")
                let subPage = subs.querySelectorAll("li")
                let subsHeight = Array.from(subPage).map(el => el.clientHeight + 24)
                let resultHeight = subsHeight.reduce((a,b)=>a+b)
                if (el.classList.contains("is-open")){
                    el.classList.remove("is-open")
                    subs.style.height = '0px'
                }else{
                    el.classList.add("is-open")
                    subs.style.height = resultHeight+'px'
                }
            }
        },
        switchPage(el){
            this.nowHeading = el.heading
            this.$emit('aside-switch', el.heading)
        },
        updatScroll(){
            let st = window.pageYOffset || document.documentElement.scrollTop
            if (this.nowScroll > 100){
                console.log("over")
                this.nowScrollOver = true
            }else{
                this.nowScrollOver = false
            }
            this.nowScroll = st
        }
    },
    created(){
        window.addEventListener('scroll', this.updatScroll);
    },
    destroyed(){
        window.removeEventListener('scroll', this.updatScroll);
    }
}

Vue.component("my-aside-nav", AsideNav)

const progressBar  = {
    template: `
        <div class='progress-container'>
            <div class="nodes">
                <div class="node active"></div>
                <div class="node"></div>
                <div class="node"></div>
                <div class="node"></div>
            </div>
            <div class="base">
                <div class="progress" :style="{ 'width': progress }"></div>
            </div>
        </div>
    `,
    props: {
        comNowSlide: {
            type: Number,
            default: 1
        }
    },
    watch: {
        comNowSlide: function(){
            let nodes = document.querySelector(".progress-container").querySelectorAll(".node")
            let nodesArr = [...nodes]
            nodesArr.forEach(node => {
                node.classList.remove("active")
            })
            for (let i =0; i<this.comNowSlide; i++){
                nodesArr[i].classList.add("active")
            }
        }
    },
    computed: {
        progress(){
            return (this.comNowSlide-1) * 33.3 + "%"
        }
    },
    data: function(){
        return {
        }
    },
    methods: {
        toStep: function(el){
            this.clickProgress(el)
        },
        clickProgress(val){
            this.$emit('progress-click', val)
        }
    }
}

Vue.component('progress-bar', progressBar)