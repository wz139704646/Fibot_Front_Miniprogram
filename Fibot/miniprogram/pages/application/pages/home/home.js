const app = getApp();
const applicationBase = app.globalData.applicationBase
const statisticsBase = app.globalData.statisticsBase

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    sellIconList: [{
      icon: 'shop',
      color: 'red',
      badge: 0,
      name: '销售记录',
      url: applicationBase+"/pages/sellList/sellList?fun=null"
    }, {
      icon: 'friendadd',
      color: 'orange',
      badge: 0,
      name: '新增客户',
        url: applicationBase+"/pages/newCustomer/newCustomer"
    }, {
      icon: 'peoplelist',
      color: 'yellow',
      badge: 0,
      name: '客户列表',
        url: applicationBase+"/pages/customerList/customerList"
    }, {
      icon: 'cart',
      color: 'olive',
      badge: 0,
      name: '销售开单',
        url: applicationBase+"/pages/sellBill/sellBill"
    }],
    buyIconList: [{
      icon: 'deliver_fill',
      color: 'red',
      badge: 0,
      name: '采购记录',
      url: applicationBase+'/pages/buyList/buyList?fun=null'
    }, {
      icon: 'friendaddfill',
      color: 'orange',
      badge: 0,
      name: '新增供应商',
        url: applicationBase+'/pages/newSupplier/newSupplier'
    }, {
      icon: 'expressman',
      color: 'yellow',
      badge: 0,
      name: '供应商列表',
        url: applicationBase+'/pages/supplierList/supplierList'
    }, {
      icon: 'file',
      color: 'olive',
      badge: 0,
      name: '采购开单',
        url: applicationBase+"/pages/buyBill/buyBill"
    }],
    fundIconList: [{
      icon: 'sponsor',
      color: 'red',
      badge: 0,
      name: '收款记录',
      url: applicationBase+'/pages/ar/receipts/receipts'
    }, {
      icon: 'sponsor',
      color: 'orange',
      badge: 0,
      name: '付款记录',
        url: applicationBase+'/pages/ap/payments/payments'
    }, {
      icon: 'recharge',
      color: 'yellow',
      badge: 0,
      name: '其他收入记录',
      url: ''
    }, {
      icon: 'recharge',
      color: 'olive',
      badge: 0,
      name: '其他支出记录',
      url: ''
    }, {
      icon: 'moneybag',
      color: 'orange',
      badge: 0,
      name: '资金流水',
      url: ''
    }, {
      icon: 'newshot',
      color: 'yellow',
      badge: 0,
      name: '资金转账记录',
        url: applicationBase+'/pages/transferAccount/transferRecord/transferRecord'
    }],
    storeIconList: [{
      icon: 'goods',
      color: 'red',
      badge: 0,
      name: '新增商品',
      url: applicationBase+'/pages/newGood/newGood'
    }, {
      icon: 'list',
      color: 'orange',
      badge: 0,
      name: '商品列表',
        url: applicationBase+'/pages/goodList/goodList'
    }, {
      icon: 'deliver',
      color: 'yellow',
      badge: 0,
      name: '调拨记录',
        url: applicationBase+'/pages/transferGood/transferRecord/transferRecord'
    }, {
      icon: 'pick',
      color: 'olive',
      badge: 0,
      name: '新增仓库',
        url: applicationBase+'/pages/newStorage/newStorage'
    }, {
      icon: 'cascades',
      color: 'olive',
      badge: 0,
      name: '库存',
        url: applicationBase+'/pages/goodsStore/goodsStore'
    }, {
      icon: 'edit',
      color: 'red',
      badge: 0,
      name: '入库',
        url: applicationBase+'/pages/buyList/buyList?fun=入库'
    }, {
      icon: 'edit',
      color: 'orange',
      badge: 0,
      name: '出库',
        url: applicationBase+'/pages/sellList/sellList?fun=出库'
    }],
    financialIconList: [{
        icon: 'ticket',
        color: 'red',
        badge: 0,
        name: '凭证',
        url: applicationBase+'/pages/voucher/voucherList/voucher'
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
        url: applicationBase+'/pages/trialBalance/trialBalance'
      },
      {
        icon: 'text',
        color: 'blue',
        badge: 0,
        name: '科目表',
        url: applicationBase+'/pages/subjects/subjects/subjects'
      }
    ],
    inOutIconList: [{
        icon: 'rankfill',
        color: 'orange',
        badge: 0,
        name: '存款日记账',
        url: applicationBase+'/pages/depositJournal/addJournal/addJournal'
      }, {
        icon: 'refund',
        color: 'red',
        badge: 0,
        name: '库存现金',
        url: applicationBase+'/pages/cashOnHand/cashShow/cashShow'
      },
      {
        icon: 'copy',
        color: 'green',
        badge: 0,
        name: '银行对账',
        url: applicationBase+'/pages/bankReconciliations/reconciliationShow/reconciliationShow'
      },
      {
        icon: 'text',
        color: 'yellow',
        badge: 0,
        name: '资金日报表',
        url: applicationBase+'/pages/dailyFund/dailyFund'
      }
    ],
    dataAnalysisIconList: [{
      icon: 'rank',
      color: 'red',
      badge: 0,
      name: '主营业务',
      url: statisticsBase+'/pages/home/home'
    }, {
      icon: 'creative',
      color: 'green',
      badge: 0,
      name: '决策指标',
      url: statisticsBase +'/pages/decisionMaking/decisionMaking'
    }, {
      icon: 'text',
      color: 'orange',
      badge: 0,
      name: '股票分析',
      url: statisticsBase +'/pages/stokeAnalysis/index'
    }
    ],
    gridCol: 4,
    skin: false
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
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