/**
 * Created by NM-029 on 11/23/2016.
 */
var webTargetDir = 'app/';
var versionDir = 'dist/';       //按日期打包
var tempSrc = 'app/traditional/';
var tempjs = tempSrc +'js/';
var tempItem = 'app/item/';
var tempcss = tempSrc +'css/';
var temphtml = tempSrc +'html/';
var tempImg = tempSrc+'img/';

var distImgUrl ='/';
var distCssUrl ='/';
var distJsUrl ='/';

var IS_MIN = false;


var imgMiniTask = [];
var imgUrlTask = [];
var fistGulpTask=[];
var modifySourceUrlTask=[];

var gulp = require('gulp');
var rev = require('gulp-rev');
var minifycss = require('gulp-minify-css');
// var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var concat = require('gulp-concat'),
    rename = require('gulp-rename');
var revCollector = require('gulp-rev-collector');
var url = require('url');
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

/*
1. 从HTML中获取js/CSS
2. 合并这些JS/CSS
3. 重命名HTML中引用的JS/CSS
*/

var souceJsInHtml = [];
var souceCssInHtml = [];

var festJsonCfg = {};
var festCssCfg = {merge:true};
var festImgCfg = {merge:true};
var festCfg={merge:true};

var versionCssDir = versionDir+'css/';  //在HTML中的CSS URL
var versionJsDir = versionDir+'js/';    //在HTML中的JS URL
var versionImgDir = versionDir+'img/';    //在HTML中的JS URL
var versionHtmlDir = versionDir+'html/';    //在HTML中的JS URL
var g_destCssUrlInHtml = '/'+versionCssDir;    //在HTML中的CSS URL
var g_destJsUrlInHtml = '/'+versionJsDir;    //在HTML中的JS URL

function funcFormatDate(date){
    return date<10?'0'+date:date;
}

//打包目录
function funcGetDate(){
    var date = new Date();
    versionDir += 'hr'+date.getFullYear()+funcFormatDate(date.getMonth()+1)+funcFormatDate(date.getDate())+'/';
    distImgUrl += versionDir+'images/';    //在HTML中的JS URL
    distCssUrl += versionDir+'css/';    //在HTML中的JS URL
    distJsUrl += versionDir+'js/';    //在HTML中的JS URL

    versionDir = webTargetDir+versionDir;
    versionCssDir = versionDir+'css/';  //打包时文件所在的路径
    versionJsDir = versionDir+'js/';    //打包时文件所在的路径
    versionImgDir = versionDir+'images/';    //打包时文件所在的路径
    versionHtmlDir = versionDir+'html/';    //打包时文件所在的路径


}

function funcMiniCss( depTask){
    var taskName = 'funcMiniCss';
    gulp.task(taskName, depTask, function(){
        return gulp.src([tempcss+'/*.css', tempcss+'/*/*.css'])
            .pipe(minifycss({compatibility: 'ie8',advanced:false,aggressiveMerging:false}))
            .pipe(rev())
            .pipe(gulp.dest(versionCssDir))
            .pipe(rev.manifest(festCssCfg))
            .pipe(gulp.dest(versionCssDir));
    });
    fistGulpTask.push(taskName);
}
var jsEncryptOutJs = "login.js";


function funcAjaxEncryptPro(depTask){
    var jsPre = tempItem + 'common/js/';
    var jsEncryptSrcJs = [jsPre+'jquery.valid.js',jsPre+'crypto-js.js',tempItem+'const.js',tempjs+"common/"+jsEncryptOutJs];
    console.log(jsEncryptSrcJs);
    var taskname = "renamejs-encrypt";
    gulp.task(taskname, depTask, function(){
        return gulp.src(jsEncryptSrcJs)      //需要操作的文件
            .pipe(concat(jsEncryptOutJs))//合并所有js到otherpage.js
            //.pipe(gulp.dest('js'))       //输出到文件夹
            .pipe(rename({suffix: ''}))   //rename压缩后的文件名
            //.pipe(uglify().on('error', gutil.log))    //压缩
            .pipe(gulp.dest(tempjs+"common/"));  //输出
    });
    imgUrlTask.push(taskname);
}

function funcMiniJs(depTask){
    var taskName = 'funcMiniJs';
    gulp.task(taskName,depTask, function() {
        return gulp.src([tempjs+'*.js',tempjs+'**/*.js']).pipe(uglify()).pipe(rev()).pipe(gulp.dest(versionJsDir)).pipe(rev.manifest(festCfg)).pipe(gulp.dest(versionJsDir));
    });
    fistGulpTask.push(taskName);
}

