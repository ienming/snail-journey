// webpack.config.js
const path = require('path');
module.exports = {
	context: path.resolve(__dirname, 'src'), //__dirname 代表當前執行文件所在目錄的完整目錄位置，"src"意思為從這個資料夾開始搜尋
	entry: "./index.js", //代表進入點的js檔案路徑
	output: { //輸出打包編譯過後的檔案名稱與路徑設定
		filename: "bundle.js",
		path: path.resolve(__dirname, 'dist'), //後方可以決定要輸出到哪個資料夾，預設會建立到 dist 資料夾中
	},
    watch: true
}

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader', //loader 讓 webpack 可以判讀並轉換
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },{
                test: /\.s[ac]ss$/i,
                // 把 sass-loader 放在首要處理 (第一步)，這邊的層級是由右往左
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ]
    },
    plugins: [new MiniCssExtractPlugin()],
}