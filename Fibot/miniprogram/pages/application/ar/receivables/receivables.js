// miniprogram/pages/application/ar/receivables/receivables.js
const app = getApp()
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
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
      },
      {
        text: '全部'
      }
    ]
  },

  // 根据销货单id查询相关信息并记录到obj中
  completeInfo: function (obj) {
    let token = app.getToken()
    if (token) {
      let that = this
      console.log(obj)
      wx.request({
        url: host + '/querySell',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          id: obj.sellId
        }),
        success: res => {
          if (res.statusCode != 200 || res.data.result.length == 0) {
            wx.showToast({
              title: '出现未知错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            let info = res.data.result[0]
            obj.customerName = info.customerName
            if (that.data.receivables) {
              that.setData({
                receivables: that.data.receivables
              })
            }
          }
        }
      })
    }
  },

  // 加载应收款的订单记录数据
  loadData: function (e) {
    let { timeRange } = this.data
    let days = timeRange.value
    let token = app.getToken()
    if (token) {
      var that = this
      var data = days ? JSON.stringify({ days }) : {}
      wx.request({
        url: host + '/arap/querySellReceive',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: data,
        success: res1 => {
          if (res1.statusCode != 200 || !res1.data.success) {
            wx.showToast({
              title: res1.data.errMsg || '请求错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            // 将相同日期的加入同一分区
            var receivables = []
            var rawData = res1.data.result
            var total = 0
            for (let i in rawData) {
              let len = receivables.length
              let newItem = rawData[i]
              newItem.date = newItem.date.substring(0, 10)
              if (len == 0 || rawData[i].date != receivables[len - 1].date) {
                receivables.push({
                  date: newItem.date,
                  records: [newItem]
                })
              } else {
                receivables[len - 1].records.push(newItem)
              }
              total += parseFloat(newItem.remain)
              that.completeInfo(newItem)
            }
            that.setData({
              receivables, total
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

  onPickerConfirm: function (e) {
    let { timeOptions } = this.data
    this.setData({
      showPicker: false,
      timeRange: timeOptions[e.detail.index]
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

  onCollapseChange: function(e) {
    this.setData({
      activeNames: e.detail
    })
  },

  onReceivableSelected: function(e) {
    console.log(e)
  },

  noSense: function(e) {}


})