/**
 * Created by NM-029 on 9/5/2016.
 */
angular.module('xsWeb').controller('xsWeb.baseHeadCtrl', ['$window','$state', '$scope', '$stateParams', '$timeout','$interval','xsWeb.common.baseHeadSrv','xsWeb.common.userSrv',  '$location','xsWeb.common.notificationSrv','xsWeb.room.messageSrv', 'xsWeb.common.paraCheckSrv','xsWeb.common.webSocketSrv','xsWeb.room.chatSrv',
    function ($window, $state, $scope, $stateParams, $timeout,$interval,baseHeadSrv,userSrv, $location,notificationSrv,messageSrv,paraCheckSrv,webSocketSrv,chatSrv) {
        var that  = this;
        this.seleteName = '';
        var user = userSrv.funcGetUser();
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

            if (!user) {
                // if (!loginRegSrv.isClickLoginBtn[0]) {
                //     loginRegSrv.showLogin();
                //     loginRegSrv.isClickLoginBtn[0] = !loginRegSrv.isClickLoginBtn[0];
                // }
                // $state.go("baseHead.liveHall");

                // $state.go("roomBase.roomChat");
            }
            else{

            }

        });
        var source = 'from="yxx@chatof/Spark 2.8.3.960"';
        // var fromUid = source.match(/from="(\d*)@/i);
        // var fromUid = source.replace("from=","");
        var hjs = 'adobe12@15test'.match(/^"[a-z]@\w/);
        var fromUid = source.match(/"(.*?)@/);

        console.log("fromUid :",fromUid[1]);
        console.log("hjs :",hjs);
        /*选择个人身份*/
        this.SelectPersonalIdentity = function (index) {
            var avatar = '',nickname='',uid=0,ofName='';
            if(index == 0){
                avatar = '/app/images/room/xingxing.jpg';
                nickname = 'yxx';
                ofName = 'yxx';
                uid = '120707';
            }else if(index == 1){
                avatar = '/app/images/room/xulei.jpg';
                nickname = 'xl';
                ofName = 'xl';
                uid = '120702';
            }else if(index == 2){
                avatar = '/app/images/room/xiaojiang.jpg';
                nickname = 'bcj';
                ofName = 'bcj';
                uid = '120706';
            }else if(index == 3){
                avatar = '/app/images/room/shezhang.jpg';
                nickname = 'yxd';
                ofName = 'yxd';
                uid = '120704';
            }
            that.seleteName = nickname;
            var userInfo = {
                avatar:avatar,
                nickname:nickname,
                uid:uid
            };
            //模拟用户信息
            //isVisitor, avatar, nickname, showid, uid, isAnchor, sessionid, loginTime,isInMyRoom,ofToken,ofIp,ofPort,wsPort，wsIp,loginToken,qstr,verified,halted
            var user = new G_OBJ_user(false, userInfo.avatar, userInfo.nickname, userInfo.showid,
                userInfo.uid, true,userInfo.accessToken, new Date().getTime(),'','',userInfo.ofToken,userInfo.ofIp,userInfo.ofPort,userInfo.wsPort,userInfo.wsIp,userInfo.loginToken,userInfo.qstr,userInfo.role,userInfo.verified,userInfo.halted);
            userSrv.funcSetUser(user);
            userSrv.setUser();
            messageSrv.connectOpenfire(ofName);
        };
        this.funcJoinRoom = function (index) {
            var avatar = '',nickname='',uid=0;
            if(index == 0){
                avatar = '/app/images/room/xingxing.jpg';
                nickname = 'yxx';
                uid = '120707';
            }else if(index == 1){
                avatar = '/images/room/xulei.jpg';
                nickname = 'xl';
                uid = '120702';
            }else if(index == 2){
                avatar = '/images/room/xiaojiang.jpg';
                nickname = 'bcj';
                uid = '120706';
            }else if(index == 3){
                avatar = '/images/room/shezhang.jpg';
                nickname = 'yxd';
                uid = '120704';
            }
            chatSrv._funcAddUserToQuietSpeckList(uid, nickname, avatar);
            $state.go("roomBase.roomChat");
        };

        this.funcToTop = function(){            //回到顶部
            $("html,body").animate({scrollTop: 0}, 500);
        };
        $scope.$watch(function() {
            return userSrv.funcGetUser();
        }, function(user) {
            $scope.user = user;
        });

    }]);
