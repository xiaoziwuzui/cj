//用户管理类
var util = require('utils.js');
var User = function () {
    var self = this;
    self.UserData = null;
    /**
     * 本地令牌认证(会自动从本地数据获取令牌)
     */
    self.tokenAuth = function (success, fail) {
        var token = wx.getStorageSync('token') || false;
        //如果本地没有令牌,直接失败处理
        if (token === false) {
            util.log('没有令牌!')
            fail && fail.call(this);
            return false;
        }
        util.request({
            url: util.api.verifyToken,
            handle: true,
            loading: 2,
            callback: function (result) {
                if (result.status === 'ok') {
                    util.log('认证令牌成功!');
                    success && success(result.data);
                } else {
                    util.log('认证令牌失败!');
                    //弹出认证失败提示信息
                    util.msg(result.msg);
                    fail && fail.call(this);
                }
            },
            error: function (result) {
                //请求失败时的处理
                util.msg('服务器异常,用户信息认证失败!');
                fail && fail.call(this);
            }
        });
    };
    /**
     * 用户登录前置逻辑
     */
    self.login = function (success, fail) {
        //优先认证令牌
        wx.checkSession({
            success() {
                util.log('用户key有效,认证令牌!');
                self.tokenAuth(function (userInfo) {
                    //令牌认证成功,直接回调登录成功
                    self.setUserData(userInfo);
                    success && success(userInfo);
                }, function () {
                    /**
                     * 令牌认证失败,开始登录处理
                     */
                    util.log('令牌认证失败,开始登录处理');
                    self._userLogin(success, fail);
                });
            },
            fail() {
                util.log('用户key无效,引导登录!');
                //会话key过期,重新登录
                self._userLogin(success, fail);
            }
        });
    };
    /**
     * 用户登录认证+授权逻辑
     * @param success
     * @param fail
     * @private
     */
    self._userLogin = function (success, fail) {
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    util.log('开启了授权,直接登录!');
                    wx.login({
                        success: function (res) {
                            if (res.code) {
                                util.log('code获取成功,进行认证!');
                                util.request({
                                    url: util.api.loginUrl,
                                    data: {
                                        code: res.code
                                    },
                                    loading: 2,
                                    handle: true,
                                    callback: function (result) {
                                        if (result.status === 'ok') {
                                            wx.getUserInfo({
                                                withCredentials: true,
                                                lang: 'zh_CN',
                                                success: function (res) {
                                                    if (res.errMsg === 'getUserInfo:ok') {
                                                        //上报服务器更新资料
                                                        util.request({
                                                            url: util.api.upUserInfo,
                                                            type: "POST",
                                                            loading: 2,
                                                            handle: true,
                                                            data: {
                                                                encryptedData: res.encryptedData,
                                                                iv: res.iv,
                                                                rawData: res.rawData
                                                            },
                                                            callback: function (res) {
                                                                util.msg(res.msg);
                                                            }
                                                        });
                                                        res.userInfo.avatar = res.userInfo.avatarUrl;
                                                        res.userInfo.nickname = res.userInfo.nickName;
                                                    }
                                                    self.setUserData(res.userInfo);
                                                }
                                            });
                                            success && success(result.data);
                                        } else {
                                            util.msg(result.msg);
                                            fail && fail.call(this);
                                        }
                                    }
                                });
                            } else {
                                util.msg(res.errMsg);
                            }
                        }
                    })
                } else {
                    //引导用户打开授权设置
                    util.log('引导用户打开授权设置!');
                    wx.showModal({
                        title: '您关闭了用户信息授权',
                        content: '请点击右上角 -> 关于 -> 设置 -> 勾选用户信息,以便我们确认用户资料!',
                        showCancel:false,
                        success:function (confirm,cancel) {
                            if(confirm === true){
                                wx.openSetting({
                                    success(res) {
                                        console.log(res.authSetting);
                                    }
                                })
                            }
                        }
                    })
                }
            },
            fail:function (res) {
                util.msg('我们无法获取您的个人信息!');
            }
        });
    };
    /**
     * 设置临时用户信息
     */
    self.setUserData = function (userInfo) {
        self.UserData = userInfo;
    };
    /**
     * 上报用户信息
     */
    self.upUserInfo = function (userInfo) {
        util.request({
            url: util.api.upUserInfo,
            data: userInfo,
            loading: 1,
            callback: function (result) {
                self.setUserData(result.data);
            }
        });
    };
}
module.exports = new User();