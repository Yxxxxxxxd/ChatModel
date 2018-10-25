(function (module) {
    'use strict';

    var webSocketFactory = function ($state,httpSrv, paraCheckSrv, notificationSrv, userSrv) {
        var privateChatConnect;
        var closedPrivateChatConnectIntented;
        var privateChatConnectReconnectTimeOut;
        var privateChatTimeOutStatus4;
        var publicChatConnect;
        var closedPublicChatConnectIntented;
        var disconnectedTime = 0;

        function connectPrivateChatServer(serverUrl,webdid, receivingMessageCallback, connectionStateCallBack) {
            closedPrivateChatConnectIntented = false;
            var user = userSrv.funcGetUser();
            //消息回调
            var messageListener = function (elem) {
                handleReceivingMessage(elem, receivingMessageCallback);
            }
            //连接状态
            var connectionState = function (state) {
                connectionStateCallBack(state);
            }
            // var uid = userSrv.funcGetUser().funcGetUid();
            // var password = (userSrv.funcGetUser().funcGetLoginOfToken());
            // var name =projectVar.opDomain;
            var password = '123456';
            var resourceID = projectVar.opSpace+'_'+projectVar.opTerminal+'_'+projectVar.opVersion+'_' + 1 +'_' +webdid;
            var name =projectVar.opDomain+'test' + '@' +projectVar.opPanda + '/'+ resourceID;

            newPrivateChatConnect(serverUrl, name, password, messageListener, connectionState);
        }

        function newPrivateChatConnect(serverUrl, name, password, messageListener, connectionState) {
            clearTimeout(privateChatConnectReconnectTimeOut);
            // clearTimeout(privateChatTimeOutStatus4);
            privateChatConnect = new Strophe.Connection(serverUrl);
            privateChatConnect.connect(name, password, function (status) {
                if (Strophe.Status.CONNECTED == status) {
                    WebSocketId = 5;
                    privateChatConnect.xmlInput = messageListener;
                    if(disconnectedTime >= 10 && disconnectedTime <= 20){
                        // notificationSrv.funcTankuang("您的消息连接已恢复");
                        alert("您的消息连接已恢复");
                    }
                    disconnectedTime = 0;
                    consoleDebugMessage("Openfire建立连接成功！");
                    sendPresence(privateChatConnect);
                } else if (Strophe.Status.DISCONNECTED == status && !closedPrivateChatConnectIntented) {
                    // alert("掉线了！！！")
                    if(disconnectedTime == 3){
                        // notificationSrv.funcTankuang("您的消息连接正在恢复中，请耐心等待");
                        alert("您的消息连接正在恢复中，请耐心等待");
                    }
                    WebSocketId = 6;
                    privateChatConnectReconnectTimeOut = setTimeout(function () {
                        /*var url = xsServiceURL + "/users/ofpwd";
                        httpSrv.get(url, function (response) {
                            if (paraCheckSrv.checkResponseAndAlertError(response)) {
                                password = response.data.str;
                                userSrv.funcGetUser().funcSetOfToken(password);
                                userSrv.setUser();
                            }
                        });
                        disconnectedTime++;*/
                        newPrivateChatConnect(serverUrl, name, password, messageListener, null);
                    }, 3 * 1000);
                }else if (Strophe.Status.AUTHFAIL == status && !closedPrivateChatConnectIntented) {
                    // alert("掉线了！！！")
                    WebSocketId = 4;
                }
                if (connectionState) {
                    connectionState(status);
                }
            });
        }

        /**
         * 处理回调消息
         */
        function handleReceivingMessage(xmlElement, callback) {
            var xmlStr = null,
                fromUid,
                source;
            if (xmlElement !== null && xmlElement.textContent !== null) {
                xmlStr = xmlElement.textContent;
            }
            if (xmlStr === null) {
                return;
            }
            //parse from uid
            if (xmlElement && xmlElement.outerHTML) {
                source = xmlElement.outerHTML;
                fromUid = source.match(/from="(\d*)@/);
            }
            // var jsonObj = messageToJson(xmlStr);
            var jsonObj = xmlStr;
            callback(jsonObj);
           /* if (!!jsonObj && jsonObj.type != null) {
                if (!jsonObj.hasOwnProperty('fromUid')) {
                    jsonObj.fromUid = fromUid;
                }
                // consoleDebugMessage("接收消息:" + jsonObj.type + " " + jsonObj.subtype);
                // consoleDebugMessage("消息内容:" + JSON.stringify(jsonObj));
                callback(jsonObj);
            }*/
        }

        /**
         * 处理消息内容
         */
        function messageToJson(xmlStr) {
            var browserName = navigator.appName;
            var strDecoded;
            if (browserName == "Microsoft Internet Explorer") {//IE
                strDecoded = regHtml(xmlStr);
            } else {
                strDecoded = $('<textarea/>').html(xmlStr).val();
            }
            var strTrimed = strDecoded.replace("<![CDATA[", "");
            strTrimed = strTrimed.replace("]]>", "");
            var jsonObj;
            if (strTrimed != null && strTrimed.length > 0 && strTrimed.indexOf("{") > -1) {
                try {
                    jsonObj = JSON.parse(strTrimed);
                }
                catch (e) {
                    consoleDebugMessage("json 解析失败 str=" + strTrimed);
                }
            }
            return jsonObj;
        }

        /**
         * 发送出席
         */
        function sendPresence(conn) {
            if (!!conn) {
                consoleDebugMessage("发送出席");
                conn.send($pres());
            }
        }

        function sendLoginMessage(jsonObj, toUid) {
            if (!!privateChatConnect) {
                var jsonStr = $.toJSONString(jsonObj);
                // var iq = $msg({type: 'chat', to: 'im' + toUid + "@pandaof"}).c('body', {}).t('' + jsonStr);
                var iq = $msg({type: 'chat', to: '' + toUid + "@yxdof"}).c('body', {}).t('' + jsonStr);
                privateChatConnect.send(iq);
                consoleDebugMessage("发送消息:" + jsonStr);
            }
        }

        /**
         * 处理回调消息
         */
        function handleReceivingPublicMessage(xmlElement, callback) {
            var xmlStr = null;
            if (xmlElement !== null && xmlElement.textContent !== null) {
                xmlStr = xmlElement.textContent;
            }
            if (xmlStr === null) {
                return;
            }
            var jsonObj = publicMessageToJson(xmlStr);
            if (!!jsonObj && jsonObj.type != null) {
                callback(jsonObj);
            }
        }

        /**
         * 处理消息内容
         */
        function publicMessageToJson(xmlStr) {
            var browserName = navigator.appName;
            var strDecoded;
            if (browserName == "Microsoft Internet Explorer") {//IE
                strDecoded = regHtml(xmlStr);
            } else {
                strDecoded = $('<textarea/>').html(xmlStr).val();
            }
            var strTrimed = strDecoded.replace("<![CDATA[", "");
            strTrimed = strTrimed.replace("]]>", "");
            var jsonObj;
            if (strTrimed != null && strTrimed.length > 0 && strTrimed.indexOf("{") > -1) {
                jsonObj = JSON.parse(strTrimed);
            }
            return jsonObj;
        }

        function isPrivateConnected() {
            return !!privateChatConnect && privateChatConnect.connected;
        }

        function disConnectServer() {
            if (privateChatConnect) {
                privateChatConnect.disconnect();
            }
            if (publicChatConnect) {
                publicChatConnect.disconnect();
            }
            closedPrivateChatConnectIntented = true;
            closedPublicChatConnectIntented = true;
            consoleDebugMessage("Openfire disconnected!");
        }
        return {
            sendLoginMessage: sendLoginMessage,
            connectServers: connectPrivateChatServer,
            disConnectServer: disConnectServer,
            isConnected: isPrivateConnected,
        }
    };
    module.factory('xsWeb.common.webSocketSrv', ['$state','xsWeb.common.httpSrv', 'xsWeb.common.paraCheckSrv', 'xsWeb.common.notificationSrv', 'xsWeb.common.userSrv',webSocketFactory]);
})(commonModule);

jQuery.extend({
    toJSONString: function (object) {
        var type = typeof object;
        if ('object' == type) {
            if (Array == object.constructor) type = 'array';
            else if (RegExp == object.constructor) type = 'regexp';
            else type = 'object';
        }
        switch (type) {
            case 'undefined':
            case 'unknown':
                return;
            case 'function':
            case 'boolean':
            case 'regexp':
                return object.toString();
            case 'number':
                return isFinite(object) ? object.toString() : 'null';

            case 'string':
                return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () {
                    var a = arguments[0];
                    return (a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : "";
                }) + '"';

            case 'object':
                if (object === null) return 'null';
                var results = [];
                for (var property in object) {
                    var value = jQuery.toJSONString(object[property]);
                    if (value !== undefined) results.push(jQuery.toJSONString(property) + ':' + value);
                }
                return '{' + results.join(',') + '}';
            case 'array':
                var results1 = [];
                for (var i = 0; i < object.length; i++) {
                    var value1 = jQuery.toJSONString(object[i]);
                    if (value1 !== undefined) results1.push(value1);
                }
                return '[' + results1.join(',') + ']';
        }
    }
});


function consoleDebugMessage(message) {
    console.log(message);
}

/**
 * 收到的私信会可能会包含除body外的其它内容，这些内容会导致JSON解析出错，所以要去掉
 * 这个函数在 strophe.js的 _onMessage中调用
 * @param msg
 * @returns {*}
 */
function funcReplaceInvalidChat(msg) {
    //手机发送过来的私信
    var tmp = msg.toString();
    var msgStr = tmp.replace(/<thread>([\w:-]+)<\/thread>/, '').replace(/<subject>([\w:-]+)<\/subject>/, '');
    return msgStr;

}