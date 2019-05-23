//app.js
var User = require('utils/user.js');
var util = require('utils/utils.js');
App({
  onLaunch: function () {
    var self = this;
    //用户登录处理
    util.log('小程序启动!');
    //已经登录过的用户自动认证
    User.tokenAuth(function (userInfo){
      self.globalData.userInfo = userInfo
    },function(){
      //不处理
    });
  },
  getUserInfo:function(success){
    var self = this;
    if (self.globalData.userInfo === null){
      User.login(function (userInfo) {
        //登录成功时
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            self.globalData.userInfo = res.userInfo
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (self.userInfoReadyCallback) {
              self.userInfoReadyCallback(res)
            }
          }
        });
      }, function () {

      });
    }else{
      success && success(self.globalData.userInfo);
    }
  },
  globalData: {
    userInfo: null,
    token:null,
  }
})