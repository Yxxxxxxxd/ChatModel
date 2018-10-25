/**
 * Created by NM-029 on 9/6/2016.
 */
(function(win){
    var activityCfg = {
        service:'http://192.168.84.155:8129/v2',
        //service:'http://192.168.84.148:82/v2',
        activityUrl:'/activity/activityData'
    };
    activityCfg.srvUrl = activityCfg.service + activityCfg.activityUrl;
    win.activityCfg = activityCfg;
    var activityCfg2 = {
        service:'http://192.168.84.155:8129/v2',
        //service:'http://192.168.84.148:82/v2',
        activityUrl:'/activity/'
    };
    activityCfg2.srvUrl = activityCfg2.service + activityCfg2.activityUrl;
    win.activityCfg2 = activityCfg2;

    //���������������ȡ��������ֵ
    function funcGetParameterFromUrl( name, url ) {
        if (!url) url = location.href
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        return results == null ? null : results[1];
    }
    win.funcGetParameterFromUrl = funcGetParameterFromUrl;
})(window);
