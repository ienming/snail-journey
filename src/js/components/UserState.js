const UserState = {
    template: `
    <div id="userState">
        <h3>User State:</h3>
        <ul>
            <p>Achievements</p>
            <li v-for="(el, idx) of achievements"><span>{{idx}}: </span>{{el}}</li>
            <span>{{userAchieved}}</span>
        </ul>
        <h4>今天的垃圾：{{dailyTrashes.length}}</h4>
        <h4>已經撿起：{{userGotTrashes.length}}</h4>
        <h4>今天的好壞人：{{dailyGuys.length}}</h4>
        <h4>已經評價：{{userJudges.length}}</h4>
    </div>
    `,
    props: ['achievements', 'userAchieved', 'dailyTrashes', 'dailyGuys', 'userGotTrashes', 'userJudges'],
    data(){
        return {}
    }
}

Vue.component('user-state', UserState)