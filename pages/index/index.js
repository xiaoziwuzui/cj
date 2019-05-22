//index.js
//获取应用实例
const app = getApp()

Page({
  data:{

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
  }
})
