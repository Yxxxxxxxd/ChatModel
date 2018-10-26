/**
 * Created by NM-029 on 9/21/2016.
 */
loginRegModule.factory('xsWeb.loginReg.quitSrv', ['$uibModal', 'xsWeb.common.userSrv', 'xsWeb.common.notificationSrv', '$window', 'xsWeb.common.httpSrv', 'xsWeb.common.paraCheckSrv',
    function ($uibModal, userSrv, notificationSrv, $window, httpSrv, paraCheckSrv) {

        var LoginRegService = function () {
            this.quitDialog = null;
            this.animationsEnabled = true;
            this.isClickQuitBtn = [false];
        };
        LoginRegService.prototype={
            showLogout:function(){
                if(this.quitDialog){
                    // return ;
                }
                this.quitDialog = $uibModal.open({
                    animation: this.animationsEnabled,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'item/loginReg/html/quit.tpl.html',
                    controller: 'xsWeb.loginReg.quitCtrl',
                    controllerAs: 'quitCtrl',
                    resolve: {
                        items: function () {
                            ;
                        }
                    }
                });
            },
            closeLoginDialog:function(success) {
                if (this.quitDialog) {
                    this.isClickQuitBtn[0] = false;
                    this.quitDialog.dismiss('cancel');
                }
            },
            funcSrvQuit:function () {
                var that = this;
                var url = xsServiceURL + "/users/login?accessToken=" +userSrv.funcGetUser().funcGetSession()+ "&loginToken=" +userSrv.funcGetUser().funcGetLoginToken();
                console.log("funcSrvQuit.url", url);
                httpSrv._deleteSync(url,function (response) {
                    if(paraCheckSrv.checkResponseAndAlertError(response)){
                        console.log("funcSrvQuit.response", response);
                        that.isClickQuitBtn[0] = false;
                        userSrv.clearUser();
                        // $window.location.reload();
                        $window.location.href = "/";
                    } else {
                        notificationSrv.funcTankuang(response.status.message);
                        that.isClickQuitBtn[0] = false;
                        userSrv.clearUser();
                        $window.location.href = "/";
                    }
                });
            }
        };
        return new LoginRegService();
    }
]);
