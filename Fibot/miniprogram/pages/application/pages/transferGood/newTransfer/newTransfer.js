const app = getApp()
const util = require('../../../../../utils/util.js')
const host = app.globalData.requestHost
const getDate = function (page) {
  let date = util.getcurDateFormatString(new Date())
  // 设置日期属性
  page.setData({
    date: date
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toNum: 0,
    inStore: [],
    outStore: [],
    typeAndTotal:null,
    goodsList:[],
    storeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getDate(this)
    var that = this 
    that.getStoreList()
  },
  //获得仓库列表
  getStoreList(e) {
    wx.request({
      url: host + '/queryWarehouse',
      data: JSON.stringify({
        companyId: app.globalData.companyId,
      }),
      method: "POST",
      header: {
        "Content-Type": 'application/json'
      },
      success: res => {
        wx.showToast({
          title: '已获得仓库列表',
          icon: 'none',
          mask: true
        })
        console.log("仓库：")
        console.log(res)
        this.setData({
          storeList: res.data.result
        })
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  iPickerChange(e) {
    console.log(e)
    this.data.inStore[e.currentTarget.dataset.index]=e.detail.value
    this.setData({
      inStore: this.data.inStore
    })
  },
  oPickerChange(e) {
    console.log(e)
    this.data.outStore[e.currentTarget.dataset.index] = e.detail.value
    this.setData({
      outStore: this.data.outStore
    })
  },
  addDetail(e) {
    this.setData({
      toNum: this.data.toNum + 1
    })
  },
  delDetail(e) {
    console.log(e)
    this.data.inStore.splice(e.currentTarget.dataset.index, 1)
    this.data.outStore.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      inStore: this.data.inStore,
      outStore: this.data.outStore,
      toNum: this.data.toNum - 1
    })
  },
  delAllDetail(e) {
    this.setData({
      inStore: [],
      outStore: [],
      toNum: 0
    })
  },
  onSubmit(e){
    console.log(this.data)
  }
})