const app = getApp()
const host = app.globalData.requestHost
const util = require('../../../../../utils/util.js')
const initPage = function (page) {
  let date = util.getcurDateFormatString(new Date())
  page.setData({
    date: date
  })
}
Page({

  data: {
    name:'',
    pieces:'',
    indexOfDepreciation:'',
    count:'',
    initial_value:'',
    estimated_useful_life:'',
    depreciation: ["年限平均法", "工作量法", "年数总和法", "双倍余额递减法", "一次扣除法"]
  },

  onLoad: function (options) {
    initPage(this)
  },

  nameChange(e){
    this.setData({
      name:e.detail.value
    })
  },

  piecesChange(e){
    this.setData({
      pieces:e.detail.value
    })
  },

  depreciationChange(e){
    this.setData({
      indexOfDepreciation:e.detail.value
    })
  },

  countChange(e) {
    this.setData({
      count: e.detail.value
    })
  },

  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  initial_valueChange(e) {
    this.setData({
      initial_value: e.detail.value
    })
  },

  estimated_useful_lifeChange(e){
    this.setData({
      estimated_useful_life:e.detail.value
    })
  },

  onSubmit(e){
    var that = this
    console.log(this.data)
    var name = this.data.name
    var pieces = this.data.pieces
    var indexOfDepreciation = this.data.indexOfDepreciation
    var count = this.data.count
    var initial_value = this.data.initial_value
    if(!name||!pieces||!indexOfDepreciation||!count||!initial_value){
      wx.showModal({
        content: '请输入完整信息',
        showCancel:false
      })
    }else{
      wx.showModal({
        content: '确认添加固定资产'+name,
        success(res){
          if(res.confirm){
            that.addFixedAsset()
          }
        }
      })   
    }
  },

  addFixedAsset(e){
    const token = app.getToken()
    var name = this.data.name
    var pieces = this.data.pieces
    var indexOfDepreciation = this.data.indexOfDepreciation
    var depreciation = this.data.depreciation
    var count = this.data.count
    var initial_value = this.data.initial_value
    var estimated_useful_life = this.data.estimated_useful_life
    wx.request({
      url: host + '/FixedAssets',
      data:JSON.stringify({
        company_id:app.globalData.companyId,
        asset_type:"固定资产",
        asset_name:name,
        pieces:pieces,
        depreciation:depreciation[indexOfDepreciation],
        count:count,
        initial_value:initial_value,
        estimated_useful_life: estimated_useful_life
      }),
      method:"POST",
      header: {
        "Content-Type": 'application/json',
        'Authorization': token
      },
      success(res){
        console.log(res)
        wx.showToast({
          title: '添加成功',
          mask:true,
          icon:'none'
        })
        wx.redirectTo({
          url: '/pages/main/main/main',
        })
      },
      fail(err){
        console.log(err)
      }
    })
  },

  onCancel(e){
    wx.redirectTo({
      url: '/pages/main/main/main',
    })
  }



})