import * as Vue from 'vue'

let vm

// function initVue(){
//     if (Vue){
//         console.log("hello vue")
//         vm = new Vue({
//             el: "#app",
//             data: {
//                 nowLoading: true,
//                 showPopup: false,
//                 showPersonalPage: false,
//                 animatedSpriteSpeak: false,
//                 adoptable: false,
//                 program: undefined,
//                 showProgram: false,
//                 nowSpeak: undefined,
//                 itemClicked: false,
//                 itemSpeak: undefined,
//                 nowNPC: undefined,
//                 showMissionBtn: false,
//                 user: {
//                     missions: {
//                         mission1: [],
//                         mission2: [],
//                         mission3: [],
//                     }
//                 },
//             },
//             computed: {
//                 itemSpeakImgSrc(){
//                     if (this.itemSpeak !== undefined){
//                         if (!this.animatedSpriteSpeak){
//                             return `src/img/${this.itemSpeak}.png`
//                         }
//                     }
//                 },
//                 nowMissionProgress(){
//                     if (this.nowNPC){
//                         return this.user.missions[`mission${this.nowNPC.mission}`]
//                     }else{
//                         return
//                     }
//                 },
//                 userGotBadges(){
//                     let badges = {
//                         mission1: false,
//                         mission2: false,
//                         mission3: false
//                     }
//                     for (let prop in this.user.missions){
//                         if (this.user.missions[prop].indexOf('finished') !== -1){
//                             badges[prop] = true
//                         }
//                     }
//                     return badges
//                 }
//             },
//             created(){
//                 let missionRecorded = JSON.parse(localStorage.getItem('missions'))
//                 if (missionRecorded){ //如果有已經儲存的任務資料
//                     this.user.missionRecorded = missionRecorded //放到 Vue 裏面
//                     for (prop in missionRecorded){
//                         this.user.missions[prop] = missionRecorded[prop] // 讓前臺拉出紀錄同步，所以遊戲可以進行
//                     }
//                 }
//                 console.log('missionRecorded: ')
//                 console.log(missionRecorded)
//             },
//             mounted() {
//                 console.log("vue completed load")
//             },
//             watch: {
//                 'user.missions': {
//                     handler: function(newValue, oldValue){
//                         console.log("任務資料有變動，開始儲存")
//                         let d = JSON.stringify(newValue)
//                         console.log('d: '+d)
//                         this.storageData('missions', d)
//                     },
//                     deep: true
//                 }
//             },
//             methods: {
//                 switchPopup(){
//                     this.showPopup = !this.showPopup
//                     window.setTimeout(()=>{
//                         this.showProgram = false
//                         this.animatedSpriteSpeak = false
//                     }, 100)
//                 },
//                 switchPersonalPage(){
//                     this.showPersonalPage = !this.showPersonalPage
//                 },
//                 switchProgram(){
//                     this.showProgram = true
//                 },
//                 startGame(){
//                     this.nowLoading = false
//                 },
//                 denyMission(){
//                     this.nowSpeak = this.nowNPC.gameSpeak.deny
//                     this.showMissionBtn = 'denied'
//                 },
//                 getMission(){
//                     console.log("開啟新任務")
//                     this.nowSpeak = this.nowNPC.gameSpeak.accept
//                     this.showMissionBtn = 'progress'
//                     this.user.missions[`mission${this.nowNPC.mission}`].push(this.nowNPC.name)
//                 },
//                 pureNext(){
//                     this.switchPopup()
//                 },
//                 storageData(key, value){
//                     localStorage.setItem(key, value)
//                 }
//             }
//         })
//         console.log(vm)
//     }
// }

function test(){
    // vm = new Vue({

    // })
    // console.log("vm: "+vm)
    console.log("Vue: "+ new Vue({}))
}

export {test, vm}