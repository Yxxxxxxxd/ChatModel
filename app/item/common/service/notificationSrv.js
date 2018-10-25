/**
 * Created by NM-029 on 10/12/2016.
 */
(function(mode) {
    'use strict';

    function notificationFactory($timeout) {

        var Tankuang = function () {
            this.EM_SHOW_TIME = 2000;
            this.isShow = false;
            this.content = '';
        };
        Tankuang.prototype = {
            constructor:Tankuang,
            funcSetContent:function (content) {
                this.content = content;
            },
            funcSetIsShow:function (isShow) {
                this.isShow = isShow;
            },
            funcGetShowTime:function () {
                return this.EM_SHOW_TIME;
            },
            funcGetContent:function () {
                return this.content;
            },
            funcGetIsShow:function () {
                return this.isShow;
            }
        };
        //action 可以是链接与JS.如果是JS请以javascript:开头
        var HongrenAlertSubmit = function () {
            this.actionHref = null;
            this.actionEvt = null;
            Tankuang.call(this);
        };
        HongrenAlertSubmit.prototype = new Tankuang();
        HongrenAlertSubmit.prototype.constructor = HongrenAlertSubmit;
        //action 可以是链接与JS.如果是JS请以javascript:开头
        HongrenAlertSubmit.prototype.funcSetAction = function (action) {
            var actionHref=action,actionEvt=null,parm=null;
            if(action.toLowerCase().indexOf('javascript')>=0){
                actionHref = null;
                actionEvt = action.match(/(javascript)(\s*?\:\s*?)(\S+)/i)[3];
                var parmStart = actionEvt.indexOf('(');
                parm = actionEvt.substring(parmStart+1,actionEvt.indexOf(')'));
                actionEvt = actionEvt.substring(0, parmStart);
            }else{
                ;
            }
            this.actionHref = actionHref;
            this.actionEvt = actionEvt;
            this.parm = parm;
        };
        HongrenAlertSubmit.prototype.funcSetContext = function (context) {
            this.context = context;
        };
        HongrenAlertSubmit.prototype.funcGetActionHref = function () {
            return this.actionHref;
        };
        HongrenAlertSubmit.prototype.funcExecuteActionEvt = function () {
            this.context[this.actionEvt](this.parm);
            this.funcSetIsShow(false);
        };


        var DashboardShow = function () {
            this.isShow = false;
            this.minShow = false;
        };
        DashboardShow.prototype = {
            constructor:DashboardShow,
            funcSetIsShow:function (isShow) {
                this.isShow = isShow;
            },
            funcGetIsShow:function () {
                return this.isShow;
            },
            funcGetMinShow:function () {
                return this.minShow;
            },
            funcSetMinShow:function (minShow) {
                this.minShow = minShow;
            }
        };
        //<!--系统自定义弹框提示，带确定按钮-->


        var NotificationSrv = function () {
            this.tankuang = new Tankuang();
            this.hongrenAlert = new Tankuang();     //系统自定义弹框提示
            this.hongrenAlertSubmit = new HongrenAlertSubmit();         //系统自定义弹框提示，带确定按钮
            this.dashboardShow = new DashboardShow();         //仪表盘
            this.funcInit();
        };

        NotificationSrv.prototype={
            constructor:NotificationSrv,
            funcInit:function () {

            },
            //系统自定义弹框提示
            funcHongrenAlert:function (content) {
                this.hongrenAlert.funcSetContent(content);
                this.hongrenAlert.funcSetIsShow(true);
            },
            //context 执行环境
            funcHongrenAlertSubmit:function (content, action, context) {
                this.hongrenAlertSubmit.funcSetContext(context);
                this.hongrenAlertSubmit.funcSetContent(content);
                this.hongrenAlertSubmit.funcSetAction(action);
                this.hongrenAlertSubmit.funcSetIsShow(true);
            },
            funcTankuang:function (content) {
                var that = this;
                this.tankuang.funcSetContent(content);
                this.tankuang.funcSetIsShow(true);
                $timeout(function () {
                    that.tankuang.funcSetIsShow(false);
                },this.tankuang.funcGetShowTime());
            },



            funcGetTankuang:function () {
                return this.tankuang;
            },
            funcGetHongrenAlert:function () {
                return this.hongrenAlert;
            },
            funcGetHongrenAlertSubmit:function () {
                return this.hongrenAlertSubmit;
            },
            funcGetDashboardShow:function () {
                return this.dashboardShow;
            }
        };

        return new NotificationSrv();

    }

    mode.factory('xsWeb.common.notificationSrv', ['$timeout', notificationFactory]);
})(commonModule);