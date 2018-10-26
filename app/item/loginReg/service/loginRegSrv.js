/**
 * Created by NM-029 on 9/21/2016.
 */
loginRegModule.factory('xsWeb.loginReg.mainSrv', ['xsWeb.common.httpSrv', '$http', '$uibModal', 'xsWeb.common.userSrv', 'xsWeb.common.notificationSrv', '$window','$state', 'xsWeb.common.paraCheckSrv','xsWeb.room.messageSrv',
    function (httpSrv, $http, $uibModal, userSrv, notificationSrv, $window,$state, paraCheckSrv,messageSrv) {

        var LoginRegService = function () {
            this.loginDialog = null;
            this.registerDialog = null;
            this.animationsEnabled = true;
            this.isClickLoginBtn = [false];
            this.isClickRegisterBtn = [false];
            this.resetEmail = null;
            this.resetCode = null;
            //登陆弹框
            this.loginMethodIndex = {index : 0};
            this.forgotPassDialog = {isShowFlag : -1};
        };
        LoginRegService.prototype={
            /**
             * 检查用户是否已经登陆 如果未登录 弹出登陆框
             * @returns {boolean} true是已登陆 false是游客
             */
            checkLoginStatus:function () {
                if(!userSrv.funcGetUser() || userSrv.funcGetUser().funcGetIsVisitor()){
                    if(!this.isClickLoginBtn[0]){
                        this.closeRegisterDialog();
                        this.showLogin();
                        this.isClickLoginBtn[0] = !this.isClickLoginBtn[0];
                    }
                    return false;
                }else{
                    return true;
                }

            },
            showLogin:function(){  //显示登陆框
                if(this.loginDialog){
                    // return ;
                }
                this.loginDialog = $uibModal.open({
                    animation: this.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'item/loginReg/html/login.tpl.html',
                    controller: 'xsWeb.loginReg.loginRegCtrl',
                    controllerAs: 'loginRegCtrl',
                    resolve: {
                        items: function () {
                            ;
                        }
                    }
                });
            },
            showResetPassDialog:function(email, code){  //显示登陆框
                if(this.loginDialog){
                    // return ;
                }
                this.loginDialog = $uibModal.open({
                    animation: this.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'item/loginReg/html/login.tpl.html',
                    controller: 'xsWeb.loginReg.loginRegCtrl',
                    controllerAs: 'loginRegCtrl',
                    resolve: {
                        items: function () {
                            ;
                        }
                    }
                });
                this.resetEmail = email;
                this.resetCode = code;
                this.forgotPassDialog.isShowFlag = 2;
            },
            showRegister:function(){  //显示注册框
                if(this.registerDialog){
                    // return ;
                }
                this.registerDialog = $uibModal.open({
                    animation: this.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'item/loginReg/html/login.tpl.html',
                    controller: 'xsWeb.loginReg.loginRegCtrl',
                    controllerAs: 'loginRegCtrl',
                    resolve: {
                        items: function () {
                            ;
                        }
                    }
                });
            },
            closeLoginDialog:function() {  //关闭登录框
                if (this.loginDialog) {
                    this.isClickLoginBtn[0] = false;
                    this.loginDialog.dismiss('cancel');
                }
            },
            closeRegisterDialog:function(){  //关闭注册框
                if(this.registerDialog){
                    this.isClickRegisterBtn[0] = false;
                    this.registerDialog.dismiss('cancel');
                }
            },
            funcUserRegister:function(regData, suc){  //用户注册
                var that = this;
                var url = xsServiceURL+"/users/teachers";
                httpSrv.post(url,regData,function(response){
                    if(paraCheckSrv.checkResponseAndAlertError(response)){
                        var userInfo = response.data;
                        //没有通过教师审核的用户相关弹框操作
                        var helpTipBoxIsShowFlag = funcLoginHelpTipBoxIsShow(userInfo, suc);
                        if(!helpTipBoxIsShowFlag){
                            return;
                        }
                        //isVisitor, avatar, nickname, showid, uid, isAnchor, sessionid, loginTime,isInMyRoom,ofToken,ofIp,ofPort,wsPort,wsIp,loginToken,qstr,role,verified,halted
                        var user = new G_OBJ_user(false, userInfo.avatar, userInfo.nickname, userInfo.showid,
                            userInfo.uid, true,userInfo.accessToken, new Date().getTime(),'','',userInfo.ofToken,userInfo.ofIp,userInfo.ofPort,userInfo.wsPort,userInfo.wsIp,userInfo.loginToken,userInfo.qstr,userInfo.role,userInfo.verified,userInfo.halted);
                        userSrv.funcSetUser(user);
                        userSrv.setUser();
                        if(typeof suc == 'function'){
                            suc();
                        }
                        that.isClickRegisterBtn[0] = false;
                        window.localStorage.DetectionCamera = false;  //是否检测过摄像头
                        window.localStorage.teacOL = 0;               //老师是否在线
                        window.localStorage.itcall = 0;               //是否有第三个人call
                        window.localStorage.MsIdLs = [];
                        window.localStorage.consoleId = false;            //日志打印id
                        $window.location.reload();
                    }
                });
            },
            funcRegUserLogin:function(regData, suc){  //手机号+密码登录
                var that = this;
                var url = xsServiceURL+"/users/login";
                httpSrv.post(url,regData,function(response){
                    if(paraCheckSrv.checkResponseAndAlertError(response)){
                        var userInfo = response.data;
                        //没有通过教师审核的用户相关弹框操作
                        var helpTipBoxIsShowFlag = funcLoginHelpTipBoxIsShow(userInfo, suc);
                        if(!helpTipBoxIsShowFlag){
                            return;
                        }
                        var nonce = parseInt(Math.random()*453395049,10)+1;
                        window.localStorage.non = nonce + '';
                        var md5s = userInfo.uid+ '' + nonce;
                        var kk = CryptoJS.MD5(md5s) + '';
                        window.localStorage.kk = kk;
                        //刷新用户信息
                        //isVisitor, avatar, nickname, showid, uid, isAnchor, sessionid, loginTime,isInMyRoom,ofToken,ofIp,ofPort,wsPort，wsIp,loginToken,qstr,verified,halted
                        var user = new G_OBJ_user(false, userInfo.avatar, userInfo.nickname, userInfo.showid,
                                userInfo.uid, true,userInfo.accessToken, new Date().getTime(),'','',userInfo.ofToken,userInfo.ofIp,userInfo.ofPort,userInfo.wsPort,userInfo.wsIp,userInfo.loginToken,userInfo.qstr,userInfo.role,userInfo.verified,userInfo.halted);
                        userSrv.funcSetUser(user);
                        userSrv.setUser();
                        if(typeof suc === 'function'){
                            suc();
                        }
                        that.isClickRegisterBtn[0] = false;
                        window.localStorage.DetectionCamera = false;
                        window.localStorage.teacOL = 0;               //老师是否在线
                        window.localStorage.MsIdLs = [];
                        window.localStorage.itcall = 0;               //是否有第三个人call
                        window.localStorage.consoleId = false;            //日志打印id
                        $state.go("baseHead.liveHallLogin");
                        $window.location.reload();
                    }
                });
            },
            sendResetEmail : function (resetPassEmail, suc, failed) {
                var url = xsServiceURL + "/users/pass/email";
                var resetData = {"email" : resetPassEmail};
                httpSrv.post(url,resetData,function(response){
                    if(paraCheckSrv.checkResponseAndAlertError(response)){
                        suc();
                    } else {
                        failed();
                    }
                });
            },
            resetPass : function (pass, suc) {
                var url = xsServiceURL + "/users/pass";
                var resetData = {
                    "email": this.resetEmail,
                    "code": this.resetCode,
                    "pass": pass
                };
                httpSrv.put(url,resetData,function(response) {
                    if(paraCheckSrv.checkResponseAndAlertError(response)) {
                        suc();
                        console.log("更新成功")
                    } else {
                        notificationSrv.funcTankuang(response.status.message);
                        console.log("更新失败")
                    }
                });
            },
            funcGetCameraInfoLogin:function (check,suc) {
                var uid = userSrv.funcGetUser().funcGetUid();
                var url = xsServiceURL+'/users/teachers/' + uid + '/camera?check=' + check;
                httpSrv.get(url, suc);
            }
        };
        return new LoginRegService();
    }
]);
