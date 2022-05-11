const vm = new Vue({
    el: "#app",
    data: {
        interaction: {
            nowClicked: false,
            nowLoading: true,
            showPopup: false,
            showPersonalPage: false,
            showHouse: false,
            houseName: "",
            nowAns: true
        },
        sys: {
            popup: false,
            say: "",
            hints: []
        },
        bgSound: undefined,
        bgIsPlaying: false,
        dailyTrashes: [],
        dailyGuys: [],
        adoptable: false,
        showProgram: false,
        showMissionBtn: false,
        btnTxt: "關閉",
        nowSpeak: undefined,
        itemSpeak: undefined,
        nowNPC: undefined,
        npcShowLink: {},
        achievement: {
            map: {
                block1: [],
                block2: [],
                block3: [],
            },
            descrips: {}
        },
        adoptions: [],
        user: {
            missions: {
                mission1: [],
                mission2: [],
                mission3: [],
            },
            achievements: {
                block1: [],
                block2: [],
                block3: [],
            },
            gotTrashes: [],
            gotSpecial: false,
            coins: 9999,
            furnitures: [],
            adoptions: [],
            judges: []
        },
        userRecord: {}
    },
    computed: {
        firstShouldShow(){
            if (Object.values(this.userRecord).length <= 2){
                Object.values(this.userRecord).forEach(el => {
                    if (el.length !== 0){
                        return false
                    }
                })
                return true
            }else return false
        },
        itemSpeakImgSrc() {
            if (this.itemSpeak !== undefined) {
                return `src/img/${this.itemSpeak}.png`
            }
        },
        finishedProgress() {
            if (this.nowNPC) {
                return this.user.missions[`mission${this.nowNPC.mission}`].length
            } else return
        },
        // userGotBadges() {
        //     let badges = {
        //         mission1: false,
        //         mission2: false,
        //         mission3: false
        //     }
        //     for (let prop in this.user.missions) {
        //         if (this.user.missions[prop].indexOf('finished') !== -1) {
        //             badges[prop] = true
        //         }
        //     }
        //     return badges
        // },
        userGotAchievements() {
            let output = {}
            let maps = 0
            for (prop in this.achievement.map) {
                maps++
            }
            for (let i = 0; i < maps; i++) {
                let map = this.achievement.map[`block${i + 1}`]
                let userGotArr = this.user.achievements[`block${i + 1}`]
                if (userGotArr.length > 0) {
                    if (map.length == userGotArr.length && map.every(val => userGotArr.includes(val))) {
                        let blockName = ""
                        switch (i + 1) {
                            case 1:
                                blockName = "文藝生活區"
                                break;
                            case 2:
                                blockName = "慢活甜點區"
                                break;
                            case 3:
                                blockName = "職人區"
                                break;
                        }
                        output[`block${i + 1}`] = `${blockName}finished！`
                    } else {
                        output[`block${i + 1}`] = `尚未探索完區域${i + 1}`
                    }
                } else {
                    output[`block${i + 1}`] = `區域${i + 1}尚未開始`
                }
            }
            return output
        },
        missionBtns() {
            if (this.showMissionBtn) {
                let btns = this.showMissionBtn.split("+") //包有多個選項內容的陣列
                let arr = []
                btns.forEach(btn => {
                    let obj = {}
                    if (btn.indexOf("Y") !== -1) { //確認是不是對的選項
                        obj.option = btn.slice(-btn.length, -1)
                        obj.correct = true
                    } else {
                        obj.option = btn
                    }
                    arr.push(obj)
                })
                return arr
            } else return
        }
    },
    created() {
        // prepare for recording token
        Vue.prototype.$bus = new Vue()
        this.$bus.$on('record-token', (token)=>{
            this.storageData('token', token)
        })
        // fetch data from localStorage
        for (prop in this.user) {
            let record = JSON.parse(localStorage.getItem(prop))
            if (record) {
                this.userRecord[prop] = record
                this.user[prop] = record
            } else {
                console.log(`no record of ${prop}`)
            }
        }
        // fetch data from API
        // this.doGetUser()
        // dailyTrashes storage
        let recorddailyTrashes = JSON.parse(localStorage.getItem('dailyTrashes'))
        if (recorddailyTrashes){
            this.dailyTrashes = recorddailyTrashes
        }
        // dailyGuys storage
        let recorddailyGuys = JSON.parse(localStorage.getItem('dailyGuys'))
        if (recorddailyGuys){
            this.dailyGuys = recorddailyGuys
        }
    },
    mounted() {
        console.log("vue completed load")
        this.autoBgMusic()
        // 定時儲存
        // window.setInterval(()=>{
        //     this.doPostUser()
        // }, 30000)
    },
    watch: {
        'user.missions': {
            handler: function (newValue, oldValue) {
                for (prop in newValue) {
                    if (newValue[prop].join().indexOf("finished") !== -1) {
                        console.log("任務資料完成的變動，開始儲存")
                        let d = JSON.stringify(newValue)
                        this.storageData('missions', d)
                    }
                }
            },
            deep: true
        },
        'user.achievements': {
            handler: function (newValue, oldValue) {
                console.log("區塊發現資料有變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('achievements', d)
            },
            deep: true
        },
        'user.furnitures': {
            handler: function (newValue, oldValue) {
                console.log("家具資料有變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('furnitures', d)
            }
        },
        'user.coins': {
            handler: function (newValue, oldValue) {
                console.log("蝸牛幣資料有變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('coins', d)
            }
        },
        'user.adoptions': {
            handler: function (newValue, oldValue) {
                console.log("認養資料有變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('adoptions', d)
            }
        },
        'user.gotTrashes': {
            handler: function (newValue, oldValue) {
                console.log("每日撿垃圾資料有變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('gotTrashes', d)
            }
        },
        'user.gotSpecial': {
            handler: function (newValue, oldValue) {
                console.log("特殊蝸牛資料變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('gotSpecial', d)
            }
        },
        'user.judges': {
            handler: function (newValue, oldValue) {
                console.log("評價好壞的資料有變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('judges', d)
            }
        },
        'dailyTrashes': {
            handler: function (newValue, oldValue) {
                console.log("每日垃圾總量有變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('dailyTrashes', d)
            }
        },
        'dailyGuys': {
            handler: function (newValue, oldValue) {
                console.log("每日Guys總量有變動，開始儲存")
                let d = JSON.stringify(newValue)
                this.storageData('dailyGuys', d)
            }
        },
        'bgIsPlaying': {
            handler: function (newValue, oldValue) {
                if (!newValue){
                    this.bgSound.stop()
                }else{
                    this.bgSound.play()
                }
            }
        }
    },
    methods: {
        autoBgMusic(){
            let sound = PIXI.sound.Sound.from({
                url: 'src/sounds/bgm_clip.m4a',
                autoPlay: this.bgIsPlaying,
                loop: true,
                preload: true,
            });
            this.bgSound = sound
        },
        switchPopup() {
            this.interaction.showPopup = !this.interaction.showPopup
            this.npcShowLink = {}
            //如果點到講廢話的NPC然後關閉視窗
            if (this.nowNPC.enterGame !== 1 && this.nowNPC.mission && this.user.achievements[`block${this.nowNPC.mission}`].indexOf(this.itemSpeak) == -1) {
                this.user.achievements[`block${this.nowNPC.mission}`].push(this.itemSpeak)
            }
            //如果遊戲講話到一半的NPC被關閉
            if (this.nowNPC.enterGame == 1 && this.finishedProgress + 1 < this.nowNPC.gameSpeaks.length) {
                this.user.missions[`mission${this.nowNPC.mission}`] = []
            }
            window.setTimeout(() => {
                this.showProgram = false
            }, 100)
        },
        switchPersonalPage() {
            this.interaction.showPersonalPage = !this.interaction.showPersonalPage
        },
        switchHousePage() {
            this.interaction.showHouse = !this.interaction.showHouse
        },
        switchBg(value){
            this.bgIsPlaying = value
        },
        switchMsg(){
            console.log("關閉留言板")
        },
        switchProgram() {
            this.showProgram = true
        },
        startGame() {
            this.interaction.nowLoading = false
        },
        checkAns(correct) {
            if (correct) {
                this.pureNext()
                this.interaction.nowAns = true
            } else {
                this.nowSpeak = this.nowNPC.gameSpeakN
                this.btnTxt = "關閉"
                this.showMissionBtn = undefined
                this.interaction.nowAns = false
            }
        },
        pureNext() {
            if (!this.interaction.nowAns) { //已經答錯了，要關閉視窗
                this.switchPopup()
                return
            }
            // 以下是正常運作對話進度
            if (this.nowNPC.gameSpeaks) {
                if (this.user.missions[`mission${this.nowNPC.mission}`].indexOf('finished') == -1) {
                    if (this.finishedProgress + 1 < this.nowNPC.gameSpeaks.length) {// 判斷對話結束了沒
                        this.user.missions[`mission${this.nowNPC.mission}`].push(this.nowNPC.name) //推進到下一步
                        if (this.nowNPC.gameOptions && this.nowNPC.gameOptions[this.finishedProgress]) { // 判斷目前的進展有沒有遊戲選項
                            this.showMissionBtn = this.nowNPC.gameSpeaks[this.finishedProgress]
                        } else {
                            // 顯示對話內容
                            this.nowSpeak = this.nowNPC.gameSpeaks[this.finishedProgress]
                            this.showMissionBtn = undefined
                        }
                        // 判斷是不是有連結要顯示
                        if (this.nowNPC.link.shows && this.nowNPC.link.shows[this.finishedProgress]) {
                            let linkNum = 0
                            for (let i = 0; i < this.finishedProgress; i++) {
                                if (this.nowNPC.link.shows[i] == 1) {
                                    linkNum++
                                }
                            }
                            if (this.nowNPC.link.names){
                                this.npcShowLink.name = this.nowNPC.link.names[linkNum]
                            }else{
                                this.npcShowLink.name = '測試外部連結'
                            }
                            this.npcShowLink.url = this.nowNPC.link.urls[linkNum]
                        } else {
                            this.npcShowLink = {} //關閉顯示外部連結
                        }
                        // 判斷是否要換說話的圖片
                        if (this.nowNPC.gameImgs && this.nowNPC.gameImgs[this.finishedProgress]){
                            this.itemSpeak = "snail_hito"
                        }else{
                            let origin
                            if (this.nowNPC.name.indexOf('house') !== -1){
                                origin = this.nowNPC.name.slice(0,-6)
                            }else {
                                origin = this.nowNPC.name
                            }
                            this.itemSpeak = origin
                        }
                        // 判斷是不是倒數
                        if (this.finishedProgress + 1 == this.nowNPC.gameSpeaks.length) {
                            this.btnTxt = "關閉"
                            // 判斷是不是有認養方案
                            if (this.nowNPC.adoptable){
                                this.adoptable = true
                            }
                        }
                    } else if (this.finishedProgress + 1 == this.nowNPC.gameSpeaks.length) { //正要結束
                        this.user.missions[`mission${this.nowNPC.mission}`].push('finished') //記錄結束
                        this.switchPopup()
                        this.user.achievements[`block${this.nowNPC.mission}`].push(this.itemSpeak)
                        this.checkBlockFinished()
                    }
                } else this.switchPopup()
            } else if (this.nowNPC.mission) { //廢話黨
                let preparedName = this.itemSpeak
                if (this.user.achievements[`block${this.nowNPC.mission}`].indexOf(preparedName) == -1) {
                    this.user.achievements[`block${this.nowNPC.mission}`].push(preparedName)
                    console.log("HI, now preparedName is: "+preparedName)
                    // 判斷對話完後自己這區有沒有完成
                    this.checkBlockFinished()
                }
                this.switchPopup()
            } else {
                // 沒有加入探索的蝸牛們
                this.switchPopup()
            }
        },
        storageData(key, value) {
            localStorage.setItem(key, value)
        },
        showSysTxt(txt, abs='', imgUrl='') {
            this.sys.popup = true
            this.sys.say = txt
            this.sys.abs = abs
            this.sys.img = imgUrl
        },
        closeSysTxt(){
            this.sys.popup = false
            this.sys.say = ""
            this.sys.img = ""
            this.sys.abs = ""
        },
        checkBlockFinished() {
            if (this.userGotAchievements[`block${this.nowNPC.mission}`].indexOf("finished") !== -1) {
                blockFinished = this.nowNPC.mission
                window.setTimeout(() => {
                    let output, badgeURl
                    switch (blockFinished) {
                        case 1:
                            output = "文藝生活區",
                            badgeURl = "badge_lit"
                            break;
                        case 2:
                            output = "慢活甜點區",
                            badgeURl = "badge_des"
                            break;
                        case 3:
                            output = "職人區",
                            badgeURl = "badge_tra"
                    }
                    this.showSysTxt(`探索完${output}了！可以新增${output}的家具到房間裡囉`, '區域探索完成！', `./src/img/${badgeURl}.png`)
                }, 800)
            }
        },
        shiftHint(){
            this.sys.hints[0].hide = true
            window.setTimeout(()=>{
                this.sys.hints.shift()
            }, 800)
        },
        doPostUser() {
            console.log(`Bearer ${localStorage.token}`)
            axios({
                method: "POST",
                url: "http://localhost:8000/user",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    authorization: `Bearer ${localStorage.token}`,
                    // "Access-Control-Allow-Origin": "*",
                },
                data: {
                    record: this.user
                }
            }).then((response) => {
                console.log(response.status);
                console.log(response);
            });
        },
        doGetUser() {
            axios({
                method: "GET",
                url: "http://localhost:8000/user",
                headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                authorization: `Bearer ${localStorage.token}`,
                // "Access-Control-Allow-Origin": "*",
                }
            }).then((response) => {
                console.log(response.status);
                console.log(response);
                for (prop in this.user) {
                    let record = response.data[prop]
                    if (record) {
                        this.userRecord[prop] = record
                        this.user[prop] = record
                    } else {
                        console.log(`no record of ${prop}`)
                    }
                }
            });
        },
    },
    beforeDestroy: function() {
        this.$bus.$off('record-token');
    }
})