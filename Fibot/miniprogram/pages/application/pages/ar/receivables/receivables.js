// miniprogram/pages/application/ar/receivables/receivables.js
const app = getApp()
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    backgroundColor : '',
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

  calcCurTotal: function () {
    let { filterReceivables } = this.data
    let total = 0
    for (let f of filterReceivables) {
      for (let r of f.records) {
        total += r.remain
      }
    }
    this.setData({
      total
    })
  },

  // 根据搜索框中的输入对应收单进行筛选
  filterBySearchText: function () {
    let { searchText, receivables } = this.data
    if (searchText) {
      let filterReceivables = []
      for (let i in receivables) {
        let rs = receivables[i].records
        if (rs.every(item => item.customerName)) {
          let filterRecords = rs.filter(item => ((item.customerName.indexOf(searchText) != -1)
            || item.sellId.indexOf(searchText) != -1
            || item.date.indexOf(searchText) != -1))
          if (filterRecords.length) {
            filterReceivables.push({
              date: receivables[i].date,
              records: filterRecords
            })
          }
        }
      }
      this.setData({ filterReceivables }, () => { this.calcCurTotal() })
    } else {
      this.setData({
        filterReceivables: receivables
      }, () => { this.calcCurTotal() })
    }
  },

  // 根据销货单id查询相关信息并记录到obj中
  completeInfo: function (obj) {
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
          id: obj.sellId
        }),
        success: res => {
          if(res.statusCode==555) {
            app.relogin()
          }
          else if (res.statusCode != 200 || res.data.result.length == 0) {
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
                receivables: that.data.receivables,
                filterReceivables: that.data.filterReceivables
              }, () => { that.filterBySearchText() })
            }
          }
        }
      })
    }
  },

  // 清空所选中的项
  clearSelected: function() {
    this.setData({
      selectedReceivables: [],
      selectedTotal: 0
    })
  },

  // 加载应收款的订单记录数据
  loadData: function () {
    if(this.options.back) {
      this.clearSelected()
    }
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
          if(res1.statusCode == 555) {
            app.relogin()
          }
          else if (res1.statusCode != 200 || !res1.data.success) {
            wx.showToast({
              title: res1.data.errMsg || '请求错误',
              icon: 'none',
              duration: 1000
            })
            that.setData({
              receivables: [],
              total: 0
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
              if(newItem.remain != 0){
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
            }
            that.setData({
              receivables, total,
              filterReceivables: receivables
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
    if(options.back) {
      this.setData({
        back: options.back,
        selectedReceivables: [],
        selectedTotal: 0
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      showPicker: false,
      backgroundColor: app.globalData.backgroundColor,
      timeRange: this.data.timeOptions[0],
      searchText: ''
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

  // 用于选择时，点击复选框事件
  onReceivableSelected: function(e) {
    console.log(e)
    let {idx, index} = e.currentTarget.dataset.path
    let { selectedReceivables, selectedTotal, filterReceivables} = this.data
    let record = filterReceivables[idx].records[index]
    // e.detail.value不为空数组，表示勾选上
    if(e.detail.value.length) {
      let position = selectedReceivables.findIndex(item => item.date<record.date)
      position = position>=0 ? position: selectedReceivables.length
      selectedReceivables.splice(position, 0, record)
      selectedTotal += record.remain
    } 
    // e.detail.value为空数组，表示取消勾选
    else {
      let start = selectedReceivables.indexOf(record)
      console.log(start)
      if(start != -1){
        selectedReceivables.splice(start, 1)
        selectedTotal -= record.remain
      }
    }
    this.setData({
      selectedReceivables, 
      selectedTotal: parseFloat(selectedTotal.toFixed(2)),
    })
  },

  noSense: function(e) {},

  onSubmit: function(e) {
    let {selectedReceivables, selectedTotal} = this.data
    let pages = getCurrentPages()
    let old = pages[pages.length-2]
    wx.navigateBack({
      success: () => {
        old.setData({
          receivables: selectedReceivables,
          total: selectedTotal
        }, () => {old.updateReceivables()})
      }
    })
  },

  searchInput: function(e) {
    this.setData({
      searchText: e.detail.value
    }, () => {
      this.filterBySearchText()
    })
  }


})