const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    financialIconList: [{
        icon: 'ticket',
        color: 'red',
        badge: 0,
        name: '凭证',
        url: '/pages/application/voucher/voucherList/voucher'
      }, {
        icon: 'copy',
        color: 'yellow',
        badge: 0,
        name: '报表',
        url: ''
      }, {
        icon: 'sort',
        color: 'yellow',
        badge: 0,
        name: '科目余额',
        url: '/pages/application/trialBalance/trialBalance'
      },
      {
        icon: 'text',
        color: 'blue',
        badge: 0,
        name: '科目表',
        url: '/pages/application/subjects/subjects/subjects'
      },
      {
        icon: 'rankfill',
        color: 'orange',
        badge: 0,
        name: '存款日记账',
        url: '/pages/application/depositJournal/addJournal/addJournal'
      }, {
        icon: 'refund',
        color: 'red',
        badge: 0,
        name: '库存现金',
        url: '/pages/application/cashOnHand/cashShow/cashShow'
      },
      {
        icon: 'copy',
        color: 'green',
        badge: 0,
        name: '银行对账',
        url: '/pages/application/bankReconciliations/reconciliationShow/reconciliationShow'
      },
      {
        icon: 'text',
        color: 'yellow',
        badge: 0,
        name: '资金日报表',
        url: '/pages/application/dailyFund/dailyFund'
      }
    ],

    statis: [{
        title: '资金分析',
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

  onLoad: function(options) {
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