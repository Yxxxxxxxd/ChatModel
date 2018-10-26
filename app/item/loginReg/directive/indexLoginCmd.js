/**
 * Created by NM-029 on 10/24/2016.
 */
commonModule.directive('indexLoginToolbar', ['xsWeb.loginReg.mainSrv','xsWeb.loginReg.quitSrv', 'xsWeb.common.userSrv', 'xsWeb.liveHall.liveHallLoginSrv', function(loginRegSrv, quitSrv, userSrv, liveHallLoginSrv) {
// roomModule.directive('roomLoginToolbar', ['xsWeb.loginReg.mainSrv', 'xsWeb.common.userSrv', function(loginRegSrv, userSrv) {
    var directive = {
        templateUrl: 'item/loginReg/html/indexLogin.tpl.html',
        restrict: 'E',
        replace: true,
        scope: true,
        link: function($scope, $rootScope, $element, $attrs, $controller) {
            var RoomLogin = function(){
                this.login = function(){
                    if(!loginRegSrv.isClickLoginBtn[0]){
                        loginRegSrv.closeRegisterDialog();
                        loginRegSrv.showLogin();
                        loginRegSrv.isClickLoginBtn[0] = !loginRegSrv.isClickLoginBtn[0];
                        loginRegSrv.forgotPassDialog.isShowFlag = 0;
                        loginRegSrv.loginMethodIndex.index = 1;
                    }
                };
                this.register = function(){
                    if(!loginRegSrv.isClickRegisterBtn[0]){
                        loginRegSrv.closeLoginDialog();
                        loginRegSrv.showRegister();
                        loginRegSrv.isClickRegisterBtn[0] = !loginRegSrv.isClickRegisterBtn[0];
                        loginRegSrv.forgotPassDialog.isShowFlag = 0;
                        loginRegSrv.loginMethodIndex.index = 0;
                    }
                };
                this.funcUserQuit = function(){
                    quitSrv.showLogout();
                }
            };
            $scope.$watch(function() {
                return userSrv.funcGetUser();
            }, function(user) {
                $scope.user = user;
            });
            $scope.roomLogin = new RoomLogin();
        }
    };
    return directive;
}]);
