// pages/application/voucher/voucher.js
const app = getApp()
const util = require('../../../../../utils/util.js')
const host = app.globalData.requestHost

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    backgroundColor: ''
  },

  // 加载凭证: idate: 起始日期，tdate: 截止日期
  loadVoucher: function(idate, tdate) {
    let token = app.getToken()
    let that = this
    if (token) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: host + '/finance/voucher/getVouchers',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: {
          low: idate,
          up: tdate
        },
        success: res => {
          console.log(res)
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: '无权限查看',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            let vouchers = res.data.result
            this.setData({
              vouchers, filterVouchers: vouchers, searchText: ""
            })
          }
        },
        complete: () => {
          wx.hideLoading()
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
      backgroundColor:app.globalData.backgroundColor
    })
    let tdate = util.getcurDateFormatString(new Date())
    let idateArr = tdate.split('-')
    idateArr.splice(2, 1)
    let idate = idateArr.join('-')+'-01'
    this.setData({
      date: { idate: idate, tdate: tdate }
    }, () => {
      let token = app.getToken()
      let that = this
      if (token) {
        wx.request({
          url: host + '/finance/subject/getTimes',
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
                title: '无权限查看',
                icon: 'none',
                duration: 1000
              })
            } else if (res.statusCode != 200 || !res.data.success) {
              wx.showToast({
                title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
              })
            } else {
              let { low, up } = res.data.result
              let lowy = parseInt(low.substring(0, 4))
              let lowm = parseInt(low.substring(4))
              let upy = parseInt(up.substring(0, 4))
              let upm = parseInt(up.substring(4))
              let {date} = that.data
              date['sdate'] = `${lowy}-${lowm}-01`
              let edays = (new Date(upy, upm, 0)).getDate()
              date['edate'] = `${upy}-${upm}-${edays}`
              that.setData({date})
            }
          }
        })
      }
    })
    this.loadVoucher(idate, tdate)
  },

  DateChange(e) {
    let name = e.currentTarget.dataset.name
    let date = this.data.date
    date[name] = e.detail.value
    this.setData({
      date: date
    }, ()=>{
      this.loadVoucher(date.idate, date.tdate)
    })
  },

  onVoucherTapped: function(e) {
    console.log(e)
    var data = e.currentTarget.dataset
    
    wx.navigateTo({
      url: `../voucherDetail/voucherDetail?voucher_no=${data.no}&date=${data.date}`,
    })
  },

  addVoucher: function(e) {
    wx.navigateTo({
      url: '../addVoucher/addVoucher?back=voucherList',
    })
  },
  
  searchInput: function (e) {
    this.setData({
      searchText: e.detail.value
    })
  },

  search: function (e) {
    let searchText = this.data.searchText
    // 搜索词为空，展示所有
    if (!searchText) {
      let vouchers = this.data.vouchers
      this.setData({
        filterVouchers: vouchers
      })
      return
    }

    let filter = []
    let vouchers = this.data.vouchers
    for (var v of vouchers) {
      if(v.voucher_no.includes(searchText) || v.abstract.includes(searchText)){
        filter.push(JSON.parse(JSON.stringify(v)))
      }
    }
    this.setData({
      filterVouchers: filter
    })
  },

  onVoucherDelete: function(e) {
    let idx = e.currentTarget.dataset.idx
    let token = app.getToken()
    let that = this
    if(token) {
      let { filterVouchers, vouchers } = that.data
      let voucher_no = filterVouchers[idx].voucher_no
      console.log(voucher_no)
      wx.showLoading({
        title: '删除凭证中',
        mask: true
      })
      wx.request({
        url: host +'/finance/voucher/delVoucher',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          voucher_no
        }),
        success: res => {
          if (res.statusCode == 555) {
            app.relogin()
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: '无权限操作',
              icon: 'none',
              duration: 1000
            })
          } else if (res.statusCode != 200 || !res.data.success) {
            wx.showToast({
              title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
            })
          } else {
            // 删除 page data 中的两个列表里相应的凭证
            let idx_v = vouchers.findIndex((item) => item.voucher_no == voucher_no)
            let len = vouchers.length
            filterVouchers.splice(idx, 1)
            if(idx_v!=-1 && vouchers.length == len) {
              vouchers.splice(idx_v, 1)
            }
            that.setData({filterVouchers, vouchers}, ()=>{wx.hideLoading()})
          }
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    }
  },

  onVoucherModify: function(e) {
    console.log('修改点击', e)
    wx.showToast({
      title: '正在开发中，敬请期待',
      icon: 'none',
      duration: 2000
    })
  }
})