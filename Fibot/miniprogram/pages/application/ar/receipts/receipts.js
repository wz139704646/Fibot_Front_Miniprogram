// miniprogram/pages/application/ar/receipts/receipts.js
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
  completeInfo: function(obj) {
    let token = app.getToken()
    if(token) {
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
          id: obj.sellid
        }),
        success: res => {
          if(res.statusCode!=200 && res.data.result.length==0) {
            wx.showToast({
              title: '出现未知错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            let info = res.data.result[0]
            obj.customerName = info.customerName
            if(that.data.receipts) {
              that.setData({
                receipts: that.data.receipts
              })
            }
          }
        }
      })
    }
  },

  // 加载收款记录数据
  loadData: function(e) {
    let {timeRange} = this.data
    let days = timeRange.value
    let token = app.getToken()
    if(token) {
      var that = this
      var data = days ? JSON.stringify({ days }) : {}
      wx.request({
        url: host + '/arap/queryReceive',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: data,
        success: res1 => {
          if(res1.statusCode!=200 || !res1.data.success){
            wx.showToast({
              title: res1.data.errMsg || '请求错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            var receipts = []
            var rawData = res1.data.result
            for(let i in rawData) {
              let len = receipts.length
              let newItem = {
                id: rawData[i].id,
                date: rawData[i].date.substring(0, 10),
                amount: rawData[i].receive,
                sellid: rawData[i].sellId
              }
              if(len == 0 || rawData[i].date != receipts[len-1].date) {
                receipts.push({
                  date: newItem.date,
                  records: [newItem]
                })
              } else {
                receipts[len-1].records.push(newItem)
              }
              that.completeInfo(newItem)
            }
            that.setData({
              receipts
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
    }, ()=> {
      this.loadData()
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
    }, () => {
      this.loadData()
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
  },

  addReceipt: function(e) {
    wx.navigateTo({
      url: '../addReceipt/addReceipt?back=receipts',
    })
  }
})