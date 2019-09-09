// miniprogram/pages/application/ap/payables/payables.js
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

  calcCurTotal: function () {
    let { filterPayables } = this.data
    let total = 0
    for (let f of filterPayables) {
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
    let { searchText, payables } = this.data
    if (searchText) {
      let filterPayables = []
      for (let i in payables) {
        let rs = payables[i].records
        if (rs.every(item => item.supplierName)) {
          let filterRecords = rs.filter(item => ((item.supplierName.indexOf(searchText) != -1)
            || item.purchaseId.indexOf(searchText) != -1
            || item.date.indexOf(searchText) != -1))
          if (filterRecords.length) {
            filterPayables.push({
              date: payables[i].date,
              records: filterRecords
            })
          }
        }
      }
      this.setData({ filterPayables }, () => { this.calcCurTotal() })
    } else {
      this.setData({
        filterPayables: payables
      }, () => { this.calcCurTotal() })
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
          if (res.statusCode == 555) {
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
                if (res2.statusCode == 555) { app.relogin() }
                else if (res2.statusCode != 200 || !res2.data.success) {
                  wx.showToast({
                    title: res2.data.errMsg || '请求失败', icon: 'none', duration: 1000
                  })
                } else {
                  obj.supplierName = res2.data.result[0].name
                  if (that.data.payables) {
                    that.setData({
                      filterPayables: that.data.filterPayables,
                      payables: that.data.payables
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

  // 清空所选中的项
  clearSelected: function () {
    this.setData({
      selectedPayables: [],
      selectedTotal: 0
    })
  },

  // 加载应收款的订单记录数据
  loadData: function () {
    if (this.options.back) {
      this.clearSelected()
    }
    let { timeRange } = this.data
    let days = timeRange.value
    let token = app.getToken()
    if (token) {
      var that = this
      var data = days ? JSON.stringify({ days }) : JSON.stringify({})
      wx.request({
        url: host + '/arap/queryPurchasePay',
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
            that.setData({
              payables: [],
              total: 0
            })
          } else {
            // 将相同日期的加入同一分区
            var payables = []
            var rawData = res1.data.result
            var total = 0
            for (let i in rawData) {
              let len = payables.length
              let newItem = rawData[i]
              newItem.date = newItem.date.substring(0, 10)
              if (newItem.remain != 0) {
                if (len == 0 || rawData[i].date != payables[len - 1].date) {
                  payables.push({
                    date: newItem.date,
                    records: [newItem]
                  })
                } else {
                  payables[len - 1].records.push(newItem)
                }
                total += parseFloat(newItem.remain)
                that.completeInfo(newItem)
              }
            }
            that.setData({
              payables, total,
              filterPayables: payables
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
    if (options.back) {
      this.setData({
        back: options.back,
        selectedPayables: [],
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

  onCollapseChange: function (e) {
    this.setData({
      activeNames: e.detail
    })
  },

  // 用于选择时，点击复选框事件
  onPayableSelected: function (e) {
    console.log(e)
    let { idx, index } = e.currentTarget.dataset.path
    let { selectedPayables, selectedTotal, payables } = this.data
    let record = payables[idx].records[index]
    // e.detail.value不为空数组，表示勾选上
    if (e.detail.value.length) {
      let position = selectedPayables.findIndex(item => item.date < record.date)
      position = position >= 0 ? position : selectedPayables.length
      selectedPayables.splice(position, 0, record)
      selectedTotal += record.remain
    }
    // e.detail.value为空数组，表示取消勾选
    else {
      let start = selectedPayables.indexOf(record)
      console.log(start)
      if (start != -1) {
        selectedPayables.splice(start, 1)
        selectedTotal -= record.remain
      }
    }
    this.setData({
      selectedPayables,
      selectedTotal: parseFloat(selectedTotal.toFixed(2)),
    })
  },

  noSense: function (e) { },

  onSubmit: function (e) {
    let { selectedPayables, selectedTotal } = this.data
    let pages = getCurrentPages()
    let old = pages[pages.length - 2]
    wx.navigateBack({
      success: () => {
        old.setData({
          payables: selectedPayables,
          total: selectedTotal
        }, () => { old.updatePayables() })
      }
    })
  },

  searchInput: function (e) {
    this.setData({
      searchText: e.detail.value
    }, () => {
      this.filterBySearchText()
    })
  }


})