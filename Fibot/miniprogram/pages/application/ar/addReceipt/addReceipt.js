// miniprogram/pages/application/ar/addReceipt/addReceipt.js
const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  changeNumofReceive: function() {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let date = util.getcurDateFormatString(new Date())
    this.setData({
      date: date
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  addReceivable: function(e) {
    wx.navigateTo({
      url: `/pages/application/ar/receivables/receivables?back=${'addReceipt'}`,
    })
  },

  onReceiveChange: function(e) {
    console.log(e)
    let receive = parseFloat(e.detail) || 0
    this.setData({
      receiveText: e.detail,
      receive
    })
  }, 

  onSave: function(e) {

  },

  onCancel: function(e) {

  }
})