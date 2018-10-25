
/**
 * 得到当前页面的Object对象
 */
(function(win){
    function liveRoomGlobalChange(){
        // $(".nano").nanoScroller({});//加滚动条
        //浏览器宽度/高度
        $("#roomBody").height(window.innerHeight);
        //初始化视频区
        if(($(window).width()/($(window).height()))>(1310/982)){
            var videoWidth = window.innerHeight*(1310/982);
            $("#roomVideo").height(window.innerHeight);
            $("#roomVideo").css('width',videoWidth);
        }else{
            var videoHeight = window.innerWidth/(1310/982);
            $("#roomVideo").width(window.innerWidth);
            $("#roomVideo").height(videoHeight);
        }
        //输入框获取焦点样式
        $("textarea").focus(function(){
            $(this).addClass("room_chat_focus");
        });
        $("textarea").blur(function(){
            $(this).removeClass("room_chat_focus");
        });
        $(".room_chat_translate_google_txt2").focus(function(){
            $(this).addClass("room_chat_focus_white");
        });
        $(".room_chat_translate_google_txt2").blur(function(){
            $(this).removeClass("room_chat_focus_white");
        });
    }
    function resizeEle(){
        if(win.funcGetIsRoomPage()){
            liveRoomGlobalChange();
        }
    }

    $(win).resize(function(){
        throttleFn(resizeEle,win);
        //浏览器宽度/高度
        $("#roomBody").height(window.innerHeight);
        //视频区
        if(($(window).width()/($(window).height()))>(1310/982)){
            var videoWidth = window.innerHeight*(1310/982);
            $("#roomVideo").height(window.innerHeight);
            $("#roomVideo").css('width',videoWidth);
        }else{
            var videoHeight = window.innerWidth/(1310/982);
            $("#roomVideo").width(window.innerWidth);
            $("#roomVideo").height(videoHeight);
        }
    });

    win.liveRoomGlobalChange = liveRoomGlobalChange;

})(window);

