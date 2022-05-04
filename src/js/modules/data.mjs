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
                // console.log("key: "+rows[0].split(",")[i])
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
            // 是自己的家裡
            if (d[keyMap.personal]){
                obj.personal = true
            }
            // 有房子可以進去
            if (d[keyMap.house]){
                obj.house = d[keyMap.house]
            }
            // 有認養的東西
            if (d[keyMap.adoptable]){
                obj.adoptable = d[keyMap.adoptable]*1
                obj.program = {
                    title: d[keyMap.program_title],
                    descrip: d[keyMap.program_descrip],
                    linkName: d[keyMap.program_linkName],
                    link: d[keyMap.program_link]
                }
                // 給 global all atoptions 這些資料，用來產生徽章
                let adoptionObj = {}
                adoptionObj.title = d[keyMap.program_title]
                adoptionObj.intro = "認養徽章說明"
                vm.$data.adoptions.push(adoptionObj)
                //
                // if (d[keyMap.program_subtitle]){
                //     obj.program.subTitle = d[keyMap.program_subtitle]
                // }
                // if (d[keyMap.program_goal]){
                //     obj.program.goal = d[keyMap.program_goal]
                // }
                // if (d[keyMap.program_keywords]){
                //     let keywords = d[keyMap.program_keywords].trim().split("^")
                //     obj.program.keywords = keywords
                // }
                // // actions
                // if (d[keyMap.action_titles]){
                //     let actions = []
                //     for (let i=0; i<d[keyMap.action_titles].trim().split("^").length; i++){
                //         let action = {
                //             imgSrc: `./src/img/${d[keyMap.action_imgs].trim().split("^")[i]}.png`,
                //             title: d[keyMap.action_titles].trim().split("^")[i],
                //             intro: d[keyMap.action_intros].trim().split("^")[i]
                //         }
                //         actions.push(action)
                //     }
                //     obj.program.actions = actions
                // }
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
            if (d[keyMap.img_show]){
                let gameImgArr = d[keyMap.img_show].trim().split("^")
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
                obj.link = {}
                let linkShows = d[keyMap.link_show].trim().split("^")
                obj.link.shows = linkShows.map(el=>el*1)
                // 切開黏在一起的網址
                let links = d[keyMap.links].trim().split("http")
                let filterLinks = links.filter(el=>el !== '')
                let output = []
                filterLinks.forEach(el=>output.push("http"+el))
                obj.link.urls = output
                //連結顯示文字
                if (d[keyMap.link_names]){
                    let linkNames = d[keyMap.link_names].trim().split("^")
                    obj.link.names = linkNames
                }
            }
            output.push(obj);
        });
        // console.log(output)
        return output
    }else{
        return
    }
};

//good bad guys
let fetchGuys = async ()=>{
    let response;

    try {
        response = await axios
            .get("src/data/data_guys.csv", {})
            console.log("async completed get guys data")
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
        rows.shift();
        rows.forEach((el) => {
            let d = el.split(",");
            let obj = {
                name: d[keyMap.name],
                group: d[keyMap.group]
            };
            if (d[keyMap.speaks]){
                let speaksArr = [];
                speaksArr = d[keyMap.speaks].trim().split("^")
                obj.speaks = speaksArr;
            }
            output.push(obj)
            // console.log(obj)
        })
        return output
    }else return
}

//static houses (background)
let normalHouses = [
    {
        x: 655,
        y: 545,
    },
    {
        x: 832,
        y: 618,
    },
];

//all trash
let trashes = [
    {
        x: -1252,
        y: -597,
        id: 0
    },{
        x: -877,
        y: -401,
        id: 1
    },{
        x: -745,
        y: 559,
        id: 2
    },{
        x: -651,
        y: 208,
        id: 3
    },{
        x: -76,
        y: -810,
        id: 4
    },{
        x: 74,
        y: 401,
        id: 5
    },{
        x: 419,
        y: 429,
        id: 6
    },{
        x: 549,
        y: -504,
        id: 7
    },{
        x: 1105,
        y: -294,
        id: 8
    },{
        x: 1369,
        y: 422,
        id: 9
    }
]

//info data
let fetchInfo = async ()=>{
    let response;

    try {
        response = await axios
            .get("src/data/data_info_npc.csv", {})
            console.log("async completed get INFO data")
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
            }
        }
        rows.shift();
        rows.forEach((el) => {
            let d = el.split(",");
            let obj = {
                title: d[keyMap.title],
                content: d[keyMap.content]
            };
            output.push(obj)
        })
        return output
    }else return
}


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
                    id: d[keyMap.id],
                    block: d[keyMap.block],
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

//fetch all achievements data
function fetchAchievements(){
    axios.get("src/data/data_achievements.csv")
        .then(res=>{
            let rows = res.data.split("\n")
            let keyMap = {};
            for (let i =0; i<rows[0].length; i++){
                if (rows[0].split(",")[i] !== undefined){
                    keyMap[rows[0].split(",")[i].trim()] = i
                }
            }
            rows.shift()
            rows.forEach(el=>{
                let d = el.split(",");
                let block = d[keyMap.block]
                let descrip = d[keyMap.descrip]
                vm.$data.achievement.descrips[`block${block}`] = descrip
                let maps = d[keyMap.map].split('^')
                vm.$data.achievement.map[`block${block}`] = maps
            })
        })
        .catch(err=>{
            throw(err)
        })
}

export { fetchNPC, normalHouses, fetchFurnitures, trashes, fetchGuys, fetchAchievements, fetchInfo };