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

  // 根据搜索框中的输入对收款记录进行筛选
  filterBySearchText: function () {
    let { searchText, receipts } = this.data
    if (searchText) {
      let filterReceipts = []
      for (let i in receipts) {
        let rs = receipts[i].records
        if (rs.every(item => item.customerName)) {
          let filterRecords = rs.filter(item => ((item.customerName.indexOf(searchText) != -1)
            || item.id.indexOf(searchText) != -1
            || item.date.indexOf(searchText) != -1))
          if (filterRecords.length) {
            filterReceipts.push({
              date: receipts[i].date,
              records: filterRecords
            })
          }
        }
      }
      this.setData({ filterReceipts })
    } else {
      this.setData({
        filterReceipts: receipts
      })
    }
  },

  // 根据销货单id查询相关信息并记录到obj中
  completeInfo: function(obj) {
    let token = app.getToken()
    if(token) {
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
          id: obj.sellid
        }),
        success: res => {
          console.log(res)
          if(res.statusCode == 555){
            app.relogin()
          }
          else if(res.statusCode!=200 || res.data.result.length==0) {
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
                filterReceipts: that.data.filterReceipts,
                receipts: that.data.receipts
              }, () => { that.filterBySearchText() })
            }
          }
        }
      })
    }
  },

  // 加载收款记录数据
  loadData: function(callback) {
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
          if(res1.statusCode == 555) {
            app.relogin()
          }
          else if(res1.statusCode!=200 || !res1.data.success){
            wx.showToast({
              title: res1.data.errMsg || '请求错误',
              icon: 'none',
              duration: 1000
            })
          } else {
            var receipts = []
            var rawData = res1.data.result
            var total = 0
            for(let i in rawData) {
              let len = receipts.length
              let newItem = {
                id: rawData[i].id,
                date: rawData[i].date.substring(0, 10),
                amount: rawData[i].receive,
                sellid: rawData[i].sellId
              }
              if(len == 0 || rawData[i].date.substring(0, 10) != receipts[len-1].date) {
                receipts.push({
                  date: newItem.date,
                  records: [newItem]
                })
              } else {
                receipts[len-1].records.push(newItem)
              }
              total += newItem.amount
              that.completeInfo(newItem)
            }
            that.setData({
              receipts, total
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
    }, ()=> {
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

  onPickerConfirm: function(e) {
    let {timeOptions} = this.data
    this.setData({
      showPicker: false,
      timeRange: timeOptions[e.detail.index],
      searchText: ''
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
  },

  searchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    }, () => {
      this.filterBySearchText()
    })
  },

})