const UserState = {
    template: `
    <div id="userState">
        <h3>User State:</h3>
        <ul>
            <li v-for="(el,idx) of badges"><span>{{idx}}: </span> {{ el }}</li>
        </ul>
        <ul>
            <p>Achievements</p>
            <li v-for="(el, idx) of achievements"><span>{{idx}}: </span>{{el}}</li>
            <span>{{userAchieved}}</span>
        </ul>
        
    </div>
    `,
    props: ['badges', 'achievements', 'userAchieved'],
    data(){
        return {}
    }
}

Vue.component('user-state', UserState)