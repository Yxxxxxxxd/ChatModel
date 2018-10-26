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