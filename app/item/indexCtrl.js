/**  * Created by hf-mini on 15/11/19.  */

(function(){

    function indexCtrl($state, $scope,$location,$timeout, notificationSrv,messageSrv,userSrv,webSocketSrv){
        this.tankuang = notificationSrv.funcGetTankuang();      //弹框提示
        this.hongrenAlert = notificationSrv.funcGetHongrenAlert();      //系统自定义弹框提示
        this.hongrenAlertSubmit = notificationSrv.funcGetHongrenAlertSubmit();      //系统自定义弹框提示，带确定按钮
        this.dashboardShow = notificationSrv.funcGetDashboardShow();      //仪表盘显示

        /**
         *  点击余额不足弹框中充值按钮跳转到充值页面
         */
        this.funcRecharge = function(){
            var url = $state.href('baseHead.recharge');
            window.open(url,'_blank');
        };

        $timeout(function () {
            // var user = userSrv.funcGetUser();
            // if(user){
            var userInfo = {
                avatar:'http://www.17sucai.com/preview/1/2017-06-26/talk/images/touxiangm.png',
                nickname:'test',
                uid:7000002
            };
            //模拟用户信息
            //isVisitor, avatar, nickname, showid, uid, isAnchor, sessionid, loginTime,isInMyRoom,ofToken,ofIp,ofPort,wsPort，wsIp,loginToken,qstr,verified,halted
            var user = new G_OBJ_user(false, userInfo.avatar, userInfo.nickname, userInfo.showid,
                userInfo.uid, true,userInfo.accessToken, new Date().getTime(),'','',userInfo.ofToken,userInfo.ofIp,userInfo.ofPort,userInfo.wsPort,userInfo.wsIp,userInfo.loginToken,userInfo.qstr,userInfo.role,userInfo.verified,userInfo.halted);
            userSrv.funcSetUser(user);
            userSrv.setUser();
                messageSrv.connectOpenfire(0);
            // }
        });
        //弹框提示，定时关闭
        $scope.showRedAlert = function (msg) {
            var ele = document.getElementById("error_box");
            ele.innerHTML = msg;
            ele.style.display = "block";
            setTimeout(function(){
                var ele = document.getElementById("error_box");
                ele.innerHTML = msg;
                ele.style.display = "none";
            }, 3000);
        };
        //存储channelId
        function setChannelId() {
            var hasChannelId = false;
            var channelId = $location.search()['c'];
            if (channelId != true && !!channelId) {
                XSH5Utils.setChannelId(channelId);
                hasChannelId = true;
            } else {
                channelId = $location.search()['C'];
                if (channelId != true && !!channelId) {
                    XSH5Utils.setChannelId(channelId);
                    hasChannelId = true;
                }
            }

        }
        $(window).on("beforeunload", function() {
            //刷新房间  跟关闭界面执行
            // webSocketSrv.disConnectServer();
        });
       /* window.onbeforeunload = function(event) {                       //暴力关闭浏览器引起的内存未释放
            webSocketSrv.disConnectServer();
        };*/
        $scope.$on("$destroy", function () {
            // webSocketSrv.disConnectServer();
        });
        setChannelId();
    }

angular.module('xsWeb').controller('xsWeb.indexCtrl', ['$state','$scope', '$location', '$timeout','xsWeb.common.notificationSrv','xsWeb.room.messageSrv','xsWeb.common.userSrv','xsWeb.common.webSocketSrv',indexCtrl]);
})();