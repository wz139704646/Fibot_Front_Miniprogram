const app = getApp()
const host = app.globalData.requestHost

Page({
  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor : '',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  addTransfer(e){
    wx.navigateTo({
      url: '../newTransfer/newTransfer',
    })
  }
})