/**
 * Created by NM-029 on 11/23/2016.
 */
var webTargetDir = 'app/';
var versionDir = 'xm161121/';       //按日期打包
var versionHtmlDir = 'dist/';       //按日期打包
var tempSrc = 'app/dist/';
var tempjs = tempSrc +'js/';
var tempcss = tempSrc +'css/';
var item = webTargetDir +'item/';
var traditional = webTargetDir +'traditional/';
var temphtml = item+ "**/*.html";
var tempImg = webTargetDir +'images/';



var gulp = require('gulp');
var rev = require('gulp-rev');
var minifycss = require('gulp-minify-css');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var revCollector = require('gulp-rev-collector'),
    minifyHtml = require("gulp-minify-html"),
    concat = require('gulp-concat'),
    ngHtml2Js = require("gulp-ng-html2js");
var url = require('url');
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var download_file_wget = function(file_url, download_dir, callback) {

    // extract the file name
    var file_name = url.parse(file_url).pathname.split('/').pop();
    // compose the wget command
    var wget = 'wget -P ' + download_dir + ' ' + file_url;
    // excute wget using child_process' exec function
    var path = download_dir+file_name;
    console.log(path);
    fs.unlink(path, function() {
        console.log(file_name+' deleted');
        var child = exec(wget, function (err, stdout, stderr) {
            if (err) throw err;
            else {
                if (typeof callback === 'function') {
                    callback();
                }
                console.log(file_name + ' downloaded to ' + download_dir);
            }
        });
    });
};

/*
1. 从HTML中获取js/CSS
2. 合并这些JS/CSS
3. 重命名HTML中引用的JS/CSS
*/

var souceJsInHtml = [];
var souceCssInHtml = [];

var festJsonCfg = {};
var festCssCfg = {};
var festImgCfg = {};
var festCfg={merge:true};

var versionCssDir = versionDir+'css/';  //在HTML中的CSS URL
var versionJsDir = versionDir+'js/';    //在HTML中的JS URL
var versionImgDir = versionDir+'images/';    //在HTML中的JS URL
var versionHtml2jsDir = versionDir+'html/';    //在HTML中的html URL
var g_destCssUrlInHtml = '/'+versionCssDir;    //在HTML中的CSS URL
var g_destJsUrlInHtml = '/'+versionJsDir;    //在HTML中的JS URL

function funcFormatDate(date){
    return date<10?'0'+date:date;
}

//打包目录
function funcGetDate(){
    var date = new Date();
    var year = date.getFullYear() + '';
    versionHtmlDir += 'xm'+year.slice(2)+funcFormatDate(date.getMonth()+1)+funcFormatDate(date.getDate())+'/';
    versionDir = webTargetDir+versionHtmlDir;
    versionCssDir = versionDir+'css/';  //在HTML中的CSS URL
    versionJsDir = versionDir+'js/';    //在HTML中的JS URL
    versionImgDir = versionDir+'images/';    //在HTML中的JS URL
    versionHtml2jsDir = versionDir+'html/';    //在HTML中的JS URL
}

//1. 从HTML中获取js/CSS
function funcGetJsOrCssFromHtml(taskName, depTask) {
    gulp.task(taskName, depTask, function(){
    return gulp.src("app/index.html")
        .pipe(useref({
            // each property corresponds to any blocks with the same name, e.g. "build:import"
            mybase: function (content, target, options, alternateSearchPath) {
                // do something with `content` and return the desired HTML to replace the block content
                //(/^\s+|\s+$/g,"");
                var tmp = content.replace(/<!--/, '').replace(/-->/, '');
                // console.log('-------------'+content+', tmp:'+tmp);
                return tmp;
            }
        }))
        .pipe(gulp.dest(tempSrc));
    });
}

function funcMiniCss(taskName, depTask){
    gulp.task(taskName, depTask, function(){
        return gulp.src(tempcss+'/*.css')
            .pipe(minifycss({compatibility: 'ie8',advanced:false,aggressiveMerging:false}))
            .pipe(rev())
            .pipe(gulp.dest(versionCssDir))
            .pipe(rev.manifest(festCssCfg))
            .pipe(gulp.dest(versionCssDir));
    });
}
function funcMiniJs(taskName, depTask){
    gulp.task(taskName,depTask, function() {
        return gulp.src(tempjs+'/*.js').pipe(uglify()).pipe(rev()).pipe(gulp.dest(versionJsDir)).pipe(rev.manifest(festCfg)).pipe(gulp.dest(versionJsDir));
    });
}

