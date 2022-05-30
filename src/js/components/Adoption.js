const Adoption = {
    template: `
        <div class="popup scroll">
            <div class="adopt-goal">
                <h3 class="mb-1">認養方案目標</h3>
                <p class="t-z-3 mb-1">{{program.goal}}</p>
            </div>
            <p v-html="program.descrip"></p>
            <div class="mt-1">
            <h3>任務獎勵</h3>
            <div class="d-flex mission-rwd">
                <figure class="d-flex aic">
                    <img src="./src/img/coin.png" />
                    <span class="pl-1">$ {{program.reward}}</span>
                </figure>
            </div>
            </div>
            <basic-link class="mt-1" title="認養方案詳細說明"></basic-link>
            <p class="t-c-g my-1">*目前認養社區活動僅供學術研究測試用，本地商家預計推行之行動計畫尚在籌備中，店家不會收到您所認養的活動資料，請安心使用*</p>
            <div @click="adopt" class="mt-2 my-btn p-2 t-a-c adopt-btn">{{ program.linkName }}</div>
        </div>
    `,
    props: ['program'],
    data(){
        return {
        }
    },
    methods: {
        adopt(){
            //判斷是否已經認養過
            if (vm.$data.user.adoptions.every(val => val !== this.program.title)){
                if (this.program.subTitle){
                    //打事件到vm 呼叫 showsys()
                    this.$emit(`adopted`, `已認養方案：「${this.program.subTitle}：${this.program.title}」`)
                    this.getReward()
                }
                else{
                    this.$emit(`adopted`, `已認養方案：「${this.program.title}」`)
                    this.getReward()
                }
                //把認養的資料儲存
                vm.$data.user.adoptions.push(this.program.title)
            }else{
                this.$emit(`adopted`, `已經認養過方案：「${this.program.title}」囉～`)
            }
        },
        getReward(){
            vm.$data.user.coins += this.program.reward
            let str = `獲得認養社區行動方案「${this.program.title}」獎勵！`
            let imgUrl = "./src/img/coin.png"
            let num = this.program.reward
            let abs = `獲得 ${num} 個蝸牛幣`
            this.$emit('adopt-reward', str, abs, imgUrl)
        }
    }
}
Vue.component('adoption', Adoption)