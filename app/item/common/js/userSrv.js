commonModule.factory('xsWeb.common.userSrv', ['$window', 'xsWeb.common.httpSrv',
    function ($window, httpSrv) {
        var that = this;
        //loginType属性说明 0代表游客 1代表用户名密码登陆
        var UserInfo = function () {

            // of 测试
            // this.user = new G_OBJ_user(true, "", "", "", 0, 0,
            //     "", "", "",  "", '1',  false, '',
            //     false, "123456", 0, '', '');
            this.user = null;
            this.funcInit();
        };
        UserInfo.prototype={
            constructor:UserInfo,
            funcInit:function () {
              //将localStorage转存为G_OBJ_user
                var tempUser = getUser();
                var token = getToken();
                var uid = getUserId();
                var username = getUserName();
                var showid = tempUser.hrsod;
                var avatar = tempUser.hraat;
                var logTim = tempUser.logTim;
                var ofToken = tempUser.ofTen;
                var WsIp = tempUser.WsIp;
                var wsPort = tempUser.wsPort;
                var logTkn = tempUser.logTkn;
                var qstr = tempUser.qstr;
                var role = tempUser.role;
                var verified = tempUser.vefd;
                var halted = tempUser.halted;
                var password = '';
                if(token && token!='undefined' && uid && uid!='undefined'){
                    //isVisitor, avatar, nickname, showid, uid, isAnchor, sessionid, loginTime,isInMyRoom,password,ofToken,ofIp,ofPort,wsPort,WsIp,loginToken,qstr,role
                    this.user = new G_OBJ_user(false, avatar, username, showid, uid,  false, token, logTim, '',password,ofToken,'','',wsPort,WsIp,logTkn,qstr,role,verified,halted);
                }
                $window.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).listen(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_AVATAR, function (avatar) {
                    throttleFn(setAvatar, that, avatar);
                });

            },
            funcGetUser:function () {
                return this.user;
            },
            funcSetUser:function (user) {
                this.user = user;
            }
        };
        var userInfo = new UserInfo();


        function getUser() {
            return window.localStorage;
        }

        function setUser() {
            /*
            userSrv.setUserId(userInfo.uid);
            userSrv.setPassword(passwd);
            userSrv.setToken(userInfosessionid);
            userSrv.setUserName(userInfonickname);
            userSrv.setAvatar(userInfo.avatar);
            */
            var userInfo = this.funcGetUser();
            getUser().hrud = userInfo.funcGetUid();
            getUser().hrnm = userInfo.funcGetNickName();
            getUser().hrsod = userInfo.funcGetShowId();
            getUser().hraat = userInfo.funcGetAvatar();
            getUser().hrtk = userInfo.funcGetSession();
            //记录登录时间
            getUser().logTim = userInfo.funcGetLoginTime();
            getUser().ofTen = userInfo.funcGetLoginOfToken();
            getUser().WsIp = userInfo.funcGetLoginWsIp();
            getUser().wsPort = userInfo.funcGetLoginWsPort();
            getUser().logTkn = userInfo.funcGetLoginToken();
            getUser().qstr = userInfo.funcGetQstr();
            getUser().role = userInfo.funcGetRole();
            getUser().vefd = userInfo.funcGetVerified();
            getUser().halted = userInfo.funcGetHalted();
        }
        function clearUser() {
            getUser().removeItem("hrtk");
            getUser().removeItem("hrud");
            getUser().removeItem("hrmb");
            getUser().removeItem("ofTen");
            getUser().removeItem("WsIp");
            getUser().removeItem("wsPort");
            getUser().removeItem("clid");
            getUser().removeItem("DetectionCamera");
            getUser().removeItem("qstr");
            getUser().removeItem("non");
            getUser().removeItem("kk");
            getUser().removeItem("role");
            getUser().removeItem("vefd");
            getUser().removeItem("MsIdLs");
            getUser().removeItem("halted");
            getUser().removeItem("videoId");
            getUser().removeItem("audioId");
        }

        function getUserId() {
            return getUser().hrud;
        }

        function getUserName() {
            return getUser().hrnm;
        }

        function getToken() {
            return getUser().hrtk;
        }
        function getLoginTime() {
            return getUser().logTim;
        }
        function getLoginMobile(){
            return getUser().hrmb;
        }

        function getAvatar() {
            return getUser().hraat;
        }

        function getLoginType() {
            return getUser().loginType;
        }

        function setUserName(userName) {
            getUser().hrnm = userName;
        }

        function setUserId(userId) {
            getUser().hrud = userId;
        }

        function setLoginType(loginType) {
            getUser().loginType = loginType;
        }


        function setToken(token) {
            getUser().hrtk = token;
        }

        function setAvatar(avatar) {
            getUser().hraat = avatar;
        }
        function removeToken() {
            getUser().removeItem("hrtk");
        }

        /**
         * 获取游客sessionid
         */
        function requestVisitorSession(suc, err) {
            var url = xsServiceURL + "/custuser/visitor";
            httpSrv.get(url, suc, err);
        }


        return {
            /*
            getUser: getUser,

            getUserId: getUserId,
            getToken: getToken,
            getLoginType: getLoginType,
            getUserName: getUserName,
            getAvatar: getAvatar,
            getPassword: getPassword,
            setPassword: setPassword,
            setUserName: setUserName,
            setUserId: setUserId,
            setToken: setToken,
            setAvatar: setAvatar,
            setLoginType: setLoginType,
            requestVisitorSession: requestVisitorSession,
            removeToken : removeToken,
            removePassword : removePassword,
            getIdCheckData:getIdCheckData,
            setIdCheckData:setIdCheckData,
            */
            setUser: setUser.bind(userInfo),
            clearUser:clearUser,
            //------------
            setUserAvatar:setAvatar,
            funcGetUser:userInfo.funcGetUser.bind(userInfo),
            funcSetUser:userInfo.funcSetUser.bind(userInfo)
        }
    }]);