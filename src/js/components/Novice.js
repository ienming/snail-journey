const NoviceGuide = {
    template: `
    <transition name="fade">
        <div class="mock por" style="z-index: 101;">
            <div class="wrapper flex-column flex-md-row">
                <transition-group name="fade" mode="out-in">
                    <div v-for="(guide, idx) of nowGuides" :key="guide.speak" v-show="idx+1 == nowSpeakStep">
                        <div class="mr-md-2 speak-img">
                            <img alt="" :src="guide.img">
                        </div>
                        <div class="d-flex">
                            <div class="popup dialogue">
                                <div class="scroll">
                                    <div class="game-ui">
                                            <div>
                                                <p v-html="guide.speak"></p>
                                                <div class="t-a-r">
                                                    <button class="my-btn mt-1 outline" @click="nxt">{{btnTxt}}</button>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
    </transition>
    `,
    props: [],
    mounted(){
        this.fetchSpeaks()
        this.fetchSteps()
    },
    data(){
        return {
            guides: [],
            nowSpeakStep: 1,
            btnTxt: '下一步',
            missionSteps: []
        }
    },
    computed: {
        nowGuides(){
            let arr = this.guides.filter(guide => guide.step == vm.$data.interaction.noviceStep)
            return arr
        }
    },
    methods: {
        fetchSpeaks(){
            axios.get("src/data/data_novice.csv", {})
            .then((res) => {
                let rows = res.data.split("\n");
                let keyMap = {};
                for (let i =0; i<rows[0].length; i++){
                    if (rows[0].split(",")[i] !== undefined){
                        keyMap[rows[0].split(",")[i].trim()] = i
                    }
                }
                rows.shift();
                rows.forEach((el) => {
                    let d = el.split(",");
                    let obj = {
                        name: d[keyMap.name],
                        speak: d[keyMap.speak],
                        img: 'src/img/'+d[keyMap.name]+'.png',
                        step: d[keyMap.step]
                    }
                    this.guides.push(obj)
                });
            })
            .catch((error) => { console.error(error) })
        },
        fetchSteps(){
            axios.get("src/data/data_novice_step.csv", {})
            .then((res) => {
                let rows = res.data.split("\n");
                let keyMap = {};
                for (let i =0; i<rows[0].length; i++){
                    if (rows[0].split(",")[i] !== undefined){
                        keyMap[rows[0].split(",")[i].trim()] = i
                    }
                }
                rows.shift();
                rows.forEach((el) => {
                    let d = el.split(",");
                    let obj = {
                        step: d[keyMap.step],
                        title: d[keyMap.title],
                        content: d[keyMap.content],
                    }
                    this.missionSteps.push(obj)
                });
            })
            .catch((error) => { console.error(error) })
        },
        nxt(){
            if (this.nowSpeakStep < this.nowGuides.length){
                this.nowSpeakStep ++
            }else{
                let nowMissionStep = this.missionSteps.findIndex(el=>el.step == vm.$data.interaction.noviceStep)
                if (nowMissionStep >= 0){
                    let obj = {}
                    obj.title = this.missionSteps[nowMissionStep].title
                    obj.content = this.missionSteps[nowMissionStep].content
                    vm.showSysTxt(obj.content, obj.title, obj.img)
                    this.$emit('close-novice-guide', obj)
                }else{
                    this.$emit('close-novice-guide')
                }
            }
        }
    }
}

Vue.component('novice-guide', NoviceGuide)