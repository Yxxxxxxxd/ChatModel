

// var xsServiceURL = "http://192.168.84.142:81/v2";
var xsServiceURL = "https://e1test.upanda.com/v2";
// var xsServiceURL = "https://e1.upanda.com/v2";
// var xsServiceURL = "http://192.168.83.77:8089/v2";               //科峰
// var ZEGOServiceUrl = 'wss://test2-wsliveroom-api.zego.im:8282/ws';
// var ZEGOLogServiceUrl = 'wss://wslogger-test.zego.im:8282/log';
var ZEGOServiceUrl = 'wss://wsliveroom451978756-api.zegocloud.com:8282/ws';
var ZEGOLogServiceUrl = 'wss://wslogger451978756-api.zegocloud.com:8282/log';
// var xsLocalOfIp = '127.0.0.1';
var xsLocalOfPort = 7070;
var xsLocalOfIp = '47.98.214.64';
// var xsLocalOfPort = 7443;
var RoomLessonId = 0;
var followingMsg = '';                          //资源关注消息 key :following.message.template
var followingMsgArr = [];
var Lang = navigator.language||navigator.userLanguage;
var Terminal = 'WEB';
var urlH5Mode = false;
// var SecretKey = '123456';
var SecretKey = '1000snfj';
var APPName = 'upanda';
var APPVersion = '1.1.0';
var ConstantsResource = [];

var urlAppId = 'panda';
var addressHost=window.location.host;

var isLocal = false;         //is local debug mode ,traditional 签名要用到
