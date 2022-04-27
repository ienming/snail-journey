const LogIn = {
    template: `
    <div class="card w-75 w-md-33">
        <div>
            <input-text v-model="acc" class="w-100 mb-1" label-title="帳號" placeholder="輸入帳號" id="acc" name="acc"></input-text>
            <input-text v-if="nowPage !== 'logIn'" v-model="nickName" class="w-100 mb-1" label-title="暱稱" placeholder="輸入暱稱" id="nickName" name="nickName"></input-text>
            <input-text v-model="pwd" class="w-100 mb-1" label-title="密碼" type="password" placeholder="輸入密碼" id="pwd" name="pwd"></input-text>
            <a class="t-a-r my-link small" @click="toSignUp" v-if="nowPage == 'logIn'">還沒有加入綠洲嗎？申請門牌</a>
            <a class="t-a-r my-link small" @click="toLogIn" v-else>回到登入</a>
            <transition name="fade-right">
                <button class="mt-2 my-btn w-100" @click="logIn" v-if="nowPage == 'logIn'">
                    進入綠洲
                </button>
                <button class="mt-2 my-btn w-100" @click="signUp" v-else>
                    申請門牌
                </button>
            </transition>
        </div>
    </div>
    `,
    data(){
        return {
            nowPage: "logIn",
            acc: "test",
            pwd: "test",
            nickName: "小蝸牛"
        }
    },
    methods: {
        logIn(){
            if (this.acc && this.pwd){
                // POST request
                // if status == 1
                this.$emit('log-in')
            }else if (!this.acc){
                alert("帳號不能為空！")
            }else if (!this.pwd){
                alert("密碼不能為空！")
            }
        },
        toLogIn(){
            this.nowPage = "logIn"
        },
        toSignUp(){
            this.nowPage = "signUp"
        },
        signUp(){
            if (this.acc && this.pwd && this.nickName){
                alert("註冊成功")
                // POST request
            }else if (!this.acc){
                alert("帳號不能為空！")
            }else if (!this.nickName){
                alert("暱稱不能為空！")
            }else if (!this.pwd){
                alert("密碼不能為空！")
            }
        }
    }
}

Vue.component("log-in", LogIn)