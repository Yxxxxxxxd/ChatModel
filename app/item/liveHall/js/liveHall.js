/**
 * 得到当前页面的Object对象
 */
(function(win){
    if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        document.getElementById('ct').className = 'content content_pab'
    }
})(window);

