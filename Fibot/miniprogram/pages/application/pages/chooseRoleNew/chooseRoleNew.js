// pages/application/chooseRoleNew/chooseRoleNew.js
const app = getApp();
const mainBase = app.globalData.mainBase
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
  },
  onLoad: function () { },
  pageBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    elements: [{
      title: '高层管理',
      name: '统筹一切 负责公司整体运作',
      color: 'cyan',
      url: mainBase + '/mainq/high_level/high_level'
      //icon: 'newsfill'
    },
    {
      title: '人资管理',
      name: '人力资源 管理公司人事调度',
      color: 'blue',
      url: mainBase + '/mainq/HR/HR'
      //icon: 'colorlens'
    },
    {
      title: '财会管理',
      name: '财务会计 掌管公司财务大计',
      color: 'olive',
      url: mainBase + '/mainq/finance/finance'
      //icon: 'font'
    },
    {
      title: '行政管理',
      name: '行政事务 统筹公司组织管理',
      color: 'green',
      url: ""
      //icon: 'icon'
    },
    {
      title: '生产管理',
      name: '基层生产 扎实公司底层实力',
      color: 'grey',
      url: mainBase + '/mainq/purchase/purchase'
      //icon: 'btn'
    },
    {
      title: '销售管理',
      name: '市场销售 贯通公司销售之道',
      color: 'purple',
      url: mainBase + '/mainq/seller/seller'
      //icon: 'tagfill'
    },
    {
      title: '市场营销',
      name: '精准营销 推广公司品牌力量',
      color: 'brown',
      url: mainBase + '/mainq/market/market'
      //icon: 'myfill'
    },
    {
      title: '物流管理',
      name: '物流运送 提供公司物流保障',
      color: 'black',
      url: mainBase + '/mainq/logistics/logistics'
      //icon: 'icloading'
    },
    ],
  }
})