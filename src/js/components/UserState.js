const UserState = {
    template: `
    <div id="userState">
        <h3>User State:</h3>
        <ul>
            <p>Achievements</p>
            <span>{{userAchieved}}</span>
        </ul>
        <h4>今天已撿起垃圾：{{userGotTrashes.length}}/{{dailyTrashes.length}}</h4>
        <h4>今天已評價好壞人：{{userJudges.length}}/{{dailyGuys.length}}</h4>
    </div>
    `,
    props: ['achievements', 'userAchieved', 'dailyTrashes', 'dailyGuys', 'userGotTrashes', 'userJudges'],
    data(){
        return {}
    }
}

Vue.component('user-state', UserState)