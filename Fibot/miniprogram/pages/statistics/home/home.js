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
var windowWidth = wx.getSystemInfoSync().windowWidth - 15
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
    diagrams: ['营业收入', '营业支出', '营业利润', '利润总额', '净利润', '毛利率', '净利率'],
    CustomBar: app.globalData.CustomBar,
  },

  touchHandler: function (e) {
    console.log(this.data)
    if (chartType == 'pie') {
      if (this.data.statis.title == '营业收入分析'){
        var intro_text = '总营业收入为'
      }
      else if (this.data.statis.title == '营业支出分析'){
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
    if (diagram == '营业支出') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getOperatingExpenditureByYear',
        data: JSON.stringify({
          year: year
        }),
        method: "POST",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          categories = []
          data = []
          for (var k in res.data.result) {
            categories.push(k)
            data.push(res.data.result[k])
          }
          categories.push(13)
          console.log(categories)
          console.log(data)
          this.setData({
            statis:
            {
              title: '营业支出分析',
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
              showIdx: 1
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '营业支出',
              data: data,
              format: function (val) {
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
        },
        fail: res => {
          console.error("未成功获取到营业支出数据")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '营业收入') {
      chartType = 'line'
      console.log('开始画营业收入的图')
      var food_arr = [];
      var daily_goods_arr = [];
      var other_goods_arr = [];
      var electronic_goods_arr = [];
      wx.request({
        url: host + '/data/getTotalSalesByYearAndMonth',
        method: "POST",
        data: JSON.stringify({
          year: year
        }),
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          categories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
          // 我也不知道为啥13它才能显示出12月
          for (var k in res.data.result) {
            console.log(k.slice(2))
            if (k.slice(2) == '食品类') {
              food_arr.push(res.data.result[k])
            }
            else if (k.slice(2) == '日用品类') {
              daily_goods_arr.push(res.data.result[k])
            }
            else if (k.slice(2) == '其他类') {
              other_goods_arr.push(res.data.result[k])
            }
            else if (k.slice(2) == '电子类') {
              electronic_goods_arr.push(res.data.result[k])
            }
            else {
              console.log("THIS SHOULD NOT Happend! Maybe because there is a new type not added!")
            };
          }
          this.setData({
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
              showIdx: 1
            }
          })
          console.log(categories)
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '食品类',
              data: food_arr,
              format: function (val) {
                return val.toFixed(2) + '万';
              }
            },
            {
              name: '日用品类',
              data: daily_goods_arr,
              format: function (val) {
                return (val).toFixed(2) + '万';
              }
            },
            {
              name: '电子类',
              data: electronic_goods_arr,
              format: function (val, name) {
                return (val).toFixed(2) + '万';
              }
            },
            {
              name: '其他类',
              data: other_goods_arr,
              format: function (val) {
                return (val).toFixed(2) + '万';
              }
            }],
            xAxis: {
              disableGrid: false
            },
            yAxis: {
              title: '当月总销售额',
              format: function (val) {
                return val;
              },
              min: 0
            },
            width: windowWidth,
            height: 300,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
              lineStyle: 'curve'
            }
          });
          console.log('complete')
        },
        fail: res => {
          console.error("未成功获取到销售数据")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '营业利润') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getOperatingProfits',
        method: "GET",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          categories = []
          data = []
          for (var k in res.data.result) {
            categories.push(k)
            data.push(res.data.result[k])
          }
          console.log(categories)
          console.log(data)
          this.setData({
            statis:
            {
              title: '营业利润分析',
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '营业利润',
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
        },
        fail: res => {
          console.error("未成功获取到营业利润数据")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '利润总额') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getTotalProfits',
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
              title: '利润总额分析',
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '利润总额',
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
        },
        fail: res => {
          console.error("未成功获取到利润总额数据")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '净利润') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getNetProfit',
        method: "GET",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          categories = []
          data = []
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
              title: '净利润分析',
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '净利润',
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
        },
        fail: res => {
          console.error("未成功获取到利润数据")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '毛利率') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getGrossProfitRate',
        method: "GET",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          categories = []
          data = []
          for (var k in res.data.result) {
            categories.push(k)
            data.push(res.data.result[k])
          }
          console.log(categories)
          console.log(data)
          this.setData({
            statis:
            {
              title: '毛利率分析',
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '毛利率',
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
          console.error("未成功获取到毛利率")
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
    else if (diagram == '净利率') {
      chartType = 'line'
      wx.request({
        url: host + '/data/getNetProfitRate',
        method: "GET",
        header: {
          "Content-Type": 'application/json'
        },
        success: res => {
          console.log(res.data.result)
          categories = []
          data = []
          for (var k in res.data.result) {
            categories.push(k)
            data.push(res.data.result[k])
          }
          console.log(categories)
          console.log(data)
          this.setData({
            statis:
            {
              title: '净利率分析',
              showPeriod: false
            }
          })
          pieChart = new wxCharts({
            canvasId: 'pieCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '净利率',
              data: data,
              format: function (val) {
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
          console.error("未成功获取到净利率")
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
    setTimeout(() => {
      this.drawDiagram('营业收入', 2019)
    }, 1500)
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

  getNumberOfDays: function(month){
    var one_date = new Date()
    one_date.setMonth(month)
    one_date.setDate(0)
    return one_date.getDate()
  },

  getCurrMonthDays: function(e){
    if (this.getNumberOfDays(curr_month) == 31) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    }
    if (this.getNumberOfDays(curr_month) == 30) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    }
    if (this.getNumberOfDays(curr_month) == 29) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
    }
    if (this.getNumberOfDays(curr_month) == 28) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
    }
  },

  chooseDayOrMonth: function (e) {
    wx.showLoading({
      title: '画图中',
      mask: true
    })
    let stat = e.currentTarget.dataset.stat
    let per = e.currentTarget.dataset.per
    let statis = this.data.statis
    statis.showIdx = per
    console.log(per)
    console.log(statis.period[per].title)
    console.log(statis.title)
    this.setData({
      statis: statis
    })
    if(statis.title == '营业收入分析'){
      if (statis.period[per].title == '本月'){
        var categories = this.getCurrMonthDays()
        console.log(categories)
        chartType = 'line'
        console.log('开始画本月营业收入的图')
        var food_arr = [];
        var daily_goods_arr = [];
        var other_goods_arr = [];
        var electronic_goods_arr = [];
        wx.request({
          url: host + '/data/getOperatingIncomeByYearAndMonth',
          method: "POST",
          data: JSON.stringify({
            year: curr_year,
            month: curr_month,
          }),
          header: {
            "Content-Type": 'application/json'
          },
          success: res => {
            for (var k in res.data.result) {
              console.log(k.slice(2))
              if (k.slice(2) == '食品类') {
                food_arr.push(res.data.result[k])
              }
              else if (k.slice(2) == '日用品类') {
                daily_goods_arr.push(res.data.result[k])
              }
              else if (k.slice(2) == '其他类') {
                other_goods_arr.push(res.data.result[k])
              }
              else if (k.slice(2) == '电子类') {
                electronic_goods_arr.push(res.data.result[k])
              }
              else {
                console.log("THIS SHOULD NOT Happend! Maybe because there is a new type not added!")
              };
            }
            this.setData({
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
            })
            console.log(categories)
            pieChart = new wxCharts({
              canvasId: 'pieCanvas',
              type: 'line',
              categories: categories,
              animation: false,
              series: [{
                name: '食品类',
                data: food_arr,
                format: function (val, name) {
                  return val.toFixed(2) + '万';
                }
              },
              {
                name: '日用品类',
                data: daily_goods_arr,
                format: function (val, name) {
                  return (val).toFixed(2) + '万';
                }
              },
              {
                name: '电子类',
                data: electronic_goods_arr,
                format: function (val, name) {
                  return (val).toFixed(2) + '万';
                }
              },
              {
                name: '其他类',
                data: other_goods_arr,
                format: function (val, name) {
                  return (val).toFixed(2) + '万';
                }
              }],
              xAxis: {
                disableGrid: false
              },
              yAxis: {
                title: '当月总销售额',
                format: function (val) {
                  return val;
                },
                min: 0
              },
              width: windowWidth,
              height: 300,
              dataLabel: true,
              dataPointShape: true,
              enableScroll: true,
              extra: {
                lineStyle: 'curve'
              }
            });
            console.log('complete')
          },
          fail: res => {
            console.error("未成功获取到销售数据")
          },
          complete: res => {
            wx.hideLoading()
          }
        })
      }
      else if (statis.period[per].title == '本年'){
        this.drawDiagram('营业收入', curr_year)
      }
      else if (statis.period[per].title == '总计'){
        chartType = 'pie'
        wx.request({
          url: host + '/data/getTotalOperatingIncome',
          method: "POST",
          header: {
            "Content-Type": 'application/json'
          },
          success: res => {
            arr = []
            for (var k in res.data.result) {
              arr.push({
                name: k,
                data: res.data.result[k]
              });
            }
            pieChart = new wxCharts({
              animation: true,
              canvasId: 'pieCanvas',
              type: 'pie',
              series: arr,
              width: windowWidth,
              height: 300,
              dataLabel: true,
            });
          },
          fail: res => {
            console.error("未成功获取到营收数据")
          },
          complete: res => {
            wx.hideLoading()
          }
        })
      }
    }
    else if (statis.title == '营业支出分析') {
      if (statis.period[per].title == '本月') {
        var categories = this.getCurrMonthDays()
        console.log(categories)
        chartType = 'line'
        console.log('开始画本月营业支出的图')
        var food_arr = [];
        var daily_goods_arr = [];
        var other_goods_arr = [];
        var electronic_goods_arr = [];
        wx.request({
          url: host + '/data/getOperatingExpenditureByYearAndMonth',
          method: "POST",
          data: JSON.stringify({
            year: curr_year,
            month: curr_month,
          }),
          header: {
            "Content-Type": 'application/json'
          },
          success: res => {
            for (var k in res.data.result) {
              console.log(k.slice(2))
              if (k.slice(2) == '食品类') {
                food_arr.push(res.data.result[k])
              }
              else if (k.slice(2) == '日用品类') {
                daily_goods_arr.push(res.data.result[k])
              }
              else if (k.slice(2) == '其他类') {
                other_goods_arr.push(res.data.result[k])
              }
              else if (k.slice(2) == '电子类') {
                electronic_goods_arr.push(res.data.result[k])
              }
              else {
                console.log("THIS SHOULD NOT Happend! Maybe because there is a new type not added!")
              };
            }
            this.setData({
              statis:
              {
                title: '营业支出分析',
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
            })
            console.log(categories)
            pieChart = new wxCharts({
              canvasId: 'pieCanvas',
              type: 'line',
              categories: categories,
              animation: false,
              series: [{
                name: '食品类',
                data: food_arr,
                format: function (val, name) {
                  return val.toFixed(2) + '万';
                }
              },
              {
                name: '日用品类',
                data: daily_goods_arr,
                format: function (val, name) {
                  return (val).toFixed(2) + '万';
                }
              },
              {
                name: '电子类',
                data: electronic_goods_arr,
                format: function (val, name) {
                  return (val).toFixed(2) + '万';
                }
              },
              {
                name: '其他类',
                data: other_goods_arr,
                format: function (val, name) {
                  return (val).toFixed(2) + '万';
                }
              }],
              xAxis: {
                disableGrid: false
              },
              yAxis: {
                title: '当月总销售额',
                format: function (val) {
                  return val;
                },
                min: 0
              },
              width: windowWidth,
              height: 300,
              dataLabel: true,
              dataPointShape: true,
              enableScroll: true,
              extra: {
                lineStyle: 'curve'
              }
            });
            console.log('complete')
          },
          fail: res => {
            console.error("未成功获取到销售数据")
          },
          complete: res => {
            wx.hideLoading()
          }
        })
      }
      else if (statis.period[per].title == '本年') {
        this.drawDiagram('营业支出', curr_year)
      }
      else if (statis.period[per].title == '总计') {
        chartType = 'pie'
        wx.request({
          url: host + '/data/getTotalOperatingExpenditure',
          method: "POST",
          header: {
            "Content-Type": 'application/json'
          },
          success: res => {
            arr = []
            for (var k in res.data.result) {
              arr.push({
                name: k,
                data: res.data.result[k]
              });
            }
            pieChart = new wxCharts({
              animation: true,
              canvasId: 'pieCanvas',
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
            wx.hideLoading()
          }
        })
      }
    }
    else{
      wx.hideLoading()
    }
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