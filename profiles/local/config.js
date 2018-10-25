

var xsServiceURL = "https://innertest-mifengvv.com/v2";
var LOGIN_TYPE_VISITOR=0;
var LOGIN_TYPE_USER=1;
var ZEGOServiceUrl = 'wss://test2-wsliveroom-api.zego.im:8282/ws';
var ZEGOLogServiceUrl = 'wss://wslogger-test.zego.im:8282/log';
var xsLocalOfIp = 'of1.panda.tv';
var xsLocalOfPort = 7443;
var SecretKey = '123456';
var RoomLessonId = 0;
var followingMsg = '';                          //资源关注消息 key :following.message.template
var followingMsgArr = [];
//设置游客信息默认值
var visitorUser = {
    name: "游客",
    loginType: LOGIN_TYPE_VISITOR
};
var urlAppId = 'panda';
var Lang = navigator.language||navigator.userLanguage;
var Terminal = 'WEB';
//var urlH5Mode = false;
var urlH5Mode = true;
var APPName = 'upanda';
var APPVersion = '1.1.0';
var ConstantsResource = [];

var isLocal = false;         //traditional 签名要用到


