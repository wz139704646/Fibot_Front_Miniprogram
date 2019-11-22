// miniprogram/pages/main/inquiryResult/inquiryResult.js
var mychart = null;
var wxCharts = require('../../../utils/wxcharts-min.js');
var windowWidth = wx.getSystemInfoSync().windowWidth - 15

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      success: function (res) {
        that.setData(JSON.parse(res.data), () => {wx.hideLoading()})
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
        console.log(that.data)
        if (that.data.type == "pie") {
          var arr = []
          arr.push({
            name: '食品类',
            data: 0
          })
          arr.push({
            name: '日用品类',
            data: 0
          })
          arr.push({
            name: '电子类',
            data: 0
          })
          arr.push({
            name: '其他类',
            data: 0
          })
          for (var k = 0;k<Object.keys(that.data.diagram).length;k++) {
            if (Object.keys(that.data.diagram).length == 0){
              wx.hideLoading()
              wx.showModal({
                title: '未获取到数据',
                content: '请确认',
              })
              return
            }
            for (var e in arr) {
              if (arr[e].name == String(Object.keys(that.data.diagram)[k])) {
                arr[e].data = that.data.diagram[Object.keys(that.data.diagram)[k]]
                console.log(arr[e].data)
                console.log('break')
                break;
              }
            }
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
        else if (that.data.type == "line") {
          var categories = []
          var data = []
          for (var k = 0; k < Object.keys(that.data.diagram).length; k++) {
            if (Object.keys(that.data.diagram).length == 0) {
              wx.hideLoading()
              wx.showModal({
                title: '未获取到数据',
                content: '请确认',
              })
              return
            }
            categories.push(String(Object.keys(that.data.diagram)[k]))
            data.push(that.data.diagram[String(Object.keys(that.data.diagram)[k])])
          }
          mychart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: String(that.data.summary),
              data: data,
              format: function (val, name) {
                return parseFloat(val).toFixed(2) + '元';
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
      success: function (res) {
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

  },

  onActiveChange: function (e) {
    console.log(e)
    let { gidx } = e.currentTarget.dataset
    this.setData({
      [`groups[${gidx}].activeNames`]: e.detail
    })
  }
})