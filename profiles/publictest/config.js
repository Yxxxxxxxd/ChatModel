var xsServiceURL = "https://e1test.upanda.com/v2";
var ZEGOServiceUrl = 'wss://wsliveroom451978756-api.zegocloud.com:8282/ws';
var ZEGOLogServiceUrl = 'wss://wslogger451978756-api.zegocloud.com:8282/log';
var followingMsg = '';                          //资源关注消息 key :following.message.template
var followingMsgArr = [];
var xsLocalOfIp = 'of1test.upanda.com';
var xsLocalOfPort = 7443;
var SecretKey = '1000snfj';

var RoomLessonId = 0;
var addressHost=window.location.host;
var urlAppId = 'panda';
var urlH5Mode = false;
var Lang = navigator.language||navigator.userLanguage;
var Terminal = 'WEB';
var APPName = 'upanda';
var APPVersion = '1.1.0';
var ConstantsResource = [];

var isLocal = false;         //is local debug mode ,traditional 签名要用到