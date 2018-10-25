/**
 * Created by NM-029 on 9/5/2016.
 */
angular.module('xsWeb').controller('xsWeb.baseHeadCtrl', ['$window','$state', '$scope', '$stateParams', '$timeout','$interval','xsWeb.common.baseHeadSrv','xsWeb.common.userSrv', 'xsWeb.loginReg.mainSrv','xsWeb.liveHall.liveHallLoginSrv', '$location','xsWeb.common.notificationSrv','xsWeb.room.messageSrv', 'xsWeb.user.infoSrv', 'xsWeb.order.orderSrv','xsWeb.common.paraCheckSrv','xsWeb.common.webSocketSrv',
    function ($window, $state, $scope, $stateParams, $timeout,$interval,baseHeadSrv,userSrv,loginRegSrv, liveHallLoginSrv, $location,notificationSrv,messageSrv, infoSrv, orderSrv,paraCheckSrv,webSocketSrv) {
        var that  = this;
        var user = userSrv.funcGetUser();
        this.dashboardShow = notificationSrv.funcGetDashboardShow();      //仪表盘显示
        this.audioNormal = true;
        this.videoNormal = true;
        this.videoIsShow = 0;
        this.foraudioPluginArr = projectVar.foraudioPluginArr;
        this.forbidPluginArr = projectVar.forbitPluginArr;
        this.videoName = '助手';
        this.videoName2 = '伴侣';
        //修改用户昵称
        this.modifyNickNameDivShow = false;
        this.funcIsShow = function(isShow){
            // that.userNewName = user.funcGetNickName();
            this.modifyNickNameDivShow = isShow;

        };

        this.liveHallTabs = [
            {title:"首页",pageUrl:"/", router:'baseHead.liveHall'},
            {title:"仪表板",pageUrl:"#/dashboard", router:'baseHead.dashboard'},
            {title:"预约管理",pageUrl:"#/order", router:'baseHead.order'},
            {title:"图书馆",pageUrl:"#/course",router:'baseHead.course'},
            {title:"历史记录",pageUrl:"#/history", router:'baseHead.history'},
            {title:"帮助",pageUrl:"#/help",router:'baseHead.help'}
            // {title:"发现",pageUrl:"/", router:'baseHead.liveHall'}

        ];
        this.liveHallOnTagIndex = 0;
        this.funcSelectShowTag = function($index){  //当前选中的是 首页/仪表板 预约管理 历史记录 支持
            var page = this.liveHallTabs[$index];
            if (page.pageUrl.indexOf('dashboard')>=0) {
                if (!user) {
                    if (!loginRegSrv.isClickLoginBtn[0]) {
                        loginRegSrv.showLogin();
                        loginRegSrv.isClickLoginBtn[0] = !loginRegSrv.isClickLoginBtn[0];
                    }
                } else {
                    this.liveHallOnTagIndex = $index;

                    that.dashboardShow.funcSetIsShow(true);
                    that.dashboardShow.funcSetMinShow(false);
                    // $state.go(page.router);
                }
            }
            else if(page.pageUrl.indexOf('order')>=0){
                if(!user){
                    if(!loginRegSrv.isClickLoginBtn[0]){
                        loginRegSrv.showLogin();
                        loginRegSrv.isClickLoginBtn[0] = !loginRegSrv.isClickLoginBtn[0];
                    }
                }else{
                    this.liveHallOnTagIndex = $index;
                    orderSrv.funcGetOrderTimeList();
                    $state.go(page.router);
                }
            }
            else if(page.pageUrl.indexOf('history')>=0){
                this.liveHallOnTagIndex = $index;
                $state.go(page.router);
            }else if(page.pageUrl.indexOf('help')>=0){
                this.liveHallOnTagIndex = $index;
                $state.go(page.router);
                // window.open(page.pageUrl);
            }
            else if(page.pageUrl.indexOf('course')>=0){
                if(userSrv.funcGetUser().funcGetHalted() == 0){
                    this.liveHallOnTagIndex = $index;
                    $state.go(page.router);
                }else{
                    notificationSrv.funcTankuang("请您联系运营开通权限")
                }
                // window.open(page.pageUrl);
            }
            else if($index == 0){
                this.liveHallOnTagIndex = $index;
                // window.location.reload();
                liveHallLoginSrv.funcoreignTeacherListMapInfo();
                $state.go(page.router);
            }
        };
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            var email = XSH5Utils.funcGetParameterFromUrl('uname');
            var code = XSH5Utils.funcGetParameterFromUrl('code');
            if (!user) {
                // if (!loginRegSrv.isClickLoginBtn[0]) {
                //     loginRegSrv.showLogin();
                //     loginRegSrv.isClickLoginBtn[0] = !loginRegSrv.isClickLoginBtn[0];
                // }
                $state.go("baseHead.liveHall");
            }else if (toState.name.indexOf('dashboard') >= 0) {
                that.liveHallOnTagIndex = 1;
            } else if (toState.name.indexOf('order') >= 0) {
                that.liveHallOnTagIndex = 2;
            } else if (toState.name.indexOf('course') >= 0) {
                that.liveHallOnTagIndex = 3;
            } else if (toState.name.indexOf('history') >= 0) {
                that.liveHallOnTagIndex = 4;
            } else if (toState.name.indexOf('liveHall') >= 0) {
                window.EventMd.create(eventEmType.BACK_TO_LOGIN_HOME).trigger(eventEmType.BACK_TO_LOGIN_HOME);
            }
            else if (toState.name.indexOf('help') >= 0) {
                that.liveHallOnTagIndex = 5;
            }
            else{
                window.EventMd.create(eventEmType.CLEAR_TIMEOUT).trigger(eventEmType.CLEAR_TIMEOUT);
            }
            if (!user && email) {
                loginRegSrv.showResetPassDialog(email, code);
            }
        });

        /**
         *  首页修改用户昵称浮动框选项切换
         */
        this.modifyNickNameBoxTabs = [
            {title:"编辑个人资料",pageUrl:"#/user/info",router:'baseHead.user'},
            {title:"设置",pageUrl:"#/user/info",router:'baseHead.user'},
            {title:"帮助",pageUrl:"#/help",router:'baseHead.help'}
        ];
        this.OnTagIndex;
        this.funcSelectNickNameBoxShowTag = function($index){  //当前选中的是 基本信息/修改密码/实名认证 选项卡
            var page = this.modifyNickNameBoxTabs[$index];
            this.OnTagIndex = $index;
            if ($index == 0) {
                infoSrv.setShowTab(1);
            } else if ($index == 1) {
                infoSrv.setShowTab(3);
            }
            // window.open(page.pageUrl,"_blank");
            $state.go(page.router);
        };
        this.funcToTop = function(){            //回到顶部
            $("html,body").animate({scrollTop: 0}, 500);
        };
        $scope.$watch(function() {
            return userSrv.funcGetUser();
        }, function(user) {
            $scope.user = user;
        });
        this.funcRedirectToAllChat = function () {
            $state.go("baseHead.chat");
        };
        this.detectionCameraShow = false;
        this.detectionCamera = false;
        $timeout(function () {
            if(user){
                // messageSrv.connectOpenfire(0);
                var role = user.funcGetRole();
                var verified = user.funcGetVerified();
                var DetectionCamera = window.localStorage.DetectionCamera;
                if(role==2 || verified == 0){
                    that.detectionCameraShow = true;
                    // that.RoomTestClick();
                }else if(DetectionCamera == "false") {
                    // that.funGetVideoAndAudio();
                    that.detectionCamera = true;
                }
                window.EventMd.create(eventEmType.REFRESH_ACCESS_TOKEN).listen(eventEmType.REFRESH_ACCESS_TOKEN, function(userInfo){
                    var userAccesstoken = userInfo.accessToken;
                    var userOftoken = userInfo.ofToken;
                    userSrv.funcGetUser().funcSetSession(userAccesstoken);
                    userSrv.funcGetUser().funcSetOfToken(userOftoken);
                    userSrv.setUser();
                });
            }
        });
        this.RoomTestClickShow = function () {
            $state.go("roomBase.roomTest");
        };
        this.RoomTestClick = function () {
            funcRoomTest();
        };
        this.funGetVideoAndAudio = function () {
            // if (typeof MediaStreamTrack === 'undefined' || typeof MediaStreamTrack.getSources === 'undefined') {
            if (typeof MediaStreamTrack === 'undefined') {
                alert('checkSystemRequirements.\n\n尝试一下谷歌浏览器 ！');
            }
            else {
                var init_devs = function (s) {
                    navigator.mediaDevices.enumerateDevices().then(function (sourceInfos) {
                        var checkState = false;
                        for (var i = 0; i !== sourceInfos.length; ++i) {
                            var sourceInfo = sourceInfos[i];
                            if (sourceInfo.kind == 'audioinput') {
                                if (that.foraudioPluginArr && that.foraudioPluginArr.indexOf(sourceInfo.label) > -1) {
                                    continue;
                                }
                                that.audioNormal = true;
                            } else if (sourceInfo.kind == 'videoinput') {
                                if (sourceInfo.label.indexOf(that.videoName) > -1 || sourceInfo.label.indexOf(that.videoName2) > -1 || that.forbidPluginArr && that.forbidPluginArr.indexOf(sourceInfo.label) > -1) {
                                    continue;
                                }
                                that.videoIsShow = 1;
                                that.videoNormal = true;
                            } else {
                                console.log('非音频视频源: ', sourceInfo);
                            }
                        }
                        if(that.videoNormal == true && that.audioNormal ==true){
                            checkState = true;
                        }
                        baseHeadSrv.funcGetCameraInfo(checkState,function (response) {
                            if (paraCheckSrv.checkResponseAndAlertError(response)) {
                                window.localStorage.DetectionCamera = true;
                            }
                        })
                    });
                }
                if (that.videoIsShow != 1) {
                    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(init_devs);
                }else{
                    init_devs();
                }
            }
        }
        // $(window).on("beforeunload", function() {
        //     //刷新房间  跟关闭界面执行
        //     webSocketSrv.disConnectServer();
        // });

    }]);
