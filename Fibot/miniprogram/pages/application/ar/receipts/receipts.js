// miniprogram/pages/application/ar/receipts/receipts.js
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
        value: 7
      },
      {
        text: '近30天',
        value: 30
      },
      {
        text: '近90天',
        value: 90
      }
    ]
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
    this.setData({
      showPicker: false,
      timeRange: this.data.timeOptions[0]
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onPickerConfirm: function(e) {
    let {timeOptions} = this.data
    this.setData({
      showPicker: false,
      timeRange: timeOptions[e.detail.index]
    })
  },

  onChooseTimeRange: function(e) {
    this.setData({
      showPicker: true
    })
  },

  onModalClose: function(e) {
    this.setData({
      showPicker: false
    })
  }
})