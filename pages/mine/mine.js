// pages/mine/mine.js
const util = require('../../utils/utils.js');
const User = require('../../utils/user.js');
const app = getApp();
Page({
  data: {
    userLogin: false,
    hideFollowBar:false,
    userInfo:null
  },
  /**
   * 跳转全部抽奖
   */
  goToUserGames: function() {
    wx.navigateTo({
      url: 'allLuckDraw/allLuckDraw',
    })
  },
  closeFollowBar:function(){
    this.setData({
      hideFollowBar: true
    });
  },
  goToAccount: function() {
    wx.navigateTo({
      url: 'balance/balance',
    })
  },
  formSubmit: function(res) {
    util.request({
      url: util.api.upFormId,
      type:"POST",
      data: {
        formId: res.detail.formId,
      },
      callback: function(result) {
        util.msg(result.msg);
      }
    });
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我抽中了一百万,你也来试试吧',
      path: 'pages/index/index?sid=999'
    }
  },
  getUserInfo(res){
    var self = this;
    util.loading('快捷登录中...');
    User.login(function(res){
      app.globalData.userInfo = res;
      util.closeLoading();
      self.setData({
        userInfo: res,
        userLogin: true
      });
    },function(){
      util.closeLoading();
      util.msg('登录失败');
    });
  
  },
  /**
   * 页面载入完成
   */
  onLoad(options) {
    var userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        userLogin: true
      });
    } else {
      this.setData({
        userInfo:null,
        userLogin: false
      });
    }
  }
})