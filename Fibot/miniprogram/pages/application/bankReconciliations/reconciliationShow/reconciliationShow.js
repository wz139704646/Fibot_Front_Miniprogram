// pages/application/bankReconciliations/reconciliationShow/reconciliationShow.js
const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost

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
      },
      {
        text: '全部'
      }
    ]
  },

  loadData: function (e) {
    let { timeRange } = this.data
    //let days = timeRange.value
    let token = app.getToken()
    if (token) {
      console.log({
        date: this.data.date,
        options: this.data.timeOptions
      })

      var that = this
      wx.request({
        url: host + '/queryBankRecordByOption',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          date: this.data.date,
          options: this.data.timeOptions
        },
        
        success: res1 => {
          if (res1.statusCode != 200 || !res1.data.success) {
            wx.showToast({
              title: res1.data.errMsg || '请求错误',
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
              reconciliationList: res.data.result
            })
          }
        },
        fail: err1 => {
          console.error('request error', err1)
        }
      })
    }
  },

  initReconciliationsList: function (e) {
    let token = app.getToken()
    if (token) {
      wx.request({
        url: host + '/queryAllBankRecord',
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
          }
          this.setData({
            reconciliationList: res.data.result
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
    //this.initReconciliationsList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      showPicker: false,
      timeRange: this.data.timeOptions[0]
    }, () => {
      this.loadData()
      //this.initReconciliationsList()
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