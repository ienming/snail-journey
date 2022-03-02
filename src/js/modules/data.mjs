//load data
import axios from "axios";
// 預設全部最多會說的話
let speaksNum = 6

let fetchSnails = async () => {
    let response;

    try {
        response = await axios
            .get("src/data/data_snails.csv", {})
            console.log("async completed get snails data")
    } catch (e) {
        // catch error
        throw new Error(e.message)
    }

    if (response.data){
        let rows = response.data.split("\n");
        let output = [];
        let keyMap = {};
        console.log(rows[0].split(","))
        for (let i =0; i<rows[0].length; i++){
            keyMap[rows[0].split(",")[i]] = i
        }
        rows.shift();
        rows.forEach((el) => {
            let d = el.split(",");
            let obj = {
                name: d[keyMap.name],
                x: d[keyMap.x],
                y: d[keyMap.y],
                adoptable: d[keyMap.adoptable],
                animated: d[keyMap.animated],
                program: {
                    name: d[keyMap.program_name],
                    description: d[keyMap.program_description]
                }
            };
            let speakStartCol = d.length - speaksNum
            let speaksArr = [];
            for (let i = speakStartCol; i < speakStartCol + speaksNum; i++) {
                if (d[i] !== '' && d[i] !== '\r'){
                    speaksArr.push(d[i])
                }
            }
            obj.speaks = speaksArr;
            output.push(obj);
        });
        return output
    }else{
        return
    }
};

let fetchItems = async () => {
    let response;

    try {
        response = await axios
            .get("src/data/data_items.csv", {})
            console.log("async completed get items data")
    } catch (e) {
        // catch error
        throw new Error(e.message)
    }

    if (response.data){
        let rows = response.data.split("\n");
        let output = [];
        let keyMap = {};
        for (let i =0; i<rows[0].length; i++){
            keyMap[rows[0].split(",")[i]] = i
        }
        rows.shift();
        rows.forEach((el) => {
            let d = el.split(",");
            let obj = {
                name: d[keyMap.name],
                x: d[keyMap.x],
                y: d[keyMap.y],
                mission: d[keyMap.mission]*1,
                gameSpeak: {
                    notyet: d[keyMap.game_speak_n],
                    progress: d[keyMap.game_speak_p],
                    complete: d[keyMap.game_speak_c],
                    accept: d[keyMap.game_speak_a],
                    deny: d[keyMap.game_speak_d],
                    finish: d[keyMap.game_speak_f]
                },
                enterGame: d[keyMap.enter_game]*1
            };
            let speakStartCol = d.length - speaksNum
            let speaksArr = [];
            for (let i = speakStartCol; i < speakStartCol + speaksNum; i++) {
                if (d[i] !== '' && d[i] !== '\r'){
                    speaksArr.push(d[i])
                }
            }
            if (speaksArr.length > 0){
                obj.speaks = speaksArr;
            }
            output.push(obj);
        });
        return output
    }else{
        return
    }
};

//snails
// let snails = [
//     {
//         name: 'snail_floor',
//         x: -180,
//         y: 450,
//         adoptable: true,
//         animated: true,
//         program: {
//             name: '認養行動案測試',
//             description: '說明文字測試'
//         },
//         speaks: ['我是一隻小蝸牛', '蝸牛市吉一極棒', '下雨洗盆栽 ><', '晚餐要吃什麼......', '聽說最近有新開的拉麵店了！找時間想去看看', '我上次從海安路走回宿舍花了三個小時，腳都快被磨爛了......']
//     },{
//         name: 'snail_cinemaroll',
//         x: 100,
//         y: 450,
//         adoptable: true,
//         animated: false,
//         program: {
//             name: '肉桂捲認養行動案',
//             description: '肉桂捲行動案文字測試'
//         },
//         speaks: ['愛意特點心店開張囉！']
//     }
// ]

//other NPC
// let items = [
//     {
//         name: "bike",
//         x: -650,
//         y: -300,
//         speaks: ["腳踏車腳踏車"],
//         // gameSpeak: {
//         //     notyet: ["今天腳踏車店沒開"],
//         //     progress: [
//         //         "我想修腳踏車......可以幫我嗎？去東邊的廣場找找看，那裡好像有廢棄的輪胎",
//         //     ],
//         //     finished: ["謝謝你！這下我就可以繼續在蝸牛巷裡散步閒晃了！"],
//         // },
//     },
//     {
//         name: "house_cinemaroll",
//         x: 530,
//         y: 350,
//         speaks: ["肉桂捲肉桂捲", "哈哈哈", "今天又下雨"],
//     },
//     {
//         name: "house_literature",
//         x: 1000,
//         y: -200,
//     },
//     {
//         name: "board",
//         x: -900,
//         y: 100,
//     },
// ];

//static houses (background)
let normalHouses = [
    {
        x: 700,
        y: 560,
    },
    {
        x: 890,
        y: 650,
    },
];

export { fetchSnails, fetchItems, normalHouses };
