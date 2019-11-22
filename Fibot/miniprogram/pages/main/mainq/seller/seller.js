const app = getApp();
var wxCharts = require('../../../../utils/wxcharts-min.js');
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase
var pieChart = null;
var arr = null;
var lineChart = null;
var chartType = "";
var startPos = null;
var date = new Date();
var curr_year = date.getFullYear();
var curr_month = date.getMonth() + 1
var windowWidth = wx.getSystemInfoSync().windowWidth - 15
const mainBase = app.globalData.mainBase
Page({
  data: {
    backgroundColor:'',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showIconList: [{
      icon: 'shop',
      color: 'red',
      badge: 0,
      name: '销售记录',
      url: applicationBase+"/pages/sellList/sellList?fun=null"
    }, {
      icon: 'friendadd',
      color: 'orange',
      badge: 0,
      name: '新增客户',
      url: applicationBase+"/pages/newCustomer/newCustomer"
    }, {
      icon: 'peoplelist',
      color: 'yellow',
      badge: 0,
      name: '客户列表',
      url: applicationBase+"/pages/customerList/customerList"
    }, {
      icon: 'cart',
      color: 'olive',
      badge: 0,
      name: '销售开单',
      url: applicationBase+"/pages/sellBill/sellBill"
      }, {
        icon: 'sponsor',
        color: 'red',
        badge: 0,
        name: '收款记录',
        url: applicationBase + '/pages/ar/receipts/receipts'
      }, {
        icon: 'sponsor',
        color: 'orange',
        badge: 0,
        name: '付款记录',
        url: applicationBase + '/pages/ap/payments/payments'
      }

    ],

    addIconList: [{
      icon: 'shop',
      color: 'red',
      badge: 0,
      name: '销售记录',
      url: applicationBase + "/pages/sellList/sellList?fun=null"
    }, {
      icon: 'friendadd',
      color: 'orange',
      badge: 0,
      name: '新增客户',
      url: applicationBase + "/pages/newCustomer/newCustomer"
    }, {
      icon: 'peoplelist',
      color: 'yellow',
      badge: 0,
      name: '客户列表',
      url: applicationBase + "/pages/customerList/customerList"
    }, {
      icon: 'cart',
      color: 'olive',
      badge: 0,
      name: '销售开单',
      url: applicationBase + "/pages/sellBill/sellBill"
      }, {
        icon: 'sponsor',
        color: 'red',
        badge: 0,
        name: '收款记录',
        url: applicationBase + '/pages/ar/receipts/receipts'
      }, {
        icon: 'sponsor',
        color: 'orange',
        badge: 0,
        name: '付款记录',
        url: applicationBase + '/pages/ap/payments/payments'
      },
    ],

    statis: [{
      title: '销售趋势分析',
      showMonth: false,
      showPeriod: true,
      period: [{
        title: '本日'
      },
      {
        title: '本月'
      },
      {
        title: '本年'
      }
      ],
      showIdx: 0
    },
    ]
  },

  touchHandler: function (e) {
    console.log(this.data)
    if (chartType == 'pie') {
      wx.showModal({
        content: arr[pieChart.getCurrentDataIndex(e)].name + '销售收入为' + arr[pieChart.getCurrentDataIndex(e)].data + '元',
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

  drawDiagram: function (year, month = 0) {
    console.log("开始画图！")
    let token = app.getToken()
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
        'Content-Type': 'application/json',
        'Authorization': token
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
            title: '销售趋势分析',
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
    this.drawDiagram(2019)
  },

  onShow: function () {
    console.log('财务人员')
  },

  NavToTalk(e) {
    wx.navigateTo({
      url: applicationBase+'/pages/start/start',
    })
    console.log("navigate")
  },

  chooseDayOrMonth: function (e) {
    wx.showLoading({
      title: '画图中',
      mask: true
    })
    let stat = e.currentTarget.dataset.stat
    let per = e.currentTarget.dataset.per
    let statis = this.data.statis
    let token = app.getToken()
    statis.showIdx = per
    console.log(per)
    console.log(statis.period[per].title)
    console.log(statis.title)
    this.setData({
      statis: statis
    })
    if (token) {
      if (statis.title == '销售趋势分析') {
        if (statis.period[per].title == '本月') {
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
              'Content-Type': 'application/json',
              'Authorization': token
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
                  title: '销售趋势分析',
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
          this.drawDiagram(curr_year)
        }
        else if (statis.period[per].title == '总计') {
          chartType = 'pie'
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
              console.error("未成功获取到销售趋势数据")
            },
            complete: res => {
              wx.hideLoading()
            }
          })
        }
      }
    }
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

  //工具方法
  getNumberOfDays: function (month) {
    var one_date = new Date()
    one_date.setMonth(month)
    one_date.setDate(0)
    return one_date.getDate()
  },

  getCurrMonthDays: function (e) {
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

  NavMy(e) {
    wx.redirectTo({
      url: mainBase + '/my/home/home?position=seller',
    })
  },

})