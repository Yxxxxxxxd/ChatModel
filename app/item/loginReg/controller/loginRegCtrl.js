/**
 * Created by NM-029 on 9/28/2016.
 */
(function (module, win) {
    function loginRegCtrl($scope, $interval, userSrv, loginRegSrv, notificationSrv, $timeout, httpSrv,$state) {
        var that = this;
        var loginGeetest = null;

        //极限验证
        that.funcInit = function () {
            // loginGeetest = new WebGeetest('#div_id_embed_login', httpSrv.get, function () {
            //     that.login_v.geetestSuccessFg = true;
            //     // that.login_v.funcSecurityCodeBtn();
            //     that.login_v.funcLoginBtn();
            // });
        };

        //登录注册退出框VIEW
        var LoginView = function () {
            var that = this;
            // this.isShowClose = !win.funcGetIsRoomPage();

            //验证码登录/密码登录选项切换
            this.loginMethodTabs = ['成为导师','登录'];
            this.loginMethod = loginRegSrv.loginMethodIndex.index;
            this.passWordBox = false;
            this.funcChangePicType = function($index){  //当前选中的是 验证码登录/密码登录 选项卡
                this.loginMethod = $index;
                this.loginBtn1 = true;
                this.loginBtn2 = false;
                // loginGeetest.funcRefresh();
                if($index == 1){
                    this.loginName = "";
                    this.loginPassword = "";
                }
                else{
                    funcRegBoxInit();
                }
            };

            //登录输入数据
            this.loginMobile = "";
            this.loginName = "";
            this.loginPassword = "";
            this.loginCode = "";
            this.securityCodeTip = "免费获取验证码";
            this.loginSecond = 59;

            //获取验证码按钮背景控制
            this.securityCodeBtn1 = true;
            this.securityCodeBtn2 = false;
            this.geetestSuccessFg = false;

            //登录按钮背景控制
            this.loginBtn1 = true;
            this.loginBtn2 = false;

            //充值密码
            this.forgotPassDialogIsShow = loginRegSrv.forgotPassDialog;
            this.forgotSendEmailIsShow = 0;
            this.resetPassEmail = null;
            this.resetPassEmailTips = null;
            this.resetPassSuc = false;
            this.validatePass = null;
            this.newPass = null;
            this.userEmail = loginRegSrv.resetEmail;

            this.redirectUrl= window.location.protocol +"//"+window.location.host+"/traditional/html/";

            this.callback_url = "qc_callback2_pub.html"; // QQ登录回调地址

            this.callback_url_FaceBook = "facebook_callback.html"; // sina登录回调地址

            this.qqLoginUrl="https://graph.qq.com/oauth/show?which=ConfirmPage" +
                "&display=pc&auth_time=&page_type=&viewPage=&scope=get_user_info,add_share" +
                "&response_type=token&redirect_uri="
                +encodeURIComponent(this.redirectUrl+ this.callback_url)
                + "&client_id=101359277&state="
                + base64encode(location.href);
            this.FaceBookLoginUrl="https://www.facebook.com/dialog/oauth?client_id=1841707962799220&redirect_uri="
                // this.FaceBookLoginUrl="/app/traditional/html/"+this.callback_url_FaceBook;
                //https://www.facebook.com/v2.5/dialog/oauth?client_id=XXXXXXXXXXXXXXX&redirect_uri=http%3A%2F%2Fphotovote.dev%2Fauth%2Ffacebook%2Fcallback&scope=email&response_type=code&state=0ztcKhmWwFLtj72TWE8uOKTcf65JmePtG95MZLDD
                +encodeURIComponent(this.redirectUrl+ this.callback_url_FaceBook)
                + "&response_type=code&state="
                + base64encode(location.href);
            this.callback_url_weixin = "weixin_callback.html"; // weixin登录回调地址 this.redirectUrl+ this.callback_url_weixin
            this.weixinLoginUrl="https://open.weixin.qq.com/connect/qrconnect?appid=wx28d925406d9babb5&redirect_uri="
                +encodeURIComponent(this.redirectUrl+ this.callback_url_weixin)
                + "&response_type=code&scope=snsapi_login&state="
                + base64encode(location.href)+"#wechat_redirect";

            // this.funcInit();
        };
        LoginView.prototype = {
            funcInit:function () {
                var hm = document.createElement("script");
                hm.src = "http://tjs.sjs.sinajs.cn/open/api/js/wb.js?appkey=2196827797";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
                $timeout(function () {
                    WB2.anyWhere(function(W){
                        W.widget.connectButton({
                            id: "wb_connect_btn",
                            type:"3,2",
                            callback : {
                                login:function(o){	//登录后的回调函数
                                },
                                logout:function(){	//退出后的回调函数
                                }
                            }
                        });
                    });

                },1000);
            },
            funcLoginBtn:function(){  //登录按钮样式控制
                if(this.loginName.length > 0 && this.loginPassword.length > 0 && this.loginPassword.length <= 20 ){
                    this.loginBtn1 = false;
                    this.loginBtn2 = true;
                }
                else{
                    this.loginBtn1 = true;
                    this.loginBtn2 = false;
                }
            },
            funcRegLoginAction:function(){  //用户名/邮箱+密码登录
                var reg = new RegExp(/^(\w){6,20}$/);
                window.localStorage.getsNum = 3;
                var macaddr = window.localStorage.web_did;
                // var validate = loginGeetest.getValidate();
                if(!this.loginName){
                    return notificationSrv.funcTankuang('请输入用户名/邮箱');
                }
                // else if(!XSH5Utils.funcPhoneNumCheck(this.loginName)){
                //     return notificationSrv.funcTankuang('用户名/邮箱输入有误');
                // }
                else if(!this.loginPassword){
                    return notificationSrv.funcTankuang('请输入密码');
                }
                else if(!reg.test(this.loginPassword)){
                    return notificationSrv.funcTankuang('密码格式有误，请输入6-20位字母、数字、下划线');
                }
                // var userLogName = this.loginName.replace(/^\s+|\s+$/g,"");
                //
                // if(!XSH5Utils.funcPhoneNumCheck(userLogName)){
                //     return notificationSrv.funcTankuang('请输入正确的手机号');
                // }
                // $(".gt_refresh_tips").click();
                // if(!validate){
                //     $("#geetestBox").show();
                //     return;
                // }
                // var regData = {
                //     "name" : userLogName,
                //     "password" : XSH5Utils.encryptByDES(this.loginPassword),
                //     "geetest_challenge":validate.geetest_challenge,
                //     "geetest_validate":validate.geetest_validate,
                //     "geetest_seccode":validate.geetest_seccode
                // };
                var regData = {
                    "username": this.loginName,
                    "pass": this.loginPassword,
                    // "pass": XSH5Utils.encryptByDES(this.loginPassword),
                    "role":1,
                    "timezone":"Asia/Shanghai",
                    "macaddr" : macaddr,
                    "terminal":1
                };
                loginRegSrv.funcRegUserLogin(regData, this.funcHideLoginPane);
            },
            //qq登录
            qqImageClick:function () {
                var url = this.qqLoginUrl;
                window.location.href = url;
            },
            // weibo登录
            facebookImageClick:function () {
                var url = this.FaceBookLoginUrl;
                window.location.href=url;
            },
            // weixin login
            weixinLoginClick:function (){
                var url = this.weixinLoginUrl;
                window.location.href=url;
            },
            funcHideLoginPane: function () {
                loginRegSrv.closeLoginDialog();
                loginRegSrv.closeRegisterDialog();
            },
            funcLoginDrill:function () {
                $state.go("baseHead.liveHallLogin");
                loginRegSrv.closeLoginDialog();
            },
            funcForgotPassDialog : function () {
                //this.funcHideLoginPane();
                this.forgotPassDialogIsShow.isShowFlag = 1;
                console.log("this.forgotPassDialogIsShow", this.forgotPassDialogIsShow)
            },
            resetPassSendEmail : function () {
                var that = this;
                if (this.resetPassEmail) {
                    this.resetPassEmailTips = this.resetPassEmail;
                    if (!XSH5Utils.funcEmailCheck(this.resetPassEmail)) {
                        this.forgotSendEmailIsShow = 1;
                    } else {
                        loginRegSrv.sendResetEmail(this.resetPassEmail, function () {
                            that.forgotSendEmailIsShow = 2;
                        }, function () {
                            that.forgotSendEmailIsShow = 1;
                        });
                    }
                }
            },
            updateNewPass : function () {
                var that = this;
                if ((this.newPass && this.validatePass) && (this.newPass == this.validatePass)) {
                    loginRegSrv.resetPass(this.newPass, function () {
                        that.resetPassSuc = 1;
                        that.loginAfterResetPass();
                    });
                } else {
                    this.resetPassSuc = 2;
                    return;
                }
            },
            loginAfterResetPass : function () {
                var macaddr = window.localStorage.web_did;
                var regData = {
                    "username": this.userEmail,
                    "pass": this.newPass,
                    // "pass": XSH5Utils.encryptByDES(this.loginPassword),
                    "role":1,
                    "timezone":"Asia/Shanghai",
                    "macaddr" : macaddr,
                    "terminal" : 1
                };
                loginRegSrv.funcRegUserLogin(regData, this.funcHideLoginPane);
            },
            funcCloseResetPassDialog : function () {
                this.forgotPassDialogIsShow.isShowFlag = 3;
                this.funcHideLoginPane();
            },
            //key event
            funcSpeckKeyEvent : function (e, index) {
                console.log("funcSpeckKeyEvent")
                var et = e || window.event;
                var keycode = et.charCode || et.keyCode;
                if(keycode == 13){
                    if(window.event){
                        window.event.returnValue = false;
                    }
                    else{
                        e.preventDefault();
                    }
                    this.funcRegLoginAction();
                }
            }
        };

        this.login_v = new LoginView();

        $timeout(function(){
            that.funcInit();
        });
    }
    module.controller('xsWeb.loginReg.loginRegCtrl', ['$scope', '$interval', 'xsWeb.common.userSrv', 'xsWeb.loginReg.mainSrv',
        'xsWeb.common.notificationSrv', '$timeout', 'xsWeb.common.httpSrv','$state', loginRegCtrl]);

})(loginRegModule, window);
