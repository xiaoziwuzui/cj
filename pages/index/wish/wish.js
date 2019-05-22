// pages/index/wish/wish.js
Page({
  /**
   * 规则查看
   */
  toRule() {
    wx.navigateTo({
      url: 'rules/rules',
    })
  },
  /**
   * 收支明细
   */
  toBudget() {
    wx.navigateTo({
      url: 'budget/budget',
    })
  },
  /**
   * 商品兑换
   */
  toExchange() {
    wx.navigateTo({
      url: 'exchange/exchange',
    })
  }
})
