const vm = new Vue({
    el: "#app",
    data: {
        interaction: {
            nowClicked: false,
            nowLoading: true,
            showPopup: false,
            showPersonalPage: false,
            showMsg: false,
            nowAns: true,
            cursorImg: 'src/img/icons/menu.png'
        },
        sys: {
            popup: false,
            say: ""
        },
        adoptable: false,
        program: undefined,
        showProgram: false,
        showMissionBtn: false,
        btnTxt: "關閉",
        nowSpeak: undefined,
        itemSpeak: undefined,
        nowNPC: undefined,
        npcShowLink: {},
        achievementMap: {
            block1: ['snail_mryeh', 'snail_oasis', 'snail_text', 'snail_book', 'snail_paint'],
            block2: ['snail_cinnamon', 'snail_scone', 'snail_dorayaki', 'snail_greenbean'],
            block3: ['board', 'bike'],
        },
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
            coins: 9999,
            furnitures: [],
            adoptions: []
        },
        userRecord: {}
    },
    computed: {
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
        userGotBadges() {
            let badges = {
                mission1: false,
                mission2: false,
                mission3: false
            }
            for (let prop in this.user.missions) {
                if (this.user.missions[prop].indexOf('finished') !== -1) {
                    badges[prop] = true
                }
            }
            return badges
        },
        userGotAchievements() {
            let output = {}
            let maps = 0
            for (prop in this.achievementMap) {
                maps++
            }
            for (let i = 0; i < maps; i++) {
                let map = this.achievementMap[`block${i + 1}`]
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
        },
        showMsgBoard(){
            // if (this.itemSpeak && this.itemSpeak == "board"){
            //     return true
            // }else return false
            //還是不要跟npc混在一起好了
        }
    },
    created() {
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
    },
    mounted() {
        console.log("vue completed load")
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
        }
    },
    methods: {
        switchPopup() {
            this.interaction.showPopup = !this.interaction.showPopup
            this.npcShowLink = {}
            //如果點到講廢話的NPC然後關閉視窗
            if (this.nowNPC.enterGame !== 1 && this.user.achievements[`block${this.nowNPC.mission}`].indexOf(this.nowNPC.name) == -1) {
                this.user.achievements[`block${this.nowNPC.mission}`].push(this.nowNPC.name)
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
                        if (this.nowNPC.link.shows && this.nowNPC.link.shows[this.finishedProgress]) { // 判斷是不是有連結要顯示
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
                        if (this.finishedProgress + 1 == this.nowNPC.gameSpeaks.length) {// 判斷是不是倒數
                            this.btnTxt = "關閉"
                        }
                    } else if (this.finishedProgress + 1 == this.nowNPC.gameSpeaks.length) { //正要結束
                        this.user.missions[`mission${this.nowNPC.mission}`].push('finished') //記錄結束
                        this.switchPopup()
                        this.user.achievements[`block${this.nowNPC.mission}`].push(this.nowNPC.name)
                        this.checkBlockFinished()
                    }
                } else this.switchPopup()
            } else { //廢話黨
                if (this.user.achievements[`block${this.nowNPC.mission}`].indexOf(this.nowNPC.name) == -1) {
                    this.user.achievements[`block${this.nowNPC.mission}`].push(this.nowNPC.name)
                    // 判斷對話完後自己這區有沒有完成
                    this.checkBlockFinished()
                }
                this.switchPopup()
            }
        },
        storageData(key, value) {
            localStorage.setItem(key, value)
        },
        showSysTxt(txt) {
            this.sys.popup = true
            this.sys.say = txt
        },
        checkBlockFinished() {
            if (this.userGotAchievements[`block${this.nowNPC.mission}`].indexOf("finished") !== -1) {
                blockFinished = this.nowNPC.mission
                window.setTimeout(() => {
                    let output
                    switch (blockFinished) {
                        case 1:
                            output = "文藝生活區"
                            break;
                        case 2:
                            output = "慢活甜點區"
                            break;
                    }
                    this.showSysTxt(`探索完${output}了！`)
                }, 800)
            }
        }
    }
})