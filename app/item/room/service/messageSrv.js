/**
 * Created by NM-029 on 9/29/2016.
 */
var userClickMobileBound;
(function(module, win) {
    function messageFactory(httpSrv, $http, window, userSrv, notificationSrv, $timeout, paraCheckSrv, webSocketSrv,chatSrv) {
        //消息拼接
        var MsgGenerate = function () {
            this.emojiElePub = document.createElement("span");//公聊区创建span节点用于存放发言消息，便于过滤表情文本
            this.emojiElePri = document.createElement("span");//私聊区创建span节点用于存放发言消息，便于过滤表情文本
        };
        MsgGenerate.prototype = {
            constructor:MsgGenerate,
            get100Message:function(messageJson){//聊天消息
                messageJson.data.unread = true;
                messageJson.data.messageId = messageJson.messageId;
                chatSrv.funcReceiveWebSocketMsg(messageJson.data);
            }
        };
        var objMsgGenerate =  new MsgGenerate();


        //公聊私聊处理
        var ChatAreaSrv = function () {
            this.funcInit();
            this.EM_MAX_PUBLIC_CHAT_NUM = 50;                                   //公聊区最多显示多少条消息
            this.isFirstSend104IQ = true;
            this.dashboardShow = notificationSrv.funcGetDashboardShow();      //仪表盘显示
            //消息样式配置
            this.messageConfigMap = {};
            this.publicChatCache = [];
        };

        ChatAreaSrv.prototype = {
            constructor:ChatAreaSrv,
            funcInit:function () {
                var that = this;
                // if(!loginRegSrv.checkLoginStatus()){
                //     setTimeout(that.connectOpenfire(),3000);
                // }

                window.EventMd.create(eventEmType.EM_TYPE_ROOM_INIT).listen(eventEmType.EM_TYPE_ROOM_INIT, function(){
                });
            },
            //公聊私聊消息处理入口
            funcChatAreaMsgPro:function (objMsg) {
                this.funcMsgPreparePro(objMsg);
                if(!objMsg || !objMsg.range){
                    return ;
                }
                var range = objMsg.range;
                if(objMsg.richtext_web){
                    if (range==1) {
                        this.funcPublicChatMsgPro(objMsg);
                    }
                }
            },
            funcMsgCommonPro:function (msgTxt) {
                if(!msgTxt){
                    return ;
                }
                return msgTxt.replace(/\"/g, "");

            },
            funcMsgPreparePro:function (objMsg) {
                var message="";
                switch (objMsg.type)
                {
                    case gOb_msgType.EM_MSG_TYPE_100_MESSAGE_SEND://聊天消息
                        message = objMsgGenerate.get100Message(objMsg);
                        objMsg.richtext_web = message;
                        break;
                    case gOb_msgType.EM_MSG_TYPE_130_MESSAGE_OFFLINE_READ://聊天消息
                        message = objMsgGenerate.get130Message(objMsg);
                        objMsg.richtext_web = message;
                        break;
                    case gOb_msgType.EM_MSG_TYPE_140_MESSAGE_TRANSLATION://聊天消息
                        message = objMsgGenerate.get140Message(objMsg);
                        objMsg.richtext_web = message;
                        break;
                    case gOb_msgType.EM_MSG_TYPE_200_MESSAGE_FOCUS://聊天消息
                        message = objMsgGenerate.get200Message(objMsg);
                        objMsg.richtext_web = message;
                        break;
                    case gOb_msgType.EM_MSG_TYPE_300_SYSTEM_SECRETARY://聊天消息
                        message = objMsgGenerate.get300Message(objMsg);
                        objMsg.richtext_web = message;
                        break;
                    default:
                        break;
                }
            },
            //公聊消息处理
            funcPublicChatMsgPro:function (objMsg) {
                if(!objMsg || !objMsg.richtext_web){
                    return ;
                }
                var msgTxt = this.funcMsgCommonPro(objMsg.richtext_web);
                this.publicChatCache.push(msgTxt);
                if(this.publicChatCache.length>=this.EM_MAX_PUBLIC_CHAT_NUM){
                    this.publicChatCache.shift();
                }
            },
            funcSendMessage:function(msg){  //聊天消息
                this.sendPublicChatMessage(msg);
            },
            funcGetPublicChatCache:function () {
                return this.publicChatCache;
            },
            connectOpenfire:function(name,lessonid)
            {
                //TODO 暂时修改为config配   上线后改回来
                // var webSocketIp=userSrv.funcGetUser().funcGetLoginWsIp();
                   var webSocketIp=xsLocalOfIp;
                // var webSocketPort=userSrv.funcGetUser().funcGetLoginWsPort();
                  var webSocketPort=xsLocalOfPort;
                var protocol=projectVar.websocketProtocol;
                // var protocol='wss://';
                var openfireUrl=protocol+webSocketIp+":"+webSocketPort+"/ws/";

                webSocketSrv.connectServers(openfireUrl,name, this.funcOnMessageReceive.bind(this),
                    function (state) {
                        console.log('connectionStateCallBack state='+state);
                    },this.openfireConnectSuccess.bind(this)
                );
            },
            openfireConnectSuccess:function () {


            },
            //openfire 有消息过来时的回调
            funcOnMessageReceive: function (jsonObj) {
                console.log("openfire  jsonObj : ",jsonObj);
                var msgObj = {};
                /*添加uid    todo*/
                // msgObj.fromUid = jsonObj.fromUid;
                // msgObj.nickName = jsonObj.nickName;
                // msgObj.avatar = 'http://www.17sucai.com/preview/1/2017-06-26/talk/images/touxiang.png';
                // msgObj.text = jsonObj.msg;
                // msgObj.serverTime = new Date().getTime();
                chatSrv.funcReceiveWebSocketMsg(jsonObj);
                // Log.info("logging info: " + JSON.stringify(jsonObj));
                var msgType;
                if (!jsonObj || Object.keys(jsonObj).length==0) {
                } else {
                    var uid = userSrv.funcGetUser().funcGetUid(); // 当前房间的房间号
                    msgType = jsonObj.type;
                    // if (jsonObj.data.toUid == uid || jsonObj.data.fromUid == uid) { // 需要过滤是否是当前房间的消息
                        var tmpStr = JSON.stringify(jsonObj);
                        if (!(tmpStr.richtext_web != "" || tmpStr.anim != "")) {
                            return;
                        }
                        // console.log("message type:"+jsonObj.type);
                        if ((msgType == gOb_msgType.EM_MSG_TYPE_0_SYSTEM_NOTIFICATION)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_1_CALL_NOTIFICATION)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_2_CALL_ACCEPT)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_3_CALL_REFUSE)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_5_CURRICULUM_CHANGES)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_100_MESSAGE_SEND)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_110_MESSAGE_REPOST_CONFIRM)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_120_MESSAGE_REALTIME_READ)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_130_MESSAGE_OFFLINE_READ)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_140_MESSAGE_TRANSLATION)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_150_MESSAGE_SYSTEM)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_200_MESSAGE_FOCUS)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_300_SYSTEM_SECRETARY)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_400_SERVICE_RESPONSE)
                            || (msgType == gOb_msgType.EM_MSG_TYPE_401_CLIENT_RESPONSE)
                        ){
                            try {
                                if (jsonObj.type != 400) {
                                    var srcId = jsonObj.messageId;
                                    var timestamp = jsonObj.timestamp ;
                                    var json401Obj = new Object();
                                    var data = new Date().getTime();
                                    var nonce = parseInt(Math.random()*453395049,10)+1;
                                    var md5s = uid.toString() +new Date().getTime() + nonce ;
                                    json401Obj.type = 401; // 401收到消息做出应答
                                    json401Obj.messageId = CryptoJS.MD5(md5s) + ''; // 房间号
                                    json401Obj.timestamp = data;// 当前回应的时间
                                    json401Obj.nonce = nonce; //生成随机数
                                    json401Obj.data =
                                        {
                                            "srcId":srcId,
                                            "timestamp": timestamp
                                        };
                                    webSocketSrv.sendLoginMessage(json401Obj,jsonObj.data.fromUid);
                                    $timeout(function () {
                                        var messageIdArr = [];
                                        var MessageIdList = window.localStorage.MsIdLs;
                                        if(MessageIdList != ''){
                                            MessageIdList = JSON.parse(MessageIdList);
                                            for(var i=0;i<MessageIdList.length;i++){
                                                if(jsonObj.messageId == MessageIdList[i]){
                                                    return;
                                                }
                                            }
                                            MessageIdList.push(jsonObj.messageId);
                                            window.localStorage.MsIdLs = JSON.stringify(MessageIdList); //将storage转变为字符串存储
                                        }else{
                                            messageIdArr.push(jsonObj.messageId);
                                            window.localStorage.MsIdLs = JSON.stringify(messageIdArr);
                                        }
                                        //OF 驱动的数据不更新VIEW,用$timeout用可以解决这个问题，目前还没有想到更好的办法
                                        $timeout(function () {
                                            chatAreaSrv.funcChatAreaMsgPro(jsonObj);
                                        });
                                        window.EventMd.create(eventEmType.EM_SPACE_MESSAGE).trigger("" + jsonObj.type, jsonObj);
                                    });
                                }
                            } catch (e) {
                                console.log('msgType:' + jsonObj.type);
                                console.log(e);
                            }
                            if(jsonObj.type == 1){
                                this.dashboardShow.funcSetIsShow(true);
                            }
                        }
                    // }
                }
            }
        };
        var chatAreaSrv = new ChatAreaSrv();
        return chatAreaSrv;
    }
    module.factory('xsWeb.room.messageSrv', ['xsWeb.common.httpSrv', '$http', '$window',  'xsWeb.common.userSrv',
        'xsWeb.common.notificationSrv','$timeout',  'xsWeb.common.paraCheckSrv', 'xsWeb.common.webSocketSrv', 'xsWeb.room.chatSrv',messageFactory]);

    //message type
    var gOb_msgType = {
        EM_MSG_TYPE_0_SYSTEM_NOTIFICATION: 0,                   //系统通知
        EM_MSG_TYPE_1_CALL_NOTIFICATION: 1,                     //来电通知
        EM_MSG_TYPE_2_CALL_ACCEPT: 2,                           //接听通知
        EM_MSG_TYPE_3_CALL_REFUSE: 3,                           //挂断/拒绝
        EM_MSG_TYPE_5_CURRICULUM_CHANGES: 5,                    //课程变化
        EM_MSG_TYPE_100_MESSAGE_SEND: 100,                      //聊天   发送文本
        EM_MSG_TYPE_110_MESSAGE_REPOST_CONFIRM: 110,            //聊天   转发确认
        EM_MSG_TYPE_120_MESSAGE_REALTIME_READ: 120,             //聊天   实时消息已读反馈
        EM_MSG_TYPE_130_MESSAGE_OFFLINE_READ: 130,              //聊天   离线消息已读反馈
        EM_MSG_TYPE_140_MESSAGE_TRANSLATION: 140,               //聊天   消息翻译结果
        EM_MSG_TYPE_150_MESSAGE_SYSTEM: 150,                    //聊天   聊天区系统消息
        EM_MSG_TYPE_200_MESSAGE_FOCUS: 200,                     //关注消息
        EM_MSG_TYPE_300_SYSTEM_SECRETARY: 300,                  //小秘书
        EM_MSG_TYPE_400_SERVICE_RESPONSE: 400,                  //服务端应答
        EM_MSG_TYPE_401_CLIENT_RESPONSE: 401                    //客户端应答
    };
    window.gOb_msgType = gOb_msgType;

})(roomModule, window);

