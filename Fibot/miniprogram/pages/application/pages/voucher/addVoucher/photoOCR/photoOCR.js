// miniprogram/pages/application/pages/voucher/addVoucher/photoOCR/photoOCR.js
const app = getApp()
const util = require('../../../../../../utils/util.js')
const callOCR = util.callOCR

Page({

  /**
   * 页面的初始数据
   */
  data: {
    OCRTypes: [
      {
        text: '增值税发票（整票）',
        action: 'VatInvoice'
      },
      {
        text: '增值税发票（卷票）',
        action: 'VatRollInvoice'
      },
      {
        text: '火车票',
        action: 'TrainTicket'
      },
      {
        text: '出租车发票',
        action: 'TaxiInvoice'
      },
      {
        text: '汽车票',
        action: 'BusInvoice'
      },
      {
        text: '轮船票',
        action: 'ShipInvoice'
      },
      {
        text: '机票行程单',
        action: 'FlightInvoice'
      },
      {
        text: '过路过桥费发票',
        action: 'TollInvoice'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: options.urlsKey,
      success: function (res) {
        let photoInfos = []
        let urls = res.data
        for (let url of urls) {
          photoInfos.push({ url })
        }
        that.setData({
          photoInfos
        }, () => {
          wx.removeStorage({
            key: options.urlsKey,
            success: function(res) {
              console.log('清除图片url缓存')
            },
            fail: function(res) {
              console.log('缓存异常，清除图片url失败')
            }
          })
        })
      },
      fail: function(err) {
        console.log('获取图片url缓存失败', err)
        wx.showToast({
          title: '缓存异常',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 获取该页面中所有显示的图片的url数组
  getPhotoUrls: function () {
    let urls = []
    let { photoInfos } = this.data
    for (let info of photoInfos) {
      urls.push(info.url)
    }

    return urls
  },

  // 获取该页面中每张图片的识别结果所产生的凭证项数组
  getEntries: function () {
    let entries = []
    let {photoInfos} = this.data
    for (let info of photoInfos) {
      if(info.entries) {
        entries = entries.concat(info.entries)
      }
    }

    return entries
  },

  // 获取该页面中每张图片识别结果产生的金额文本数组
  getTotalText: function () {
    let texts = []
    let {photoInfos} = this.data
    for (let info of photoInfos) {
      if(info.totalText) {
        texts = texts.concat(info.totalText)
      }
    }

    return texts
  },

  // 处理 增值税发票（整票）的方法
  processVatInvoice: function (photoidx, result, callback) {
    let infos = result['VatInvoiceInfos']
    let { photoInfos } = this.data
    // 找到服务名称项，金额项，税额项
    let itemIdx = infos.findIndex(item => {
      return item.Name == '货物或应税劳务、服务名称' ||
        item.Name == '项目名称' ||
        item.Name == '货物或应税劳务名称'
    })
    let totalIdx = infos.findIndex(item => item.Name == '金额')
    let taxIdx = infos.findIndex(item => item.Name == '税额')
    let abstract = itemIdx == -1 ? '' : infos[itemIdx].Value
    let taxAbstract = '增值税'
    let total = itemIdx == -1 ? 0 : parseFloat(infos[totalIdx].Value)
    let taxTotal = taxIdx == -1 ? 0 : parseFloat(infos[taxIdx].Value)
    // 将相关内容加入相应图片的凭证项中
    photoInfos[photoidx].entries = []
    photoInfos[photoidx].totalText = []
    // 服务费
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '借'
    })
    // 税额
    photoInfos[photoidx].entries.push({
      abstract: taxAbstract,
      subject: {},
      total: taxTotal,
      credit_debit: '借'
    })
    // 合计
    photoInfos[photoidx].entries.push({
      abstract: taxAbstract,
      subject: {},
      total: taxTotal + total,
      credit_debit: '贷'
    })
    photoInfos[photoidx].totalText.push('' + total)
    photoInfos[photoidx].totalText.push('' + taxTotal)
    photoInfos[photoidx].totalText.push('' + (taxTotal + total))
  },

  // 处理 增值税发票（卷票）的方法
  processVatRollInvoice: function (photoidx, result, callback) {
    let infos = result['VatRollInvoiceInfos']
    let { photoInfos } = this.data
    // 找到金额项
    let totalIdx = infos.findIndex(item => item.Name == '小写金额')
    let total = totalIdx == -1 ? 0 : parseFloat(infos[totalIdx].Value)
    photoInfos[photoidx].entries = []
    photoInfos[photoidx].totalText = []
    // 借方
    photoInfos[photoidx].entries.push({
      abstract: '增值税发票（卷票）',
      subject: {},
      total: total,
      credit_debit: '借'
    })
    // 贷方
    photoInfos[photoidx].entries.push({
      abstract: '增值税发票（卷票）',
      subject: {},
      total: total,
      credit_debit: '贷'
    })
    photoInfos[photoidx].totalText.push(''+total)
    photoInfos[photoidx].totalText.push('' + total)
  },

  // 处理 火车票 的方法
  processTrainTicket: function (photoidx, result, callback) {
    let infos = result
    let { photoInfos } = this.data
    // 找到出发站，到达站，金额和座位种类
    let { StartStation, DestinationStation, SeatCategory, Price} = infos
    let abstract = StartStation + '至' + DestinationStation + SeatCategory + '火车票'
    let total = parseFloat(Price)
    photoInfos[photoidx].entries = []
    photoInfos[photoidx].totalText = []
    // 借方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '借'
    })
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '贷'
    })
    // 贷方
    photoInfos[photoidx].totalText.push(''+total)
    photoInfos[photoidx].totalText.push('' + total)
  },

  // 处理 出租车发票 的方法
  processTaxiInvoice: function (photoidx, result, callback) {
    let infos = result
    let { photoInfos } = this.data
    // 找到距离和价格信息
    let { Fare, Distance} = infos
    let abstract = `乘出租车(${Distance}公里)`
    let total = parseFloat(Fare)
    photoInfos[photoidx].entries = []
    photoInfos[photoidx].totalText = []
    // 借方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '借'
    })
    // 贷方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '贷'
    })
    photoInfos[photoidx].totalText.push('' + total)
    photoInfos[photoidx].totalText.push('' + total)
  },

  // 处理 汽车票 的方法
  processBusInvoice: function (photoidx, result, callback) {
    let infos = result['BusInvoiceInfos']
    let { photoInfos } = this.data
    // 找到始发地，目的地和票价
    let startIdx = infos.findIndex(item => item.Name == '始发地' || item.Name == '始发站' || item.Name == '起始站')
    let destIdx = infos.findIndex(item => item.Name == '目的地' || item.Name == '目的站' || item.Name == '终点站')
    let totalIdx = infos.findIndex(item => item.Name == '票价')
    let start = startIdx == -1 ? '？' : infos[startIdx].Value
    let dest = destIdx == -1 ? '?' : infos[destIdx].Value
    let total = totalIdx == -1 ? 0 : parseFloat(infos[totalIdx].Value)
    let abstract = `${start}至${dest}汽车票`
    photoInfos[photoidx].entries = []
    photoInfos[photoidx].totalText = []
    // 借方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '借'
    })
    // 贷方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '贷'
    })
    photoInfos[photoidx].totalText.push('' + total)
    photoInfos[photoidx].totalText.push('' + total)
  },

  // 处理 轮船票 的方法
  processShipInvoice: function (photoidx, result, callback) {
    let infos = result['ShipInvoiceInfos']
    let { photoInfos } = this.data
    // 找到始发地，目的地和票价
    let startIdx = infos.findIndex(item => item.Name == '始发地' || item.Name == '始发站' || item.Name == '起始站')
    let destIdx = infos.findIndex(item => item.Name == '目的地' || item.Name == '目的站' || item.Name == '终点站')
    let totalIdx = infos.findIndex(item => item.Name == '票价')
    let start = startIdx == -1 ? '？' : infos[startIdx].Value
    let dest = destIdx == -1 ? '?' : infos[destIdx].Value
    let total = totalIdx == -1 ? 0 : parseFloat(infos[totalIdx].Value)
    let abstract = `${start}至${dest}轮船票`
    photoInfos[photoidx].entries = []
    photoInfos[photoidx].totalText = []
    // 借方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '借'
    })
    // 贷方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '贷'
    })
    photoInfos[photoidx].totalText.push('' + total)
    photoInfos[photoidx].totalText.push('' + total)
  },

  // 处理 机票行程单 的方法
  processFlightInvoice: function (photoidx, result, callback) {
    let infos = result['FlightInvoiceInfos']
    let { photoInfos } = this.data
    // 找到始发地，目的地和票价
    let startIdx = infos.findIndex(item => (item.Name == '始发地' || item.Name == '始发站' || item.Name == '起始站'))
    let destIdx = infos.findIndex(item => (item.Name == '目的地' || item.Name == '目的站' || item.Name == '终点站'))
    let totalIdx = infos.findIndex(item => item.Name == '合计金额')
    let start = startIdx == -1 ? '？' : infos[startIdx].Value
    let dest = destIdx == -1 ? '?' : infos[destIdx].Value
    let total = totalIdx == -1 ? 0 : parseFloat(infos[totalIdx].Value)
    let abstract = `${start}至${dest}机票`
    photoInfos[photoidx].entries = []
    photoInfos[photoidx].totalText = []
    // 借方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '借'
    })
    // 贷方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '贷'
    })
    photoInfos[photoidx].totalText.push('' + total)
    photoInfos[photoidx].totalText.push('' + total)
  },

  // 处理 过路费过桥发票 的方法
  processTollInvoice: function (photoidx, result, callback) {
    let infos = result['TollInvoiceInfos']
    let { photoInfos } = this.data
    // 找到始发地，目的地和票价
    let entranceIdx = infos.findIndex(item => item.Name == '入口')
    let exitIdx = infos.findIndex(item => item.Name == '出口')
    let totalIdx = infos.findIndex(item => item.Name == '金额')
    let entrance = entranceIdx == -1 ? '？' : infos[entranceIdx].Value
    let exit = exitIdx == -1 ? '?' : infos[exitIdx].Value
    let total = totalIdx == -1 ? 0 : parseFloat(infos[totalIdx].Value)
    let abstract = `${entrance}到${exit}过路过桥费`
    photoInfos[photoidx].entries = []
    photoInfos[photoidx].totalText = []
    // 借方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '借'
    })
    // 贷方
    photoInfos[photoidx].entries.push({
      abstract: abstract,
      subject: {},
      total: total,
      credit_debit: '贷'
    })
    photoInfos[photoidx].totalText.push('' + total)
    photoInfos[photoidx].totalText.push('' + total)
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

  preview: function (e) {
    console.log(e)
    let idx = e.currentTarget.dataset.index
    let urls = this.getPhotoUrls()
    console.log(idx)
    wx.previewImage({
      urls: urls,
      current: urls[idx]
    })
  },

  // 重新选择某张图片，以进入页面时的选取图片方式
  reselect: function (e) {
    console.log('重新选择图片')
    let idx = e.currentTarget.dataset.index
    // 获取进入页面时的照片选取方式
    let { method } = this.options
    console.log(method)
    let { photoInfos } = this.data
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [method],
      success: function (res) {
        let { tempFilePaths } = res
        photoInfos[idx].url = tempFilePaths[0]
        that.setData({ photoInfos })
      }
    })
  },

  onSubjectSelect: function (e) {
    // 跳到科目表界面，进行科目选择
    console.log(e)
    let {photoidx, entryidx} = e.currentTarget.dataset
    let datafor = `photoInfos[${photoidx}].entries[${entryidx}].subject`
    let that = this
    wx.navigateTo({
      url: `../../../subjects/subjects/subjects?datafor=${datafor}`,
    })
  },

  // 点击某一张图片的票据类型选择
  onOCRTypeSelect: function (e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      showOCRTypes: true,
      curPhotoIdx: idx
    })
  },

  // 处理OCR识别得到的结果
  processOCRResult: function (photoidx, action, result, callback) {
    let { photoInfos } = this.data
    this[`process${action}`](photoidx, result, callback)
    this.setData({photoInfos}, callback)
  },

  // 对某张图片进行OCR
  onOCR: function (e) {
    let idx = e.currentTarget.dataset.idx
    let that = this
    let { photoInfos } = this.data
    let { url, ocrType } = photoInfos[idx]
    if (!ocrType) {
      wx.showToast({
        title: '请选择票据类型',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.showLoading({
      title: '识别中',
    })
    callOCR(url, ocrType.action + 'OCR', (_res) => {
      wx.hideLoading()
      console.log(idx, '识别结果', _res)
      let data = _res.result.Response
      if (data.Error) {
        wx.showToast({
          title: '识别失败，类型不匹配或无法识别该样式票据',
          icon: 'none',
          duration: 2000
        })
        console.log('图片识别失败', data.Error)
        that.setData({
          [`photoInfos[${idx}].recognized`]: true,
          [`photoInfos[${idx}].recogSuc`]: false
        })
      } else {
        that.processOCRResult(idx, ocrType.action, data, () => {
          that.setData({
            [`photoInfos[${idx}].recognized`]: true,
            [`photoInfos[${idx}].recogSuc`]: true
          })
        })
      }
    })
  },

  // 关闭票据类型选择模态框
  onModalClose: function (e) {
    this.setData({
      showOCRTypes: false
    })
  },

  // 确认选择票据类型
  onOCRTypeConfirm: function (e) {
    let { OCRTypes, curPhotoIdx } = this.data
    this.setData({
      showOCRTypes: false,
      [`photoInfos[${curPhotoIdx}].ocrType`]: OCRTypes[e.detail.index],
    })
  },

  onAbstractInput: function(e) {
    let {photoidx, entryidx} = e.currentTarget.dataset
    let value = e.detail.value
    this.setData({
      [`photoInfos[${photoidx}].entries[${entryidx}].abstract`]: value,
    })
  },

  onTotalInput: function(e) {
    let { photoidx, entryidx } = e.currentTarget.dataset
    let value = parseFloat(e.detail.value)
    value = value || 0
    this.setData({
      [`photoInfos[${photoidx}].entries[${entryidx}].total`]: value,
      [`photoInfos[${photoidx}].totalText[${entryidx}]`]: e.detail.value,
    })
  },

  onTotalAutoChange: function(e) {
    let type = e.currentTarget.dataset.type
    let {photoidx, entryidx} = e.currentTarget.dataset
    let path = `photoInfos[${photoidx}].entries[${entryidx}]`
    // 修改对应项的 credit_debit 属性
    this.setData({
      [path + '.credit_debit']: type,
    })
  },

  onSave: function(e) {
    // 将识别结果与填入结果保存回添加凭证页面
    let urls = this.getPhotoUrls()
    let pages = getCurrentPages();
    let oldPage = pages[pages.length-2]
    let { entryPushTarget, totalPushTarget, urlsKey, inplace} = this.options
    let entries = []
    let totalTexts = []
    if (inplace == 'false') {
      entries = oldPage.data[entryPushTarget]
      totalTexts = oldPage.data[totalPushTarget]
    }
    // 分别加入分录、金额文本、附件图片
    entries = entries.concat(this.getEntries())
    totalTexts = totalTexts.concat(this.getTotalText())
    oldPage.addAttachments(this.getPhotoUrls())
    oldPage.setData({
      [entryPushTarget]: entries,
      [totalPushTarget]: totalTexts,
      entryModified: true
    }, () => {
      wx.showToast({
        title: '保存成功',
        icno: 'success',
        duration: 2000
      })
      wx.navigateBack({})
    })
  },

  onCancel: function(e) {
    wx.showModal({
      title: '返回',
      content: '识别结果保存，确认返回？',
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({})
        }
      }
    })
  }

})