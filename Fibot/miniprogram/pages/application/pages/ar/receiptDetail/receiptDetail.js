// miniprogram/pages/application/ar/receiptDetail/receiptDetail.js
const app = getApp()
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sell: {},
    verified: false
  },

  // 加载销货单信息
  loadSellInfo: function (sellId) {
    let token = app.getToken()
    if (token) {
      let that = this
      wx.request({
        url: host + '/querySell',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          id: sellId
        }),
        success: res => {
          if (res.statusCode == 555) { app.relogin() }
          else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: '出现未知错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            console.log('销货信息', res)
            let { sell } = that.data
            let sellList = res.data.result
            let { date, customerName } = sellList[0]
            let total = sellList[0].goodsList.reduce((acc, cur) => acc + cur.sumprice, 0)
            sell.date = date.substring(0, 10)
            sell.total = total
            sell.customerName = customerName
            sell.goodsList = sellList[0].goodsList
            that.setData({ sell })
          }
        }
      })
    }
  },

  // 加载收款单信息
  loadReceiptInfo: function (id) {
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host + '/arap/queryReceive',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          id: id
        }),
        success: res1 => {
          console.log(res1)
          if (res1.statusCode == 555) { app.relogin() }
          else if (res1.statusCode != 200 || !res1.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          } else {
            let { sellId, receive, date, status } = res1.data.result[0]
            that.setData({
              sellId, id, date, receive,
              verified: status
            })
            that.loadSellInfo(sellId)
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadReceiptInfo(options.id)
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

  onCollapseChange: function (e) {
    this.setData({
      activeNames: e.detail
    })
  },

  // 点击审核按钮事件
  onVerify: function (e) {
    let token = app.getToken()
    if (token) {
      let { id } = this.data
      let that = this
      wx.showModal({
        title: '确认审核',
        success: res => {
          if (res.confirm) {
            wx.request({
              url: host + '/arap/checkReceive',
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              data: JSON.stringify({
                id: id
              }),
              success: res => {
                console.log('审核', res)
                if (res.statusCode == 555) {
                  app.relogin()
                } else if (res.statusCode != 200 || !res.data.success) {
                  wx.showToast({
                    title: res.data.errMsg || '请求失败',
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                } else {
                  wx.showToast({
                    title: '审核成功',
                    duration: 1000
                  })
                  that.setData({
                    verified: true
                  })
                }
              },
              fail: err => {
                console.log('request fail', err)
              }
            })
          }
        }
      })
    }
  }

})