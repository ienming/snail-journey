//load data
import axios from "axios";

let fetchNPC = async () => {
    let response;

    try {
        response = await axios
            .get("src/data/data_npc.csv", {})
            console.log("async completed get NPC data")
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
                console.log("key: "+rows[0].split(",")[i])
            }
        }
        // console.log(keyMap)
        rows.shift();
        rows.forEach((el) => {
            let d = el.split(",");
            let obj = {
                name: d[keyMap.name],
                x: d[keyMap.x],
                y: d[keyMap.y],
                mission: d[keyMap.mission]*1,
                enterGame: d[keyMap.enter_game]*1,
            };
            if (d[keyMap.game_speak_n]){
                obj.gameSpeakN = d[keyMap.game_speak_n]
            }
            // 有認養的東西
            if (d[keyMap.adoptable]){
                obj.adoptable = d[keyMap.adoptable]*1
                obj.program = {
                    title: d[keyMap.program_title],
                    intro: d[keyMap.program_intro],
                }
                if (d[keyMap.program_subtitle]){
                    obj.program.subTitle = d[keyMap.program_subtitle]
                }
                if (d[keyMap.program_goal]){
                    obj.program.goal = d[keyMap.program_goal]
                }
                if (d[keyMap.program_keywords]){
                    let keywords = d[keyMap.program_keywords].trim().split("^")
                    obj.program.keywords = keywords
                }
                // actions
                if (d[keyMap.action_titles]){
                    let actions = []
                    for (let i=0; i<d[keyMap.action_titles].trim().split("^").length; i++){
                        let action = {
                            imgSrc: `./src/img/${d[keyMap.action_imgs].trim().split("^")[i]}.png`,
                            title: d[keyMap.action_titles].trim().split("^")[i],
                            intro: d[keyMap.action_intros].trim().split("^")[i]
                        }
                        actions.push(action)
                    }
                    obj.program.actions = actions
                }
            }
            // NPC 遊戲中要講的話
            if (d[keyMap.game_speaks]){
                let gameSpeaksArr = []
                gameSpeaksArr = d[keyMap.game_speaks].trim().split("^")
                obj.gameSpeaks = gameSpeaksArr
            }
            // NPC 遊戲對應的選項內容
            if (d[keyMap.game_option]){
                let gameOptionArr = []
                gameOptionArr = d[keyMap.game_option].trim().split("^")
                obj.gameOptions = gameOptionArr.map(el=>el*1)
            }
            // NPC 遊戲對應的圖片顯示
            if (d[keyMap.game_img]){
                let gameImgArr = d[keyMap.game_img].trim().split("^")
                obj.gameImgs = gameImgArr.map(el=>el*1)
            }
            // NPC 講的廢話
            if (d[keyMap.speaks]){
                let speaksArr = [];
                speaksArr = d[keyMap.speaks].trim().split("^")
                obj.speaks = speaksArr;
            }
            // 中間穿插的連結何時顯示
            if (d[keyMap.link_show]){
                let linkShows = d[keyMap.link_show].trim().split("^")
                obj.linkShow = linkShows.map(el=>el*1)
                // 切開黏在一起的網址
                let links = d[keyMap.links].trim().split("http")
                let filterLinks = links.filter(el=>el !== '')
                let output = []
                filterLinks.forEach(el=>output.push("http"+el))
                obj.link = output
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

//all furnitures
function fetchFurnitures(){
    let response = [];
    axios.get("src/data/data_furnitures.csv")
        .then(res=>{
            let rows = res.data.split("\n")
            let keyMap = {};
            for (let i =0; i<rows[0].length; i++){
                if (rows[0].split(",")[i] !== undefined){
                    keyMap[rows[0].split(",")[i].trim()] = i
                    // console.log("key: "+rows[0].split(",")[i])
                }
            }
            rows.shift()
            rows.forEach(el=>{
                let d = el.split(",");
                let obj = {
                    name: d[keyMap.name],
                    x: d[keyMap.x],
                    y: d[keyMap.y],
                    txt: d[keyMap.txt],
                    price: d[keyMap.price]*1
                };
                response.push(obj)
            })
            vm.$data.allFurnitures = response
        })
        .catch(err=>{
            throw(err)
        })
}

export { fetchNPC, normalHouses, fetchFurnitures };

// let fetchSnails = async () => {
//     let response;

//     try {
//         response = await axios
//             .get("src/data/data_snails.csv", {})
//             console.log("async completed get snails data")
//     } catch (e) {
//         // catch error
//         throw new Error(e.message)
//     }

//     if (response.data){
//         let rows = response.data.split("\n");
//         let output = [];
//         let keyMap = {};
//         console.log(rows[0].split(","))
//         for (let i =0; i<rows[0].length; i++){
//             keyMap[rows[0].split(",")[i]] = i
//         }
//         rows.shift();
//         rows.forEach((el) => {
//             let d = el.split(",");
//             let obj = {
//                 name: d[keyMap.name],
//                 x: d[keyMap.x],
//                 y: d[keyMap.y],
//                 adoptable: d[keyMap.adoptable],
//                 animated: d[keyMap.animated],
//                 program: {
//                     name: d[keyMap.program_name],
//                     description: d[keyMap.program_description]
//                 }
//             };
//             let speakStartCol = d.length - speaksNum
//             let speaksArr = [];
//             for (let i = speakStartCol; i < speakStartCol + speaksNum; i++) {
//                 if (d[i] !== '' && d[i] !== '\r'){
//                     speaksArr.push(d[i])
//                 }
//             }
//             obj.speaks = speaksArr;
//             output.push(obj);
//         });
//         return output
//     }else{
//         return
//     }
// };