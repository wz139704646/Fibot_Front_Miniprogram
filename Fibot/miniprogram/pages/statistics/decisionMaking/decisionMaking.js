// miniprogram/pages/finding/home/home.js
var wxCharts = require('../../../utils/wxcharts-min.js');
var app = getApp();
const host = app.globalData.requestHost
var pieChart = null;
var arr = null;
var lineChart = null;
var chartType = "";
var startPos = null;
var date = new Date();
var curr_year = date.getFullYear();
var curr_month = date.getMonth() + 1
var windowWidth = wx.getSystemInfoSync().windowWidth - 15;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statis:
    {
      title: '营业收入分析',
      showPeriod: true,
      period: [
        {
          title: '本月'
        },
        {
          title: '本年'
        },
        {
          title: '总计'
        },
      ],
      showIdx: 0
    }
    ,
    chartHidden: false,
    diagrams: ['债务率', '流动比率', '速动比率', '现金比率', '资产周转率'],
    CustomBar: app.globalData.CustomBar,
  },

  touchHandler: function (e) {
    console.log(this.data)
    if (chartType == 'pie') {
      if (this.data.statis.title == '营业收入分析') {
        var intro_text = '总营业收入为'
      }
      else if (this.data.statis.title == '营业支出分析') {
        var intro_text = '总营业支出为'
      }
      wx.showModal({
        content: arr[pieChart.getCurrentDataIndex(e)].name + intro_text + arr[pieChart.getCurrentDataIndex(e)].data + '元',
        showCancel: false,
        confirmText: "我知道啦",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if (chartType == 'line') {
      console.log("touched")
      pieChart.scrollStart(e);
    }
    else {
      console.log('not implemented')
    }
  },
  moveHandler: function (e) {
    console.log('move')
    pieChart.scroll(e);
  },
  touchEndHandler: function (e) {
    console.log('touch end')
    pieChart.scrollEnd(e);
    pieChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

  drawDiagram: function (diagram, year = 0, month = 0) {
    console.log("开始画图！")
    var categories = [];
    var data = [];
    var time = [];
    var types = [];
    var windowWidth = wx.getSystemInfoSync().windowWidth - 15;
    arr = [];
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    if (diagram == '债务率') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getDebtRate',
        method: "GET",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          for (var k in res.data.result) {
            categories.push(k)
            data.push(res.data.result[k])
          }
          console.log(categories)
          console.log(data)
          this.setData({
            statis:
            {
              title: '债务率分析',
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '债务率',
              data: data,
              format: function (val, name) {
                return parseFloat(val).toFixed(2) + '%';
              }
            }],
            width: windowWidth,
            height: 300,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
              lineStyle: 'curve'
            }
          });
        },
        fail: res => {
          console.error("未成功获取到债务率")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '流动比率' || diagram == '速动比率') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getLiquidRatio',
        method: "GET",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          for (var k in res.data.result) {
            categories.push(k)
            data.push(res.data.result[k])
          }
          categories.push(String(curr_year))
          data.push(res.data.result[curr_year-1])
          console.log(categories)
          console.log(data)
          this.setData({
            statis:
            {
              title: diagram,
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: diagram,
              data: data,
              format: function (val, name) {
                return parseFloat(val).toFixed(2) + '%';
              }
            }],
            width: windowWidth,
            height: 300,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
              lineStyle: 'curve'
            }
          });
        },
        fail: res => {
          console.error("未成功获取到" + diagram)
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '资产周转率') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getTurnoverRate',
        method: "GET",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          for (var k in res.data.result) {
            categories.push(k)
            data.push(res.data.result[k])
          }
          console.log(categories)
          console.log(data)
          this.setData({
            statis:
            {
              title: '资产周转率分析',
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '资产周转率',
              data: data,
              format: function (val, name) {
                return parseFloat(val).toFixed(5) + '%';
              }
            }],
            width: windowWidth,
            height: 300,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
              lineStyle: 'curve'
            }
          });
        },
        fail: res => {
          console.error("未成功获取到资产周转率")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '现金比率') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getCashRatio',
        method: "GET",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          for (var k in res.data.result) {
            categories.push(k)
            data.push(res.data.result[k])
          }
          console.log(categories)
          console.log(data)
          this.setData({
            statis:
            {
              title: '现金比率分析',
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '现金比率',
              data: data,
              format: function (val, name) {
                return parseFloat(val).toFixed(2) + '%';
              }
            }],
            width: windowWidth,
            height: 300,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
              lineStyle: 'curve'
            }
          });
        },
        fail: res => {
          console.error("未成功获取到现金率")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else {
      console.log("Not implemented yet!")
      complete: res => {
        wx.hideLoading()
      }
      wx.showToast({
        title: '开发中，敬请期待',
        icon: "none",
        duration: 2000,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '画图中',
      mask: true
    })
    setTimeout(()=>{
      this.drawDiagram('债务率', 2019)
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  chooseDayOrMonth: function (e) {
    console.log('这不应该鸭')
  },

  showModal(e) {
    console.log("show list")
    console.log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target,
      chartHidden: true
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
      chartHidden: false
    })
  },
  chooseDiagram: function (e) {
    console.log(e.currentTarget.dataset.diag)
    this.hideModal(e)
    this.drawDiagram(e.currentTarget.dataset.diag, 2019)
  },
})