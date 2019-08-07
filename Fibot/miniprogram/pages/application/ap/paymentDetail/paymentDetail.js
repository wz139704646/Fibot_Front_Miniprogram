// miniprogram/pages/application/ap/paymentDetail/paymentDetail.js
const app = getApp()
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    purchase: {},
    verified: false
  },

  // 加载购货单信息
  loadPurchaseInfo: function(purchaseId) {
    let token = app.getToken()
    if(token) {
      let that = this
      wx.request({
        url: host+'/queryPurchase',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          id: purchaseId
        }),
        success: res => {
          console.log(res)
          if (res.statusCode == 555) { app.relogin() }
          else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: '出现未知错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            console.log('购货信息', res)
            let {purchase} = that.data
            let buyList = res.data.result
            let {date, supplierId} = buyList[0]
            let total = buyList.reduce((acc, cur) => acc + cur.purchasePrice*cur.number, 0)
            purchase.date = date
            purchase.total = total
            this.setData({ purchase })
            wx.request({
              url: host + '/querySupplierById',
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              data: JSON.stringify({
                companyId: app.globalData.companyId,
                id: supplierId
              }),
              success: res2 => {
                console.log(res2)
                if (res2.statusCode == 555) { app.relogin() }
                else if (res2.statusCode != 200 || !res2.data.success) {
                  wx.showToast({
                    title: res2.data.errMsg || '请求失败', icon: 'none', duration: 1000
                  })
                } else {
                  purchase.supplierName = res2.data.result[0].name
                  that.setData({ purchase })
                }
              }
            })
          }
        }
      })
    }
  },

  // 加载付款单信息
  loadPaymentInfo: function (id) {
    let token = app.getToken()
    let that = this
    if(token) {
      wx.request({
        url: host + '/arap/queryPayment',
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
          if(res1.statusCode == 555) {app.relogin()}
          else if(res1.statusCode != 200 || !res1.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          } else {
            let {purchaseId, pay, date, status} = res1.data.result[0]
            that.setData({
              purchaseId, id, date, pay, 
              verified: status
            })
            that.loadPurchaseInfo(purchaseId)
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPaymentInfo(options.id)
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

  onVerify: function(e) {
    let token = app.getToken()
    if(token) {
      let { id } = this.data
      let that = this
      wx.showModal({
        title: '确认审核',
        success: res => {
          if (res.confirm) {
            wx.request({
              url: host + '/arap/checkPayment',
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
                if(res.statusCode == 555) {
                  app.relogin()
                } else if(res.statusCode!=200 || !res.data.success) {
                  wx.showToast({
                    title: res.data.errMsg || '请求失败',
                    icon: 'none',
                    duration: 1000,
                    mask: true
                  })
                } else {
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