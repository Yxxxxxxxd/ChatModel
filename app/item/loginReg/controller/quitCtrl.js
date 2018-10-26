/**
 * Created by NM-029 on 9/28/2016.
 */
(function (module) {
    function loginRegCtrl(quitSrv, notificationSrv) {


        //登录注册退出框VIEW
        var QuitView = function () {
            //是否显示
            this.isQuitPaneShow = true;
        };
        QuitView.prototype = {
            funcHideQuitPane: function () {
                quitSrv.closeLoginDialog();
            },
            funcQuit:function () {
                window.localStorage.removeItem("edtm");
                window.localStorage.removeItem("rstm");
                quitSrv.funcSrvQuit();
            }
        };

        this.quit_v = new QuitView();
    }
    module.controller('xsWeb.loginReg.quitCtrl', ['xsWeb.loginReg.quitSrv', 'xsWeb.common.notificationSrv', loginRegCtrl]);

})(loginRegModule);
