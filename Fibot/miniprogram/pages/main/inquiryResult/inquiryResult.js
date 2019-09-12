// miniprogram/pages/main/inquiryResult/inquiryResult.js
var mychart= null;
var wxCharts = require('../../../utils/wxcharts-min.js');
var windowWidth = wx.getSystemInfoSync().windowWidth - 15

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'long-text',
    text: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.getStorage({
      key: 'inquiry',
      success: function(res) {
        this.setData(JSON.parse(res.data), () => {wx.hideLoading()})
        wx.showLoading({
          title: '画图中',
          mask: true
        })
      },
      fail: err => {
        wx.showToast({
          title: '获取数据失败，请退出重试',
          icon: 'none',
          duration: 3000
        })
      },
      complete: () => {
        if (that.data.type == "pie"){
          var arr = []
          for (var k in Object.keys(that.data.diagram)) {
            arr.push({
              name: k,
              data: that.data.diagram[k]
            });
          }
          mychart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            series: arr,
            width: windowWidth,
            height: 300,
            dataLabel: true,
          });
        }
        else if(that.data.type == "line"){
          var categories = []
          var data = []
          for (var k in that.data.diagram) {
            categories.push(k)
            data.push(that.data.diagram[k])
          }
          console.log(categories)
          console.log(data)
          mychart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              // name: '营业利润',
              data: data,
              format: function (val, name) {
                return parseFloat(val).toFixed(2) + '万';
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
        }
        () => {
          wx.hideLoading() 
        }
      }
    })
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
    wx.removeStorage({
      key: 'inquiry',
      success: function(res) {
        console.log('查询缓存清除成功', res)
      },
    })
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

  }
})