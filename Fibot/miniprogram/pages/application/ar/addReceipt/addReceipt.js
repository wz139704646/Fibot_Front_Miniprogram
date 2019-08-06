// miniprogram/pages/application/ar/addReceipt/addReceipt.js
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
  updateReceivables: function(){
    let { receivables, receive } = this.data
    if (receivables && receivables.length > 0) {
      let t = receive
      for (let i in receivables) {
        if (receivables[i].remain < t) {
          receivables[i].receive = receivables[i].remain
          t -= receivables[i].remain
        } else {
          receivables[i].receive = parseFloat(t.toFixed(2))
          t = 0
        }
      }
      this.setData({
        receivables
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  changeNumofReceive: function() {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let date = util.getcurDateFormatString(new Date())
    this.setData({
      date: date,
      receive: 0
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

  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  addReceivable: function(e) {
    wx.navigateTo({
      url: '/pages/application/ar/receivables/receivables?back=addReceipt',
    })
  },

  onCollapseChange: function(e) {
    this.setData({
      activeNames: e.detail
    })
  },

  onReceivableDelete: function(e) {
    let index = e.currentTarget.dataset.idx
    let {receivables, total} = this.data
    total -= receivables[index].remain
    receivables.splice(index, 1)
    this.setData({
      receivables, total: parseFloat(total.toFixed(2))
    }, () => { this.updateReceivables() })
  },

  // 收款输入事件
  // 输入收款金额同时将应收单据中的收款额进行更新
  onReceiveChange: function(e) {
    let receive = parseFloat(e.detail) || 0
    this.setData({
      receiveText: e.detail,
      receive
    }, () => { this.updateReceivables() })
  }, 

  // 无效，原因：失焦时会触发输入事件
  // onReceiveInputFinished: function(e) {
  //   console.log('失焦', e)
  //   let {receive} = this.data
  //   this.setData({
  //     receiveText: receive.toFixed(2)
  //   })
  // },

  onSave: function(e) {
    let token = app.getToken()
    if (token) {
      let { receivables, total, receive } = this.data
      if (total < receive) {
        wx.showToast({
          title: '收款金额应小于或等于应收单据总金额',
          icon: 'none',
          duration: 2000,
          success: () => {
            this.setData({
              receive: total,
              receiveText: `${total}`
            })
          }
        })
      } else {
        for (let r of receivables) {
          if (r.receive > 0) {
            wx.request({
              url: host + '/arap/addReceive',
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              data: JSON.stringify({
                sellId: r.sellId,
                amount: r.receive,
                date: this.data.date
              }),
              success: res => {
                if(res.statusCode == 555) {
                  app.relogin()
                } else if(res.statusCode!=200 || !res.data.success) {
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
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({})
        }
      }
    })
  }
})