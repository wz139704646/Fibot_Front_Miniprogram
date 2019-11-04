// miniprogram/pages/application/voucher/addVoucher/addVoucher.js
const app = getApp()
const util = require('../../../../../utils/util.js')
const host = app.globalData.requestHost
// const callOCR = util.callOCR

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // picTypes: [
    //   { name: '增值税发票', value: 'VatInvoice'},
    //   { name: '金融票据整单', value: 'FinanBill'}
    // ],
    voucher_no: '',
    entryModified: false
  },

  // 获取新增凭证的默认编号
  // 参数 date: 新增凭证的日期字符串
  getDefaultNo: function(date) {
    let datestrs = date.split('-')
    datestrs.splice(2, 1)
    let datestr = datestrs.join('')
    this.setData({
      voucher_no_prefix: datestr
    })
  },

  // 进入该页面时默认的数据设置
  setDefaultData: function(e){
    let date = util.getcurDateFormatString(new Date())
    this.getDefaultNo(date)
    let entries = [
      {
        subject: {},
        abstract: '',
        total: 0,
        credit_debit: '借'
      },
      {
        subject: {},
        abstract: '',
        total: 0,
        credit_debit: '贷'
      }
    ]
    let totalText = ["", ""]
    this.setData({
      date: date,
      entries: entries,
      attachments_number: 0,
      attachments: [],
      activeNames: [],
      totalText
    })
  },

  // 计算真正的总金额（包含正负）
  calTotal: function(entry) {
    let total = Math.abs(entry.total)
    let cd = entry.credit_debit
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
    let completed =entries.length>0 && entries.every( 
        (entry) =>  (entry.subject && entry.subject.subject_code!=undefined
        && entry.subject.name && entry.abstract && entry.total!=0 && entry.credit_debit)
      )
    let total = entries.reduce((tot, cur) => tot+this.calTotal(cur), 0)
    let correct = total == 0
    return completed && correct
  },

  // 计算凭证的金额
  calVoucherTotal: function(entries) {
    return entries.reduce((tot, cur) => cur.credit_debit == '借' ? tot+cur.total : tot, 0)
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

  addAttachments: function(newAttachments) {
    let {attachments, attachments_number} = this.data
    attachments = attachments.concat(newAttachments)
    attachments_number += newAttachments.length
    this.setData({attachments, attachments_number})
  },

  DateChange: function(e) {
    this.setData({
      date: e.detail.value
    }, () => {
      this.getDefaultNo(e.detail.value)
    })
  },

  onNoInput: function(e) {
    this.setData({
      voucher_no: e.detail.value,
      entryModified: true
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
      [`entries[${idx}].abstract`]: value,
      entryModified: true
    })
  },

  onTotalInput: function(e) {
    let idx = e.currentTarget.dataset.idx
    let value = parseFloat(e.detail.value)
    console.log(value, e.detail.value)
    value = value || 0
    this.setData({
      [`entries[${idx}].total`]: value,
      [`totalText[${idx}]`]: e.detail.value,
      entryModified: true
    })
  },

  onSubjectSelect: function(e) {
    // 跳到科目表界面，进行科目选择
    let idx = e.currentTarget.dataset.idx
    let datafor = `entries[${idx}].subject`
    let that = this
    wx.navigateTo({
      url: `../../subjects/subjects/subjects?datafor=${datafor}`,
      success: () => {
        that.setData({
          entryModified: true
        })
      }
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
        [path+'.credit_debit']: type,
        entryModified: true
      })
    } else if(type == '平') {
      // 平 代表自动计算，根据其他所有项的金额进行计算
      var entries = this.data.entries
      var total = 0
      var cd = this.data.entries[idx].credit_debit
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
        [path+'.credit_debit'] : cd,
        [path+'.total'] : Math.abs(total),
        [`totalText[${idx}]`]: Math.abs(total).toString(),
        entryModified: true
      })
    }
  },

  onEntryDelete: function(e) {
    let idx = e.currentTarget.dataset.idx
    let {entries, totalText} = this.data
    entries.splice(idx, 1)
    totalText.splice(idx, 1)
    this.setData({
      entries,
      totalText
    })
  },

  onNumInput: function(e) {
    let value = parseInt(e.detail)
    value = value || 0
    console.log(value)
    this.setData({
      attachments_number: value,
      entryModified: true
    })
  },

  ChooseAttachment: function(e) {
    let that = this
    wx.chooseImage({
      success: function(res) {
        let {tempFilePaths, tempFiles} = res
        let { attachments, attachments_number} = that.data
        attachments_number += tempFilePaths.length
        that.setData({
          attachments_number,
          attachments: attachments.concat(tempFilePaths)
        })
      },
      fail: function(err) {
        console.error('图片选择出错', err)
      }
    })
  },

  ViewImage: function(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: this.data.attachments,
      current: url
    })
  },

  DelImg(e) {
    let { attachments_number} = this.data 
    this.data.attachments.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      attachments: this.data.attachments,
      attachments_number: attachments_number - 1 < 0 ? 0 : attachments_number-1
    })
  },

  addEntry: function(e) {
    let {totalText, entries} = this.data
    entries.push({
      abstract: '',
      subject: {},
      total: 0,
      credit_debit: '借'
    })
    totalText.push('')
    this.setData({
      entries, totalText,
      entryModified: true
    })
  },

  onSave: function(e) {
    let token = app.getToken()
    let that = this
    if(token) {
      let { entries, date, voucher_no, attachments_number, attachments, voucher_no_prefix } = this.data
      if (!voucher_no || !date || !this.checkEntries(entries)) {
        let errMsg = '出错了！'
        if (!voucher_no) {
          errMsg = '凭证编号未输入'
        } else if (!date) {
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
        wx.showLoading({
          title: '凭证信息保存中',
          mask: true
        })
        // 凭证信息初步检查未出错
        var total = this.calVoucherTotal(entries)
        for (let entry of entries) {
          entry['subject_code'] = entry.subject.subject_code
        }
        // 发送添加凭证的请求
        wx.request({
          url: host +'/finance/voucher/addVoucher',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          data:JSON.stringify({
            date,
            voucher_no: voucher_no_prefix + voucher_no,
            attachments_number,
            entries
          }),
          success: res => {
            if (res.statusCode == 555) {
              app.relogin()
            } else if (res.statusCode == 403) {
              wx.showToast({
                title: '无权限添加凭证',
                icon: 'none',
                duration: 1000
              })
            } else if (res.statusCode != 200 || !res.data.success) {
              wx.showToast({
                title: res.data.errMsg || '请求失败', icon: 'none', duration: 1000
              })
            } else {
              // 上传附件
              if (attachments && attachments.length > 0){
                wx.showLoading({
                  title: '附件上传中',
                  mask: true
                })
                for(let att of attachments){
                  wx.uploadFile({
                    url: host + '/finance/voucher/addAttachment',
                    filePath: att,
                    name: 'voucher_attachment',
                    header: {
                      'Authorization': token
                    },
                    formData: {
                      voucher_no: voucher_no_prefix + voucher_no
                    },
                    success: result => {
                      result.data = JSON.parse(result.data)
                      console.log(result)
                      if (result.statusCode == 403) {
                        wx.showToast({
                          title: '无权限上传附件',
                          icon: 'none',
                          duration: 1000
                        })
                      } else if (result.statusCode != 200 || !result.data.success) {
                        wx.showToast({
                          title: '上传附件失败:'+(result.data.errMsg || '请求失败'),
                          icon: 'none', duration: 1000
                        })
                      } else {
                        wx.showToast({
                          title: '附件上传成功',
                          icon: 'success',
                          duration: 1000
                        })
                      }
                    },
                    complete: () => {
                      wx.hideLoading()
                    }
                  })
                }
              }
              // 将新增的凭证加回凭证页面
              if (this.options.back == 'voucherList') {
                var pages = getCurrentPages()
                var old = pages[pages.length - 2]
                var { filterVouchers, vouchers } = old.data
                filterVouchers = filterVouchers || []
                vouchers = vouchers || []
                // 按日期大小和编号大小比较进行插入
                var v_idx = vouchers.findIndex((voucher) => (voucher.date == date && voucher.voucher_no >= voucher_no) || voucher.date > date)
                var f_idx = filterVouchers.findIndex((voucher) => (voucher.date == date && voucher.voucher_no >= voucher_no) || voucher.date > date)
                var f_len1 = filterVouchers.length
                v_idx = v_idx == -1 ? vouchers.length : v_idx
                vouchers.splice(v_idx, 0, { voucher_no: voucher_no_prefix + voucher_no, date, abstract: entries[0].abstract, total })
                var f_len2 = filterVouchers.length
                if (f_len1==f_len2) {
                  f_idx = f_idx == -1 ? f_len1 : f_idx
                  filterVouchers.splice(f_idx, 0, { voucher_no: voucher_no_prefix + voucher_no, date, abstract: entries[0].abstract, total })
                }
                old.setData({
                  vouchers, filterVouchers
                })
                wx.navigateBack({})
              }
            }
          }
        })
      }
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
  },

  onAttachmentQClicked: function(e){
    wx.showToast({
      title: '指凭证的附加单据数，按照实际情况，与上传情况无关',
      icon: 'none',
      duration: 3000
    })
  },

  // 扫描发票图片添加凭证
  scanPhoto: function(e) {
    console.log("scan options")
    this.setData({
      scanOptionShow: true
    })
  },

  onScanOptionClose: function(e) {
    console.log("options hide")
    this.setData({
      scanOptionShow: false
    })
  },

  // 扫描二维码
  scanQrCode: function(e) {
    let that = this
    console.log("scan qr code")
    wx.showLoading({
      title: '识别中',
    })
    wx.scanCode({
      success: res => {
        wx.hideLoading()
        console.log('scan code', res)
        let code = res.result
        let codeArr = code.split(",")
        if (codeArr.length < 7) {
          wx.showToast({
            title: '无法识别发票内容',
            icon: 'none',
            duration: 2000
          })
        } else {
          console.log('发票金额', codeArr[4])
          let totalStr = codeArr[4]
          let { entries, totalText, entryModified} = that.data
          let total;
          if (Number.isInteger(totalStr)) {
            total = parseInt(totalStr)
          } else {
            total = parseFloat(totalStr)
          }
          if (!entryModified) {
            entries = []
            totalText = []
          }
          entries.push({
            abstract: '货物/应税劳务/服务金额',
            subject: {},
            total: total,
            credit_debit: '借'
          })
          entries.push({
            abstract: '货物/应税劳务/服务金额',
            subject: {},
            total: total,
            credit_debit: '贷'
          })
          totalText.push(codeArr[4])
          totalText.push(codeArr[4])
          that.setData({
            entries, totalText,
            scanOptionShow: false,
            entryModified: true
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log('scan code error', err)
      }
    })
  },

  scan: function(source, limit, callback) {
    let that = this
    let actionType = 'VatInvoice'
    wx.chooseImage({
      count: limit,
      sizeType: ['original', 'compressed'],
      sourceType: [source],
      success: callback
        // const tempFilePaths = res.tempFilePaths
        // let { attachments, attachments_number } = that.data
        // attachments.push(tempFilePaths[0])
        // attachments_number += 1
        // // 提示
        // wx.showLoading({
        //   title: '识别中',
        // })
        // that.setData({
        //   attachments, attachments_number
        // })
        // callOCR(tempFilePaths[0], actionType + 'OCR', _res => {
        //   wx.hideLoading()
        //   let data = _res.result.Response
        //   if (data.Error) {
        //     wx.showToast({
        //       title: '识别失败',
        //       icon: 'none',
        //       duration: 2000
        //     })
        //     console.log('图片识别失败', data.Error)
        //   } else {
        //     console.log(data[actionType + 'Infos'])
        //     let infos = data[actionType + 'Infos']
        //     let { entries, totalText } = that.data
        //     let itemIdx = infos.findIndex(item => {
        //       return item.Name == '货物或应税劳务、服务名称' ||
        //         item.Name == '项目名称' ||
        //         item.Name == '货物或应税劳务名称'
        //     })
        //     let totalIdx = infos.findIndex(item => item.Name == '金额')
        //     let taxIdx = infos.findIndex(item => item.Name == '税额')
        //     let abstract = itemIdx == -1 ? '' : infos[itemIdx].Value
        //     let taxAbstract = '增值税'
        //     let total = itemIdx == -1 ? 0 : parseFloat(infos[totalIdx].Value)
        //     let taxTotal = taxIdx == -1 ? 0 : parseFloat(infos[taxIdx].Value)
        //     // 添加发票记录内容项
        //     entries.push({
        //       abstract: abstract,
        //       subject: {},
        //       total: total,
        //       credit_debit: '借'
        //     })
        //     totalText.push('' + total)
        //     entries.push({
        //       abstract: taxAbstract,
        //       subject: {},
        //       total: taxTotal,
        //       credit_debit: '借'
        //     })
        //     totalText.push('' + taxTotal)
        //     that.setData({
        //       entries, totalText,
        //       scanOptionShow: false
        //     })
        //   }
        // })
    })
  },

  // 扫描临时拍的照片
  scanCameraOrAlbum: function(e) {
    let source = e.currentTarget.dataset.source
    // 相同的代码，只更改了图片源
    let limit = source == 'camera' ? 1 : 9
    let that = this
    this.scan(source, limit, (res) => {
      const tempFilePaths = res.tempFilePaths
      wx.setStorage({
        key: 'ocrPhotos',
        data: tempFilePaths,
        success: () => {
          let {entryModified} = that.data
          that.setData({
            scanOptionShow: false
          }, () => {
            wx.navigateTo({
              url: 'photoOCR/photoOCR?entryPushTarget=entries&totalPushTarget=totalText&urlsKey=ocrPhotos&method=' + source + "&inplace=" + (!entryModified),
            })
          })
        }, 
        fail: (err) => {
          console.log('使用缓存失败', err)
          wx.showToast({
            title: '缓存异常',
            icon: 'none',
            duration: 2000
          })
        }
      })
    })
  },

  // 无意义函数
  nop: function() {},
})