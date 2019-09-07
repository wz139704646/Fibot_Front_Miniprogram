import * as echarts from '../../../../ec-canvas/echarts';

const app = getApp();
const host = app.globalData.requestHost;
var mychart = null;

function initPEChart(canvas, width, height) {
  let token = app.getToken()
  wx.showLoading({
    title: '画图中',
    mask: true
  })
  console.log(token)
  if (token) {
    wx.request({
      url: host + '/data/getIndustryData',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success: res => {
        mychart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(mychart);
        // Generate data
        var category = [];
        var barData = [];
        category = Object.keys(res.data.result).slice(0, 5)
        category.push(Object.keys(res.data.result)[6])
        category.push(Object.keys(res.data.result)[5])
        barData = Object.values(res.data.result).map(function (arr) {
          return arr[0]
        }).slice(0, 5)
        barData.push(res.data.result['贵阳银行'][0])
        barData.push(res.data.result['行业平均'][0])
        console.log(category)
        console.log(barData)

        var option = {
          backgroundColor: 'white',
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              detail: { formatter: '{value}%' },
              data: [{ value: 50, name: '运营情况评分' }]
            }
          ]
        };
        mychart.setOption(option);
        return mychart;
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }
};

function initPBChart(canvas, width, height) {
  let token = app.getToken()
  wx.showLoading({
    title: '画图中',
    mask: true
  })
  if (token) {
    wx.request({
      url: host + '/data/getIndustryData',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success: res => {
        var category = [];
        var barData = [];
        category = Object.keys(res.data.result).slice(0, 5)
        category.push(Object.keys(res.data.result)[6])
        category.push(Object.keys(res.data.result)[5])
        barData = Object.values(res.data.result).map(function (arr) {
          return arr[1]
        }).slice(0, 5)
        barData.push(res.data.result['贵阳银行'][1])
        barData.push(res.data.result['行业平均'][1])
        console.log(category)
        console.log(barData)

        // option
        var option = {
          backgroundColor: 'white',
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              detail: { formatter: '{value}%' },
              data: [{ value: 50, name: '运营情况评分' }]
            }
          ]
        };
        mychart.setOption(option);
        return chart;
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  }
};

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
      onInit: initPEChart
    },
    chartHidden: false,
    CustomBar: app.globalData.CustomBar,
    diagrams: ['市盈率P/E', '市净率P/B', '市现率PCF', '市销率P/S'],
  },

  onLoad: function (options) {
    // this.drawDiagram('市盈率P/E', 2019)
    // myChart = initPEChart()
  },

  drawDiagram: function (diagram, year = 0) {
    console.log('开始画' + diagram)
    let token = app.getToken()
    if (token) {
      if (diagram == '市盈率P/E') {
        console.log(this.data)
        wx.showLoading({
          title: '画图中',
          mask: true
        })
        wx.request({
          url: host + '/data/getIndustryData',
          method: "POST",
          header: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          success: res => {
            var category = [];
            var barData = [];
            category = Object.keys(res.data.result).slice(0, 5)
            category.push(Object.keys(res.data.result)[6])
            category.push(Object.keys(res.data.result)[5])
            barData = Object.values(res.data.result).map(function (arr) {
              return arr[0]
            }).slice(0, 5)
            barData.push(res.data.result['贵阳银行'][0])
            barData.push(res.data.result['行业平均'][0])
            console.log(category)
            console.log(barData)

            // option

            var option = {
              backgroundColor: 'white',
              tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
              },
              toolbox: {
                feature: {
                  restore: {},
                  saveAsImage: {}
                }
              },
              series: [
                {
                  name: '业务指标',
                  type: 'gauge',
                  detail: { formatter: '{value}%' },
                  data: [{ value: 50, name: '运营情况评分' }]
                }
              ]
            };
            mychart.setOption(option);
            return mychart;
          },
          complete: res => {
            wx.hideLoading()
          }
        })
      }
      else {
        wx.showToast({
          title: '开发中，敬请期待',
          icon: "none",
          duration: 2000,
        })
      }
    }
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

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})