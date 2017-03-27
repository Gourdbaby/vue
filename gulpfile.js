var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var webpack = require('webpack');
var webpackDevServer = require("webpack-dev-server");
var config = require('./webpack.config.js');

gulp.task('default', ['webpack-dev-server'], function (callback) {
  callback();
});

//开发环境执行的任务
//由于inline模式只有通过webpack-dev-server命令启动时才会起作用，所以执行这个任务启动时无法实现自动刷新；
//为了能够实现自动刷新，webpack官网给的方案就是为每个entry增加一个配置；
//即使不用这个配置，通过iframe模式访问时也是可以实现自动刷新的；
gulp.task('webpack-dev-server', function (callback) {
  var port = config.devServer.port;
  var host = config.devServer.host;
  /**为了实现inline模式的自动刷新 start */
  for(var key in config.entry){
    config.entry[key].unshift("webpack-dev-server/client?http://"+host+":"+port);
  }
  /**为了实现inline模式的自动刷新 end */
  new webpackDevServer(webpack(config), config.devServer)
    .listen(port, host, function (err) {
      if (err) {
        throw new gutil.PluginError('webpack-dev-server', err);
      }
      gutil.log('[webpack-dev-server]', 'http://127.0.0.1:' + port + '/[your-page-name]');
      gutil.log('[webpack-dev-server]', 'or');
      gutil.log('[webpack-dev-server]', 'http://127.0.0.1:' + port + '/webpack-dev-server/[your-page-name]');
      callback();
    });
});

//生产环境执行的任务
gulp.task('prod', ['webpack'], function (callback) {
  callback();
});

//执行webpack任务
gulp.task('webpack',['clean'], function (callback) {
  webpack(config,function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }
    //输出webpack编译的日志
    gutil.log('[webpack:build]', stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
    }));
    callback();
  });
});

//删除之前编译生成的文件
gulp.task('clean',function(){
  return gulp.src([
    config.output.path
  ]).pipe(clean({force: true}));
});
