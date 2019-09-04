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
      }, {
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
      }
    ],

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
  },

  //长按删除功能
  delete: function (e) {
    var that = this;
    var list = that.data.sellIconList;
    var index = e.currentTarget.dataset.index;//获取当前长按下标
    wx.showModal({
      title: '提示',
      content: '确定要删除该功能吗？',
      success: function (res) {
        if (res.confirm) {
          list.splice(index, 1);
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          sellIconList: list
        });
      }
    })
  },

  //添加功能
  add: function (e) {
    var that = this;
    var list = that.data.sellIconList;
    var index = e.currentTarget.dataset.index;//获取当前长按下标
    wx.showModal({
      title: '提示',
      content: '确定要添加该功能吗？',
      success: function (res) {
        if (res.confirm) {
          list.push(list[index]);
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          sellIconList: list,
          isShow: false
        });
      }
    })
  },

  //点击添加
  showFunction: function () {
    this.setData({
      isShow: true
    })
  },

  //取消添加
  hide: function () {
    this.setData({
      isShow: false
    })
  }

})