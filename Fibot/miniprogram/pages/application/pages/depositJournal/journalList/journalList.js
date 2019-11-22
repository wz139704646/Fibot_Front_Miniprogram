// pages/application/depositJournal/journalList/journalList.js
const app = getApp()
const util = require('../../../../../utils/util.js')
const host = app.globalData.requestHost
var start = ''
var end = ''

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
    backgroundColor : '',
    journalList : [],

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

  initJournalList() {
    let token = app.getToken()
    if (token) {
      wx.request({
        url: host + '/queryAllCashRecord',
        method: "GET",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          console.log(res)
          console.log(res.data.result)
          for (var index in res.data.result) {
            res.data.result[index].date = res.data.result[index].date.toString().substring(5, 10)
            res.data.result[index].time = res.data.result[index].date.toString().substring(11,18)
          }
          this.setData({
            journalList:res.data.result
          })
        }
      })
    } 
  },

  selectDate(){
    start = this.data.startDate + " 00:00:00"
    end = this.data.endDate + " 00:00:00"
    console.log(start)
    console.log(end)
    let token = app.getToken()
    if (token) {
      wx.request({
        url: host + '/queryCashRecordByDate',
        data: JSON.stringify({
          start: start,
          end: end
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json',
          'Authorization': token
        },
        success: res => {
          console.log(res)
          console.log(res.data.result)
          this.setData({
            journalList: res.data.result
          })
        }
      })
    } 
  },

  addJournal(e) {
    wx.redirectTo({
      url: '/pages/application/depositJournal/addJournal/addJournal',
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    initPage(this)
    var that = this
    that.initJournalList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor,
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
    console.log(e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
    var page = getCurrentPages().pop()
    page.initJournalList()
    //page.onLoad()
  },

  EndDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
    var page = getCurrentPages().pop()
    page.initJournalList()
    //page.onLoad()
  },

  AccountTypeChange(e) {
    this.setData({
      indexOfAccountType: e.detail.value
    })
  }
})