// miniprogram/pages/application/ap/addPayment/addPayment.js
const app = getApp()
const util = require('../../../../utils/util.js')
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 更新应收单据中的收款数额
  updatePayables: function() {
    let {
      payables,
      pay
    } = this.data
    if (payables && payables.length > 0) {
      let t = pay
      for (let i in payables) {
        if (payables[i].remain < t) {
          payables[i].pay = payables[i].remain
          t -= payables[i].remain
        } else {
          payables[i].pay = parseFloat(t.toFixed(2))
          t = 0
        }
      }
      this.setData({
        payables
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  changeNumOfPay: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let date = util.getcurDateFormatString(new Date())
    this.setData({
      date: date,
      pay: 0
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  addPayable: function(e) {
    wx.navigateTo({
      url: '/pages/application/ar/payables/payables?back=addPayment',
    })
  },

  onCollapseChange: function(e) {
    this.setData({
      activeNames: e.detail
    })
  },

  onPayableDelete: function(e) {
    let index = e.currentTarget.dataset.idx
    let {
      payables,
      total
    } = this.data
    total -= payables[index].remain
    payables.splice(index, 1)
    this.setData({
      payables,
      total: parseFloat(total.toFixed(2))
    }, () => {
      this.updatePayables()
    })
  },

  // 收款输入事件
  // 输入收款金额同时将应收单据中的收款额进行更新
  onPayChange: function(e) {
    let pay = parseFloat(e.detail) || 0
    this.setData({
      payText: e.detail,
      pay
    }, () => {
      this.updatePayables()
    })
  },

  // 无效，原因：失焦时会触发输入事件
  // onPayInputFinished: function(e) {
  //   console.log('失焦', e)
  //   let {pay} = this.data
  //   this.setData({
  //     payText: pay.toFixed(2)
  //   })
  // },

  onSave: function(e) {
    let token = app.getToken()
    if (token) {
      let {
        payables,
        total,
        pay
      } = this.data
      if (total < pay) {
        wx.showToast({
          title: '收款金额应小于或等于应收单据总金额',
          icon: 'none',
          duration: 2000,
          success: () => {
            this.setData({
              pay: total,
              payText: `${total}`
            })
          }
        })
      } else {
        for (let r of payables) {
          if (r.pay > 0) {
            wx.request({
              url: host + '/arap/addPayment',
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              data: JSON.stringify({
                purchaseId: r.purchaseId,
                amount: r.pay,
                date: this.data.date
              }),
              success: res => {
                if (res.statusCode == 555) {
                  app.relogin()
                } else if (res.statusCode != 200 || !res.data.success) {
                  wx.showToast({
                    title: res.data.errMsg || '请求失败',
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                }
              },
              fail: err => {
                console.log('request fail', err)
              }
            })
          }
        }
        wx.navigateBack({})
      }
    }
  },

  onCancel: function(e) {
    wx.showModal({
      title: '返回',
      content: '收款单未保存，确认返回？',
      success: function(res) {
        if (res.confirm) {
          wx.navigateBack({})
        }
      }
    })
  }
})