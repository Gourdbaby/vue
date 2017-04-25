var path = require('path');
var webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');
var htmlWebpackPlugin = require('html-webpack-plugin');
var glob = require('glob');

//将css提取出来保存为单独的文件
var extractCss = new extractTextPlugin('assets/css/[name].css');
//html提取出来保存为单独的文件
var extractHtml = new extractTextPlugin('[name].html');

var config = {
    //入口文件配置
    entry: {
        'vendors': [
            'jquery',
            'vue'
        ]
    },
    //入口文件输出配置
    output: {
        path: path.join(__dirname , '../web/'),
	    filename: 'assets/js/[name].js',
	    chunkFilename: 'assets/js/chunks/[name].js',
	    publicPath: '/web/'
    },
    module: {
        //加载器配置
        loaders: [{
            //把你的模块中引用的jquery模块公布到全局作用域，可以通过$和jQuery访问。
            //如果你的模块中没有引用jquery模块，那它将不起作用。
            //expose-loader暴露该模块为全局变量
            test: require.resolve('jquery'),
            loader: 'expose?$!expose?jQuery'
        }, {
            test: require.resolve('vue'),
            loader: 'expose?Vue'
        },{
            test: require.resolve('element-ui'),
            loader: 'expose?ElementUI'
        }, {
            test: require.resolve('vue-router'),
            loader: 'expose?VueRouter'
        },{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json'
        }, 
        {
	      test: /\.s?css$/,
	      loader: extractCss.extract('style', 'css?{"discardComments":{"removeAll":true}}!sass')
	    }, 
        {
            test: /\.woff2?(\?[\s\S]+)?$/,
            loader: 'url?limit=10000&name=assets/fonts/[name].[ext]'
        }, {
            test: /\.(svg|ttf|eot)(\?[\s\S]+)?$/,
            loader: 'file?limit=10000&name=assets/fonts/[name].[ext]'
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url-loader?limit=10000&name=assets/images/[name].[ext]' //css中引用的图片路径将被替换为output.publicPath+这里的name
        }, {
	      test: /\.vue$/,
	      loader: 'vue',
	      options: {
	        loaders: {
	          'scss': 'vue-style-loader!css-loader!sass-loader',
	          'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
	        },
	        postcss: [
	          require('autoprefixer')({
	            browsers: ['last 3 versions']
	          })
	        ]
	      }
	    }]
    },
    //插件项
    plugins: [
        extractCss,
        new extractTextPlugin('element-ui/lib/theme-default/index.css'),
        // extractHtml,
        new webpack.ProvidePlugin({
            //一般如果我们要在某个模块中使用jquery这个模块的话要这样写：var $=require('jquery');
            //某些第三方库可能也直接依赖了jquery；
            //而我们通过ProvidePlugin这个插件的话就不需要自己引用jquery模块了，插件会自动帮我们引用;
            //ProvidePlugin插件将会把jquery模块的module.exports赋值给$;
            //所以，我们直接在模块中使用$就行了。
            //$在页面中要使用的名字，jquery是node_modules下面的模块文件名
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'Vue': 'vue',
            'ElementUI':'element-ui',
            'VueRouter':'vue-router'
        })
    ],
    resolve: {
        root: [
            //指定你的入口文件中要引用的模块的根目录
            //例如a.js中的require('js/lazyload/lazyload1')
            //如下设置就告诉webpack引用模块时从项目的根目录下查找
            path.resolve('.')
        ],
        alias: {

        }
    },
    devServer: {
        host: '0.0.0.0',
        port: 8083,
        publicPath: '/web',
        stats: {
            colors: true
        },
        historyApiFallback: false,
        inline: true,
        progress: true
    },
    devtool: 'cheap-module-source-map',
    compress: true,
    colors: true,
    progress: true,
    debug: true
};

//业务入口文件所在的目录
var entryDir = path.join(__dirname, 'pages/');
var entries = glob.sync(entryDir + '*').map(function(entry) {
    return {
        name: path.basename(entry),
        path: entry
    }
});
//console.log("======"+JSON.stringify(entries))

entries.forEach(function(entry) {
    //添加entry
    config.entry[entry.name] = [entry.path];
	console.log("entry====="+JSON.stringify(entry))
    //生成html
    config.plugins.push(new htmlWebpackPlugin({
        filename: entry.name + '.html',   //生成的html文件名
        template: entry.path + '/page.html', //模板html文件
        chunks: ['aaa',entry.name], //当前这个HTML需要引入的 js chunks
        hash: true, //哈希值
        minify: {removeComments:true,collapseWhitespace:true} //压缩HTML文件
    }));

});

entries = entries.map(function(entry) {
    return entry.name;
});

//默认会把所有入口文件中的中公共的代码提取出来，生成一个common.js文件
//new webpack.optimize.CommonsChunkPlugin('js/common.js'),
//我们也可以指定某几个入口来提取公共代码，生成一个common.js文件
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    chunks: entries
}));
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendors',
    minChunks: Infinity
}));

module.exports = config;