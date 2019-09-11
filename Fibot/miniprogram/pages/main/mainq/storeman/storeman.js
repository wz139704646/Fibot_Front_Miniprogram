const app = getApp();
var wxCharts = require('../../../../utils/wxcharts-min.js');
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase
var pieChart1 = null;
var pieChart2 = null;
var arr = null;
var startPos = null;
var windowWidth = wx.getSystemInfoSync().windowWidth - 15

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showIconList: [{
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

    addIconList: [{
      icon: 'goods',
      color: 'red',
      badge: 0,
      name: '新增商品',
      url: applicationBase + '/pages/newGood/newGood'
    }, {
      icon: 'list',
      color: 'orange',
      badge: 0,
      name: '商品列表',
      url: applicationBase + '/pages/goodList/goodList'
    }, {
      icon: 'deliver',
      color: 'yellow',
      badge: 0,
      name: '调拨记录',
      url: applicationBase + '/pages/transferGood/transferRecord/transferRecord'
    }, {
      icon: 'pick',
      color: 'olive',
      badge: 0,
      name: '新增仓库',
      url: applicationBase + '/pages/newStorage/newStorage'
    }, {
      icon: 'edit',
      color: 'red',
      badge: 0,
      name: '入库',
      url: applicationBase + '/pages/buyList/buyList?fun=入库'
    }, {
      icon: 'edit',
      color: 'orange',
      badge: 0,
      name: '出库',
      url: applicationBase + '/pages/sellList/sellList?fun=出库'
    }],

    statis: [{
      title: '库存分析',
      showMonth: false,
      showPeriod: true,
      showIdx: 0
    }
    ]
  },

  onLoad: function (options) {
    this.setData({
      showIconList: this.data.showIconList
    })
    this.drawDiagram()
  },

  onShow: function () {
    console.log('仓库管理')
  },

  NavToTalk(e) {
    wx.navigateTo({
      url: applicationBase+'/pages/start/start',
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
    wx.showModal({
      content: arr[pieChart1.getCurrentDataIndex(e)].name + '库存总价值为' + arr[pieChart1.getCurrentDataIndex(e)].data + '元',
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
    wx.showModal({
      content: arr[pieChart1.getCurrentDataIndex(e)].name + '库存总价值为' + arr[pieChart1.getCurrentDataIndex(e)].data + '元',
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
    var token = app.getToken()
    console.log(token)
    if(token){
      wx.request({
        url: host + '/data/getRatioOfGoodsInWarehouse',
        method: "POST",
        header: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        success: res => {
          arr = []
          // total_val = 0
          // for (var v in res.data.result.values()){
          //   total_val = total_val + v
          // }
          console.log(res.data.result)
          // console.log(total_val)
          for (var k in res.data.result) {
            arr.push({
              name: k,
              data: parseFloat(res.data.result[k])
            });
          }
          console.log(arr)
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
    }
  },

})