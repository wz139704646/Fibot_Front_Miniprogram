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

  navigateToHome: function(e) {
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