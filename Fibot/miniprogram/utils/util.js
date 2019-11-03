var crypto = require('./cryptojs/cryptojs.js').Crypto

const json2form = json => {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

const encodeUTF8 = text => {
  const code = encodeURIComponent(text);
  const bytes = [];
  for (var i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (c === '%') {
      const hex = code.charAt(i + 1) + code.charAt(i + 2);
      const hexVal = parseInt(hex, 16);
      bytes.push(hexVal);
      i += 2;
    } else bytes.push(c.charCodeAt(0));
  }
  return bytes;
}

const decodeUTF8 = bytes => {
  var encoded = "";
  for (var i = 0; i < bytes.length; i++) {
    encoded += '%' + bytes[i].toString(16);
  }
  return decodeURIComponent(encoded);
}

function base64_encode(str) { // 编码，配合encodeURIComponent使用
  var c1, c2, c3;
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var i = 0, len = str.length, strin = '';
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
      strin += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
      strin += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    strin += base64EncodeChars.charAt(c1 >> 2);
    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    strin += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return strin
}

const encryptPasswd = pwd => {
  let bytes = crypto.SHA1(pwd, {asBytes:true})
  let str = crypto.SHA1(pwd, { asString: true })
  console.log("SHA1:" + str)
  console.log("SHA1:" + crypto.SHA1(pwd))
  let encrypted = crypto.util.bytesToBase64(bytes)
  console.log('base64:' + encrypted)
  console.log('new base64:' + base64_encode(str))
  return encrypted
}

const bytes2Str = bytes => {
  for (var str = [], i = 0; i < bytes.length; i++)
    str.push(String.fromCharCode(bytes[i]));
  return str.join("");
}

const getcurDateFormatString = date => {
  // let datestr = date.toLocaleDateString()
  // console.log('时间为: '+datestr)
  // let dateArr = datestr.split('/')
  // if(dateArr.length < 3){
    // dateArr = datestr.split('-')
  // }
  // console.log(dateArr)
  let year = date.getFullYear()
  let date1 = date.getDate()
  let month = date.getMonth() + 1
  let dates = ""+date1
  let months = ""+month
  if(date1.toString().length < 2){
    dates = "0" + dates
  }
  if(month.toString().length < 2){
    months = "0"+months
  }
  return year.toString() + '-' + months + '-' + dates
}

const twoDecimal = function changeTwoDecimal_f(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    console.log('function:changeTwoDecimal->parameter error');
    return false;
  }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}

// 调用 OCR 云函数
const callOCR = function (url, action, callback) {
  console.log('call ocr function', action, url)
  // url只是本地url，需要upload到cloud的tempPhoto中再让cloud function使用
  wx.cloud.uploadFile({
    cloudPath: "tempOCRPhoto/tempOCRPhoto" + Date.parse(new Date()) + ".jpg",
    filePath: url
  }).then(_res => {
    wx.cloud.callFunction({
      name: 'ocr',
      data: {
        action: action,
        imgFileId: _res.fileID
      }
    }).then(res => {
      callback(res)
      wx.cloud.deleteFile({
        fileList: [_res.fileID]
      }).catch(dferr => {
        console.log('文件删除失败', dferr)
      })
    }).catch(err => {
      console.log('云函数调用失败', err)
      wx.hideLoading()
      wx.showToast({
        title: '异常错误',
        icon: 'none',
        duration: 2000
      })
      wx.cloud.deleteFile({
        fileList: [_res.fileID]
      }).catch(ferr => {
        console.log('文件删除失败', ferr)
      })
    })
  }).catch(_err => {
    console.log('文件上传失败', _err)
    wx.hideLoading()
    wx.showToast({
      title: '异常错误',
      icon: 'none',
      duration: 2000
    })
  })
}


module.exports = {
  json2form: json2form,
  encodeUTF8: encodeUTF8,
  decodeUTF8: decodeUTF8,
  encryptPasswd: encryptPasswd,
  bytes2Str: bytes2Str,
  getcurDateFormatString: getcurDateFormatString,
  twoDecimal: twoDecimal,
  callOCR: callOCR
}