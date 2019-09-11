var date = new Date();
var curr_year = date.getFullYear();
Page({
  data: {
    records: [
      '该月没有任何采购记录'
    ],
    month: 0,
    year: curr_year,
    category: '未获取'
  },
  onLoad: function (option) {
    var pages = getCurrentPages()
    let prev = pages[pages.length - 2]
    this.setData({
      records: Object.values(prev.data.totalRecords),
      category: prev.data.category
    })
    console.log(this.data.records)
  }
})