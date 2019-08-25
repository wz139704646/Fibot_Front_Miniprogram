const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    sellIconList: [{
      icon: 'shop',
      color: 'red',
      badge: 0,
      name: '销售记录',
      url: "/pages/application/sellList/sellList?fun=null"
    }, {
      icon: 'friendadd',
      color: 'orange',
      badge: 0,
      name: '新增客户',
      url: "/pages/application/newCustomer/newCustomer"
    }, {
      icon: 'peoplelist',
      color: 'yellow',
      badge: 0,
      name: '客户列表',
      url: "/pages/application/customerList/customerList"
    }, {
      icon: 'cart',
      color: 'olive',
      badge: 0,
      name: '销售开单',
      url: "/pages/application/sellBill/sellBill"
    }],

    statis: [{
      title: '利润趋势分析',
      showMonth: false,
      showPeriod: true,
      period: [{
        title: '本日'
      },
      {
        title: '本月'
      },
      {
        title: '本年'
      }
      ],
      showIdx: 0
    },
    {
      title: '资产增长分析',
      showMonth: true,
      showPeriod: false
    }
    ]
  },

  onLoad: function (options) {
    this.setData({
      financialIconList: this.data.financialIconList
    })
  },

  NavToTalk(e) {
    wx.navigateTo({
      url: '/pages/application/start/start',
    })
    console.log("navigate")
  },

  navigateToHome: function (e) {
    wx.navigateTo({
      url: '/pages/my/home/home',
    })
  },

  //分页面跳转
  show(e) {
    console.log("navigate")
    wx.navigateTo({
      url: e.currentTarget.id,
    })
  }

})