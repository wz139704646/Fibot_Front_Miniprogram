// pages/application/subjects/addSubject/addSubject.js
const subjectUtil = require('../util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newCode: '',
    newName: '',
    showPicker: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    let typeName = options.typeName
    // TODO 获取所有类别和当前类别下的所有科目信息

    // 样例数据
    var subjects =  [
      {
        title: '资产类',
        id: 0,
        subs: [
          {
            code: 1001,
            name: '库存现金'
          },
          {
            code: 1002,
            name: '银行存款'
          }
        ]
      },
      {
        title: '负债类',
        id: 1,
        subs: [
          {
            code: 2001,
            name: '短期借款'
          },
          {
            code: 2101,
            name: '交易性金融负债'
          }
        ]
      },
      {
        title: '权益类',
        id: 2,
        subs: [
          {
            code: 4001,
            name: '实收资本'
          },
          {
            code: 4002,
            name: '资本公积'
          }
        ]
      },
      {
        title: '成本类',
        id: 3,
        subs: [
          {
            code: 5001,
            name: '生产成本'
          },
          {
            code: 5101,
            name: '制造费用'
          }
        ]
      },
      {
        title: '损益类',
        id: 4,
        subs: [
          {
            code: 6001,
            name: '主营业务收入'
          },
          {
            code: 6051,
            name: '其他业务收入'
          }
        ]
      }
    ]
    // 提取类别名便于picker使用
    let typeNames = []
    for(var s of subjects) {
      typeNames.push(s.title)
    }
    for(var i in subjects) {
      subjects[i].subs = subjectUtil.setSubjectPickerText(subjects[i].subs)
    }
    this.setData({
      typeName: typeName,
      type: type,
      upperName: `${subjects[type].subs[0].code} ${subjects[type].subs[0].name}`,
      subs: subjects[type].subs,
      newCode: `${subjects[type].subs[0].code}01`,
      newName: `${subjects[type].subs[0].name}`,
      types: subjects,
      typeNames: typeNames
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 点击类别选择cell
  onChooseType: function(e) {
    this.setData({
      showPicker: true,
      modalName: 'type'
    })
  },

  // 点击上级科目选择cell
  onChooseUpper: function(e) {
    this.setData({
      showPicker: true,
      modalName: 'upper'
    })
  },

  onCodeInput: function(e) {
    this.setData({
      newCode: e.detail
    })
  },

  onNameInput: function(e) {
    this.setData({
      newName: e.detail
    })
  },

  onSubmit: function(e) {
    let that = this
    console.log('submit')
    var { typeName, upperName, newCode, newName} = this.data
    wx.showModal({
      title: '确认添加',
      content: `明细科目 ${newCode} ${newName} 将被添加到${typeName}${upperName}下，是否确认？`,
      success: function(res) {
        if(res.confirm) {
          wx.showLoading({
            title: '请求提交中',
            mask: true
          })
          // TODO 添加新的明细科目
          
          // 添加完毕，返回，将数据添加到上级页面
          var pages = getCurrentPages()
          var old = pages[pages.length-2]
          var {type, newCode, newName} = that.data
          wx.navigateBack({
            success: () => {
              // 在原页面的数据中新增一项
              var subject = old.data.subjects[type]
              var idx = subject.subs.findIndex((sub) => sub.code > newCode)
              idx = idx == -1 ? subject.subs.length : idx
              subject.subs.splice(idx, 0, {code: newCode, name: newName})
              old.setData({
                subjects: old.data.subjects
              })
            }
          })
        }
      },
      fail: function(err) {
        console.error('调起模态确认框失败', err)
      }
    })
  },

  onCancel: function(e) {
    wx.navigateBack({})
  },

  onModalClose: function(e) {
    this.setData({
      showPicker: false
    })
  },

  setType: function (typeId, typeName) {
    // TODO 通过typeId发起请求获取所有科目并保存在data.subs，并设置默认科目代码和名称

    let { types } = this.data
    this.setData({
      typeName: typeName,
      type: typeId,
      upperName: `${types[typeId].subs[0].code} ${types[typeId].subs[0].name}`,
      subs: types[typeId].subs,
      newCode: `${types[typeId].subs[0].code}01`,
      newName: `${types[typeId].subs[0].name}`
    })
  },

  setUpper: function (idx, text) {
    let { subs } = this.data
    this.setData({
      upperName: text,
      newCode: `${subs[idx].code}01`,
      newName: subs[idx].name
    })
  },

  onPickerConfirm: function(e) {
    console.log(e)
    var { modalName } = this.data
    const { value, index } = e.detail
    // picker类型为type选择时
    if(modalName == 'type') {
      this.setType(index, value)
    } else {
      this.setUpper(index, value.text)
    }
    this.onModalClose()
  },
})