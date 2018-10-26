/**
 * Created by NM-029 on 9/5/2016.
 */
angular.module('xsWeb').controller('xsWeb.baseHeadCtrl', ['$window','$state', '$scope', '$stateParams', '$timeout','$interval','xsWeb.common.baseHeadSrv','xsWeb.common.userSrv',  '$location','xsWeb.common.notificationSrv','xsWeb.room.messageSrv', 'xsWeb.common.paraCheckSrv','xsWeb.common.webSocketSrv','xsWeb.room.chatSrv',
    function ($window, $state, $scope, $stateParams, $timeout,$interval,baseHeadSrv,userSrv, $location,notificationSrv,messageSrv,paraCheckSrv,webSocketSrv,chatSrv) {
        var that  = this;
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
        this.funcJoinRoom = function () {
            chatSrv._funcAddUserToQuietSpeckList('7000001', 'yxd', 'http://www.17sucai.com/preview/1/2017-06-26/talk/images/touxiang.png');
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
