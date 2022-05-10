const LogIn = {
    template: `
    <div class="card w-75 w-md-33">
        <div>
            <input-text v-model="acc" class="w-100 mb-1" label-title="帳號" placeholder="輸入帳號" id="acc" name="acc"></input-text>
            <input-text v-if="nowPage !== 'logIn'" v-model="nickName" class="w-100 mb-1" label-title="暱稱" placeholder="輸入暱稱" id="nickName" name="nickName"></input-text>
            <input-text v-if="nowPage !== 'logIn'" v-model="email" class="w-100 mb-1" label-title="信箱" type="email" placeholder="輸入信箱" id="email" name="email"></input-text>
            <input-text v-model="pwd" class="w-100 mb-1" label-title="密碼" type="password" placeholder="輸入密碼" id="pwd" name="pwd"></input-text>
            <a class="t-a-r my-link small" @click="toSignUp" v-if="nowPage == 'logIn'">還沒有加入綠洲嗎？申請門牌</a>
            <a class="t-a-r my-link small" @click="toLogIn" v-else>回到登入</a>
            <p class="t-c mt-1 t-z-2 t-w-6" v-if="error">{{ errMsg }}</p>
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
    data() {
        return {
            nowPage: "logIn",
            acc: "test",
            pwd: "test",
            nickName: "小蝸牛",
            email: "test@test.com",
            links: {
                hello: "http://localhost:8000/",
                user: "http://localhost:8000/user",
                login: "http://localhost:8000/login",
                register: "http://localhost:8000/register",
            },
            errMsg: ""
        }
    },
    computed: {
        error(){
            if (this.errMsg){
                return true
            }else return false
        }
    },
    methods: {
        logIn() {
            if (this.acc && this.pwd) {
                this.doLogin()
            } else if (!this.acc) {
                this.errMsg = "帳號不能為空！"
            } else if (!this.pwd) {
                this.errMsg = "密碼不能為空！"
            }
        },
        toLogIn() {
            this.nowPage = "logIn"
            this.errMsg = ""
        },
        toSignUp() {
            this.nowPage = "signUp"
            this.errMsg = ""
        },
        signUp() {
            if (this.acc && this.pwd && this.nickName) {
                this.doRegister()
            } else if (!this.acc) {
                this.errMsg = "帳號不能為空！"
            } else if (!this.nickName) {
                this.errMsg = "暱稱不能為空！"
            } else if (!this.email) {
                this.errMsg = "信箱不能為空！"
            } else if (!this.pwd) {
                this.errMsg = "密碼不能為空！"
            }
        },
        doLogin() {
            axios({
                method: "POST",
                url: this.links.login,
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    // "Access-Control-Allow-Origin": "*",
                },
                data: {
                    username: this.acc,
                    password: this.pwd
                },
            }).then((response) => {
                console.log(response.status);
                console.log(response);
                if (response.data.status == 1){
                    vm.$bus.$emit("record-token", response.data.token)
                    this.$emit('log-in')
                }else{
                    console.log(response.data.msg)
                    this.errMsg = "登入失敗"
                }
            });
        },
        doRegister() {
            axios({
                method: "POST",
                url: this.links.register,
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    // "Access-Control-Allow-Origin": "*",
                },
                data: {
                    username: this.acc,
                    password: this.pwd,
                    nickname: this.nickName,
                    email: this.email,
                },
            }).then((response) => {
                console.log(response.status);
                console.log(response);
                if (response.data.status == 1){
                    vm.$bus.$emit("record-token", response.data.token)
                    this.errMsg = "註冊成功！歡迎光臨蝸牛綠洲！"
                    window.setTimeout(()=>{
                        this.$emit('log-in')
                    }, 1000)
                }else {
                    console.log(response.data.msg)
                    this.errMsg = "註冊失敗！已有重複帳號"
                }
            });
        }
    }
}

Vue.component("log-in", LogIn)