// pages/main/mainq/publicAdministraion/publicAdministraion.js
const app = getApp();
var wxCharts = require('../../../../utils/wxcharts-min.js');
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase
var pieChart1 = null;
var pieChart2 = null;
var arr = null;
var startPos = null;
var windowWidth = wx.getSystemInfoSync().windowWidth - 15
var firstOpen = true
const mainBase = app.globalData.mainBase
const statisticsBase = app.globalData.statisticsBase

Page({
  data: {
    backgroundColor:'',
    distance: 10000,
    activeNames: [],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showIconList: [{
      icon: 'rank',
      color: 'red',
      badge: 0,
      name: '主营业务',
      url: statisticsBase + '/pages/home/home'
    }, {
        icon: 'creative',
        color: 'green',
        badge: 0,
        name: '决策指标',
        url: statisticsBase + '/pages/decisionMaking/decisionMaking'
      }, {
        icon: 'text',
        color: 'orange',
        badge: 0,
        name: '股票分析',
        url: statisticsBase + '/pages/stokeAnalysis/index'
      },
      {
        icon: 'list',
        color: 'yellow',
        badge: 0,
        name: '固定资产列表',
        url: applicationBase + '/pages/fixedAssets/fixedAssetsList/fixedAssetsList'
      }, {
        icon: 'recharge',
        color: 'olive',
        badge: 0,
        name: '新增固定资产',
        url: applicationBase + '/pages/fixedAssets/newFixedAsset/newFixedAsset'
      }, {
        icon: 'text',
        color: 'blue',
        badge: 0,
        name: '科目表',
        url: applicationBase + '/pages/subjects/subjects/subjects'
      }
    ],

    addIconList: [{
      icon: 'rank',
      color: 'red',
      badge: 0,
      name: '主营业务',
      url: statisticsBase + '/pages/home/home'
    }, {
        icon: 'creative',
        color: 'green',
        badge: 0,
        name: '决策指标',
        url: statisticsBase + '/pages/decisionMaking/decisionMaking'
      }, {
        icon: 'text',
        color: 'orange',
        badge: 0,
        name: '股票分析',
        url: statisticsBase + '/pages/stokeAnalysis/index'
      },
      {
      icon: 'list',
      color: 'yellow',
      badge: 0,
      name: '固定资产列表',
      url: applicationBase + '/pages/fixedAssets/fixedAssetsList/fixedAssetsList'
    }, {
        icon: 'recharge',
        color: 'olive',
        badge: 0,
        name: '新增固定资产',
        url: applicationBase + '/pages/fixedAssets/newFixedAsset/newFixedAsset'
      }, {
        icon: 'text',
        color: 'blue',
        badge: 0,
        name: '科目表',
        url: applicationBase + '/pages/subjects/subjects/subjects'
      }

    ],

    statis: [{
      title: '营收分析',
      showMonth: false,
      showPeriod: true,
      showIdx: 0
    },
      // {
      //   title: '资产增长分析',
      //   showMonth: true,
      //   showPeriod: false
      // }
    ],

    chartHidden: true,
    CustomBar: app.globalData.CustomBar,

    liftimes: {
      attached: function () {
        console.log('行政管理')
        this.drawDiagram()
      }
    }
  },
  /**
       * 生命周期函数--监听页面初次渲染完成
       */
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })

  },
  onLoad: function (options) {
    this.setData({
      showIconList: this.data.showIconList
    })
    console.log('行政管理')
    this.drawDiagram()
  },

  onShow: function () {
    console.log('行政管理')
  },

  NavToTalk(e) {
    wx.navigateTo({
      url: applicationBase + '/pages/start/start',
    })
    console.log("navigate")
  },

  //分页面跳转
  show(e) {
    console.log("navigate")
    wx.navigateTo({
      url: e.currentTarget.id,
    })
    console.log('行政管理')
  },

  //长按删除功能
  delete: function (e) {
    var that = this;
    var list = that.data.showIconList;
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
          showIconList: list
        });
      }
    })
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
      showIconList: this.data.showIconList
    });
    console.log('行政管理')
    this.drawDiagram()
    if (firstOpen) {
      wx.navigateTo({
        url: '/pages/main/mainq/administration/administration',
        success: function () {
          console.log('nav')
        }
      })
      firstOpen = false
    }
  },

  clickbtn: function (e) {
    console.log('click')
    this.drawDiagram()
    this.setData({
      distance: 200,
      chartHidden: false
    })
  },

  //添加功能
  add: function (e) {
    var that = this;
    var list = that.data.addIconList;
    var showIconList = that.data.showIconList;
    var index = e.currentTarget.dataset.index;//获取当前长按下标
    wx.showModal({
      title: '提示',
      content: '确定要添加该功能吗？',
      success: function (res) {
        if (res.confirm) {
          showIconList.push(list[index]);
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          showIconList: showIconList,
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
  },

  //点击图片触发
  touchHandler: function (e) {
    // console.log('touch')
    // wx.showModal({
    //   content: arr[pieChart1.getCurrentDataIndex(e)].name + '营业收入' + arr[pieChart1.getCurrentDataIndex(e)].data + '元',
    //   showCancel: false,
    //   confirmText: "我知道啦",
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     }
    //   }
    // });
  },

  touchEndHandler: function (e) {
    console.log('touch')
    if (this.data.statis.title == '营收分析') {
      var intro_text = '总营业收入为'
    }
    else if (this.data.statis.title == '营业支出分析') {
      var intro_text = '总营业支出为'
    }
    wx.showModal({
      content: arr[pieChart1.getCurrentDataIndex(e)].name + '营业收入' + arr[pieChart1.getCurrentDataIndex(e)].data + '元',
      showCancel: false,
      confirmText: "我知道啦",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },

  //画图函数
  drawDiagram: function (year = 0, month = 0) {
    console.log("draw")
    var token = app.getToken()
    wx.request({
      url: host + '/data/getTotalOperatingIncome',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success: res => {
        arr = []
        for (var k in res.data.result) {
          arr.push({
            name: k,
            data: res.data.result[k]
          });
          console.log(arr)
        }
        pieChart1 = new wxCharts({
          animation: true,
          canvasId: 'pieCanvas1',
          type: 'pie',
          series: arr,
          width: windowWidth,
          height: 300,
          dataLabel: true,
        });
      },
      fail: res => {
        console.error("未成功获取到营业支出数据")
      },
      complete: res => {

      }
    })
  },

  NavMy(e) {
    wx.redirectTo({
      url: mainBase + '/my/home/home?position=administration',
    })
  },
})