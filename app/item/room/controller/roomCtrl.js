(function(module){

    function roomCtrl($scope, $timeout, $state,$interval,userSrv,roomSrv,dashboardSrv,paraCheckSrv,notificationSrv){

        var that = this;
        this.messageId = '';
        // anchorShowSrv.funGetVideoAndAudio();
        // anchorShowSrv.funcZGVideoDevices();
        this.editorClick = false;
        // console.log("this.editorClick : ",this.editorClick);

        this.funcEditorClickShow = function () {
            this.editorClick = true;
        };

        this.funcEditorClickHide = function () {
            this.editorClick = false;
        };
        liveRoomGlobalChange();
    }

    module.controller('xsWeb.room.roomCtrl',['$scope', '$timeout', '$state','$interval' ,'xsWeb.common.userSrv','xsWeb.room.roomSrv','xsWeb.dashboard.dashboardSrv','xsWeb.common.paraCheckSrv','xsWeb.common.notificationSrv','xsWeb.common.userSrv',roomCtrl])
})(roomModule);