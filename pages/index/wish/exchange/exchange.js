// pages/index/wish/exchange/exchange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false, //显示弹出层
  },
  /**
   * 点击出现弹出层
   */
  showPopupBox() {
    this.setData({
      showPopup:true
    })
  },

  /**
   * 取消弹出层
   */
  censelPopupBox() {
    this.setData({
      showPopup:false
    })
  }
})