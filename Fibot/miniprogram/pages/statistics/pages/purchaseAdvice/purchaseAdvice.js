var app = getApp();
const host = app.globalData.requestHost
var windowWidth = wx.getSystemInfoSync().windowWidth - 5

Page({
  data: {
    host: host,
    backgroundColor: '',
    TabCur: 0,  // 当前标签页
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    backorderGoodsPage: 0,    // 缺货商品页号
    sellWellGoodsPage: 0,   // 畅销唱片页号
    backorderGoods: [],   // 缺货商品信息
    sellWellGoods: [],    // 畅销商品信息
    showPeriods: false,   // 是否显示选择周期模态框
    sellWellPeriodIdx: 1,   // 当前所选畅销周期的索引
    sellWellAllLoaded: false,   // 畅销商品是否全部加载完毕
    backorderAllLoaded: false,    // 缺货商品是否全部加载完毕
    sellWellPeriodOptions: [    // 畅销周期的可选项
      {
        text: '近3天',
        value: 3
      },
      {
        text: '近一周',
        value: 7
      },
      {
        text: '近15天',
        value: 15
      },
      {
        text: '近一个月',
        value: 30
      },
      {
        text: '近两个月',
        value: 60
      }
    ]
  },

  /**
   * 获取缺货商品封装
   * 参数 page: 页数
   * 参数 callback: 成功加载完毕后的回调函数，参数是返回结果
   */
  getBackorderGoods: function(page, callback) {
    let token = app.getToken()
    if (token) {
      console.log('发起缺货商品查询请求', {
        page: page
      })
      wx.request({
        url: host + '/data/getBackorderGoods',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          page: page
        }),
        success: callback,
        fail: err => {
          wx.hideLoading()
          console.error('请求获取缺货商品失败')
          wx.showToast({
            title: '出现异常错误',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 获取畅销商品封装
   * 参数 page: 页数
   * 参数 days: 畅销商品的周期（近3天、一周等） 
   * 参数 callback: 加载完毕后的回调函数，参数是返回结果
   */
  getSellWellGoods: function (page, days, callback) {
    let token = app.getToken()
    if (token) {
      console.log('发起畅销商品查询请求', {
        page: page,
        days: days
      })
      wx.request({
        url: host + '/data/getSellWellGoods',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        data: JSON.stringify({
          page: page,
          days: days
        }),
        success: callback,
        fail: err => {
          wx.hideLoading()
          console.error('请求获取畅销商品失败')
          wx.showToast({
            title: '出现异常错误',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  /**
   * 加载缺货数据并绑定到页面上
   */
  loadBackorderGoods: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let { backorderGoodsPage, backorderGoods } = this.data
    this.getBackorderGoods(backorderGoodsPage, (res) => {
      if (res.statusCode == 555) {
        app.relogin()
      } else if (res.statusCode == 403) {
        wx.showToast({
          title: '无权限查看缺货商品',
          icon: 'none',
          duration: 1000
        })
      } else if (res.statusCode != 200 || !res.data.success) {
        wx.showToast({
          title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
        })
      } else {
        let goods = res.data.result
        console.log('缺货商品接口返回结果', goods)
        backorderGoods = backorderGoods.concat(goods)
        that.setData({
          backorderGoods: backorderGoods
        }, () => {
          wx.hideLoading()
        })
      }
    })
  },

  /**
   * 加载畅销数据并绑定到页面上
   */
  loadSellWellGoods: function() {
    let that = this
    let { sellWellPeriodIdx, sellWellPeriodOptions, sellWellGoodsPage, sellWellGoods } = this.data
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getSellWellGoods(sellWellGoodsPage, sellWellPeriodOptions[sellWellPeriodIdx].value, (res) => {
      if (res.statusCode == 555) {
        app.relogin()
      } else if (res.statusCode == 403) {
        wx.showToast({
          title: '无权限查看畅销商品',
          icon: 'none',
          duration: 1000
        })
      } else if (res.statusCode != 200 || !res.data.success) {
        wx.showToast({
          title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
        })
      } else {
        let goods = res.data.result
        console.log('畅销商品接口返回结果', goods)
        sellWellGoods = sellWellGoods.concat(goods)
        that.setData({
          sellWellGoods: sellWellGoods
        }, () => {
          wx.hideLoading()
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.loadBackorderGoods()
    this.loadSellWellGoods()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })
  },

  /**
   * 监听畅销商品周期选择按钮
   */
  onSellWellPeriodBtnTapped: function(e) {
    console.log('点击周期选择按钮')
    this.setData({
      showPeriods: true
    })
  },

  /**
   * 监听畅销商品周期选择模态框关闭
   */
  onModalClose: function(e) {
    this.setData({
      showPeriods: false
    })
  },

  /**
   * 监听畅销商品选择确定
   */
  onPeriodConfirm: function(e) {
    // 从第0页重新开始查询，并清空列表
    this.setData({
      sellWellPeriodIdx: e.detail.index,
      showPeriods: false,
      sellWellGoodsPage: 0,
      sellWellGoods: []
    }, () => {
      // 重新加载高销量商品
      this.loadSellWellGoods()
    })
  },

  /**
   * 监听缺货商品加载更多按钮被点击事件
   */
  onLoadMoreBackorderBtnTapped: function(e) {
    let { backorderGoodsPage } = this.data
    // 点击后加载新的一页
    this.setData({
      backorderGoodsPage: backorderGoodsPage + 1
    }, () => {
      this.loadBackorderGoods()
    })
  },

  /**
   * 监听畅销商品加载更多按钮被点击事件
   */
  onLoadMoreSellWellBtnTapped: function(e) {
    let { sellWellGoodsPage } = this.data
    // 点击之后加载新的一页
    this.setData({
      sellWellGoodsPage: sellWellGoodsPage + 1
    }, () => {
      this.loadSellWellGoods()
    })
  },

  /**
   * 监听标签页点击事件
   */
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
})