/* 
先安装gulp及相关:
    yarn add gulp -D | yarn add gulp-less -D | ...
再定义变量接收
*/
var gulp = require("gulp");
var less = require("gulp-less");
var cssmin = require("gulp-minify-css");
//在网页显示样式源less文件名(没有这个插件就显示css文件名), 方便后期找less文件修改
var sourcemaps = require("gulp-sourcemaps");
//这个插件目的有两个，一个是显示报错信息，一个是报错后不终止当前gulp任务…
var notify = require("gulp-notify");
var concat = require("gulp-concat"); //将编译出来的css合并为一个文件
var plumber = require("gulp-plumber"); //处理管道奔溃

/* 
测试用--
gulp.task("default", function () {
  console.log("启动gulp...");
}); 
*/

gulp.task("compileLess", function () {
  gulp
    .src("less/*.less")
    //如果less文件中有语法错误，用notify插件报错，用plumber保证任务不会停止
    .pipe(
      plumber({ errorHandler: notify.onError("Error:<%= error.message %>;") })
    )
    .pipe(sourcemaps.init()) //初始话sourcemaps
    .pipe(less())
    .pipe(cssmin()) //兼容IE7 .pipe(cssmin({compatibility: 'ie7'}))
    // .pipe(concat("common.css")) //慎用：貌似跟sourcemap会冲突，编译失败！
    .pipe(sourcemaps.write("./maps")) //生成sourcemap文件，路径为./maps
    .pipe(gulp.dest("css"));  
});

//最后监听less变化，自动编译
gulp.task("default", function () {
  // gulp.watch("less/*.less", ['compileLess']); //这种写法过时了(gulp 3.x之前使用)
  gulp.watch("less/*.less", gulp.series('compileLess')); //gulp 4开始gulp.series()调用
});
