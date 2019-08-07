// pages/application/cashOnHand/cashShow/cashShow.js
const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost
var date = ''
var date1 = ''
var time = ''

const initPage = function (page) {
  date1 = util.getcurDateFormatString(new Date())

  var timeStamp = Date.parse(new Date())
  var date = new Date(timeStamp)
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  time = " " + h + ":" + m + ":" + s

  // 设置日期属性
  page.setData({
    date1: date1,
    time: time
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeOptions: [
      {
        text: '今天',
        value: 1
      },
      {
        text: '近7天',
        value: 2
      },
      {
        text: '近30天',
        value: 3
      }
    ],
  },

  loadData: function (e) {
    let { timeRange } = this.data
    let days = timeRange.value
    let date1 = this.data.date1 + this.data.time
    let token = app.getToken()
    if (token) {
      console.log({
        date: date1,
        option: days
      })

      var that = this
      wx.request({
        url: host + '/queryCashRecordByOption',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          date: date1,
          option: days
        },

        success: res => {
          if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            console.log(res)
            console.log(res.data.result)
            for (var index in res.data.result) {
              res.data.result[index].date = res.data.result[index].date.toString().substring(5, 10)
            }
            this.setData({
              cashList: res.data.result
            })
          }
        },
        fail: err1 => {
          console.error('request error', err1)
        }
      })
    }
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
    initPage(this)

    this.setData({
      showPicker: false,
      timeRange: this.data.timeOptions[0]
    }, () => {
      this.loadData()
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

  onPickerConfirm: function (e) {
    let { timeOptions } = this.data
    this.setData({
      showPicker: false,
      timeRange: timeOptions[e.detail.index],
    }, () => {
      this.loadData()
    })
  },

  onChooseTimeRange: function (e) {
    this.setData({
      showPicker: true
    })
  },

  onModalClose: function (e) {
    this.setData({
      showPicker: false
    })
  },


})