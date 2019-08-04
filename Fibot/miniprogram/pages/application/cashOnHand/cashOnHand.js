const app = getApp()
const util = require('../../../utils/util.js')
const host = app.globalData.requestHost

const initPage = function (page) {
  let startDate = util.getcurDateFormatString(new Date())
  let endDate = util.getcurDateFormatString(new Date())
  // 设置日期属性
  page.setData({
    startDate: startDate,
    endDate: endDate
  })
}

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
    initPage(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  StartDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  EndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  }

})