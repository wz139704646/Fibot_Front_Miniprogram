const app = getApp()
const host = app.globalData.requestHost
const applicationBase = app.globalData.applicationBase
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    resultList:[],
    isClick: false,
    hasData: 0,
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0
  },
  onLoad: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate(),
      host:host
    })
    //this.getSellRecommendDate()
  },
  onReady(){
    this.setData({
      backgroundColor: app.globalData.backgroundColor
    })
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                       //需要遍历的日历数组数据
    let arrLen = 0;                         //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay();                          //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },

  selectDay(e){
    console.log(e)
    this.setData({
      isToday:e.currentTarget.dataset.istoday,

    })
    var dataset = e.currentTarget.dataset
    var year = dataset.year
    var month = dataset.month
    var datenum = parseInt(dataset.datenum)
    var datenum1 = datenum + 1
    if(String(month).length==1){
      month = "0" + String(month)
    }
    //console.log(String(month).length)
    if(String(datenum).length==1){
      datenum = "0" + String(datenum)
    }
    //console.log(datenum)
    if (String(datenum1).length == 1) {
      datenum1 = "0" + String(datenum1)
    }
    var date = year + "-" + month + "-" + datenum + " 00:00:00"
    var date1 = year + "-" + month + "-" + datenum + " 00:00:00"
    this.getSellRecommend(date,date1)
  },

  getSellRecommend(date,date1) {
    var token = app.getToken()
    var that = this
    wx.request({
      url: host + '/sell_recommend',
      method: "POST",
      data: JSON.stringify({
        from_date:date,
        to_date:date1
      }),
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success: res => {
        console.log(res)
        var hasData = res.data.result.length
        that.setData({
          resultList: res.data.result,
          hasData: hasData,
          isClick:true
        })
      }
    })
  },

  getSellRecommendDate(e) {
    var that = this
    var token = app.getToken()
    wx.request({
      url: host + '/sell_recommend_date',
      method: "POST",
      data: JSON.stringify({
      }),
      header: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      success: res => {
        console.log(res)
      }
    })
  },

  navigateToGoodInfo(e) {
    console.log(e)
    console.log("查看详情")
    wx.navigateTo({
      url: applicationBase + '/pages/goodInfo/goodInfo?id=' + e.currentTarget.dataset.id,
    })
  },
  
})