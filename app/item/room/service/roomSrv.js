/**
 * Created by NM-029 on 1/17/2017.
 */
//
(function(module,win) {
    'use strict';
    win.isRoomPage = false;
    win.funcSetIsRoomPage = function (isRoomPage) {
        win.isRoomPage = isRoomPage;
    };
    win.funcGetIsRoomPage = function () {
        return win.isRoomPage;
    };
    var roomFactory = function (httpSrv,$stateParams,notificationSrv,userSrv,paraCheckSrv) {
        var that = this;
        var ChatRoomData = function(avatar, nickname, uid){
            this.avatar = avatar;
            this.nickname = nickname;
            this.uid = uid;
        };
        ChatRoomData.prototype={
            constructor:ChatRoomData,
            funcGetAnchorAvatar:function(){
                return this.avatar;
            },
            funcGetAnchorNickName:function(){
                return this.nickname;
            },
            funcGetAnchorUid:function(){
                return this.uid;
            }
        };
        var RoomSrv = function () {
            this.roomTotalData = null;//房间中的数据
            this.anchor = {};       //主播信息 G_OBJ_anchor
            this.video = null;
            this.toavatar = 0;
            this.touid = 0;
            this.touserName = 0;
            this.anchorUid = 0;

            this.chatRoomData = [];         //换房间数据
            this.roomAnchorInfo = [];       //房间设置信息
            this.funcInit();
        };
        RoomSrv.prototype = {
            constructor: RoomSrv,
            funcInit: function () {
                var user = userSrv.funcGetUser();
                // OF 测试
                this.anchorUid = $stateParams.uid;
                win.funcSetIsRoomPage(true);
                //media_url, param_quality, resourceId, servIp, servPort
                // this.ofInfo = new OfInfo('', '', '', '192.169.84.105', '5222');
                //房间数据获取完成
                var channelId = window.localStorage.clid;
                if(!channelId){
                    return
                }
                window.EventMd.create(eventEmType.EM_TYPE_ROOM_INIT).trigger(eventEmType.EM_TYPE_ROOM_INIT);
                if((user) && user.funcGetSession()){
                    //进入自己的房间
                    if(this.anchorUid == user.funcGetUid()){
                        // TODO  自己的房间
                        user.funcSetIsInMyRoom(true);
                    }
                }else{
                    // notificationSrv.funcTankuang('请先登录');
                    return ;
                }
                if(this.anchorUid == user.funcGetUid()){
                    user.funcSetIsInMyRoom(true);
                }

            },
            //lessons/{lessonId}            获取授课记录详情
            funcGetLessonDetails:function(lessonId,suc){
                var url =xsServiceURL + "/lessons/" + lessonId;
                httpSrv.get(url,suc);
            },
            funcGetResouceInfo:function (suc) {
                var qstr = window.localStorage.qstr;
                var url = xsServiceURL+'/resource?l=' + Lang + '&t=' + Terminal + '&qstr=' + qstr;
                httpSrv.get(url, suc);
            },

            funcAnalyticsLogs:function (data,suc) {
                var url =xsServiceURL + "/analytics/logs?appName=" + APPName + "&appVersion=" + APPVersion;
                // var url = xsServiceURL+"/users/loginAuto";
                httpSrv.post(url,data,suc);
            },
            funcGetRoomTotalData:function() {  //get房间中的数据
                return this.roomTotalData;
                //http://127.0.0.1:8091/lessons/course/saveStudentEval
            },
            funcGetLessonSaveStudentEval:function(data,suc){
                var url = xsServiceURL + "/lessons/course/saveStudentEval";
                httpSrv.post(url,data,suc);
            },
            //http://127.0.0.1:8091/lessons/course/getCacheCourse?uid=30000008      //获取学生临时保存课件
            //http://127.0.0.1:8091/lessons/course/getCourse/1                      //有courseId时调取
            funcGetStudentsCacheCourse:function(uid,courseId,suc){
                var url;
                if(courseId == -1){
                    return;
                    // url =xsServiceURL + "/lessons/course/getCacheCourse?uid=" + uid;
                }else{
                    url =xsServiceURL + "/lessons/course/getCourse/"+ courseId;
                }
                httpSrv.get(url,suc);
            },

        };

        var roomSrv = new RoomSrv();

        return roomSrv;
        // return new roomFactory();
    };
    module.factory('xsWeb.room.roomSrv', ['xsWeb.common.httpSrv','$stateParams', 'xsWeb.common.notificationSrv','xsWeb.common.userSrv','xsWeb.common.paraCheckSrv',roomFactory]);
})(roomModule,window);
