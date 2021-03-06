// 主線探索遊戲邏輯
function initMission(el){
    let nowUserMissionProgress = vm.$data.user.missions[`mission${el.mission}`]
    if (el.mission && nowUserMissionProgress.indexOf('finished') == -1){ //此NPC有任務而且該任務還沒完成
        // 首先確認是不是點到開啟新任務的NPC
        if (el.enterGame == 1 && nowUserMissionProgress.length == 0){ //而且玩家這條任務還沒開啟
            vm.$data.nowSpeak = el.gameSpeaks[0]
            vm.$data.btnTxt = "下一步"
            vm.$data.adoptable = false
            vm.$data.interaction.nowAns = true
        }
    }else if (el.mission){  // 此 NPC 的任務對話完成了
        // 是否有可以認養的按鈕
        if (el.adoptable){
            vm.$data.adoptable = true
        }else{
            vm.$data.adoptable = false
            vm.$data.btnTxt = "關閉"
        }
        console.log(`任務${el.mission}結束，講一下廢話`)
    }
}
export {initMission}

// Achievement Map for mapping whether get badges or not
// let achievementMap = {
//     block1: ['bike', 'house_literature'],
//     block2: []
// }
// 把這邊改成某一區全區講完話就有徽章

// function initMission(el){
//     let nowUserMissionProgress = vm.$data.user.missions[`mission${el.mission}`]
//     if (el.mission && nowUserMissionProgress.indexOf('finished') == -1){ //此NPC有任務而且該任務還沒完成
//         // 首先確認是不是點到開啟新任務的NPC
//         if (el.enterGame == 1 && nowUserMissionProgress.length == 0){ //而且玩家這條任務還沒開啟
//             vm.$data.showMissionBtn = 'notyet'
//             vm.$data.nowSpeak = el.gameSpeak.notyet
//         }else if (nowUserMissionProgress.length > 0){  //確認NPC所屬的這條任務是不是開啟
//             console.log("任務已開啟，目前階段： "+nowUserMissionProgress.length)
//             let arr = []
//             arr = vm.$data.user.missions[`mission${el.mission}`].slice(0)
//             if (el.name == arr[arr.length-1]) { //如果點到的跟上一個一樣
//                 vm.$data.nowSpeak = el.gameSpeak.progress //再講一次一樣的提示
//                 console.log("同一NPC, 尚未前往下一階段")
//                 return
//             }
//             console.log("要被推入的NPC："+el.name)
//             arr.push(el.name)
//             if (arrayEquals(arr, gameFlow[`mission${el.mission}`].slice(0, arr.length))){ //確認順序是不是正確的
//                 vm.$data.user.missions[`mission${el.mission}`].push(el.name)
//                 vm.$data.nowSpeak = el.gameSpeak.progress
//                 console.log("點對人了")
//                 // 結束遊戲
//                 if (arr.length == gameFlow[`mission${el.mission}`].length){
//                     console.log(`任務${el.mission}完成！`)
//                     vm.$data.nowSpeak = el.gameSpeak.complete
//                     vm.$data.user.missions[`mission${el.mission}`].push('finished')
//                 }
//             }else{
//                 console.log("順序錯了，不是找我")
//                 console.log("目前的順序："+arr)
//                 console.log("正確的順序："+gameFlow[`mission${el.mission}`].slice(0, arr.length))
//             }
//         }else{
//             console.log(`任務${el.mission}尚未開啟`)
//         }
//     }else{
    //         console.log("沒有任務喔～")
    //         return
    //     }
    // }