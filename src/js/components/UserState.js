const UserState = {
    template: `
    <div id="userState" :class="hide ? 'hide' : ''">
        <div @click="switchUserState" class="icon">
            <img :src="foldImg" />
        </div>
        <h3>Snail Explorer</h3>
        <p class="t-z-1 mb-1 t-c-g">Continuously log in：365 days</p>
        <p class="t-z-2 t-w-5">Missions for cleaning up everday：{{userGotTrashes.length}}/{{dailyTrashes.length}}</p>
        <p class="t-z-2 t-w-5">Missions for keep in order：{{userJudges.length}}/{{dailyGuys.length}}</p>
        <section>
            <p class="t-z-2 t-w-5">Wandering in Snail Oasis</p>
            <div v-for="el of explors" class="d-flex">
                <img :src="el.finished ? './src/img/icons/checked.svg' : './src/img/icons/checked_notyet.svg'" class="icon mr-1 d-inline-block"/>
                <span v-if="el.finished" class="t-z-2">Visit all neighborhoods in {{el.name}}！</span>
                <span v-else class="t-z-2">{{el.name}}Have'nt visited all neighborhoods</span>
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
                        blockName = "Literary Area"
                        break;
                    case 'block2':
                        blockName = "Downshifring Area"
                        break;
                    case 'block3':
                        blockName = "Professions Area"
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