// miniprogram/pages/application/ap/payments/payments.js
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

  // 根据搜索框中的输入对收款记录进行筛选
  filterBySearchText: function () {
    let { searchText, payments } = this.data
    if (searchText) {
      let filterPayments = []
      for (let i in payments) {
        let rs = payments[i].records
        if (rs.every(item => item.supplierName)) {
          let filterRecords = rs.filter(item => ((item.supplierName.indexOf(searchText) != -1)
            || item.id.indexOf(searchText) != -1
            || item.date.indexOf(searchText) != -1))
          if (filterRecords.length) {
            filterPayments.push({
              date: payments[i].date,
              records: filterRecords
            })
          }
        }
      }
      this.setData({ filterPayments })
    } else {
      this.setData({
        filterPayments: payments
      })
    }
  },

  // 根据销货单id查询相关信息并记录到obj中
  completeInfo: function (obj) {
    let token = app.getToken()
    if (token) {
      let that = this
      wx.request({
        url: host + '/queryPurchase',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          companyId: app.globalData.companyId,
          id: obj.purchaseId
        }),
        success: res => {
          console.log('查询进货信息',res)
          if (res.statusCode == 555) {
            app.relogin()
          }
          else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: '出现未知错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            let info = res.data.result[0]
            wx.request({
              url: host + '/querySupplierById',
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              data: JSON.stringify({
                companyId: app.globalData.companyId,
                id: info.supplierId
              }),
              success: res2 => {
                if(res2.statusCode==555){ app.relogin() }
                else if(res2.statusCode!=200 || !res2.data.success){
                  wx.showToast({
                    title: res2.data.errMsg || '请求失败', icon: 'none', duration: 1000
                  })
                } else {
                  obj.supplierName = res2.data.result[0].name
                  if (that.data.payments) {
                    that.setData({
                      filterPayments: that.data.filterPayments,
                      payments: that.data.payments
                    }, () => { that.filterBySearchText() })
                  }
                }
              }
            })
          }
        }
      })
    }
  },

  // 加载收款记录数据
  loadData: function (callback) {
    let { timeRange } = this.data
    let days = timeRange.value
    let token = app.getToken()
    if (token) {
      var that = this
      var data = days ? JSON.stringify({ days }) : JSON.stringify({})
      wx.request({
        url: host + '/arap/queryPayment',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: data,
        success: res1 => {
          if (res1.statusCode == 555) {
            app.relogin()
          }
          else if (res1.statusCode != 200 || !res1.data.success) {
            wx.showToast({
              title: res1.data.errMsg || '请求错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            var payments = []
            var rawData = res1.data.result
            var total = 0
            for (let i in rawData) {
              let len = payments.length
              let newItem = {
                id: rawData[i].id,
                date: rawData[i].date ? rawData[i].date.substring(0, 10) : rawData[i].date,
                amount: rawData[i].pay,
                purchaseId: rawData[i].purchaseId
              }
              if (len == 0 || rawData[i].date.substring(0, 10) != payments[len - 1].date) {
                payments.push({
                  date: newItem.date,
                  records: [newItem]
                })
              } else {
                payments[len - 1].records.push(newItem)
              }
              total += newItem.amount
              that.completeInfo(newItem)
            }
            that.setData({
              payments, total
            }, callback)
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

  onPullDownRefresh: function () {
    this.loadData(() => {
      wx.stopPullDownRefresh()
    })
  },

  onPickerConfirm: function (e) {
    let { timeOptions } = this.data
    this.setData({
      showPicker: false,
      timeRange: timeOptions[e.detail.index],
      searchText: ''
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

  addPayment: function (e) {
    wx.navigateTo({
      url: '../addPayment/addPayment?back=payments',
    })
  },

  searchInput: function (e) {
    this.setData({
      searchText: e.detail.value
    }, () => {
      this.filterBySearchText()
    })
  },

})