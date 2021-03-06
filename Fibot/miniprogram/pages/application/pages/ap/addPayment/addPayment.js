// miniprogram/pages/application/ap/addPayment/addPayment.js
const app = getApp()
const util = require('../../../../../utils/util.js')
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    backgroundColor: ''
  },

  getPayBanks: function () {
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host + '/arap/getBankNames',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: '无权限获取银行列表',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            that.setData({
              payBanks: res.data.result,
              bank: res.data.result[0]
            })
          }
        }
      })
    }
  },

  // 更新应付单据中的付款数额
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
    let token = app.getToken()
    let that = this
    if (token) {
      wx.request({
        url: host + '/arap/getPayMethods',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: '无权限获取支付方式',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            that.setData({
              payMethods: res.data.result,
              method: res.data.result[0]
            }, () => {
              if (res.data.result[0] != '现金') {
                that.getPayBanks()
              }
            })
          }
        }
      })
    }
  },

  changeNumOfPay: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let date = util.getcurDateFormatString(new Date())
    this.setData({
      backgroundColor: app.globalData.backgroundColor,
      date: date,
      pay: 0,
      payables: []
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

  // 日期选择事件
  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  // 添加应付单input点击事件
  addPayable: function(e) {
    wx.navigateTo({
      url: '../payables/payables?back=addPayment',
    })
  },

  // 折叠面板展开事件
  onCollapseChange: function(e) {
    this.setData({
      activeNames: e.detail
    })
  },

  // 应付单删除事件
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
  // 输入收款金额同时将应付单据中的收款额进行更新
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

  // 付款记录保存按钮点击事件
  onSave: function(e) {
    let token = app.getToken()
    if (token) {
      let {
        payables,
        total,
        pay,
        method,
        bank
      } = this.data
      if(!payables || payables.length == 0){
        // 要求应付单据不为空
        wx.showToast({
          title: '请选择应付单据',
          icon: 'none',
          duration: 1000
        })
      } else if (total < pay) {
        // 要求输入付款金额小于等于总金额
        wx.showToast({
          title: '收款金额应小于或等于应付单据总金额',
          icon: 'none',
          duration: 2000,
          success: () => {
            this.setData({
              pay: total,
              payText: `${total}`
            })
          }
        })
      } else if (pay > 0 && !method) {
        wx.showToast({
          title: '请选择付款方式',
          icon: 'none'
        })
      } else if (pay > 0 && method != '现金' && !bank) {
        wx.showToast({
          title: '请选择付款银行',
          icon: 'none'
        })
      } else {
        // 遍历应付单，发送请求添加付款记录
        for (let r of payables) {
          let postData = {
            purchaseId: r.purchaseId,
            amount: r.pay,
            date: this.data.date,
            clearForm: method
          }
          if (r.pay > 0) {
            if (method != '现金') {
              postData['bankName'] = bank
            }
            wx.request({
              url: host + '/arap/addPayment',
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              data: JSON.stringify(postData),
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
        wx.navigateBack({ 
          success: () => {
            wx.showToast({
              title: '保存成功',
              duration: 1000
            })
          }
         })
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
  },

  MethodChange: function (e) {
    let method = this.data.payMethods[e.detail.value]
    this.setData({
      method
    }, () => {
      if (method != '现金') {
        this.getPayBanks()
      }
    })
  },

  BankChange: function (e) {
    this.setData({
      bank: this.data.payBanks[e.detail.value]
    })
  }
})