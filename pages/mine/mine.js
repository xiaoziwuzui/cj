// pages/mine/mine.js
Page({
/**
 * 跳转全部抽奖
 */
  goToUserGames:function(){
    wx.navigateTo({
      url: 'allLuckDraw/allLuckDraw',
    })
  },
  goToAccount:function(){
    wx.navigateTo({
      url: 'balance/balance',
    })
  }

})