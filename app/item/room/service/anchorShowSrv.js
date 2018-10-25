
/** 主播开/停播/流地址变化操作 */
(function(module, win, $){
    function anchorShowFactory(httpSrv, userSrv, $timeout,$interval,$http,loginRegSrv,paraCheckSrv){

        var Obj_anchorVideo = function(){
            var that = this;
            this.funcInit();
        };
        Obj_anchorVideo.prototype = {
            constructor:Obj_anchorVideo,
            funcInit:function(){

            }
        };

        var gObj_AnchorVideo = new Obj_anchorVideo();
        return gObj_AnchorVideo;
    };

    module.factory('xsWeb.room.anchorShowSrv', ['xsWeb.common.httpSrv','xsWeb.common.userSrv', '$timeout','$interval','$http','xsWeb.loginReg.mainSrv','xsWeb.common.paraCheckSrv',anchorShowFactory]);
})(roomModule, window, jQuery);

