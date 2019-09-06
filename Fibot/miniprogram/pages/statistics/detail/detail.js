var date = new Date();
var curr_year = date.getFullYear();
Page({
  data:{
    records: [
      '1',
      '2',
      '3'
    ],
    month: 0,
    year: curr_year
  },
  onLoad: function (option) {
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // let eventChannel = this.getOpenerEventChannel();
    // eventChannel.on('acceptDataFromOpenerPage', function (data) {
    //   console.log(data.name)  
    //   console.log(data.year)
    // })
    var pages = getCurrentPages()
    let prev = pages[pages.length-2]
    console.log(prev.data.month)
    console.log(prev.data.passingData)
    this.setData({
      records: prev.data.passingData,
      month: prev.data.month,
      year: curr_year,
      chartName: prev.data.chartName
    })
  }
})