/**
 * Created by NM-029 on 1/17/2017.
 */
//
(function(module) {
    'use strict';

    var baseHeadFactory = function (httpSrv,userSrv) {

        var baseHeadSrv = function () {
            this.userAnchorStaus = 0; //用户开播状态:0 不可开播  1可以开播
            this.funcInit();
        };
        baseHeadSrv.prototype={
            constructor:baseHeadSrv,
            funcInit:function () {
            },
            //http://{ip:port}/v2/users/teachers/{uid}/camera?check={check}
            funcGetCameraInfo:function (check,suc) {
                var uid = userSrv.funcGetUser().funcGetUid();
                var url = xsServiceURL+'/users/teachers/' + uid + '/camera?check=' + check;
                httpSrv.get(url, suc);
            },
        };
        return new baseHeadSrv();
    };
    module.factory('xsWeb.common.baseHeadSrv', ['xsWeb.common.httpSrv','xsWeb.common.userSrv',baseHeadFactory]);
})(commonModule);