function funcMiniImages(taskName, depTask){
    gulp.task(taskName,depTask, function() {
        return gulp.src([tempImg+'/**/*.png', tempImg+'/**/*.jpg',tempImg+'/**/**/*.png', tempImg+'/**/**/*.jpg'])
            .pipe(rev()).pipe(gulp.dest(versionImgDir)).pipe(rev.manifest(festImgCfg)).pipe(gulp.dest(versionImgDir));
    });
}
//修改资源文件的引用
function modefiySourceUrl(taskName, dependTask) {
    var manifestSrc = [versionCssDir+'*manifest.json', versionJsDir+'*manifest.json', versionHtml2jsDir+'*manifest.json'];//,festCssPath+'rev-manifest.json','*manifest.json'
    console.log("manifestName:"+taskName.toString());
    var dirReplace = {
        'css/': versionHtmlDir+'css/',
        'js/': versionHtmlDir+'js/'
    };
    gulp.task(taskName, dependTask, function () {
        var manifestName = manifestSrc.concat();
        manifestName.push(tempSrc+'*.html');
        return gulp.src(manifestName)
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: dirReplace
            }))
            //.pipe(minifyHtml({conditionals: true, loose: true}))
            .pipe(gulp.dest(webTargetDir));
        //gulp.task('del', require('del')('rev'));//最后删除过渡文件目录
    });
}
function modefiySourceImgUrl(taskName, dependTask) {
    var manifestSrc = [versionImgDir+'*manifest.json'];//,festCssPath+'rev-manifest.json','*manifest.json'
    console.log("manifestName:"+taskName.toString());
    var imgUrl = "/"+versionHtmlDir + 'images/';
    var dirReplace = {
        '../../../../images/': imgUrl,
        '../../../images/': imgUrl,
        '../../images/': imgUrl,
        '../images/': imgUrl
    };
    gulp.task(taskName, dependTask, function () {
        var manifestName = manifestSrc.concat();
        manifestName.push(tempcss+'/*.css');
        return gulp.src(manifestName)
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: dirReplace
            }))
            //.pipe(minifyHtml({conditionals: true, loose: true}))
            .pipe(gulp.dest(tempcss));
        //gulp.task('del', require('del')('rev'));//最后删除过渡文件目录
    });
}

function modefiySourceHtmlImgUrl(taskName, dependTask) {
    var manifestSrc = [versionImgDir+'*manifest.json'];//,festCssPath+'rev-manifest.json','*manifest.json'
    console.log("manifestName:"+taskName.toString());
    var imgUrl = "/"+versionHtmlDir + 'images/';
    var dirReplace = {
        '../../../../images/': imgUrl,
        '../../../images/': imgUrl,
        '../../images/': imgUrl,
        '../images/': imgUrl
    };
    gulp.task(taskName, dependTask, function () {
        var manifestName = manifestSrc.concat();
        manifestName.push(temphtml);
        return gulp.src(manifestName)
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: dirReplace
            }))
            //.pipe(minifyHtml({conditionals: true, loose: true}))
            .pipe(gulp.dest(item));
        //gulp.task('del', require('del')('rev'));//最后删除过渡文件目录
    });
}
function funcHtml2Js(taskName, dependTask){
    gulp.task(taskName, dependTask, function () {
        return gulp.src("app/item/**/html/*.html")
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe(ngHtml2Js({
                moduleName: "xsWeb",
                prefix: "item/"
            }))
            .pipe(concat("partials.js"))
            .pipe(uglify()).pipe(rev()).pipe(gulp.dest(versionJsDir)).pipe(rev.manifest(festCfg)).pipe(gulp.dest(versionHtml2jsDir));
    });
}

function main(){
    var minCssTaskName = 'minifycss';
    var minImgTaskName = 'minifyImg';
    var minJsTaskName = 'minifyjs';
    var modefiySourceUrlhtml = 'modefiySourceUrlhtml';
    var modefiySourceImgCss = 'modefiySourceImgCss';
    var modefiySourceImgHtml = 'modefiySourceImgHtml';
    var userefTaskName = 'useref';
    var minHtmlTaskName = 'minHtml';
    funcGetDate();
    funcGetJsOrCssFromHtml(userefTaskName, null);
    funcMiniImages(minImgTaskName, [userefTaskName]);
    modefiySourceImgUrl(modefiySourceImgCss, [userefTaskName,minImgTaskName]);
    modefiySourceHtmlImgUrl(modefiySourceImgHtml, [userefTaskName,minImgTaskName]);
    funcMiniCss(minCssTaskName, [userefTaskName,minImgTaskName, modefiySourceImgCss]);


    funcMiniJs(minJsTaskName, [userefTaskName,minImgTaskName], modefiySourceImgCss);
    funcHtml2Js(minHtmlTaskName, [minCssTaskName, minJsTaskName, modefiySourceImgHtml]);
    modefiySourceUrl(modefiySourceUrlhtml,[minCssTaskName, minJsTaskName, modefiySourceImgHtml, minHtmlTaskName]);

    gulp.task('default',function() {
        //第三方登录会用到 custUser.js / base64.js
        // var jsFiles = ['/app/item/common/js/custUser.js', '/app/item/common/js/base64.js', '/app/item/common/js/jquery.valid.js',
        //     '/app/item/common/js/crypto-js.js'];
        // for(var i=0; i<jsFiles.length; i++){
        //     download_file_wget(commonProjectUrl + jsFiles[i], item+'common/js/', function(){
        //     });
        // }
        // var traJsFiles = ['/app/item/common/js/custUser.js', '/app/item/common/js/utils.js', '/app/item/common/js/geetest.js', '/app/item/common/js/base64.js'];
        // for(var i=0; i<traJsFiles.length; i++){
        //     download_file_wget(commonProjectUrl + traJsFiles[i], traditional+'js/common/', function(){
        //     });
        // }
        // download_file_wget(commonUrl, tempjs, function(){
        //     gulp.start([userefTaskName, minCssTaskName, minImgTaskName, modefiySourceImgCss, minJsTaskName, modefiySourceImgHtml,
        //         modefiySourceUrlhtml, minHtmlTaskName]);
        // });
        gulp.start([userefTaskName, minCssTaskName, minImgTaskName, modefiySourceImgCss, minJsTaskName, modefiySourceImgHtml,
            modefiySourceUrlhtml, minHtmlTaskName]);
    });
}
main();
