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
            if (rows[0].split(",")[i] !== undefined){
                keyMap[rows[0].split(",")[i].trim()] = i
                // console.log("key: "+rows[0].split(",")[i])
            }
        }
        // console.log(keyMap)
        rows.shift();
        rows.forEach((el) => {
            let d = el.split(",");
            if (d[keyMap.name] == 'bike'){
                console.log(d[keyMap.name])
                console.log(d[keyMap.game_option])
                console.log(d[keyMap.game_img])
                console.log(d[keyMap.speaks])
            }
            let obj = {
                name: d[keyMap.name],
                x: d[keyMap.x],
                y: d[keyMap.y],
                mission: d[keyMap.mission]*1,
                enterGame: d[keyMap.enter_game]*1,
            };
            // NPC 遊戲中要講的話
            if (d[keyMap.game_speaks]){
                let gameSpeaksArr = []
                gameSpeaksArr = d[keyMap.game_speaks].trim().split("&")
                obj.gameSpeaks = gameSpeaksArr
            }
            // NPC 遊戲對應的選項內容
            if (d[keyMap.game_option]){
                let gameOptionArr = []
                gameOptionArr = d[keyMap.game_option].trim().split("&")
                obj.gameOptions = gameOptionArr.map(el=>el*1)
            }
            // NPC 遊戲對應的圖片顯示
            if (d[keyMap.game_img]){
                let gameImgArr = d[keyMap.game_img].trim().split("&")
                obj.gameImgs = gameImgArr.map(el=>el*1)
            }
            // NPC 講的廢話
            if (d[keyMap.speaks]){
                let speaksArr = [];
                speaksArr = d[keyMap.speaks].trim().split("&")
                obj.speaks = speaksArr;
            }
            output.push(obj);
        });
        console.log(output)
        return output
    }else{
        return
    }
};

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
