// pages/main/mainq/humanResourse/humanResourse.js
// pages/main/boss/boss.js
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

Page({
  data: {
    distance: 10000,
    activeNames: [],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    financialIconList: [{
      icon: 'ticket',
      color: 'red',
      badge: 0,
      name: '凭证',
      url: applicationBase + '/pages/voucher/voucherList/voucher'
    }, {
      icon: 'copy',
      color: 'yellow',
      badge: 0,
      name: '报表',
      url: ''
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
        console.log('高层管理')
        this.drawDiagram()
      }
    }
  },

  onLoad: function (options) {
    this.setData({
      financialIconList: this.data.financialIconList
    })
    console.log('人资管理')
    this.drawDiagram()
  },

  onShow: function () {
    console.log('人资管理')
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
    console.log('人资管理')
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

  onChange(event) {
    this.setData({
      activeNames: event.detail,
      financialIconList: this.data.financialIconList
    });
    console.log('人资管理')
    this.drawDiagram()
    if (firstOpen) {
      wx.navigateTo({
        url: '/pages/main/mainq/humanResourse/humanResourse',
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
  },

  //点击图片触发
  touchHandler: function (e) {
    console.log('touch')
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
})