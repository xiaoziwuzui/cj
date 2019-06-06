//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/utils.js');
Page({
  data:{
    shareTicket:true
  },
  onPullDownRefresh(){
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
  },
  /**
   * 分享
   */
  share() {
    wx.showActionSheet({
      itemList: ['分享给朋友', '下载分享图'],
      success(res) {
        if(res.tapIndex === 0){
          // 分享给朋友
        } else {
          // 下载分享图
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  showIndex(){
    var self = this;
    if (self.data.shareTicket === true){
      wx.hideShareMenu({
        success:function(res){
          console.log(res);
          self.setData({
            shareTicket: false
          })
          console.log(self.data.shareTicket);
        }
      });
    }else{
      wx.showShareMenu({
        withShareTicket: true,
        success: function (res) {
          self.setData({
            shareTicket: true
          })

        },
        fail: function (res) {
          console.log(res);
        }
      });
    }
  },
  /**
   * 查看更多
   */
  loadMoreSquare(){
    wx.navigateTo({
      url: "squaregames/squaregames"
    });
  },
  /**
   * 跳转抽奖详情
   */
  goToLottery() {
    wx.navigateTo({
      url: "prizeDetail/prizeDetail"
    });
  },
  /**
   * 跳转心愿
   */
  toWish() {
    wx.navigateTo({
      url: 'wish/wish',
    })
  },
  onShareAppMessage(res) {
    var title = '快和我一起来抽奖吧';
    var url   = 'pages/index/index?sid=123';
    var param = {};
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
      title = '帮我一起签到吧';
      url = 'pages/index/index?sid=456';
    }
    param = {
      title:title,url:url,
      success: (res) => {
        if (res.shareTickets && res.shareTickets.length === 0) {
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: (res) => {
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              console.log(encryptedData);
              console.log(iv);
            },
            fail: function (res) { console.log(res) },
            complete: function (res) { console.log(res) }
          });
        }
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
    return param;
  },
  /**
   * 页面载入完成
   */
  onLoad(options){
    var sid,msg,self = this;
    if(options.sid){
      sid = options.sid.toString();
      msg = '来源分享:' + sid;
      wx.showToast({
        title: msg,
      });
    }
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        self.setData({
          shareTicket: true
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
  }
})
