var date = new Date();
var curr_year = date.getFullYear();
Page({
  data: {
    records: [
      '1',
      '2',
      '3'
    ],
    month: 0,
    year: curr_year,
    category: '未获取'
  },
  onLoad: function (option) {
    var pages = getCurrentPages()
    let prev = pages[pages.length - 2]
    this.setData({
      records: prev.data.totalRecords,
      category: prev.data.category
    })
  }
})