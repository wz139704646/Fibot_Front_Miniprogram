// pages/application/voucher/voucher.js
const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let date = util.getcurDateFormatString(new Date())
    this.setData({
      date: { idate: date, tdate: date }
    })
  },

  DateChange(e) {
    let name = e.currentTarget.dataset.name
    let date = this.data.date
    date[name] = e.detail.value
    this.setData({
      date: date
    })
  },

  addVoucher: function(e) {
    wx.navigateTo({
      url: '../addVoucher/addVoucher',
    })
  }
})