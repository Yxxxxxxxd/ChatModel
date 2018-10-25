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
            var user = userSrv.funcGetUser();
            if(user){
                messageSrv.connectOpenfire(0);
            }
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
            // if (!hasChannelId) {
            //     var s = window.location.search;
            //     if (!!s) {
            //         var stext = s.substring(1,s.Length);
            //         var params = stext.split("&");
            //         for (var index in params) {
            //             var param =  params[index].split("=");
            //             if (param[0].toLowerCase() == "c") {
            //                 XSH5Utils.setChannelId(param[1]);
            //                 break;
            //             }
            //         }
            //     }
            // }
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