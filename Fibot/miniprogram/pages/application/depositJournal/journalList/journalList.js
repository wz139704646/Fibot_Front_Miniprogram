// pages/application/depositJournal/journalList/journalList.js
const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost

const initPage = function (page) {
  let date = util.getcurDateFormatString(new Date())
  // 设置日期属性
  page.setData({
    date: date
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexOfAccountType: 0,

    accountType: ['库存现金', '银行存款'],
    objectArray: [
      {
        id: 0,
        name: '库存现金'
      },
      {
        id: 1,
        name: '银行存款'
      }
    ],
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
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  AccountTypeChange(e) {
    this.setData({
      indexOfAccountType: e.detail.value
    })
  }
})