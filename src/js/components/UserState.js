const UserState = {
    template: `
    <div id="userState">
        <section>
            <h4>綠洲散步</h4>
            <div v-for="el of explors" class="d-flex">
                <img :src="el.finished ? './src/img/icons/checked.svg' : './src/img/icons/checked_hover.svg'" class="icon mr-1 d-inline-block"/>
                <span v-if="el.finished" class="t-z-2">走遍{{el.name}}了！</span>
                <span v-else class="t-z-2">{{el.name}}還有沒認識的鄰居喔</span>
            </div>
        </section>
        <h4>每日街道清掃：{{userGotTrashes.length}}/{{dailyTrashes.length}}</h4>
        <h4>街道環境維護：{{userJudges.length}}/{{dailyGuys.length}}</h4>
    </div>
    `,
    props: ['achievements', 'userAchieved', 'dailyTrashes', 'dailyGuys', 'userGotTrashes', 'userJudges'],
    data(){
        return {}
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
        }
    }
}

Vue.component('user-state', UserState)