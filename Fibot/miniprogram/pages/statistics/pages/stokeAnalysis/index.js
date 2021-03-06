import * as echarts from '../../../../ec-canvas/echarts';

const app = getApp();
const host = app.globalData.requestHost;
var mychart = null;

function initPBChart(canvas, width, height) {
  var that = this
  let token = app.getToken()
  wx.showLoading({
    title: '画图中',
    mask: true
  })
  if(token){
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
          // backgroundColor: '#4C4C4C',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['P/B市净率'],
            textStyle: {
              color: 'black'
            }
          },
          xAxis: {
            data: category,
            axisLabel: {
              interval: 0,
              // rotate: -10
              formatter: function (val) {
                return val.split("").join("\n");
              }
            },
            axisLine: {
              lineStyle: {
                color: 'black'
              }
            }
          },
          yAxis: {
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: 'black'
              }
            }
          },
          series: [{
            name: 'P/B市净率',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: that.data.bar_color
              }
            },
            data: barData
          }]
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
      title: '分享成功',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    ec: {
    },
    bar_color: '',
    backgroundColor: '',
    chartHidden: false,
    CustomBar: app.globalData.CustomBar,
    diagrams: ['市盈率P/E', '市净率P/B', '市现率PCF', '市销率P/S'],
  },

  onLoad: function (options) {
    // this.drawDiagram('市盈率P/E', 2019)
    // myChart = initPEChart()
    if (app.globalData.backgroundColor == 'bg-high_level') {
      this.setData({
        bar_color: '#e9c582',
      })
    }
    else if (app.globalData.backgroundColor == 'bg-HR') {
      this.setData({
        bar_color: '#6d5947',
      })
    }
    else {
      this.setData({
        bar_color: '#00E2FF',
      })
    }
  },
  onReady: function () {
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })
    console.log(app.globalData.backgroundColor)
    if (app.globalData.backgroundColor == 'bg-high_level') {
      this.setData({
        bar_color: '#e9c582',
      })
      console.log(this.data.bar_color)
    }
    else if(app.globalData.backgroundColor == 'bg-HR'){
      this.setData({
        bar_color: '#6d5947',
      })
      console.log(this.data.bar_color)
    }
    else{
      this.setData({
        bar_color: '#00E2FF',
      })
      console.log(this.data.bar_color)
    }
    console.log(this.data.bar_color)
    console.log('111')
    this.setData({
      ec: {
        onInit: this.initPEChart
      },
    })
  },

  drawDiagram: function (diagram, year = 0) {
    var that = this
    console.log('开始画' + diagram)
    let token = app.getToken()
    if(token){
      if (diagram == '市盈率P/E') {
        console.log(that.data)
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
              // backgroundColor: '#4C4C4C',
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['P/E市盈率'],
                textStyle: {
                  color: 'black'
                }
              },
              xAxis: {
                data: category,
                axisLabel: {
                  interval: 0,
                  // rotate: -10
                  formatter: function (val) {
                    return val.split("").join("\n");
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'black'
                  }
                }
              },
              yAxis: {
                splitLine: { show: false },
                axisLine: {
                  lineStyle: {
                    color: 'black'
                  }
                }
              },
              series: [{
                name: 'P/E市盈率',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                  normal: {
                    barBorderRadius: 5,
                    color: that.data.bar_color
                  }
                },
                data: barData
              }]
            };
            mychart.setOption(option);
            return mychart;
          },
          complete: res => {
            wx.hideLoading()
          }
        })
      }
      else if (diagram == '市净率P/B') {
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
              return arr[1]
            }).slice(0, 5)
            barData.push(res.data.result['贵阳银行'][1])
            barData.push(res.data.result['行业平均'][1])
            console.log(category)
            console.log(barData)

            // option
            var option = {
              // backgroundColor: '#4C4C4C',
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['P/B市净率'],
                textStyle: {
                  color: 'black'
                }
              },
              xAxis: {
                data: category,
                axisLabel: {
                  interval: 0,
                  // rotate: -10
                  formatter: function (val) {
                    return val.split("").join("\n");
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'black'
                  }
                }
              },
              yAxis: {
                splitLine: { show: false },
                axisLine: {
                  lineStyle: {
                    color: 'black'
                  }
                }
              },
              series: [{
                name: 'P/B市净率',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                  normal: {
                    barBorderRadius: 5,
                    color: that.data.bar_color
                  }
                },
                data: barData
              }]
            };
            mychart.setOption(option);
            return mychart;
          },
          complete: res => {
            wx.hideLoading()
          }
        })
      }
      else if (diagram == '市现率PCF') {
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
              return arr[2]
            }).slice(0, 5)
            barData.push(res.data.result['贵阳银行'][2])
            barData.push(res.data.result['行业平均'][2])
            console.log(category)
            console.log(barData)

            // option
            var option = {
              // backgroundColor: '#4C4C4C',
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['PCF市现率'],
                textStyle: {
                  color: 'black'
                }
              },
              xAxis: {
                data: category,
                axisLabel: {
                  interval: 0,
                  // rotate: -10
                  formatter: function (val) {
                    return val.split("").join("\n");
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: 'black'
                  }
                }
              },
              yAxis: {
                splitLine: { show: false },
                axisLine: {
                  lineStyle: {
                    color: 'black'
                  }
                }
              },
              series: [{
                name: 'PCF市现率',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                  normal: {
                    barBorderRadius: 5,
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: that.data.bar_color // 0% 处的颜色
                      }, {
                          offset: 1, color: that.data.bar_color // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  }
                },
                data: barData
              }]
            };
            mychart.setOption(option);
            return mychart;
          },
          complete: res => {
            wx.hideLoading()
          }
        })
      }
      else if (diagram == '市销率P/S') {
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
              return arr[3]
            }).slice(0, 5)
            barData.push(res.data.result['贵阳银行'][3])
            barData.push(res.data.result['行业平均'][3])
            console.log(category)
            console.log(barData)

            // option
            var option = {
              // backgroundColor: '#4C4C4C',
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['P/S市销率'],
                textStyle: {
                  color: 'black'
                }
              },
              xAxis: {
                data: category,
                axisLabel: {
                  interval: 0,
                  // rotate: -10,
                  formatter: function (val) {
                    return val.split("").join("\n");
                  }
                },
                axisPointer: {
                  label: {
                    margin: 100,
                    color: 'red'
                  },
                },
                axisLine: {
                  lineStyle: {
                    color: 'black'
                  }
                }
              },
              yAxis: {
                splitLine: { show: false },
                axisLine: {
                  lineStyle: {
                    color: 'black'
                  }
                }
              },
              series: [{
                name: 'P/S市销率',
                type: 'bar',
                barWidth: 10,
                itemStyle: {
                  normal: {
                    barBorderRadius: 5,
                    color: that.data.bar_color
                  }
                },
                data: barData
              }]
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


  initPEChart(canvas, width, height) {
    var that = this;
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
          console.log(that.data.bar_color)
          // option
          var option = {
            backgroundColor: 'white',
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['P/E市盈率'],
              textStyle: {
                color: 'black'
              }
            },
            xAxis: {
              data: category,
              axisLabel: {
                interval: 0,
                // rotate: -10,
                margin: 10,
                formatter: function (val) {
                  return val.split("").join("\n");
                }
              },
              axisPointer: {
                label: {
                  margin: 100,
                  padding: [
                    25,
                    20,
                    20,
                    10,
                  ]
                }
              },
              axisLine: {
                lineStyle: {
                  color: 'black'
                }
              }
            },
            yAxis: {
              splitLine: { show: false },
              axisLine: {
                lineStyle: {
                  color: 'black'
                }
              }
            },
            series: [{
              name: 'P/E市盈率',
              type: 'bar',
              barWidth: 10,
              itemStyle: {
                normal: {
                  barBorderRadius: 5,
                  color: that.data.bar_color
                }
              },
              data: barData
            }]
          };
          mychart.setOption(option);
          return mychart;
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
  }

})