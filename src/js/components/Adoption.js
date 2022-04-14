const Adoption = {
    template: `
        <div class="popup adoption">
            <p v-html="program.descrip"></p>
            <div class="mt-1">
            任務獎勵：
            <div class="d-flex mission-rwd">
                <figure>
                    <img src="./src/img/coin.png" />
                    <p>???</p>
                </figure>
            </div>
            </div>
            <basic-link class="mt-1" :title="program.linkName" :url="program.link"></basic-link>
            <div @click="adopt" class="mt-2 my-btn">認養任務！</div>
        </div>
    `,
    props: ['program'],
    data(){
        return {}
    },
    methods: {
        adopt(){
            //判斷是否已經認養過
            if (vm.$data.user.adoptions.every(val => val !== this.program.title)){
                if (this.program.subTitle){
                    //打事件到vm 呼叫 showsys()
                    this.$emit(`adopted`, `已認養方案：「${this.program.subTitle}：${this.program.title}」`)
                }
                else{
                    this.$emit(`adopted`, `已認養方案：「${this.program.title}」`)
                }
                //把認養的資料儲存
                vm.$data.user.adoptions.push(this.program.title)
            }else{
                this.$emit(`adopted`, `已經認養過方案：「${this.program.title}」囉～`)
            }
        },
    }
}
Vue.component('adoption', Adoption)

// const Adoption = {
//     template: `
//         <div class="popup adoption">
//             <div class="d-flex justify-between head">
//                 <div>
//                     <h3>{{program.subTitle}}</h3>
//                     <h1>{{program.title}}</h1>
//                 </div>
//                 <div class="d-flex flex-column jcc">
//                     <img src="" alt="" />
//                     <span></span>
//                 </div>
//             </div>
//             <p class="mt-1">
//                 <p class="t-w-8 t-z-1">專案目標</p>
//                 <p class="t-z-2">{{program.goal}}</p>
//             </p>
//             <div class="d-flex my-1">
//                 <div v-for="keyword of program.keywords" class="keyword">
//                     {{keyword}}
//                 </div>
//             </div>
//             <p class="my-2">{{program.intro}}</p>
//             <div class="d-flex flex-wrap my-1 action">
//                 <figure class="m-0 d-flex aic flex-column" v-for="action of program.actions">
//                     <img :src="action.imgSrc" alt="" />
//                     <figcaption class="mt-1 t-a-c">
//                         <h5 class="t-z-2">{{action.title}}</h5>
//                         <p class="t-z-2">{{action.intro}}</p>
//                     </figcaption>
//                 </figure>
//             </div>
//             <cta @adopting="adopt"></cta>
//         </div>
//     `,
//     props: {
//         program: {
//             type: Object
//         }
//     },
//     data(){
//         return {}
//     },
//     methods: {
//         adopt(){
//             //判斷是否已經認養過
//             if (vm.$data.user.adoptions.every(val => val !== this.program.title)){
//                 if (this.program.subTitle){
//                     //打事件到vm 呼叫 showsys()
//                     this.$emit(`adopted`, `已認養方案：「${this.program.subTitle}：${this.program.title}」`)
//                 }
//                 else{
//                     this.$emit(`adopted`, `已認養方案：「${this.program.title}」`)
//                 }
//                 //把認養的資料儲存
//                 vm.$data.user.adoptions.push(this.program.title)
//             }else{
//                 this.$emit(`adopted`, `已經認養過方案：「${this.program.title}」囉～`)
//             }
//         },
//     }
// }
// Vue.component('adoption', Adoption)