//修改资源文件的引用
function modifySourceUrl(dependTask) {
    var taskName = 'modifySourceUrl';
    var manifestSrc = [versionCssDir+'*manifest.json', versionJsDir+'*manifest.json'];//,festCssPath+'rev-manifest.json','*manifest.json'
    console.log("manifestName:"+taskName.toString());
    var dirReplace = {
        '../../css/': distCssUrl,
        '../../js/': distJsUrl,
        '../css/': distCssUrl,
        '../js/': distJsUrl
    };
    gulp.task(taskName, dependTask, function () {
        var manifestName = manifestSrc.concat();
        manifestName.push(temphtml+'*.html');manifestName.push(temphtml+'**/*.html');
        return gulp.src(manifestName)
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: dirReplace
            }))
            //.pipe(minifyHtml({conditionals: true, loose: true}))
            .pipe(gulp.dest(temphtml));
        //gulp.task('del', require('del')('rev'));//最后删除过渡文件目录
    });
    modifySourceUrlTask.push(taskName);
}


/**
 * images files rename with hash code
 * @param taskName
 * @param depTask
 */
function funcMiniImages(depTask){
    var taskName = "funcMiniImages";
    gulp.task(taskName, function() {
        var imgFiles = [tempImg+'*.png', tempImg+'*.jpg',tempImg+'*.gif', tempImg+'**/*.png', tempImg+'**/*.jpg',
            tempImg+'**/*.gif',tempImg+'**/**/*.png', tempImg+'**/**/*.jpg',tempImg+'**/**/*.gif'];
        console.log('imgFiles:'+imgFiles+', versionImgDir:'+versionImgDir);
        return gulp.src(imgFiles)
            .pipe(rev()).pipe(gulp.dest(versionImgDir)).pipe(rev.manifest(festImgCfg)).pipe(gulp.dest(versionImgDir));
    });
    imgMiniTask.push(taskName);
}

function modefiySourceImgUrl(dependTask) {
    var manifestSrc = [versionImgDir+'*manifest.json'];//,festCssPath+'rev-manifest.json','*manifest.json'
    console.log("manifestName: modefiySourceImgUrl");
    var imgUrl = distImgUrl;
    var dirReplace = {
        '../../../../img/': imgUrl,
        '../../../img/': imgUrl,
        '../../img/': imgUrl,
        '../img/': imgUrl,
        '/traditional/img/': imgUrl,
        'traditional/img/': imgUrl
    };
    var taskName = "funcImgUrlCss";
    gulp.task(taskName, dependTask, function () {
        var manifestName = manifestSrc.concat();
        var cssFiles = [tempcss+'*.css', tempcss+'**/*.css', tempcss+'**/**/*.css'];
        manifestName = manifestName.concat(cssFiles);
        return gulp.src(manifestName)
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: dirReplace
            }))
            //.pipe(minifyHtml({conditionals: true, loose: true}))
            .pipe(gulp.dest(tempcss));
        //gulp.task('del', require('del')('rev'));//最后删除过渡文件目录
    });
    imgUrlTask.push(taskName);

    taskName = "funcImgUrlHtml";
    gulp.task(taskName, dependTask, function () {
        var manifestName = manifestSrc.concat();
        manifestName.push(temphtml+'*.html');manifestName.push(temphtml+'**/*.html');
        return gulp.src(manifestName)
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: dirReplace
            }))
            //.pipe(minifyHtml({conditionals: true, loose: true}))
            .pipe(gulp.dest(temphtml));
        //gulp.task('del', require('del')('rev'));//最后删除过渡文件目录
    });
    imgUrlTask.push(taskName);

    taskName = "funcImgUrlJs";
    gulp.task(taskName, dependTask, function () {
        var manifestName = manifestSrc.concat();
        manifestName.push(tempjs+'*.js');
        manifestName.push(tempjs+'**/*.js');
        return gulp.src(manifestName)
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: dirReplace
            }))
            //.pipe(minifyHtml({conditionals: true, loose: true}))
            .pipe(gulp.dest(tempjs));
        //gulp.task('del', require('del')('rev'));//最后删除过渡文件目录
    });
    imgUrlTask.push(taskName);
}

function main(){
    funcGetDate();
    funcMiniImages();
    modefiySourceImgUrl(imgMiniTask);
    funcAjaxEncryptPro(imgMiniTask);
    funcMiniCss(imgMiniTask.concat(imgUrlTask));
    funcMiniJs(imgMiniTask.concat(imgUrlTask));
    modifySourceUrl(imgMiniTask.concat(imgUrlTask).concat(fistGulpTask));
    gulp.task('default',function() {
        gulp.start(imgMiniTask.concat(imgUrlTask).concat(fistGulpTask).concat(modifySourceUrlTask));
    });
}
main();
