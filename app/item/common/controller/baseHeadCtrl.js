/**
 * Created by NM-029 on 9/5/2016.
 */
angular.module('xsWeb').controller('xsWeb.baseHeadCtrl', ['$window','$state', '$scope', '$stateParams', '$timeout','$interval','xsWeb.common.baseHeadSrv','xsWeb.common.userSrv',  '$location','xsWeb.common.notificationSrv','xsWeb.room.messageSrv', 'xsWeb.common.paraCheckSrv','xsWeb.common.webSocketSrv',
    function ($window, $state, $scope, $stateParams, $timeout,$interval,baseHeadSrv,userSrv, $location,notificationSrv,messageSrv,paraCheckSrv,webSocketSrv) {
        var that  = this;
        var user = userSrv.funcGetUser();
        this.dashboardShow = notificationSrv.funcGetDashboardShow();      //仪表盘显示
        this.audioNormal = true;
        this.videoNormal = true;
        this.videoIsShow = 0;
        //修改用户昵称
        this.modifyNickNameDivShow = false;
        this.funcIsShow = function(isShow){
            // that.userNewName = user.funcGetNickName();
            this.modifyNickNameDivShow = isShow;

        };

        this.liveHallTabs = [
            // {title:"首页",pageUrl:"/", router:'baseHead.liveHall'},
            {title:"首页",pageUrl:"/", router:'roomBase.roomChat'}
            // {title:"发现",pageUrl:"/", router:'baseHead.liveHall'}

        ];
        this.liveHallOnTagIndex = 0;
        this.funcSelectShowTag = function($index){  //当前选中的是 首页/仪表板 预约管理 历史记录 支持
            var page = this.liveHallTabs[$index];
            if (page.pageUrl.indexOf('dashboard')>=0) {
                if (!user) {
                    /*if (!loginRegSrv.isClickLoginBtn[0]) {
                        loginRegSrv.showLogin();
                        loginRegSrv.isClickLoginBtn[0] = !loginRegSrv.isClickLoginBtn[0];
                    }*/
                } else {
                    this.liveHallOnTagIndex = $index;
                    // $state.go(page.router);
                }
            }
            else if($index == 0){
                this.liveHallOnTagIndex = $index;
                // window.location.reload();
                $state.go(page.router);
            }
        };
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (!user) {
                // if (!loginRegSrv.isClickLoginBtn[0]) {
                //     loginRegSrv.showLogin();
                //     loginRegSrv.isClickLoginBtn[0] = !loginRegSrv.isClickLoginBtn[0];
                // }
                // $state.go("baseHead.liveHall");
                $state.go("roomBase.roomChat");
            }
            else{
                window.EventMd.create(eventEmType.CLEAR_TIMEOUT).trigger(eventEmType.CLEAR_TIMEOUT);
            }

        });

        this.funcToTop = function(){            //回到顶部
            $("html,body").animate({scrollTop: 0}, 500);
        };
        $scope.$watch(function() {
            return userSrv.funcGetUser();
        }, function(user) {
            $scope.user = user;
        });

    }]);
