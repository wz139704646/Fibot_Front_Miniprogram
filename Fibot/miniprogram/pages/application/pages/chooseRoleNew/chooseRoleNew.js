// pages/application/chooseRoleNew/chooseRoleNew.js
const app = getApp();
const mainBase = app.globalData.mainBase
const cloudBase = "cloud://zqr-testdemo-974f2b.7a71-zqr-testdemo-974f2b-1258658144"
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    backgroundColor: app.globalData.backgroundColor,

    cardCur: 0,
    elements: [{
      title: '高层管理',
      name: '统筹一切 负责公司整体运作',
      color: 'cyan',
      image: cloudBase + "/imgs/人物角色/高层管理.png",
      url: mainBase + '/mainq/high_level/high_level',
      icon: 'newsfill',
      backgroundColor: 'bg-high_level'
    },
    {
      title: '人资管理',
      name: '人力资源 管理公司人事调度',
      color: 'blue',
      url: mainBase + '/mainq/HR/HR',
      image: cloudBase + "/imgs/人物角色/人资管理.png",
      icon: 'colorlens',
      backgroundColor: 'bg-HR'
    },
    {
      title: '财会管理',
      name: '财务会计 掌管公司财务大计',
      color: 'olive',
      image: cloudBase + "/imgs/人物角色/财会管理.png",
      url: mainBase + '/mainq/finance/finance',
      icon: 'font',
      backgroundColor: 'bg-finance'
    },
    {
      title: '行政管理',
      name: '行政事务 统筹公司组织管理',
      color: 'green',
      image: cloudBase + "/imgs/人物角色/行政管理.png",
      url: mainBase + "/mainq/administration/administration",
      icon: 'icon',
      backgroundColor: 'bg-administration'
    },
    {
      title: '生产管理',
      name: '基层生产 扎实公司底层实力',
      color: 'grey',
      image: cloudBase + "/imgs/人物角色/生产管理.png",
      url: mainBase + '/mainq/purchase/purchase',
      backgroundColor: 'bg-purchase'
      //icon: 'btn'
    },
    {
      title: '销售管理',
      name: '市场销售 贯通公司销售之道',
      color: 'purple',
      image: cloudBase + "/imgs/人物角色/销售管理.png",
      url: mainBase + '/mainq/seller/seller',
      icon: 'tagfill',
      backgroundColor: 'bg-seller'
    },
    {
      title: '市场营销',
      name: '精准营销 推广公司品牌力量',
      color: 'brown',
      image: cloudBase + "/imgs/人物角色/市场营销.png",
      url: mainBase + '/mainq/market/market',
      icon: 'myfill',
      backgroundColor: 'bg-market'
    },
    {
      title: '物流管理',
      name: '物流运送 提供公司物流保障',
      color: 'black',
      image: cloudBase + "/imgs/人物角色/物流管理.png",
      url: mainBase + '/mainq/logistics/logistics',
      icon: 'icloading',
      backgroundColor: 'bg-logistics'
    },
    ],
  },
  onLoad: function () { },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  enterRole(e){
    var cardCur = this.data.cardCur
    var roles = this.data.elements
    var backgroundColor = roles[cardCur].backgroundColor
    app.globalData.backgroundColor = backgroundColor
    console.log(backgroundColor)
    console.log(app.globalData.backgroundColor)

    wx.redirectTo({
      url: roles[cardCur].url,
    })
  }

});
