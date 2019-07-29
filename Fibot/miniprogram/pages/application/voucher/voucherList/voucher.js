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

  // 加载凭证: idate: 起始日期，tdate: 截止日期
  loadVoucher: function(idate, tdate) {
    // 样例数据
    this.setData({
      vouchers: [
        {
          no: '0001',
          abstract: '计提工资费用',
          total: 68100.00,
          date: '2019-07-27'
        },
        {
          no: '0002',
          abstract: '计提工资费用',
          total: 68100.00,
          date: '2019-07-27'
        },
        {
          no: '0003',
          abstract: '计提工资费用',
          total: 68100.00,
          date: '2019-07-27'
        }
      ]
    })
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
    this.loadVoucher(date, date)
  },

  DateChange(e) {
    let name = e.currentTarget.dataset.name
    let date = this.data.date
    date[name] = e.detail.value
    this.setData({
      date: date
    })
  },

  onVoucherTapped: function(e) {
    console.log(e)
    var data = e.currentTarget.dataset
    
    wx.navigateTo({
      url: `../voucherDetail/voucherDetail?no=${data.no}&date=${data.date}`,
    })
  },

  addVoucher: function(e) {
    wx.navigateTo({
      url: '../addVoucher/addVoucher',
    })
  },
})