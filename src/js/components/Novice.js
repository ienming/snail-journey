const NoviceGuide = {
    template: `
    <transition name="fade">
        <div class="mock" style="">
            <div class="wrapper flex-column flex-md-row">
                <transition-group name="fade" mode="out-in">
                    <div v-for="(guide, idx) of guides" :key="guide.speak" v-show="idx+1 == nowStep">
                        <div class="mr-md-2 speak-img">
                            <img alt="" :src="guide.img">
                        </div>
                        <div class="d-flex">
                            <div class="popup dialogue">
                                <div class="scroll">
                                    <div class="game-ui">
                                            <div>
                                                <p>{{guide.speak}}</p>
                                                <div class="t-a-r">
                                                    <button class="my-btn mt-1 outline" @click="nxt">{{btnTxt}}</button>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                                <div class="close">
                                    <img src="src/img/icons/close.svg" alt="">
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
        this.fetchData()
    },
    data(){
        return {
            guides: [],
            nowStep: 1,
            btnTxt: '下一步'
        }
    },
    methods: {
        fetchData(){
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
                        img: 'src/img/'+d[keyMap.name]+'.png'
                    }
                    this.guides.push(obj)
                });
            })
            .catch((error) => { console.error(error) })
        },
        nxt(){
            if (this.nowStep < this.guides.length){
                this.nowStep ++
            }else{
                this.$emit('close-novice-guide')
                let title = "新手導引"
                let content = `
                    找到自己家
                `
                let img = "src/img/icons/lightbulb.png"
                vm.showSysTxt(content, title, img)
            }
        }
    }
}

Vue.component('novice-guide', NoviceGuide)