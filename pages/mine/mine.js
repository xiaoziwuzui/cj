// pages/mine/mine.js
const util = require('../../utils/utils.js');
const User = require('../../utils/user.js');
const app = getApp();
Page({
  data: {
    userLogin: false,
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
  goToAccount: function() {
    wx.navigateTo({
      url: 'balance/balance',
    })
  },
  formSubmit: function(res) {
    console.log(res);
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
    User.login(function(res){
      console.log(res);
      app.globalData.userInfo = res;
      self.setData({
        userLogin: true
      });
    },function(){

    });
  
  },
  /**
   * 页面载入完成
   */
  onLoad(options) {
    var userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({
        userLogin: true
      });
    } else {
      this.setData({
        userLogin: false
      });
    }
  }
})