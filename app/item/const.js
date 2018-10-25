/**
 * Created by hf-mini on 15/11/17.
 */

var _requestValidConfigString = "s" + "h" + "0" + "w" + "s" + "e" + "l" + "f" + "h" + "5";
var _hf_constants1 = "hong";
var _hf_constants2 = "hren";
var _hf_constants3 = "ac57";
var _hf_constants4 = "2000";

var _gf_constants1 = "showsi";
var _gf_constants2 = "1000gn";
var _gf_constants3 = "showData";

var rk = "p" + "1" + "a" + "y" + "b" + "a" + "c" + "k";

var projectType = {
    PROJECT_HONG_REN : 0x01,
    PROJECT_MI_FENG : 0x02
};
var projectVar = {
    moneyName:'红钻',
    wx:'红人live',
    customerServiceQQ:'2881510090',
    recruitQQ:'2881510091',
    webSiteName:'红人',
    url:'yu361.com',
    channelId:'30301100',
    anchorSwfUrl:'swf/anchorSwf/hranchorplayer.swf',
    indexSwfUrl:'swf/hrindexplayer/hrindexplayer.swf',
    roomSwfUrl:'swf/hrroomplayer/hrroomplayer.swf',
    bubbleUrl:'http://pics.yu361.com/icons/of/game/',
    pluginLowVersion:'316',
    PROJECT_TYPE : projectType.PROJECT_HONG_REN,
    anchorVideoH5 : true,
    mobileBoundText:'绑定手机号，账号有保障！',
    websocketProtocol:location.protocol=='https:' ?'wss://':'ws://',
    opDomain:'',
    opPanda:'yxdof',
    opVersion:'1.0',
    opSpace:'showspace',
    opTerminal:'W',
    opProDomain:'openfire.cn',
    //要屏蔽的插件数组
    // forbitPluginArr:["秀色直播助手","蜜疯直播助手","红人直播助手","乐嗨直播助手","嗨秀直播助手","6RoomsCamV10","YY伴侣","酷狗直播伴侣","91KBOX"],
    forbitPluginArr:["助手","伴侣","6RoomsCamV10","YY伴侣","酷狗直播伴侣","91KBOX"],
    foraudioPluginArr:["默认","通讯"]

};

var WebSocketId = 0;
//环境变量
var envVar = {
    https:location.protocol=='https:',
    protocol : location.protocol=='https:' ? "https://" : "http://",
    isSupportCss3Animation:false
};

var systemVar = {
    animationFg:true            //礼物特效开关
};
