/*默认启动页面，以及不能识别的路由都返回anchors*/
angular.module('xsWeb')
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {

            if (urlH5Mode) {
                $locationProvider.html5Mode(true);
            }
            $urlRouterProvider.when('', '/');

            $stateProvider

            // web 页面
            //带上方通用头部UI的基础html
                .state('baseHead', {
                    url : '',
                    abstract : true,
                    views : {
                        '' : {
                            templateUrl: 'item/common/html/baseHead.html'
                        }
                    }
                })
                //用户协议
                .state('agreement', {
                    url : '/agreement',
                    // abstract : true,
                    views : {
                        '' : {
                            templateUrl: 'item/help/html/agreement.html'
                        }
                    }
                })
                //隐私政策
                .state('privacyPolicy', {
                    url: '/privacyPolicy',
                    views: {
                        '': {
                            templateUrl: 'item/help/html/pp.html'
                        }
                    }
                })
                //未登录 大厅
                .state('baseHead.liveHall', {
                    url : '/',
                    views : {
                        'mainView' : {
                            // templateUrl: 'item/liveHall/html/liveHall.html'
                            templateUrl: 'item/room/html/roomChat.html'
                        }
                    }
                })
                //学生登录 大厅
                .state('baseHead.studentHead', {
                    url : '/',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/liveHall/html/studentHead.html'
                        }
                    }
                })
                //已登录 大厅
                .state('baseHead.liveHallLogin', {
                    url : '/',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/liveHall/html/liveHallLogin.html'
                        }
                    }
                })
                //直播间基础页
                .state('roomBase', {
                    url : '',
                    abstract : true,
                    views : {
                        '' : {
                            templateUrl: 'item/room/html/roomBase.html'
                        }
                    }
                })

                //新版直播间
                .state('roomBase.roomChat', {
                    url : '/room',
                    // url : '/roomNew/{lessonid:[0-9]{1,4}}',
                    views : {
                        'roomView' : {
                            templateUrl: 'item/room/html/roomChat.html'
                        }
                    }
                })


                /* wei xin */
                .state('weixin', {
                    url : '/weixin',
                    views : {
                        '' : {
                            templateUrl: 'item/weixinCom/html/weixinBase.html'
                        }
                    }
                })
                //微信公众号充值
                .state('weixin.wxRecharge', {
                    url : '/wxRecharge',
                    views : {
                        'weixinView' : {
                            templateUrl: 'item/wxRecharge/html/wxRecharge.html'
                        }
                    }
                })
        }
    ]);
