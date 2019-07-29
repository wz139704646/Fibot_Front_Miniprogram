// miniprogram/pages/application/voucher/addVoucher/addVoucher.js
const app = getApp()
const util = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  // 获取新增凭证的默认编号
  // 参数 date: 新增凭证的日期字符串
  getDefaultNo: function(date) {
    // 例
    return '0001'
  },

  // 进入该页面时默认的数据设置
  setDefaultData: function(e){
    let date = util.getcurDateFormatString(new Date())
    let no = this.getDefaultNo(date)
    let entries = [
      {
        subject: {},
        abstract: '',
        total: 0,
        cd: '借'
      },
      {
        subject: {},
        abstract: '',
        total: 0,
        cd: '贷'
      }
    ]
    this.setData({
      date: date,
      no: no,
      entries: entries,
      numOfAttachments: 0,
      attachments: [],
      activeNames: []
    })
  },

  // 计算真正的总金额（包含正负）
  calTotal: function(entry) {
    let total = Math.abs(entry.total)
    let cd = entry.cd
    if(cd == '贷') {
      return -total
    } else if(cd == '借') {
      return total
    } else {
      return entry.total
    }
  },

  // 检查entries中的每一项是否是正确的输入，以及借贷是否平衡
  checkEntries: function(entries) {
    let completed = entries.every( (entry) =>  (entry.subject && entry.subject.code!=undefined
      && entry.subject.name && entry.abstract && entry.total!=0 && entry.cd) )
    let total = entries.reduce((tot, cur) => tot+this.calTotal(cur), 0)
    let correct = total == 0
    return completed && correct
  },

  // 计算凭证的金额
  calVoucherTotal: function(entries) {
    return entries.reduce((tot, cur) => cur.cd == '借' ? tot+Math.abs(cur.total) : tot)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setDefaultData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  DateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  onNoInput: function(e) {
    this.setData({
      no: e.detail.value
    })
  },

  onCollapseChange: function(e) {
    this.setData({
      activeNames: e.detail
    })
  },

  onAbstractInput: function(e) {
    let idx = e.currentTarget.dataset.idx
    let value = e.detail.value
    this.setData({
      [`entries[${idx}].abstract`]: value
    })
  },

  onTotalInput: function(e) {
    let idx = e.currentTarget.dataset.idx
    let value = parseFloat(e.detail.value)
    console.log(value, e.detail.value)
    value = value || 0
    this.setData({
      [`entries[${idx}].total`]: value
    })
  },

  onSubjectSelect: function(e) {
    // 跳到科目表界面，进行科目选择
    let idx = e.currentTarget.dataset.idx
    let datafor = `entries[${idx}].subject`
    wx.navigateTo({
      url: `../../subjects/subjects/subjects?datafor=${datafor}`,
    })
  },

  onTotalAutoChange: function(e) {
    // 金额的性质自动改变
    let type = e.currentTarget.dataset.type
    let idx = e.currentTarget.dataset.idx
    // 改变项在data中的路径
    let path = `entries[${idx}]`
    if(type == '借' || type == '贷') {
      // 简单的 借 贷 的改变时仅改变 cd 属性
      this.setData({
        [path+'.cd']: type
      })
    } else if(type == '平') {
      // 平 代表自动计算，根据其他所有项的金额进行计算
      var entries = this.data.entries
      var total = 0
      var cd = this.data.entries[idx].cd
      for(let i in entries) {
        if(i!=idx)
          total += this.calTotal(entries[i])
      }
      if(total > 0){
        cd = '贷'
      } else if(total<0) {
        cd = '借'
      }
      this.setData({
        [path+'.cd'] : cd,
        [path+'.total'] : Math.abs(total)
      })
    }
  },

  onEntryDelete: function(e) {
    let idx = e.currentTarget.dataset.idx
    let {entries} = this.data
    entries.splice(idx, 1)
    this.setData({
      entries
    })
  },

  addEntry: function(e) {
    let {entries} = this.data
    entries.push({
      abstract: '',
      subject: {},
      total: 0,
      cd: '借'
    })
    this.setData({
      entries
    })
  },

  onSave: function(e) {
    let { entries, date, no, numOfAttachments, attachments } = this.data
    if(!no || !date || !this.checkEntries(entries)) {
      let errMsg = '出错了！'
      if(!no) {
        errMsg = '凭证编号未输入'
      } else if(!date) {
        errMsg = '日期未输入'
      } else {
        errMsg = '分录信息有误！'
      }
      wx.showToast({
        title: errMsg,
        icon: 'none',
        duration: 1000
      })
    } else {
      // 凭证信息初步检查未出错
      var total = this.calVoucherTotal(entries)

      // TODO 发送添加凭证的请求
      
      // 将新增的凭证加回凭证页面
      
    }
  },

  onCancel: function(e) {
    wx.showModal({
      title: '返回',
      content: '凭证未保存，确认返回？',
      success: function(res) {
        if(res.confirm) {
          wx.navigateBack({})
        }
      }
    })
  }
})