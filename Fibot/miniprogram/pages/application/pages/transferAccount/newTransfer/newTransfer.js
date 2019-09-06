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
    toNum:0,
    //account:["支付宝","微信","现金","刷卡","会员卡","抹零","挂账","订金","优惠劵"],
    inAcc:[],
    outAcc:[],
    amount:[],
    remarks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getDate(this)
  },
  DateChange(e){
    console.log(e)
    this.setData({
      date:e.detail.value
    })
  },
  amountChange(e){
    console.log(e)
    this.data.amount[e.currentTarget.dataset.index] = e.detail.value
    this.setData({
      amount:this.data.amount
    })
  },
  remarkChange(e){
    console.log(e)
    this.data.remarks[e.currentTarget.dataset.index] = e.detail.value
    this.setData({
      remarks: this.data.remarks
    })
  },
  addDetail(e){
    this.setData({
      toNum:this.data.toNum+1
    })
  },
  delDetail(e){
    console.log(e)
    this.data.inAcc.splice(e.currentTarget.dataset.index,1)
    this.data.outAcc.splice(e.currentTarget.dataset.index, 1)
    this.data.amount.splice(e.currentTarget.dataset.index, 1)
    this.data.remarks.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      inAcc:this.data.inAcc,
      outAcc:this.data.outAcc,
      amount:this.data.amount,
      remarks:this.data.remarks,
      toNum:this.data.toNum-1
    })
  },
  delAllDetail(e){
    this.setData({
      inAcc: [],
      outAcc: [],
      amount: [],
      remarks: [],
      toNum: 0
    })
  },
  addTransfer(e){
    
  },
  onSubmit(e){
    var that = this
    for(var i=0;i<this.data.toNum;i++){
      if(this.data.inAcc[i]==null||this.data.outAcc[i]==null||this.data.amount[i]==null){
        wx.showModal({
          title: '资金转账单',
          content: '请填写必要信息',
          showCancel: false
        })
      }
    } 
  }
})