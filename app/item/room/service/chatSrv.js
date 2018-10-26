/**
 * Created by NM-029 on 9/29/2016.
 */
//交流相关：发言/飞屏
(function(roomModule) {
    'use strict';

    var chatFactory = function ($timeout, httpSrv, $http, roomSrv, userSrv, notificationSrv, webSocketSrv,paraCheckSrv) {

        var SPEAK_2_LIST_MAX_NUM = 5;   //对谁说最多显示5个用户
        var QUIET_SPEAK_2_LIST_MAX_NUM = 7;   //私聊说最多显示5个用户

        var Speak2who = function (uid, userName, avatar, index, serverTime, lastMsg,sortServerTime,msgTime,unread,lessonId) {
            this.uid = uid;
            this.name = userName;
            this.avatar = avatar;
            this.index = index;
            this.serverTime = serverTime;
            this.lastMsg = lastMsg;
            this.sortServerTime = sortServerTime;
            this.msgTime = msgTime;
            this.unread = unread;
            this.nameAll = userName;
            this.lessonId = lessonId;
        };
        Speak2who.prototype = {
            constructor:Speak2who,
            funcGetName:function () {
                return this.nameAll;
            },
            funcGetFormatName:function () {
                return this.name.length>6?this.name.substr(0,6)+'...':this.name;
            },
            funcGetUid:function () {
                return this.uid;
            },
            funcGetAvatar:function () {
                return this.avatar;
            },
            funcGetIndex:function () {
                return this.index;
            },
            funcGetServerTime:function () {
                return this.serverTime;
            },
            funcGetLastMsg:function () {
                return this.lastMsg;
            },
            funcGetSortServerTime:function () {
                return this.sortServerTime;
            },
            funcGetMsgTime:function () {
                return this.msgTime;
            },
            funcGetUnread:function () {
                return this.unread;
            },
            funcGetLessonId:function () {
                return this.lessonId;
            },
            funcSetName:function (name) {
                this.name = name;
            },
            funcSetUid:function (uid) {
                this.uid = uid;
            },
            funcSetAvatar:function (avatar) {
                this.avatar = avatar;
            },
            funcSetIndex:function (index) {
                this.index = index;
            },
            funcSetServerTime:function (serverTime) {
                this.serverTime = serverTime;
            },
            funcSetLastMsg:function (lastMsg) {
                this.lastMsg = lastMsg;
            },
            funcSetSortServerTime:function (sortServerTime) {
                this.sortServerTime = sortServerTime;
            },
            funcSetMsgTime:function (msgTime) {
                this.msgTime = msgTime;
            },
            funcSetUnread:function (unread) {
                this.unread = unread;
            },
            funcSetLessonId:function (lessonId) {
                this.lessonId = lessonId;
            }
        };

        //私聊中的消息
        var ChatMessage = function(dir, msg, time, historyId,transMsg){
            var _self = this;
            _self.dir = dir;
            _self.msg = msg;
            _self.time = time;
            _self.historyId = historyId;
            _self.transMsg = transMsg;
        };
        ChatMessage.MSG_TYPE_TEXT = 1;
        ChatMessage.MSG_TYPE_VOICE = 2;
        ChatMessage.MSG_TYPE_VIDEO = 3;
        ChatMessage.prototype = {
            constructor:ChatMessage,
            MSG_DIR_SEND:0,
            MSG_DIR_RECV:1,
            funcGetMsgDir:function () {
                return this.dir;
            },
            funcGetMsg:function () {
                return this.msg;
            },
            funcGetFormatTime:function () {
                return this.time;
            },
            funcGetChatHistoryId:function () {
                return this.historyId;
            },
            funcGetTransMsg:function () {
                return this.transMsg;
            },
            funcSetTransMsg:function (transMsg) {
                this.transMsg = transMsg;
            }
        };

        //私聊
        var QuietChat = function(speak2){
            var _self = this;
            _self.speak2 = speak2;
            _self.messages = [];
            _self.Roommessages = [];
            _self.serverTime = [];
            _self.msgTime = [];
            _self.isShow = true;                //user may close this item
            _self.closeImgIsShow = false;        //close image is show
        };
        QuietChat.prototype = {
            constructor:QuietChat,
            funcGetSpeak2:function () {
                return this.speak2;
            },
            funcGetMessages:function () {
                return this.messages;
            },
            funcGetRoomMessages:function () {
                return this.Roommessages;
            },
            funcGetServerTime:function(){
                return this.serverTime;
            },
            funcGetMsgTime:function(){
                return this.msgTime;
            },
            funcGetIsShow:function () {
                return this.isShow;
            },
            funcGetCloseImgIsShow:function () {
                return this.closeImgIsShow;
            },
            funcSetIsShow:function (isShow) {
                this.isShow = isShow;
            },
            funcSetCloseImgIsShow:function (isShow) {
                this.closeImgIsShow = isShow;
            }
        };
        //quiet panel show control, because of websocket will receive message and dispaly quiet chat tip panel, so we let this bit here.
        var ChatPaneShow = function (dialogShow, dialogTipShow, highlight) {
            this.dialogShow = dialogShow;
            this.dialogTipShow = dialogTipShow;
            this.dialogTipHighlight = highlight;        //目前没有使用这个属性，使用的是quietChatRecvNewUidList.length
        };
        ChatPaneShow.prototype = {
            constructor:ChatPaneShow,
            funcGetDialogShow:function () {
                return this.dialogShow;
            },
            funcGetDialogTipShow:function () {
                return this.dialogTipShow;
            },
            funcGetDialogTipHighlight:function () {
                return this.dialogTipHighlight;
            },
            funcSetDialogShow:function (isShow) {
                this.dialogShow = isShow;
            },
            funcSetDialogTipShow:function (isShow) {
                this.dialogTipShow = isShow;
            },
            funcSetDialogTipHighlight:function (highlight) {
                this.dialogTipHighlight = highlight;
            }
        };

        // service
        var ChatSrv = function () {
            this.speak2List = [];  //给谁送礼列表
            this.selectedSpeak2who = {};    //现在选中给谁送礼

            this.firstFlyScreenFg = 0;      //是不第一次发送飞屏
            this.msgContent = '';           //缓存发送的内容
            //private chat
            this.quietChatRecvNewUidList = []; //接收到的私聊消息（未读）的UID
            this.quietSpeck2List = [];      //私聊列表，存储的是QuietChat
            this.roomSpeck2List = [];       //房间内聊天
            this.selectedQuietSpeak2who = new Speak2who();    //现在选中给谁私聊
            this.quietSpeckTip = new Speak2who();               //右下角提示
            this.chatPaneShow = new ChatPaneShow(false, false, false);
            this.webSocket = null;


            this.funcInit();
        };

        ChatSrv.prototype={
            constructor:ChatSrv,
            funcInit:function () {
                var that = this;
                window.EventMd.create(eventEmType.EM_TYPE_ROOM_INIT).listen(eventEmType.EM_TYPE_ROOM_INIT, function(){
                    that.funcReadyInit();
                });

                /*监听到点击的单个对象的时候将消息数组清空，避免储存数据的时候出错*/
                window.EventMd.create(eventEmType.CHANGE_TAB_CLICK).listen(eventEmType.CHANGE_TAB_CLICK, function(speakUid){
                    var quietChat;
                    if(quietChat = that.funcGetQuietChatObjByUid(speakUid)){
                        quietChat.funcGetMessages().length = 0;
                    }
                });
            },
            funcReadyInit:function () {
                this.funcAddPeople2QuietSpeakList();
            },
            funcGetSpeakGift2List:function () {
                return this.speak2List;
            },
            funcGetSelectedSpeak2who:function () {
                return this.selectedSpeak2who;
            },
            funcSetSelectedSpeak2who:function (speck2) {
                var speak2who = speck2;
                this.selectedSpeak2who.uid = speak2who.uid;
                this.selectedSpeak2who.name = speak2who.name;
                this.selectedSpeak2who.avatar = speak2who.avatar;
            },

            /*==================== 私聊 =======================*/
            funcSetSelectedQuietSpeak2who:function (speck2, index) {
                var that = this;
                var speak2who = speck2;
                var uid = userSrv.funcGetUser().funcGetUid(); // 当前房间的房间号
                this.selectedQuietSpeak2who.funcSetUid(speak2who.uid);
                this.selectedQuietSpeak2who.funcSetName(speak2who.name);
                this.selectedQuietSpeak2who.funcSetAvatar(speak2who.avatar);
                this.selectedQuietSpeak2who.funcSetIndex(index);
                //update speck tip
                this.quietSpeckTip.funcSetUid(speak2who.uid);
                this.quietSpeckTip.funcSetName(speak2who.name);
                this.quietSpeckTip.funcSetAvatar(speak2who.avatar);
                this.quietSpeckTip.funcSetIndex(index);

                this.funcRemoveFromQuietRecvNewUidList(speak2who.uid);
            },
            funcGetCurrenQuietSpeck:function () {
                return this.selectedQuietSpeak2who;
            },
            funcGetQuietRecvNewUidList:function(){
                return this.quietChatRecvNewUidList;
            },
            funcRemoveFromQuietRecvNewUidList:function(uid){
                var newUidList = this.funcGetQuietRecvNewUidList();
                for(var i=0; i<newUidList.length; i++){
                    if(uid == newUidList[i]){
                        newUidList.splice(i, 1);
                        break;
                    }
                }
            },
            funcAdd2QuietRecvNewUidList:function(uid){
                var newUidList = this.funcGetQuietRecvNewUidList(),
                    find = false;
                for(var i=0; i<newUidList.length; i++){
                    if(uid == newUidList[i]){
                        find = true;
                        break;
                    }
                }
                if(!find){
                    newUidList.push(uid);
                }
            },
            //向私聊列表中增加用户
            funcAddPeople2QuietSpeakList:function(uid, userName, avatar){
                //is people in list
                var send2 = null;
                var isInList = false;
                var send2who = null,
                    that = this,
                    user,
                    findAvatar = false;
                for(var i=0; i<this.quietSpeck2List.length; i++){
                    send2 = this.quietSpeck2List[i].funcGetSpeak2();
                    if(send2.uid == uid){
                        isInList = true;
                        this.funcSetSelectedQuietSpeak2who(send2, i);
                        // set show
                        this.quietSpeck2List[i].funcSetIsShow(true);
                        break;
                    }
                }
                if(!isInList){
                    if(!findAvatar){

                    }
                    if(findAvatar){
                        this._funcAddUserToQuietSpeckList(uid, userName, avatar);
                    }
                }
            },
            _funcAddUserToQuietSpeckList:function (uid, userName, avatar,channelId) {
                var send2;
                for(var i=0; i<this.quietSpeck2List.length; i++){
                    send2 = this.quietSpeck2List[i].funcGetSpeak2();
                    if(send2.uid == uid){
                        this.quietSpeck2List[i].funcGetRoomMessages().length = 0;
                        send2.lessonId = channelId;
                        this.funcSetSelectedQuietSpeak2who(send2, i);
                        // set show
                        this.quietSpeck2List[i].funcSetIsShow(true);
                        return;
                    }
                }
                // this.funcRemoveFromQuietRecvNewUidList(uid);
                //uid, userName, avatar, index, serverTime, lastMsg,sortServerTime,msgTime,unread,lessonId
                var send2who = new Speak2who(+uid, userName, avatar,'','','','','','',channelId);
                var quietChat = new QuietChat(send2who);
                this.funcSetSelectedQuietSpeak2who(send2who, this.quietSpeck2List.length);
                // if(this.quietSpeck2List.length > 0){
                //     this.quietSpeck2List.length = 0;
                // }
                this.quietSpeck2List.push(quietChat);
                console.log("this.quietSpeck2List : ",this.quietSpeck2List)
            },
            funcGetQuietSpeck2List:function () {                                    //首页私聊
                return this.quietSpeck2List;
            },
            funcGetRoomSpeck2List:function () {                                     //房间页聊天
                return this.roomSpeck2List;
            },
            funcGetQuietSpeckTip:function () {
                return this.quietSpeckTip;
            },
            funcGetQuietChatPaneShow:function () {
                return this.chatPaneShow;
            },
            //chatPaneShow
            funcQuietChat:function (msg, index, serverTime,sendTxt) {
                console.log("msg : ",msg);
                console.log("index : ",index);
                if(!msg){
                    return ;
                }
                var uid = userSrv.funcGetUser().funcGetUid(); // 当前房间的房间号
                var data = new Date().getTime();
                var nonce = parseInt(Math.random()*453395049,10)+1;
                var md5s =uid.toString()+data+nonce;
                var historyId = CryptoJS.MD5(md5s) + ''; // 房间号

                var that = this,
                    quietChat,
                    chatMsg = new ChatMessage(ChatMessage.prototype.MSG_DIR_SEND, sendTxt,serverTime,historyId,'');
                quietChat = this.funcGetQuietChatObjByUid(this.selectedQuietSpeak2who.uid);
                // quietChat.funcGetMessages().push(chatMsg);
                quietChat.funcGetSpeak2().funcSetServerTime(serverTime);
                quietChat.funcGetServerTime().push(serverTime);
                var speck2 = quietChat.funcGetSpeak2(),
                    user = userSrv.funcGetUser();
                var json100Obj = new Object();
                json100Obj.type = 100; // 401收到消息做出应答
                json100Obj.messageId = historyId; // 房间号
                json100Obj.timestamp = data;// 当前回应的时间
                json100Obj.nonce = nonce; //生成随机数
                quietChat.funcGetRoomMessages().push(chatMsg);
                var lessonId = window.localStorage.clid;
                json100Obj.data =
                    {
                        "fromUid":user.funcGetUid(),
                        "toUid": speck2.funcGetUid(),
                        "text": msg,
                        "lessonId":lessonId,
                        "avatar":user.funcGetAvatar(),
                        "nickName":user.funcGetNickName()
                    };
                this.funcSortArrQuiet();
                webSocketSrv.sendLoginMessage(json100Obj, speck2.funcGetUid());
            },
            funcQuietChatTest:function (msg, index, serverTime,sendTxt) {
                console.log("msg : ",msg);
                console.log("index : ",index);
                if(!msg){
                    return ;
                }
                var uid = projectVar.opName; // 当前房间的房间号
                var data = new Date().getTime();
                var nonce = parseInt(Math.random()*453395049,10)+1;
                var md5s =uid.toString()+data+nonce;
                var historyId = CryptoJS.MD5(md5s) + ''; // 房间号

                var that = this,
                    quietChat,
                    chatMsg = new ChatMessage(ChatMessage.prototype.MSG_DIR_SEND, sendTxt,serverTime,historyId,'');
                quietChat = this.funcGetQuietChatObjByUid(this.selectedQuietSpeak2who.uid);
                quietChat.funcGetMessages().push(chatMsg);
                quietChat.funcGetSpeak2().funcSetServerTime(serverTime);
                quietChat.funcGetServerTime().push(serverTime);
                var speck2 = quietChat.funcGetSpeak2(),
                    user = userSrv.funcGetUser();
                var json100Obj = new Object();
                json100Obj.type = 100; // 401收到消息做出应答
                json100Obj.messageId = historyId; // 房间号
                json100Obj.timestamp = data;// 当前回应的时间
                json100Obj.nonce = nonce; //生成随机数
                quietChat.funcGetRoomMessages().push(chatMsg);
                json100Obj.data =
                    {
                        "fromUid":user.funcGetUid(),
                        "toUid": speck2.funcGetUid(),
                        "text": msg,
                        "avatar":user.funcGetAvatar(),
                        "nickName":user.funcGetNickName()
                    };
                this.funcSortArrQuiet();
                // webSocketSrv.sendLoginMessage(json100Obj, speck2.funcGetUid());
                webSocketSrv.sendLoginMessage(msg, 'yxd');
            },
            funcSortArrQuiet:function () {
                this.quietSpeck2List.sort(function(a,b){                    //点开消息按钮给消息排序
                    // console.log("b.speak2.serverTime : ",b.speak2.sortServerTime,"a.speak2.serverTime : ",a.speak2.sortServerTime)
                    return b.speak2.sortServerTime-a.speak2.sortServerTime});
            },
            funcGetQuietChatObjByUid:function (uid) {
                var user,
                    quietChat;
                // console.log("this.quietSpeck2List : ",this.quietSpeck2List);

                for(var i=0; i<this.quietSpeck2List.length; i++){
                    user = this.quietSpeck2List[i].funcGetSpeak2();
                    if(user.uid == uid){
                        quietChat = this.quietSpeck2List[i];
                        break;
                    }
                }
                return quietChat;
            },
            funcGetHistoryQuietChatObjByUid:function (uid) {                            //历史消息
                var user,
                    quietChat,
                    myuid = userSrv.funcGetUser().funcGetUid();
                /*this.quietSpeck2List.sort(function(a,b){                    //点开消息按钮给消息排序
                    // console.log("b.speak2.serverTime : ",b.speak2.sortServerTime,"a.speak2.serverTime : ",a.speak2.sortServerTime)
                    return b.speak2.sortServerTime-a.speak2.sortServerTime});*/
                for(var i=0; i<this.quietSpeck2List.length; i++){
                    user = this.quietSpeck2List[i].funcGetSpeak2();
                    if(user.uid == uid){
                        quietChat = this.quietSpeck2List[i];
                        break;
                    }
                    // else if(myuid == uid){
                    //     quietChat = this.quietSpeck2List[i];
                    //     break;
                    // }
                }
                return quietChat;
            },
            funcReceiveWebSocketMsg:function (msgObj) {                 //todo  添加消息列表
                //type=3:语音；type=2:图片；type=1:文字
                if(!msgObj.text){
                    return
                }
                var uid = msgObj.fromUid,
                    nickName = msgObj.nickName,
                    avatar = msgObj.avatar,
                    msg = msgObj.text,
                    historyId = msgObj.messageId,
                    sortServerTime = msgObj.serverTime,
                    unread = msgObj.unread,
                    serverTime = XSH5Utils.funcDateTimeFormat(msgObj.serverTime),
                    index = 2,
                    quietChat,
                    speck2,
                    chat,
                    chatMsg,
                    quietList;

                chatMsg = new ChatMessage(ChatMessage.prototype.MSG_DIR_RECV, msg,serverTime,historyId);

                if(quietChat = this.funcGetQuietChatObjByUid(uid)){
                    $timeout(function(){
                        quietChat.funcGetRoomMessages().push(chatMsg);
                    });
                    quietChat.funcGetSpeak2().funcSetLastMsg(msg);
                    quietChat.funcGetMessages().push(chatMsg);
                    quietChat.funcGetServerTime().push(serverTime);
                    quietChat.funcGetSpeak2().funcSetSortServerTime(sortServerTime);
                    quietChat.funcSetIsShow(true);
                    quietChat.funcGetSpeak2().funcSetAvatar(avatar);
                    quietChat.funcGetSpeak2().funcSetName(nickName);
                    quietChat.funcGetSpeak2().funcSetUnread(unread);
                    quietChat.funcGetSpeak2().funcSetServerTime(serverTime);
                }else{
                    quietList = this.funcGetQuietSpeck2List();
                    index = quietList.length;
                    //speck2 = new Speak2who(uid, nickName, avatar, index,, serverTime, msg,sortServerTime);
                    speck2 = new Speak2who(uid, nickName, avatar, index, serverTime, msg,sortServerTime,serverTime,unread);
                    chat = new QuietChat(speck2);
                    chat.funcGetRoomMessages().push(chatMsg);
                    chat.funcGetMessages().push(chatMsg);
                    chat.funcGetServerTime().push(serverTime);
                    quietList.push(chat);
                }
                //update speak tip
                this.quietSpeckTip.funcSetUid(uid);
                this.quietSpeckTip.funcSetName(nickName);
                this.quietSpeckTip.funcSetAvatar(avatar);
                this.chatPaneShow.funcSetDialogTipShow(true);
                this.funcSortArrQuiet();
                if( (this.selectedQuietSpeak2who.funcGetUid()!=uid) || (!this.chatPaneShow.funcGetDialogShow()) ){
                    // this.chatPaneShow.funcSetDialogTipHighlight(true);
                    this.funcAdd2QuietRecvNewUidList(uid);
                }

                if(msgObj.hasOwnProperty('_seq')){
                    this.funcResponseWebSocketMsg(msgObj._seq, uid);
                    this.funcResponse2WebSocketMsg(msgObj._seq, uid);
                }
            },
            funcResponseWebSocketMsg:function(sq, uid){
                var jsonObj = {};
                jsonObj._res = sq;
                webSocketSrv.sendLoginMessage(jsonObj, uid);
            },
            funcResponse2WebSocketMsg:function(sq, uid){
                var jsonObj = {};
                jsonObj._res = 0;
                jsonObj.type = 4;
                webSocketSrv.sendLoginMessage(jsonObj, uid);
            }
        };

        return new ChatSrv();

    };

    roomModule.factory('xsWeb.room.chatSrv', ['$timeout', 'xsWeb.common.httpSrv', '$http', 'xsWeb.room.roomSrv', 'xsWeb.common.userSrv', 'xsWeb.common.notificationSrv', 'xsWeb.common.webSocketSrv',  'xsWeb.common.paraCheckSrv', chatFactory]);
})(roomModule);