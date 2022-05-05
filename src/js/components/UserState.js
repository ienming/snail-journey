const UserState = {
    template: `
    <div id="userState" :class="hide ? 'hide' : ''">
        <div @click="switchUserState" class="icon">
            <img :src="foldImg" />
        </div>
        <h3>蝸牛探險家</h3>
        <p class="t-z-1 mb-1 t-c-g">連續登入：X天</p>
        <p class="t-z-2 t-w-5">每日環境清潔：{{userGotTrashes.length}}/{{dailyTrashes.length}}</p>
        <p class="t-z-2 t-w-5">巷弄秩序維護：{{userJudges.length}}/{{dailyGuys.length}}</p>
        <section>
            <p class="t-z-2 t-w-5">綠洲散步</p>
            <div v-for="el of explors" class="d-flex">
                <img :src="el.finished ? './src/img/icons/checked.svg' : './src/img/icons/checked_notyet.svg'" class="icon mr-1 d-inline-block"/>
                <span v-if="el.finished" class="t-z-2">走遍{{el.name}}了！</span>
                <span v-else class="t-z-2">{{el.name}}還有沒認識的鄰居喔</span>
            </div>
        </section>
    </div>
    `,
    props: ['achievements', 'userAchieved', 'dailyTrashes', 'dailyGuys', 'userGotTrashes', 'userJudges'],
    data(){
        return {
            hide: false
        }
    },
    computed:{
        explors(){
            let arr = []
            for (prop in this.userAchieved){
                let obj = {}, blockName
                switch (prop){
                    case 'block1':
                        blockName = "文藝生活區"
                        break;
                    case 'block2':
                        blockName = "慢活甜點區"
                        break;
                    case 'block3':
                        blockName = "職人區"
                        break;
                }
                obj.name = blockName
                obj.status = this.userAchieved[prop]
                if (obj.status.indexOf("finished") !== -1){
                    obj.finished = true
                }else{
                    obj.finished = false
                }
                arr.push(obj)
            }
            return arr
        },
        foldImg(){
            if (this.hide){
                return './src/img/icons/fold_left.svg'
            }else {
                return './src/img/icons/fold_right.svg'
            }
        }
    },
    methods: {
        switchUserState(){
            this.hide = !this.hide
        }
    }
}

Vue.component('user-state', UserState)