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
                            templateUrl: 'item/liveHall/html/liveHall.html'
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
                //仪表盘
                .state('baseHead.dashboard', {
                    url : '/dashboard',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/dashboard/html/dashboard.html'
                        }
                    }
                })
                //预约管理
                .state('baseHead.order',{
                    url : '/order',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/order/html/order.html'
                        }
                    }
                })

                //历史记录
                .state('baseHead.history',{
                    url : '/history',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/history/html/history.html'
                        }
                    }
                })
                //支持
                .state('baseHead.support',{
                    url : '/support',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/support/html/support.html'
                        }
                    }
                })
                //整页聊天
                .state('baseHead.chat',{
                    url : '/chat',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/chat/html/chat.html'
                        }
                    }
                })
                //课程
                .state('baseHead.course',{
                    url : '/course',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/course/html/course.html'
                        }
                    }
                })
                //用户信息导航
                .state('baseHead.user', {
                    url : '/user',
                    views : {
                        'mainView' : {
                            templateUrl: 'item/mySpace/html/mySpace.html'
                        }
                    }
                })

                //我的资料
                .state('baseHead.user.info', {
                    url: '/info',
                    views: {
                        'userView': {
                            templateUrl: 'item/mySpace/html/mySpace.html'
                        }
                    }
                })
                //其他教师资料
                .state('baseHead.teacInfo', {
                    url: '/teacInfo/{uid:[0-9]{1,9}}',
                    views: {
                        'mainView': {
                            templateUrl: 'item/mySpace/html/personalData.html'
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

                //直播间   ZEGO
                .state('roomBase.roomZeGo', {
                    url : '/roomZeGo/{lessonid:[0-9]{1,4}}',
                    // url : '/room',
                    views : {
                        'roomView' : {
                            templateUrl: 'item/room/html/roomZeGo.html'
                        }
                    }
                })
                //直播间  Agora
                .state('roomBase.roomAgora', {
                    url : '/roomAgora/{lessonid:[0-9]{1,4}}',
                    // url : '/room',
                    views : {
                        'roomView' : {
                            templateUrl: 'item/room/html/roomAgora.html'
                        }
                    }
                })
                //直播间  测试摄像头
                .state('roomBase.roomTest', {
                    url : '/roomTest',
                    // url : '/room',
                    views : {
                        'roomView' : {
                            templateUrl: 'item/room/html/roomTest.html'
                        }
                    }
                })
                //新版直播间
                .state('roomBase.roomNew', {
                    url : '/roomNew/{lessonid:[0-9]{1,4}}',
                    // url : '/room',
                    views : {
                        'roomView' : {
                            templateUrl: 'item/room/html/roomNew.html'
                        }
                    }
                })

                //帮助页
                .state('baseHead.help', {
                    url: '/help',
                    views: {
                        'mainView': {
                            templateUrl: 'item/help/html/help.html'
                        }
                    }
                })
                .state('baseHead.help1', {
                    url: '/help1/{index:[0-9]{1}}',
                    views: {
                        'mainView': {
                            templateUrl: 'item/help/html/help1.html'
                        }
                    }
                })
                .state('baseHead.help2', {
                    url: '/help2/{index:[0-9]{1}}',
                    views: {
                        'mainView': {
                            templateUrl: 'item/help/html/help2.html'
                        }
                    }
                })
                .state('baseHead.help3', {
                    url: '/help3/{index:[0-9]{1}}',
                    views: {
                        'mainView': {
                            templateUrl: 'item/help/html/help3.html'
                        }
                    }
                })
                .state('baseHead.help4', {
                    url: '/help4/{index:[0-9]{1}}',
                    views: {
                        'mainView': {
                            templateUrl: 'item/help/html/help4.html'
                        }
                    }
                })
                .state('baseHead.help5', {
                    url: '/help5/{index:[0-9]{1}}',
                    views: {
                        'mainView': {
                            templateUrl: 'item/help/html/help5.html'
                        }
                    }
                })
                .state('baseHead.help6', {
                    url: '/help6/{index:[0-9]{1}}',
                    views: {
                        'mainView': {
                            templateUrl: 'item/help/html/help6.html'
                        }
                    }
                })
            //联系我们
                .state('baseHead.contact', {
                    url: '/contact/{index:[0-9]{1}}',
                    views: {
                        'mainView': {
                            templateUrl: 'item/help/html/contact.html'
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
