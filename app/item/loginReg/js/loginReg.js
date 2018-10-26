//没有通过教师审核的用户相关弹框操作
function funcLoginHelpTipBoxIsShow(userInfo, suc){
    if(userInfo.hasOwnProperty('role') || userInfo.hasOwnProperty('verified')){
        if(userInfo.role == 2 || userInfo.verified == 0) {
            angular.element(document.getElementById('baseHeadCtrl')).controller().detectionCameraShow = true;
            window.localStorage.pdnm = userInfo.nickname;
            window.localStorage.pdavt = userInfo.avatar;
            if(typeof suc === 'function'){
                suc();
            }
            return false;
        }
    }
    return true;
}
//没有通过教师审核的用户点击弹框上“确定”按钮相关操作
function funcRoomTest(){
    var name = window.localStorage.pdnm;
    var avatar = window.localStorage.pdavt;
    window.location.href='https://www.upanda.com?name=' + encodeURIComponent(name)+"&avatar="+avatar;
    window.localStorage.removeItem("pdnm");
    window.localStorage.removeItem("pdavt");
}