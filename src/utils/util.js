import wx from 'wx';
import api from '@/utils/api';

function formatTime(timeStamp) {
  var date = new Date(timeStamp)
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-');
  //return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

function timeStamp(str) {
  const dateTmp = str.replace(/-/g, '/')
  return new Date(dateTmp).getTime()
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}
/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登录远程服务器
          console.log('微信登陆成功', res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * 获取微信授权项
 */
function getWxSetting() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: function (res) {
        // console.log('获取用户授权设置成功', res)
        resolve(res)
      },
      fail: function (err) {
        // console.log('获取用户授权设置失败', err)
        reject(err);
      }
    });
  });
}

/**
 * 打开微信授权设置页面
 */
function openWxSetting() {
  return new Promise(function (resolve, reject) {
    wx.openSetting({
      success: function (res) {
        // console.log('打开用户授权设置成功', res)
        resolve(res)
      },
      fail: function (err) {
        // console.log('打开用户授权设置失败', err)
        reject(err);
      }
    });
  });
}

/**
 * 拉起微信授权项
 */
function setWxAuthorize(scope) {
  return new Promise(function (resolve, reject) {
    console.log(scope)
    wx.authorize({
      scope: scope,
      success: function (res) {
        // console.log('拉起用户授权设置成功', res)
        resolve(res)
      },
      fail: function (err) {
        // console.log('拉起用户授权设置失败', err)
        reject(err);
      }
    });
  });
}

/**
 * 选择微信地址
 */
function chooseWxLocation() {
  return new Promise(function (resolve, reject) {
    wx.chooseLocation({
      success: function (res) {
        // console.log('获取地址成功', res)
        resolve(res)
      },
      fail: function (err) {
        // console.log('获取地址失败', err)
        reject(err);
      }
    });
  });
}


/**
 * 调用微信已经授权过
 */
function getSetting() {
  return new Promise(function (resolve, reject) {
    wx.getSetting({
      success: function (res) {
        console.log('获取用户授权设置成功', res)
        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接显示绑定手机号
          resolve(res);
        } else {//没有授权跳到授权页面
          wx.navigateTo({
            url: "/pages/auth/auth"
          });
        }
      },
      fail: function (err) {
        console.log('获取用户授权设置失败', err)
        reject(err);
      }
    });
  });
}

/**
 * 调用微信获取用户信息接口，需要button授权
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function (res) {
        console.log('获取用户信息成功', res);
        resolve(res);
      },
      fail: function (err) {
        console.log('获取用户信息失败', err);
        reject(err);
      }
    })
  })
}

/**
 * 调用微信选择图片接口
 */
function chooseImage(count) {
  return new Promise(function (resolve, reject) {
    wx.chooseImage({
      count: count,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log('获取图片成功', res);
        resolve(res);
      },
      fail: function (err) {
        console.log('获取图片失败', err);
        reject(err);
      }
    })
  })
}

/**
 * 调用微信上传图片接口
 */
function uploadFile(f, i) {
  return new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: api.uploadFile,
      filePath: f[i],
      header: {
        'token': wx.getStorageSync('token')
      },
      name: 'file',
      formData: null,
      success(res) {
        console.log('图片上传成功', res);
        resolve(res);
      },
      fail: function (err) {
        console.log('图片上传失败', err);
        reject(err);
      }
    })
  })
}

/**
 * 微信获取经纬度
 */
function getLocation() {
  return new Promise(function (resolve, reject) {
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        // console.log('获取地理位置成功', res);
        resolve(res);
      },
      fail: function (err) {
        // console.log('获取地理位置失败', err);
        reject(err);
      }
    });
  })
}

function getQueryString(url, key) {
  var _url = decodeURIComponent(url)
  var reg = new RegExp("(^|&|/?)" + key + "=([^&|/?]*)(&|/?|$)", 'i');
  var result = _url.substr(1).match(reg);
  return result ? result[2] : null;
}


//支付成功后跳转
function goToPaySuccess() {
  const url = "/pages/subPackageShop/paySuccess/paySuccess";
  redirectTo(url);
}

function redirectTo(url) {
  wx.redirectTo({
    url: url
  });
}

function navigateTo(url) {
  wx.navigateTo({
    url: url
  });
}

function navigateBack(n) {
  wx.navigateBack({
    delta: n
  });
}

function reLaunch(url) {
  wx.reLaunch({
    url: url
  });
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function showToastSuccess(msg) {
  wx.showToast({
    title: msg,
    icon: 'success',
    duration: 2000
  })
}

function showToastError(msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 3000
  })
}


function showWxLoading(msg) {
  wx.showLoading({
    title: msg,
  })
}

function hideWxLoading(msg) {
  wx.hideLoading()
}

function removeStorage(key) {
  wx.removeStorage({
    key: key
  });
}

function setNavigationBarTitle(title) {
  wx.setNavigationBarTitle({
    title: title
  })
}

function makePhoneCall(phone) {
  wx.makePhoneCall({
    phoneNumber: phone
  })
}

function mobileToStar(mobile) {
  var str = mobile.substring(0, 3) + "****" + mobile.substring(7, 11);
  return str;
}

function dateTimeStr(time) {
  var str = time.substring(5);
  return str;
}

function setBeforeDate(n) {
  var myDate = new Date()
  var year = myDate.getFullYear() - n
  return new Date(year, 0, 1).getTime()
}

function setAfterDate(n) {
  var myDate = new Date()
  var year = myDate.getFullYear() + n
  return new Date(year, 11, 31).getTime()
}

function strToObj(str) {
  let obj = {},
    _str = decodeURIComponent(str),
    _arr = _str.split('&');
  for (let i in _arr) {
    obj[_arr[i].split("=")[0]] = _arr[i].split("=")[1];
  }
  return obj;
}

function moneyFormat(money) {
  if (isNaN(money)) {
    return "0.00"
  }
  const formatMoney = (money / 100).toFixed(2)
  return formatMoney;
}

const util = {
  formatTime,
  timeStamp,
  getQueryString,
  goToPaySuccess,
  redirectTo,
  navigateTo,
  navigateBack,
  reLaunch,
  showErrorToast,
  showToastSuccess,
  showToastError,
  showWxLoading,
  hideWxLoading,
  removeStorage,
  mobileToStar,
  dateTimeStr,
  setNavigationBarTitle,
  makePhoneCall,

  checkSession,
  login,

  getWxSetting,
  openWxSetting,
  setWxAuthorize,
  chooseWxLocation,

  getSetting,
  getUserInfo,
  chooseImage,
  uploadFile,
  getLocation,
  setBeforeDate,
  setAfterDate,

  strToObj,

  moneyFormat
}

export default util
