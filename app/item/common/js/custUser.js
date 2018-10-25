/**
 * Created by NM-029 on 8/16/2016.
 */
(function(win, $){
    /*用户类*/
    // "uid": 30000031,
    //     "accessToken": "7662f0e67fdd92861df09917f075788a",
    //     "loginToken": "ldc379e392e2adccc16a39362d3723ddf",
    //     "nickname": "HidalgocRaDt2dFQ",
    //     "avatar": "http://pics.xiu361.cn/op/avatar/sys_06.jpg",
    //     "regHours": 0,
    //     "mobileStatus": -1,
    //     "emailStatus": -1
    //isVisitor, avatar, nickname, showid, uid, isAnchor,
    // sessionid, loginTime,isInMyRoom,ofToken,ofIp,ofPort
    var G_OBJ_user = function(isVisitor, avatar, nickname, showid, uid, isAnchor, sessionid, loginTime,isInMyRoom,password,ofToken,ofIp,ofPort,wsPort,wsIp,loginToken,qstr,role,verified,halted){
        this.isVisitor = isVisitor;
        this.avatar = avatar;
        this.nickname = nickname;
        this.showid = showid;
        this.sessionid = sessionid;

        this.uid = uid;
        this.isAnchor = isAnchor;
        this.isInMyRoom = isInMyRoom;
        this.password = password;

        this.loginTime = loginTime;                 //登录时间

        this.ofToken = ofToken;
        this.ofIp = ofIp;
        this.ofPort = ofPort;
        this.wsPort = wsPort;
        this.wsIp = wsIp;
        this.loginToken = loginToken;
        this.qstr = qstr;
        this.role = role;                           //是否为学生       1表示老师 2 表示学生
        this.verified = verified;                   //老师审核是否通过  0表示未审核 1 表示已审核
        this.halted = halted;                       //老师是否可用开播  0表示未审核 1 表示已审核
        this.nickname4 = nickname;
    };

    G_OBJ_user.prototype = {
        constructor:G_OBJ_user,
        funcGetIsVisitor:function(){
            return this.isVisitor;
        },
        funcGetUid:function(){
            var nonce = window.localStorage.non;
            var kk1 = window.localStorage.kk;
            var md5s = this.uid + '' + nonce;
            var kk2 = CryptoJS.MD5(md5s) + '';
            if(nonce == undefined && kk1 == undefined){
                return this.uid;
            }
            else if(kk1 == kk2){
                return this.uid;
            }else{
                window.localStorage.removeItem("hrtk");
                window.localStorage.removeItem("hrud");
                window.localStorage.removeItem("hrmb");
                window.localStorage.removeItem("ofTen");
                window.localStorage.removeItem("WsIp");
                window.localStorage.removeItem("wsPort");
                window.localStorage.removeItem("clid");
                window.localStorage.removeItem("DetectionCamera");
                window.localStorage.removeItem("qstr");
                window.localStorage.removeItem("non");
                window.localStorage.removeItem("kk");
                window.localStorage.removeItem("role");
                window.localStorage.removeItem("vefd");
                window.localStorage.removeItem("logTkn");
                window.localStorage.removeItem("hraat");
                window.localStorage.removeItem("hrnm");
                window.localStorage.removeItem("MsIdLs");
                window.localStorage.removeItem("halted");
                window.localStorage.removeItem("videoId");
                window.localStorage.removeItem("audioId");
            }
            // return this.uid;
        },
        funcGetFormNickName:function(){
            return this.nickname.length>8?this.nickname.substr(0, 8):this.nickname;
        },
        funcGetNickName:function(){
            return this.nickname;
        },
        funcGetNickNameFour:function(){
            return this.nickname4.length>4?this.nickname4.substr(0,4)+'...':this.nickname4;
        },
        funcGetAvatar:function(){
            return this.avatar;
        },
        funcGetShowId:function(){
            return this.showid;
        },
        funcGetIsAnchor:function(){
            return this.isAnchor;
        },
        funcGetIsInMyRoom:function(){
            return this.isInMyRoom;
        },
        funcGetPassWord:function(){
            return this.password;
        },
        funcGo2HomePage:function(){
            return funcGo2TaHome(this.uid);
        },
        funcGetSession:function(){
            return this.sessionid;
        },
        funcGetFollowers:function(){
            return this.followers;
        },
        funcGetLoginTime:function(){
            return this.loginTime;
        },
        funcGetLoginMobile:function(){
            return this.mobile;
        },
        funcGetLoginOfToken:function(){
            return this.ofToken;
        },
        funcGetLoginOfIp:function(){
            return this.ofIp;
        },
        funcGetLoginOfPort:function(){
            return this.ofPort;
        },
        funcGetLoginWsPort:function(){
            return this.wsPort;
        },
        funcGetLoginWsIp:function(){
            return this.wsIp;
        },
        funcGetLoginToken:function(){
            return this.loginToken;
        },
        funcGetQstr:function(){
            return this.qstr;
        },
        funcGetRole:function(){
            return this.role;
        },
        funcGetVerified:function(){
            return this.verified;
        },
        funcGetHalted:function(){
            return this.halted;
        },

        funcSetUid:function(uid){
            this.uid = uid;
        },
        funcSetIsInMyRoom:function(isInMyRoom){
            this.isInMyRoom = isInMyRoom;
        },
        funcSetPassWord:function(password){
            this.password = password;
        },
        funcSetNickName:function(nickname){
            this.nickname = nickname;
        },
        funcSetSession:function(sessionid){
            this.sessionid = sessionid;
        },
        funcSetOfToken:function(ofToken){
            this.ofToken = ofToken;
        },
        funcSetMoney:function(money){
            if(!isNaN(money) && (this.money != money)){
                this.money = +money;
                //触发更新local staorage
                win.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).trigger(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_MONEY, this.money);
            }
        },
        funcSetDiamond:function(diamond){
            if(!isNaN(diamond) && (this.diamond != diamond)){
                this.diamond = +diamond;
                //触发更新local staorage
                win.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).trigger(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_DIAMOND, this.diamond);
            }
        },
        funcSetAvatar:function(avatar){
            if(avatar && (this.avatar != avatar)){
                this.avatar = avatar;
                //触发更新local staorage
                win.EventMd.create(eventEmType.EM_TYPE_USER_INFO_CHANGE).trigger(eventEmType.EM_SUB_TYPE_LOCAL_STORAGE_AVATAR, this.avatar);
            }
        }
    };

    /*主播类*/
    //isVisitor, avatar, nickname, showid, uid, isAnchor,
    // sessionid, loginTime,isInMyRoom,ofToken,ofIp,ofPort
    var G_OBJ_anchor = function(isVisitor, avatar, nickname, showid,uid, isAnchor, isInMyRoom,password, sessionid,
                                 onLineTime, isOnline, mode,ofToken,ofIp,ofPort,wsPort,wsIp,loginToken,qstr,role,verified,halted){
        G_OBJ_user.call(this,isVisitor, avatar, nickname, showid, uid, isAnchor, isInMyRoom,password,sessionid,ofToken,ofIp,ofPort,wsPort,wsIp,loginToken,qstr,role,verified,halted);

        this.onLineTime = onLineTime;       //开播时间
        this.isOnline = isOnline;           //主播是否在线
        this.mode = mode;                   //在哪里开播的
    };


    G_OBJ_anchor.prototype = new G_OBJ_user();
    G_OBJ_anchor.prototype.constructor = G_OBJ_anchor;
    G_OBJ_anchor.prototype.EM_MODE_MOBILE = 0;      //在手机开播
    G_OBJ_anchor.prototype.EM_MODE_PC = 1;          //在PC开播
    G_OBJ_anchor.prototype.funcGetOnLineTime=function(){
        return this.onLineTime;
    };
    G_OBJ_anchor.prototype.funcGetHostvalue=function(){
        return this.hostvalue;
    };
    G_OBJ_anchor.prototype.funcGetScore=function(){
        return this.score;
    };
    G_OBJ_anchor.prototype.funcGetScoreUp=function(){
        return this.scoreUp;
    };
    G_OBJ_anchor.prototype.funcGetIsOnline=function(){
        return this.isOnline;
    };
    G_OBJ_anchor.prototype.funcGetMode=function(){
        return this.mode;
    };
    G_OBJ_anchor.prototype.funcSetMode=function(mode){
        this.mode = mode;
    };
    G_OBJ_anchor.prototype.funcSetOnLineTime=function(onLineTime){
        this.onLineTime = onLineTime;
    };

    G_OBJ_anchor.prototype.funcSetIsOnline=function(isOnline){
        this.isOnline = isOnline;
    };

    function  setUser2localStorage(userInfo) {
        var localStorage  = window.localStorage;
        localStorage.hrud = userInfo.funcGetUid();
        localStorage.hrnm = userInfo.funcGetNickName();
        localStorage.hrsod = userInfo.funcGetShowId();
        localStorage.hraat = userInfo.funcGetAvatar();
        localStorage.hrtk = userInfo.funcGetSession();
        localStorage.logTim = userInfo.funcGetLoginTime();
        localStorage.logTkn = userInfo.funcGetLoginToken();
        localStorage.qstr = userInfo.funcGetQstr();
        localStorage.role = userInfo.funcGetRole();
        localStorage.ofTen = userInfo.funcGetLoginOfToken();
        localStorage.WsIp = userInfo.funcGetLoginWsIp();
        localStorage.wsPort = userInfo.funcGetLoginWsPort();
        localStorage.vefd = userInfo.funcGetVerified();
        localStorage.halted = userInfo.funcGetHalted();
    }

    win.G_OBJ_user = G_OBJ_user || Object;
    win.G_OBJ_anchor = G_OBJ_anchor || Object;
    win.setUser2localStorage = setUser2localStorage;
})(window,jQuery);
