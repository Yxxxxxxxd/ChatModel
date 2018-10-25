/**
 * Created by NM-029 on 10/31/2016.
 */
//公用参数校验
(function(mode) {
    'use strict';

    var paraCheckFactory = function (notificationSrv, userSrv, loginRegSrv) {

        var ParaCheckSrv = function () {
            var self = this;
            self.SESSION_EXPRESS_TIME =  86400000;       //1*24*60*60*1000;


        };

        ParaCheckSrv.prototype={
            constructor:ParaCheckSrv,
            /**
             * 检查返回结果是否正确 如果不正确提示错误信息
             * @param response
             * @returns {boolean}
             */
            checkResponseAndAlertError:function  (response) {
                if (response && response.status && response.status.statuscode == "0") {
                    return true;
                } else {
                    //session 过期
                    if(response && response.status && response.status.statuscode == "-100"){
                        notificationSrv.funcTankuang('会话过期请先登录');
                        userSrv.clearUser();
                        loginRegSrv.showLogin();
                    }else if (response && response.status && response.status.message && response.status.statuscode != "-998") {
                        notificationSrv.funcTankuang(response.status.message);
                    }
                    return false;
                }
            },
            funcCheckLoginTime:function () {
                var loginTime = userSrv.funcGetUser().funcGetLoginTime();
                var nowTime = new Date().getTime();
                if(loginTime){
                    if(nowTime-loginTime > this.SESSION_EXPRESS_TIME){
                        notificationSrv.funcTankuang('会话过期请先登录');
                        userSrv.clearUser();
                        loginRegSrv.showLogin();
                        return false;
                    }
                }else{
                    notificationSrv.funcTankuang('会话过期请先登录');
                    userSrv.clearUser();
                    loginRegSrv.showLogin();
                    return false;
                }
                return true;
            }

        };

        return new ParaCheckSrv();

    };


    mode.factory('xsWeb.common.paraCheckSrv', ['xsWeb.common.notificationSrv','xsWeb.common.userSrv', paraCheckFactory]);
})(commonModule);