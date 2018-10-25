/**
 * Created by NM-029 on 10/10/2016.
 */
//公聊 & 私聊 & 小跑道 & 大跑道 & 弹幕消息 & 开启关闭特效
(function(roomModule){
    var msgAreaCtrl = function($sce, msgSrv, roomSrv, chatSrv, notificationSrv, userSrv, $timeout){
        var that = this;
        this.publicChatCache = msgSrv.funcGetPublicChatCache();
        this.firstFlyNum = 0;
        //发言内容
        this.speakTxt = "";
        //聊天输入框中按回车键发言
        this.sendMsgKeyEvent = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if (keycode === 13) {
                this.sendMessage(5001);
            }
        };
        this.isHrScrollbar1 = false;
        this.isHrScrollbar2 = true;
        this.showHrScrollbar1 = function(){  //显示滚动条
            this.isHrScrollbar1 = true;
            this.isHrScrollbar2 = false;
        };
        this.showHrScrollbar2 = function(){  //隐藏滚动条
            this.isHrScrollbar1 = false;
            this.isHrScrollbar2 = true;
        };
        this.publicChatIsEnScroll = true;    //公聊滚屏使能
        this.publicChatOperateShow = false;  //公聊滚屏/清屏是否显示

        this.deliberatelyTrustDangerousSnippet = function(html) {
            return $sce.trustAsHtml(html);
        };

        //清除公聊信息
        this.funcClearPublicChatArea = function(){
            msgSrv.funcClearPublicChatArea();
        };
        //公聊滚屏
        this.funcSetIsEnableScrollPublicChat = function (en) {
            this.publicChatIsEnScroll = en;
        };
        //公聊滚屏/清屏是否显示
        this.funcSetIsShowPublicChatOperate = function (en) {
            this.publicChatOperateShow = en;
        };

        this.funcClearPrivateChatArea = function () {
            msgSrv.funcClearPrivateChatArea();
        };

        this.sendMessage = function(chatType){
            var message = this.speakTxt.trim();
            //普通聊天
            switch (chatType) {
                case 5001: //发言
                    if(message == "" || message.replace(/^\s+|\s+$/g, "") == "")
                    {
                        return notificationSrv.funcTankuang("聊天内容不能为空!");
                    }
                    else if (message.length > 100) {
                        this.speakTxt = "";
                        return notificationSrv.funcTankuang("发言应在100个字符以内!");
                    }
                    else{
                        msgSrv.funcSendMessage(message);
                        this.speakTxt = "";
                        return;
                    }
                    break;
                default:
                    break;
            }
        };
    };
    roomModule.controller('xsWeb.room.msgAreaCtrl', ['$sce', 'xsWeb.room.messageSrv', 'xsWeb.room.roomSrv', 'xsWeb.room.chatSrv', 'xsWeb.common.notificationSrv',
        'xsWeb.common.userSrv', '$timeout', msgAreaCtrl]);
})(roomModule);
