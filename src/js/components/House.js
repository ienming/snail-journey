const House = {
    template: `
    <section class="mock room">
        <div class="room-page">
            <div id="houseCnvsContainer"></div>
            <img src="./src/img/icons/exit.png" alt="離開房間" @click="switchHousePage" class="game-ui icon" />
        </div>
    </section>
    `,
    props: ['npc'],
    data(){
        return {
            pixi: {
                app: undefined,
                houseScale: 0,
                originScale: 0.349375 //(719-80*2)/1600 macBook 螢幕大小作為原點
            },
            items: undefined,
            sprites: {}
        }
    },
    computed: {
        hostName(){
            let id = this.npc.name.indexOf("_house")
            return this.npc.name.slice(0, id)
        }
    },
    async mounted(){
        let d = await this.fetchData()
        this.items = d.filter(el=>el.hostName == this.hostName) //過濾不是這間房間的資料
        this.init()
    },
    methods: {
        fetchData: async() => {
            let response;
            try {
                response = await axios
                    .get("src/data/data_house.csv", {})
                    console.log("async completed get House data")
            } catch (e) {
                throw new Error(e.message)
            }

            if (response.data){
                let rows = response.data.split("\n")
                let output = [];
                let keyMap = {};
                for (let i =0; i<rows[0].length; i++){
                    if (rows[0].split(",")[i] !== undefined){
                        keyMap[rows[0].split(",")[i].trim()] = i
                        // console.log("key: "+rows[0].split(",")[i])
                    }
                }
                rows.shift()
                rows.forEach(el=>{
                    let d = el.split(",");
                    let obj = {
                        name: d[keyMap.name],
                        hostName: d[keyMap.host_name],
                        x: d[keyMap.x],
                        y: d[keyMap.y],
                    };
                    output.push(obj)
                })
                return output
            }
        },
        init(){
            let paddingY = 80
            let houseScale = (window.innerHeight-paddingY*2)/1600
            this.pixi.houseScale = houseScale //傳給 global Variable
            let houseCnvsContainer = document.querySelector("#houseCnvsContainer")
            let houseApp = new PIXI.Application({
                backgroundColor: 0xffffff,
                antialias: true,
            })
            houseApp.renderer.resize(1771*houseScale, 1600*houseScale)
            houseCnvsContainer.appendChild(houseApp.view)

            this.pixi.app = houseApp //把 PIXI app 丟到 component 資料裡面變成元件的全域變數
            // 初始化房間背景
            let houseTexture = new PIXI.Texture.from(`./src/img/room.jpg`)
            let house = new PIXI.Sprite(houseTexture)
            house.scale.set(houseScale)
            this.pixi.app.stage.addChild(house)
            // 
            this.pixi.itemsContainer = new PIXI.Container()
            this.pixi.app.stage.addChild(this.pixi.itemsContainer)
            // this.pixi.achievesContainer = new PIXI.Container()
            // this.pixi.app.stage.addChild(this.pixi.achievesContainer)
            // this.pixi.furnituresContainer = new PIXI.Container()
            // this.pixi.app.stage.addChild(this.pixi.furnituresContainer)
            this.draw() //初始化房間
        },
        draw(){
            this.showName()
            this.drawSnail()
            this.drawItems()
        },
        showName(){
            let txt = new PIXI.Text(`歡迎來到${this.hostName}的家`)
            this.pixi.app.stage.addChild(txt)
        },
        drawItems(){
            const loader = PIXI.Loader.shared
            this.items.forEach((item)=>{
                loader.add(item.name, `./src/img/${item.name}.jpg`)
                let obj = {
                    sp: undefined,
                    x: item.x,
                    y: item.y
                }
                this.sprites[item.name] = obj
            })
            loader.load((loader, resources)=>{
                let sp = new PIXI.Sprite(resources.commentBoard.texture)
                this.sprites.commentBoard.sp = sp
                sp.x = this.sprites.commentBoard.x
                sp.y = this.sprites.commentBoard.y
                // this.sprites.displayShelf = new PIXI.Sprite(resources.displayShelf.texture)
            })
            loader.onComplete.add(()=>{
                // draw all sprites
                // for (prop in this.sprites){
                    //     let sp = this.sprites[prop].sp
                    //     this.pixi.itemsContainer.addChild(sp)
                    // }
                this.drawItems()
            })
            this.pixi.itemsContainer.addChild(sp)
        },
        drawSnail(){
            let el = this.npc
            let texture = new PIXI.Texture.from(`./src/img/${this.hostName}.png`)
            let sp = new PIXI.Sprite(texture)
            sp.name = this.hostName
            sp.x = 800*this.pixi.houseScale
            sp.y = 1200*this.pixi.houseScale
            sp.scale.set(this.pixi.houseScale)
            sp.anchor.set(0.5)
            sp.interactive = true
            sp.buttonMode = true
            sp.on("pointerdown", ()=>{
                vm.$data.interaction.showPopup = !vm.$data.interaction.showPopup
                vm.$data.itemSpeak = this.hostName
                if (el.speaks){
                    this.speakRandomly(el)
                }else{
                    vm.$data.nowSpeak = undefined
                }
                if (el.gameSpeaks){
                    this.initMission(el) // 主線探索遊戲邏輯
                }else{
                    // 是否有可以認養的按鈕
                    if (el.adoptable){
                        vm.$data.adoptable = true
                        vm.$data.program = el.program
                        vm.$data.btnTxt = undefined
                    }else{
                        vm.$data.adoptable = false
                        vm.$data.btnTxt = "關閉"
                    }
                    console.log("講一下廢話")
                }
            })
            this.pixi.app.stage.addChild(sp)
        },
        speakRandomly(el){
            let randomSentenceNum = this.getRandom(0, el.speaks.length-1)
            vm.$data.nowSpeak = el.speaks[randomSentenceNum]
        },
        getRandom(min, max){
            return Math.floor(Math.random()*(max-min+1))+min
        },
        initMission(el){
            let nowUserMissionProgress = vm.$data.user.missions[`mission${el.mission}`]
            if (el.mission && nowUserMissionProgress.indexOf('finished') == -1){ //此NPC有任務而且該任務還沒完成
                // 首先確認是不是點到開啟新任務的NPC
                if (el.enterGame == 1 && nowUserMissionProgress.length == 0){ //而且玩家這條任務還沒開啟
                    vm.$data.nowSpeak = el.gameSpeaks[0]
                    vm.$data.btnTxt = "下一步"
                    vm.$data.adoptable = false
                    vm.$data.interaction.nowAns = true
                }
            }else if (el.mission){  // 此 NPC 的任務對話完成了
                // 是否有可以認養的按鈕
                if (el.adoptable){
                    vm.$data.adoptable = true
                    vm.$data.program = el.program
                }else{
                    vm.$data.adoptable = false
                    vm.$data.btnTxt = "關閉"
                }
                console.log(`任務${el.mission}結束，講一下廢話`)
            }
        },
        switchHousePage(){
            this.$emit("switch-house-page")
        }
    }
}

Vue.component('house', House)