var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var NODE_ENV = process.env.NODE_ENV||'development';
var curVersion = process.env.version||'1.0.0';


var ExtractTextPlugin = require('extract-text-webpack-plugin')
/*
 html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
 */
var HtmlWebpackPlugin = require('html-webpack-plugin')

//定义文件夹的路径
var HTML_ROOT_PATH = path.resolve(__dirname, "src/view");   //模板文件路径
var JS_ROOT_PATH = path.resolve(__dirname, "src/js/page");  //页面脚本路径

//公共模块组
var commonArray = new Array();

var config = {
    // 配置入口文件
    entry: {},

    output: {
        path: path.join(__dirname, 'dist'), // 输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: './',       			// 模板、样式、脚本、图片等资源对应的server上的路径
        filename: 'js/[name].js',     		// 每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js'   // chunk生成的配置
    },
    module: {
        // 加载器，关于各个加载器的参数配置，可自行搜索之。
        loaders: [
            {
                test: /\.css$/,
                // 配置css的抽取器、加载器。'-loader'可以省去
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.less$/,
                // 配置less的抽取器、加载器。中间!有必要解释一下，
                // 根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
                // 你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
                loader: ExtractTextPlugin.extract('css!less')
            }, {
                // html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                // 比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
                test: /\.html$/,
                loader: 'html?attrs=img:src img:data-src'
            }, {
                // 文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            }, {
                // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                // 如下配置，将小于8192byte的图片转成base64码
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
            }
        ]
    },
    plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(NODE_ENV)
			},
			'curVersion': JSON.stringify(curVersion)
		}),
        new webpack.ProvidePlugin({ 			 // 加载jq
            $: 'jquery'
        }),
		
        new ExtractTextPlugin('css/[name].css'), // 单独使用link标签加载css并设置路径，相对于output配置中的publickPath

    ],
};

if (process.env.NODE_ENV == 'production') {    //正式环境
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
			comments: false,
            compress:{
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        })
    );
} else {    //开发环境
	config.plugins.push(
        new webpack.HotModuleReplacementPlugin() // 热加载
    );
	// 热更新 使用webpack-dev-server，提高开发效率
	config.devServer = {
		contentBase: './dist/',
		host: 'localhost',
		port: 9090,
		inline: true,
		hot: true
	}
}

//HtmlWebpackPlugin 模板生成相关的配置，每个对于一个页面的配置
var HtmlFiles   = fs.readdirSync(HTML_ROOT_PATH);
HtmlFiles.forEach(function(item){
    var currentPath = path.join(HTML_ROOT_PATH, item);
    var fileName = path.basename(currentPath,".html");
    // HtmlWebpackPlugin，模板生成相关的配置
    if (fs.statSync(currentPath).isFile()) {
        config.plugins.push(new HtmlWebpackPlugin({ // 根据模板插入css/js等生成最终HTML
            favicon: './src/img/favicon.ico', // favicon路径，通过webpack引入同时可以生成hash值
            filename: currentPath.replace("\\src\\view\\", "\\dist\\"), // 生成的html存放路径，相对于path
            template: currentPath, // html模板路径
            inject: 'body', // js插入的位置，true/'head'/'body'/false
            hash: true, // 为静态资源生成hash值
            chunks: ['vendors', fileName], // 需要引入的chunk，不配置就会引入所有页面的资源
            minify: { // 压缩HTML文件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: false, // 删除空白符与换行符
				//minifyJS:true,
				//minifyCSS:true,
            }
        }));
        config.entry[fileName] = JS_ROOT_PATH +"/"+ fileName + ".js";  //配置入口
        commonArray.push(fileName);
    }
});

//CommonsChunkPlugin 提取公共模块
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
    chunks: commonArray, // 提取哪些模块共有的部分
    minChunks: commonArray.length // 提取至少3个模块共有的部分
}));

module.exports = config;
