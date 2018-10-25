/**
 * Created by hf-mini on 15/11/17.
 */
commonModule.factory('xsWeb.common.httpSrv', ['$http','$q','$window','$location','$rootScope', 'xsWeb.common.notificationSrv',
    function ($http, $q, $window,$location,$rootScope, notificationSrv) {

        //加载小菊花是否显示
        function httpService(xsConfig, ignoreToken){
            // showLoading();
            var success = function (response) {
                //隐藏加载菊花
                // hideLoading();
                if(response.data.status.statuscode=="-998"){                        //token过期10分钟
                    //session过期
                    //get Token
                    var accesstoken = window.localStorage.hrtk;
                    if(accesstoken){
                        var macaddr = window.localStorage.web_did;
                        var loginToken =  window.localStorage.logTkn;
                        var url = xsServiceURL+"/users/loginAuto";
                        var data = {
                            "loginToken":loginToken,
                            "role":1,  // 2 为学生，1 为教师
                            "macaddr" : macaddr,
                            "terminal" : 1
                        };
                        postSync(url,data,function(loginResponse){
                            if(loginResponse && loginResponse.status && loginResponse.status.statuscode == "0"){
                                var userInfo = loginResponse.data;
                                window.localStorage.hrtk=userInfo.accessToken;
                                window.localStorage.ofTen=userInfo.ofToken;
                                window.EventMd.create(eventEmType.REFRESH_ACCESS_TOKEN).trigger(eventEmType.REFRESH_ACCESS_TOKEN,userInfo);
                                var sourceurl = xsConfig.souceurl;
                                var sourcedata = xsConfig.sourcedata;
                                if (xsConfig.method == 'POST'){
                                    postSync(sourceurl,sourcedata,function(postResponse){
                                        response.data.data = postResponse.data;
                                        response.data.status = postResponse.status;
                                    })
                                }
                                if (xsConfig.method == 'GET'){
                                    getSync(sourceurl,function(getResponse){
                                        response.data.data = getResponse.data;
                                        response.data.status = getResponse.status;
                                    })
                                }
                                if(xsConfig.method == 'PUT'){
                                    putSync(sourceurl,sourcedata,function(putResponse){
                                        response.data.data = putResponse.data;
                                        response.data.status = putResponse.status;
                                    })
                                }
                                if(xsConfig.method == 'DELETE'){
                                    _deleteSync(sourceurl,function(deleteResponse){
                                        response.data.data = deleteResponse.data;
                                        response.data.status = deleteResponse.status;
                                    })
                                }
                            }else{
                                // var message;
                                window.localStorage.removeItem("hrtk");
                                window.localStorage.removeItem("hrud");
                                window.localStorage.removeItem("hrmb");
                                window.localStorage.removeItem("ofTen");
                                window.localStorage.removeItem("WsIp");
                                window.localStorage.removeItem("wsPort");
                                window.localStorage.removeItem("clid");
                                window.localStorage.removeItem("DetectionCamera");
                                window.localStorage.removeItem("qstr");
                                window.localStorage.removeItem("non");
                                window.localStorage.removeItem("kk");
                                window.localStorage.removeItem("role");
                                window.localStorage.removeItem("vefd");
                                window.localStorage.removeItem("logTkn");
                                window.localStorage.removeItem("hraat");
                                window.localStorage.removeItem("hrnm");
                                window.localStorage.removeItem("MsIdLs");
                                window.localStorage.removeItem("halted");
                                window.localStorage.removeItem("videoId");
                                window.localStorage.removeItem("audioId");
                                var indexPath = window.location.protocol + "//" + window.location.host;
                                window.location= indexPath;
                                return;
                            }
                        });
                    }else{
                        // var message;
                        // window.localStorage.removeItem("hrtk");
                        var indexPath = window.location.protocol + "//" + window.location.host;
                        window.location= indexPath;
                        return;
                    }

                }
                //过滤掉message中括号
                if(response.data.status.statuscode != 0){
                    response.data.status.message = response.data.status.message.replace('[', '');
                    response.data.status.message = response.data.status.message.replace(']', '');
                }
                if(xsConfig.success) {
                    if(response.data && response.data.data && response.data.data['dat' + 'a1']) {
                        var str = XSH5Utils.decryptResponse(response.data.data['dat' + 'a1']);
                        response.data.data = eval('(' + str + ')')
                    }
                    xsConfig.success(response.data);
                }
            };
            var failure = function (response) {
                //隐藏加载菊花
                // hideLoading();
                if(xsConfig.error) {
                    xsConfig.error(response);
                }
                //$rootScope.showAlert("获取数据失败,请检查您的网络连接并刷新页面...");
            };
            //encrypt(xsConfig);
            $http(xsConfig).then(success, failure);
        }

        var getConfig = XSH5Utils.getHttpConfig.bind(XSH5Utils);

        function getSign(url) {
            var xsConfig = getConfig( "GET", url, null, null);
            xsConfig.headers['Accept-Language']= Lang;
            return xsConfig.url;
        }

        function get (url, success, error, ignoreToken) {
            var xsConfig = getConfig( "GET", url, success, error);
            xsConfig.headers['Accept-Language']= Lang;
            httpService(xsConfig, ignoreToken);
        }

        function getSync(url, suc, err) {
            var xsConfig = getConfig("GET", url, suc, err);
            xsConfig.headers['Accept-Language']= Lang;
            xsConfig.async = false;
            $.ajax(xsConfig);
        }

        function post (url, data, success, error, ignoreToken) {
            var xsConfig = getConfig( "POST", url, success, error, data);
            xsConfig.headers['Accept-Language']= Lang;
            httpService(xsConfig, ignoreToken);
        }

        function postSync (url, data, success, error, ignoreToken) {
            var xsConfig = getConfig( "POST", url, success, error, data);
            xsConfig.headers['Accept-Language']= Lang;
            xsConfig.async = false;
            $.ajax(xsConfig);
        }

        function postSyncServ (url, data, success, error, ignoreToken) {
            var xsConfig = getConfig( "POST", url, success, error, data);
            xsConfig.headers['Accept-Language']= Lang;
            xsConfig.async = false;
            httpService(xsConfig);
        }

        function postPhp(url, data, success, error) {
            var xsConfig = getConfig( "POST", url, success, error, data);
            xsConfig.headers['Content-Type'] = "application/x-www-form-urlencoded";
            xsConfig.headers['Access-Control-Allow-Origin']= "*";
            xsConfig.headers['Accept-Language']= Lang;
            httpService(xsConfig, true);
        }

        function put (url, data, success, error, ignoreToken) {
            var xsConfig = getConfig( "PUT", url, success, error, data);
            xsConfig.headers['Accept-Language']= Lang;
            httpService(xsConfig, ignoreToken);
        }

        function putSync (url, data, success, error, ignoreToken) {
            var xsConfig = getConfig( "PUT", url, success, error, data);
            xsConfig.headers['Accept-Language']= Lang;
            xsConfig.async = false;
            $.ajax(xsConfig);
        }

        function _delete(url, success, error, ignoreToken) {
            var xsConfig = getConfig( "DELETE", url, success, error);
            xsConfig.headers['Accept-Language']= Lang;
            httpService(xsConfig, ignoreToken);
        }

        function _deleteSync(url, success, error, ignoreToken) {
            var xsConfig = getConfig( "DELETE", url, success, error);
            xsConfig.headers['Accept-Language']= Lang;
            xsConfig.async = false;
            $.ajax(xsConfig);
        }

        function _deleteWithData(url ,data, success, error, ignoreToken) {
            var xsConfig = getConfig( "DELETE", url, success, error, data);
            xsConfig.headers['Accept-Language']= Lang;
            httpService(xsConfig, ignoreToken);
        }
        /**
         * 检查返回结果是否正确 如果不正确提示错误信息
         * @param response
         * @returns {boolean}
         */
        function checkResponseStatus (response) {
            if (response && response.status && response.status.statuscode == "0") {
                return true;
            } else {
                //session 过期
                if(response && response.status && response.status.statuscode == "-100"){
                    notificationSrv.funcTankuang('会话过期请先登录');
                } else if (response && response.status && response.status.message) {
                    notificationSrv.funcTankuang(response.status.message);
                }
                return false;
            }
        }

        return {
            get : get,
            post : post,
            put : put,
            delete : _delete,
            _deleteSync : _deleteSync,
            deleteWithData : _deleteWithData,
            getSync : getSync,
            postPhp : postPhp,
            getSign : getSign,
            putSync : putSync,
            postSync:postSync,
            postSyncServ:postSyncServ,
            checkResponseStatus:checkResponseStatus
        }
    }]);
