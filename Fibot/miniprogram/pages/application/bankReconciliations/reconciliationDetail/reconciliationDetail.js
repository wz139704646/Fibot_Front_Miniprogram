// pages/application/bankReconciliations/reconciliationDetail/reconciliationDetail.js
const app = getApp()
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
    var that = this
    console.log(options)

    this.setData({
      voucher: options.voucher,
      bankName: options.bankName,
      clearForm: options.clearForm,
      date: options.date,
      amount: options.amount,
      status: options.status,
    })
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

  onClick(e) {
    var that = this

    wx.showModal({
      title: '确认审核',
      content: '是否确认审核该笔对账',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请求提交中',
            mask: true
          })
          that.checkSuccess()
        }
      },
      fail: function (err) {
        console.error('审核失败', err)
      }
    })
  },

  checkSuccess(e) {
    wx.request({
      url: host + '/checkBankStatus',
      data: JSON.stringify({
        voucher: this.data.voucher,
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success: res => {
        console.log(res)
        wx.showToast({
          title: 'add success',
        })
        wx.redirectTo({
          url: '/pages/application/bankReconciliations/reconciliationShow/reconciliationShow',
        })
      }
    })
  }

})