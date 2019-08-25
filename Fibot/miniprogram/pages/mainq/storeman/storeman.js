const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    storeIconList: [{
      icon: 'goods',
      color: 'red',
      badge: 0,
      name: '新增商品',
      url: '/pages/application/newGood/newGood'
    }, {
      icon: 'list',
      color: 'orange',
      badge: 0,
      name: '商品列表',
      url: '/pages/application/goodList/goodList'
    }, {
      icon: 'deliver',
      color: 'yellow',
      badge: 0,
      name: '调拨记录',
      url: '/pages/application/transferGood/transferRecord/transferRecord'
    }, {
      icon: 'pick',
      color: 'olive',
      badge: 0,
      name: '新增仓库',
      url: '/pages/application/newStorage/newStorage'
    }, {
      icon: 'edit',
      color: 'red',
      badge: 0,
      name: '入库',
      url: '/pages/application/buyList/buyList?fun=入库'
    }, {
      icon: 'edit',
      color: 'orange',
      badge: 0,
      name: '出库',
      url: '/pages/application/sellList/sellList?fun=出库'
    }],


    statis: [{
      title: '库存数量分析',
      showMonth: false,
      showPeriod: true,
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