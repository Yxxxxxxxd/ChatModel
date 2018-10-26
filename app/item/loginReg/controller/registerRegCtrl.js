/**
 * Created by NM-029 on 2/6/2017.
 */
(function (module, win) {
    function registerRegCtrl(httpSrv, $scope,$state, $interval, userSrv, loginRegSrv, notificationSrv, $timeout) {
        var that = this;
        var regGeetest = null;

        //极限验证
        that.funcInit = function () {
            // regGeetest = new WebGeetest('#div_id_embed_register', httpSrv.get, function () {
            //     that.register_v.geetestSuccessFg = true;
            //     // that.register_v.funcSecurityCodeBtn();
            //     that.register_v.funcLoginBtn();
            // });
        };

        //登录注册退出框VIEW
        var RegView = function () {
            var that = this;
            //注册输入数据
            this.loginName = "";
            this.loginEmail = "";
            this.loginBirth = "";
            this.loginMajor = "";
            this.loginIsChinese = "";
            this.loginMobile = "";
            this.loginCode = "";
            this.regTimezone = '';
            this.securityCodeTip = "免费获取验证码";
            this.loginSecond = 59;
            this.regPasswd = '';
            this.confirmRegPass = '';

            //获取验证码按钮背景控制
            this.securityCodeBtn1 = true;
            this.securityCodeBtn2 = false;
            this.geetestSuccessFg = false;

            //注册按钮背景控制
            this.loginBtn1 = true;
            this.loginBtn2 = false;

            this.redirectUrl="http://"+window.location.host+"/traditional/html/";

            this.callback_url = "qc_callback2_pub.html"; // QQ登录回调地址

            this.callback_url_sina = "sina_callback.html"; // sina登录回调地址

            this.qqLoginUrl="https://graph.qq.com/oauth/show?which=ConfirmPage" +
            "&display=pc&auth_time=&page_type=&viewPage=&scope=get_user_info,add_share" +
            "&response_type=token&redirect_uri="
            +encodeURIComponent(this.redirectUrl+ this.callback_url)
            + "&client_id=101359277&state="
            + base64encode(location.href);
            this.weiboLoginUrl="https://api.weibo.com/oauth2/authorize?client_id=2196827797&redirect_uri="
            +encodeURIComponent(this.redirectUrl+ this.callback_url_sina)
            + "&response_type=code&state="
            + base64encode(location.href);
            this.callback_url_weixin = "weixin_callback.html"; // weixin登录回调地址
            this.weixinLoginUrl="https://open.weixin.qq.com/connect/qrconnect?appid=wxcab24ba741d86d20&redirect_uri="
            +encodeURIComponent(this.redirectUrl+ this.callback_url_weixin)
            + "&response_type=code&scope=snsapi_login&state="
            + base64encode(location.href)+"#wechat_redirect";

            // this.funcInit();
        };
        RegView.prototype = {
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
            funcRegBoxInit:function(){
                this.loginName = "";
                this.loginEmail = "";
                this.loginMobile = "";
                this.regPasswd = "";
                this.loginBirth = "";
                this.loginMajor = "";
                this.loginIsChinese = 0;
                $('.home_login_radio').removeClass("home_login_radio_check");
            },
            //设置邮箱输入检查
            funcCheckEmailInput:function(type){
                var inputEmail = '';
                if(type == 0){
                    inputEmail = this.loginEmail;
                }
                if (inputEmail) {
                    if (!XSH5Utils.funcEmailCheck(inputEmail)) {
                        return notificationSrv.funcTankuang('邮箱格式输入有误');
                    }
                }
            },
            //设置密码输入检查
            funcCheckPassInput:function(type){
                var inputPass = '';
                if(type == 0){
                    inputPass = this.regPasswd;
                }
                else{
                    inputPass = this.confirmRegPass;
                }

                var reg = new RegExp(/^(\w|-){6,20}$/);

                if (inputPass && !( reg.test(inputPass))) {
                    return notificationSrv.funcTankuang('密码格式有误，请输入6-20位字母、数字、下划线');
                }
                else if(type == 1 && inputPass != this.regPasswd){
                    return notificationSrv.funcTankuang('两次密码输入不一致');
                }
            },
            funcLoginBtn:function(){
                var isChecked = document.getElementById("register_check").checked;
                if(this.loginMobile.length == 11 && this.loginCode.length == 6 &&
                    this.regPasswd.length >= 6 && this.regPasswd.length <= 20 &&
                    this.confirmRegPass.length >= 6 && this.confirmRegPass.length <= 20 &&
                    isChecked ){
                    this.loginBtn1 = false;
                    this.loginBtn2 = true;
                }
                else{
                    this.loginBtn1 = true;
                    this.loginBtn2 = false;
                }
            },
            funcGetRegIsChineseClick:function () {
                var that = this;
                var humanDate = 0;
                $('.home_login_radio').toggleClass("home_login_radio_check");
                if(that.loginIsChinese == 0){
                    that.loginIsChinese = 1;
                }else{
                    that.loginIsChinese = 0;
                }
                console.log(that.loginIsChinese);
            },
            funcRegAction: function () {
                // this.gender = $("input[name='gender']:checked").val() == "男" ? 1 : 2 ;
                var reg = new RegExp(/^(\w|-){6,20}$/);
                if(!this.loginName){
                    return notificationSrv.funcTankuang('请输入用户名');
                } else if (!XSH5Utils.funcNicknameCheck(this.loginName)) {
                    return notificationSrv.funcTankuang('用户名格式输入有误');
                } else if (!this.loginEmail) {
                    return notificationSrv.funcTankuang('请输入邮箱');
                } else if (!XSH5Utils.funcEmailCheck(this.loginEmail)) {
                    return notificationSrv.funcTankuang('邮箱格式输入有误');
                }
                // else if(!this.loginMobile){
                //     return notificationSrv.funcTankuang('请输入手机号');
                // }
                // else if(!XSH5Utils.funcPhoneNumCheck(this.loginMobile)){
                //     return notificationSrv.funcTankuang('手机号输入有误');
                // }

                else if (!this.regPasswd) {
                    return notificationSrv.funcTankuang('请设置密码');
                }
                else if (!(reg.test(this.regPasswd))) {
                    return notificationSrv.funcTankuang('密码格式有误，请输入6-20位字母、数字、下划线');
                }
                else if(this.loginMajor.length >10){
                    return notificationSrv.funcTankuang('专业不得超过10个字符!');
                }
                else if(this.loginBirth && !XSH5Utils.funcYearMonthDayCheck(this.loginBirth)){
                     return notificationSrv.funcTankuang('出生日期输入有误');
                }
                else {
                    var date = new Date(this.loginBirth);
                    humanDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
                    this.regTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                }
                // if(!this.loginMobile){
                //     return notificationSrv.funcTankuang('手机号为空');
                // }
                var regData = {
                    "username":this.loginName,
                    "pass":this.regPasswd,
                    "email":this.loginEmail,
                    "mobile":this.loginMobile ? "+86 "+this.loginMobile : "",
                    "birth":humanDate,
                    "major" :this.loginMajor,
                    "channel":"1",
                    "timezone":this.regTimezone,
                    "isChinese":this.loginIsChinese,
                    "terminal":1
                };
                console.log("注册信息", regData);
                loginRegSrv.funcUserRegister(regData, this.funcHideRegisterPane);
            },
            //qq登录
            qqImageClick:function () {
                var url = this.qqLoginUrl;
                window.location.href = url;
            },
            // weibo登录
            sinaImageClick:function () {

                var url = this.weiboLoginUrl;
                window.location.href=url;
            },
            // weixin login
            weixinLoginClick:function (){
                var url = this.weixinLoginUrl;
                window.location.href=url;
            },
            funcHideRegisterPane: function () {
                loginRegSrv.closeRegisterDialog();
            },
            funcPrivacyPolicyClick:function () {
                var url = $state.href('privacyPolicy');
                window.open(url,'_blank');
            },
            funcPrivacyAgreement:function () {
                var url = $state.href('agreement');
                window.open(url,'_blank');
            }
        };

        this.register_v = new RegView();

        $timeout(function(){
            that.funcInit();
        });
    }
    module.controller('xsWeb.loginReg.registerRegCtrl', ['xsWeb.common.httpSrv', '$scope','$state', '$interval', 'xsWeb.common.userSrv', 'xsWeb.loginReg.mainSrv',
        'xsWeb.common.notificationSrv', '$timeout', registerRegCtrl]);
})(loginRegModule, window);
//注册框输入内容初始化
function funcRegBoxInit(){
    angular.element(document.getElementById('registerRegCtrl')).controller().register_v.funcRegBoxInit();
}
