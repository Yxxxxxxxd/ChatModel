/**
 * Created by NM-029 on 3/23/2017.
 */
//私信
(function (roomModule, win) {

    var quietChatCtrl = function ($scope,$state, userSrv, $timeout, $interval, chatSrv, notificationSrv, paraCheckSrv) {
        var _self = this;

        this.leaveMssageMaxShow = false;                        //留言页面窗口大
        this.leaveMssageMinShow = false;                        //留言页面窗口小
        this.MessageTranslation0 = false;                        //大翻译弹框显示隐藏
        this.MessageTranslation1 = false;                        //小翻译弹框显示隐藏
        this.MessageTranslation2 = false;                        //直播间翻译
        this.MessageTranslationText = '';                        //翻译内容
        this.MessageTranslationIndex = 0;                        //选中当前index
        this.chatLeftShowIndex = 0;                              //选中左侧聊天index
        this.UnreadMessageShow = false;
        this.thisRoomLessonId = 0;
        this.thisSpeckUid = 0;                                   //右侧小聊天框，当前选中的说话uid
        var backgroundFlashing = 0;

        this.userAvatar = userSrv.funcGetUser();

        this.publicChatIsEnScroll = true;   //公聊滚屏使能
        this.isHrScrollbar1 = false;
        this.isHrScrollbar2 = true;
        this.showHrScrollbar1 = function () {//显示滚动条
            this.isHrScrollbar1 = true;
            this.isHrScrollbar2 = false;
        };
        this.showHrScrollbar2 = function () {//隐藏滚动条
            this.isHrScrollbar1 = false;
            this.isHrScrollbar2 = true;
        };
        /*收到1消息*/
        window.EventMd.create(eventEmType.EM_SPACE_MESSAGE).listen(""+gOb_msgType.EM_MSG_TYPE_100_MESSAGE_SEND, function(messageJson){
            if(messageJson.data){
                _self.UnreadMessageShow = true;
                // _self.funcAllMessageConversation();
            }
        });
        /*收到200消息*/
        window.EventMd.create(eventEmType.EM_SPACE_MESSAGE).listen(""+gOb_msgType.EM_MSG_TYPE_200_MESSAGE_FOCUS, function(messageJson){
            if(messageJson.data){
                _self.UnreadMessageShow = true;
                // _self.funcAllMessageConversation();
            }
        });
        /*收到300消息*/
        window.EventMd.create(eventEmType.EM_SPACE_MESSAGE).listen(""+gOb_msgType.EM_MSG_TYPE_300_SYSTEM_SECRETARY, function(messageJson){
            if(messageJson.data){
                _self.UnreadMessageShow = true;
                // _self.funcAllMessageConversation();
            }
        });
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (!_self.userAvatar) {
                $state.go("baseHead.liveHall");
            }else if (toState.name.indexOf('chat') >= 0) {
                _self.funcAllMessageConversation();
            }
        });
        this.modifyNickNameDivShow = false;
        this.funcQuietIsShow = function () {
            this.modifyNickNameDivShow = !this.modifyNickNameDivShow;
            _self.UnreadMessageShow = false;
            if (this.modifyNickNameDivShow) {
                _self.funcAllMessageConversation();
            }
        };

        this.funcAllMessageConversation = function () {
            chatSrv.funcAllMessageHistory(function (response) {
                if (paraCheckSrv.checkResponseAndAlertError(response)) {
                    var data = response.data.entities;
                    var user = userSrv.funcGetUser();
                    var focusName;
                    var touid,avatar,nickName,type,text,constants;
                    data.sort(function(a,b){                    //点开消息按钮给消息排序
                        return b.serverTime-a.serverTime});
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        type = item.type;
                        var dateTime = XSH5Utils.funcDateTimeFormat(item.serverTime);
                        if (user.funcGetUid() == item.fromUid) {
                            touid = item.toUid;
                            avatar = item.toAvatar;
                            nickName = item.toNickname;
                        } else {
                            touid = item.fromUid;
                            avatar = item.fromAvatar;
                            nickName = item.fromNickname;
                        }
                        item.fromUid = touid;
                        item.studentId = item.id;
                        item.nickName = nickName;
                        item.avatar = avatar;
                        item.sortServerTime = item.serverTime;
                        item.serverTime = dateTime;
                        if(type == 200){
                            text = item.text.replace(/\'/g, "\"");
                            text = JSON.parse(text);
                            focusName = text.fromNickname;
                            item.text = followingMsgArr[0].replace("$fromNickname","我");
                            item.translatedText = followingMsgArr[1].replace("$fromNickname","I");
                        }else if(type == 300){
                            var msg = '',test = '';
                            text = item.text.replace(/\'/g, "\"");
                            text = JSON.parse(text);
                            for (var j=0;j<ConstantsResource.length;j++){
                                if(text.template == ConstantsResource[j].key){
                                    msg = ConstantsResource[j].value;
                                }
                            }
                            test = msg.substring(0,msg.indexOf('||'));
                            test = test.replace(/\$/g, "\ ");
                            test = test.replace('studentNickname', text.studentNickname);
                            test = test.replace('mins',text.mins);
                            test = test.replace('hours','6');
                            test = test.replace('time',text.time);
                            item.text = test;
                        }
                        chatSrv.funcReceiveWebSocketHistoryStudentMsg(item);
                        // _self.funcQueryStudent(touid, item.text, item.id, dateTime);
                    }
                }
            });
        };

        this.fucnMessageIconShow = function (isShow) {
            this.modifyNickNameDivShow = isShow;
        };
        this.funcQueryStudent = function (uid, msg, id, serverTime) {                     //查询历史会话学生信息
            chatSrv.funcQueryStudentInfo(uid, function (response) {
                if (paraCheckSrv.checkResponseAndAlertError(response)) {
                    var data = response.data;
                    data.text = msg;
                    data.studentId = id;
                    data.fromUid = data.uid;
                    data.nickName = data.nickname;
                    data.serverTime = serverTime;
                    chatSrv.funcReceiveWebSocketHistoryStudentMsg(data);
                }
            });
        };

        _self.quietChatPaneShow = chatSrv.funcGetQuietChatPaneShow();
        _self.speckContent = '';                                               //私信聊天内容
        _self.quietSpeck2List = chatSrv.funcGetQuietSpeck2List();
        _self.quietSpeckTip = chatSrv.funcGetQuietSpeckTip();
        _self.curItem = chatSrv.funcGetCurrenQuietSpeck();
        _self.recvNewUidList = chatSrv.funcGetQuietRecvNewUidList();
        _self.funcGetQuietChatPaneShow = function () {
            return this.quietChatPaneShow;
        };
        _self.funcGetQuietSpeck2List = function () {
            return this.quietSpeck2List;
        };
        _self.funcGetQuietSpeckTip = function () {
            return this.quietSpeckTip;
        };
        _self.funcGetCurItem = function () {
            return this.curItem;
        };
        _self.funcRecvNewUidList = function () {
            return this.recvNewUidList;
        };

        //key event
        _self.funcQuietSpeckKeyEvent = function (e, index) {
            var et = e || window.event;
            var keycode = et.charCode || et.keyCode;
            if(keycode == 13){
                if(window.event){
                    window.event.returnValue = false;
                }
                else{
                    e.preventDefault();
                }
                _self.funcQuietSpeck(index);
            }
        };

        //speck
        _self.funcQuietSpeck = function (index) {
            var txt = this.speckContent.trim();
            if (txt == "") {
                return notificationSrv.funcTankuang('发言内容不能为空！');
            }
            else if (txt.length > 200) {
                return notificationSrv.funcTankuang('发言应在200个字符以内!');
            }

            this.speckContent = '';
            var serverTime = XSH5Utils.funcDateTimeFormat("");
            // chatSrv.funcQuietChat(txt, index, serverTime,txt);
            chatSrv.funcQuietChatTest(txt, index, serverTime,txt);
        };
        // tab change
        _self.funcChangeTab = function (index, Speak2) {
            _self.chatLeftShowIndex = index;
            _self.thisSpeckUid = Speak2.uid;
            console.log("thisSpeckUid : ",_self.thisSpeckUid);
            _self.funcLeaveMessageClose(true, false);
            window.EventMd.create(eventEmType.CHANGE_TAB_CLICK).trigger(eventEmType.CHANGE_TAB_CLICK,Speak2.uid);
            var uid = userSrv.funcGetUser().funcGetUid(); // 当前房间的房间号
            // $('#panda_message_panel').show();
            chatSrv.funcSetSelectedQuietSpeak2who(Speak2, index);
            chatSrv.funcMessageHistory(uid, Speak2.uid, null, function (response) {                     //点击返回历史消息    查看是否有lessonid
                if (paraCheckSrv.checkResponseAndAlertError(response)) {
                    var data = response.data.entities;
                    var text;
                    var focusName;
                    if(data.length == 0){
                        var speack2 = _self.funcGetQuietSpeckTip();
                        chatSrv._funcAddUserToQuietSpeckList(speack2.funcGetUid(), speack2.funcGetName(), speack2.funcGetAvatar());
                    }
                    for (var i = data.length - 1; i >= 0; i--) {
                        var item = data[i];
                        item.sortServerTime = item.serverTime;
                        item.serverTime = XSH5Utils.funcDateTimeFormat(item.serverTime);
                        item.unread = false;
                        if(item.type == 200){
                            text = item.text.replace(/\'/g, "\"");
                            text = JSON.parse(text);
                            focusName = text.fromNickname;
                            item.text = followingMsgArr[0].replace("$fromNickname","我");
                            item.translatedText = followingMsgArr[1].replace("$fromNickname","I");
                        }else if(item.type == 300){
                            var msg = '',test = '';
                            text = item.text.replace(/\'/g, "\"");
                            text = JSON.parse(text);
                            for (var j=0;j<ConstantsResource.length;j++){
                                if(text.template == ConstantsResource[j].key){
                                    msg = ConstantsResource[j].value;
                                }
                            }
                            test = msg.substring(0,msg.indexOf('||'));
                            test = test.replace(/\$/g, "\ ");
                            test = test.replace('studentNickname', text.studentNickname);
                            test = test.replace('mins',text.mins);
                            test = test.replace('hours','6');
                            test = test.replace('time',text.time);
                            item.text = test;
                        }
                        if(item.text == ''){
                            continue;
                        }
                        chatSrv.funcReceiveWebSocketHistoryMsg(item);  //历史记录添加聊天
                    }
                    chatSrv.funcSendWeb130Msg(Speak2.uid);
                }
            });
        };
        _self.funcTipPaneClick = function (Speak2) {
            _self.modifyNickNameDivShow = false;

            var uid = userSrv.funcGetUser().funcGetUid(); // 当前房间的房间号
            if(uid == Speak2.uid){
                notificationSrv.funcTankuang("学生都在等您呢，就不要和您自己聊天啦！");
                return;
            }
            _self.funcLeaveMessageClose(true, false);
            // $('#panda_message_panel').show();
            chatSrv._funcAddUserToQuietSpeckList(Speak2.uid, Speak2.name, Speak2.avatar);
            // chatSrv.funcSetSelectedQuietSpeak2who(Speak2, 0);

            chatSrv.funcMessageHistory(uid, Speak2.uid, null, function (response) {                     //点击返回历史消息    查看是否有lessonid
                if (paraCheckSrv.checkResponseAndAlertError(response)) {
                    var data = response.data.entities;
                    var text,focusName;
                    if(data.length == 0){
                        var speack2 = _self.funcGetQuietSpeckTip();
                        chatSrv._funcAddUserToQuietSpeckList(speack2.funcGetUid(), speack2.funcGetName(), speack2.funcGetAvatar());
                    }
                    for (var i = data.length - 1; i >= 0; i--) {
                        var item = data[i];
                        item.serverTime = XSH5Utils.funcDateTimeFormat(item.serverTime);
                        if(item.type == 200){
                            text = item.text.replace(/\'/g, "\"");
                            text = JSON.parse(text);
                            focusName = text.fromNickname;
                            item.text = followingMsgArr[0].replace("$fromNickname","我");
                            item.translatedText = followingMsgArr[1].replace("$fromNickname","I");
                        }
                        chatSrv.funcReceiveWebSocketHistoryMsg(item);  //历史记录添加聊天
                    }
                }
            });
        };
        //delete chat
        _self.funcHideChatItem = function (index, $event) {
            var cnt = 0,
                chatList;
            chatSrv.funcHideItem(index);
            //do not have one item
            for (var i = 0; i < this.quietSpeck2List.length; i++) {
                chatList = this.quietSpeck2List[i];
                if (chatList.funcGetIsShow()) {
                    cnt++;
                    break;
                }
            }
            if (!cnt) {
                var paneShow = this.funcGetQuietChatPaneShow();
                paneShow.funcSetDialogShow(false);
                paneShow.funcSetDialogTipShow(false);
            }
            $event.stopPropagation();
        };

        //tip panel click
        _self.funcTipPaneClickEvt = function () {
            _self.funcLeaveMessageClose(true, false);
            var speack2 = this.funcGetQuietSpeckTip();
            chatSrv.funcAddPeople2QuietSpeakList(speack2.funcGetUid(), speack2.funcGetName(), speack2.funcGetAvatar());
            var paneShow = this.funcGetQuietChatPaneShow();
            paneShow.funcSetDialogShow(true);
            paneShow.funcSetDialogTipShow(true);
            //只要点击就置灰
            // chatSrv.funcRemoveFromQuietRecvNewUidList(speack2.funcGetUid());
            this.funcRecvNewUidList().length = 0;
        };

        _self.funcLeaveMessageShow = function (flag) {  //留言聊天小化
            _self.leaveMssageMinShow = flag;
            _self.leaveMssageMaxShow = !flag
        };
        _self.funcLeaveMessageClose = function (maxIsShow, minIsShow) {  //关闭留言聊天页面
            _self.leaveMssageMaxShow = maxIsShow;
            _self.leaveMssageMinShow = minIsShow;
        };
        _self.funcLoginMessageTranslation = function (msg, index, $index) {
            _self.MessageTranslationText = '';
            if (index == 0) {
                _self.MessageTranslation0 = true;
            } else if (index == 1) {
                _self.MessageTranslation1 = true;
            } else if (index == 2) {
                _self.MessageTranslation2 = true;
            }
            _self.MessageTranslationIndex = $index;
            var data = {
                "text": msg
                // "fromLocale":"en-US",
                // "toLocale":"zh-CN"
            };
            chatSrv.funcMessageTranslation(data, function (response) {
                if (paraCheckSrv.checkResponseAndAlertError(response)) {
                    _self.MessageTranslationText = response.data.text;
                }
            });
        };

        _self.messageTranslationClose = function () {                       //点击关闭翻译弹框
            _self.MessageTranslation0 = false;
            _self.MessageTranslation1 = false;
            _self.MessageTranslation2 = false;
        };

        _self.funcLoginMessageHistory = function (fromUid, toUid) {
            chatSrv.funcMessageHistory(fromUid, toUid, function (response) {
                if (paraCheckSrv.checkResponseAndAlertError(response)) {
                    console.log("response : ", response);
                }
            });
        };

        _self.AllMessageRead = function () {                            //全部标为已读    消息发出去后稍等2秒调取接口
            _self.UnreadMessageShow = false;
            chatSrv.funcSendWeb130AllMsg(function () {
                $timeout(function () {
                    _self.funcAllMessageConversation();
                },2000);
            });
        }
        //暂时先用$timeout将学生信息装进列表里
        $timeout(function () {
            _self.thisRoomLessonId = window.localStorage.clid;
            // var speack2 = _self.funcGetQuietSpeckTip();
            // chatSrv.funcAddPeople2QuietSpeakList(speack2.funcGetUid(), speack2.funcGetName(), speack2.funcGetAvatar());
        });

        $scope.$watch(function () {
            var speck2List = _self.funcGetQuietSpeck2List();
            var curIndex = _self.funcGetCurItem().funcGetIndex();
            for (var i = 0; i < speck2List.length; i++) {
                if (curIndex == i) {
                    return speck2List[i].funcGetMessages().length;
                }
            }
        });

        //窗口拖动
        this.funcDragAndDrop = function($index){
            var wTop = ".pandaMsgTop" + $index, wBox = ".pandaMsgBox" + $index;
            $timeout(function(){
                XSH5Utils.funcDragAndDrop(wTop, wBox);
            });
        }
    };
    roomModule.controller('xsWeb.room.quietChatCtrl', ['$scope','$state', 'xsWeb.common.userSrv', '$timeout', '$interval', 'xsWeb.room.chatSrv',  'xsWeb.common.notificationSrv', 'xsWeb.common.paraCheckSrv',
        quietChatCtrl]);
})(roomModule, window);