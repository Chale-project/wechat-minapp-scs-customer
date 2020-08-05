import wx from 'wx'
import Fly from 'flyio'
const request = new Fly()

let ApiRootUrl = null
switch (process.env.NODE_ENV) {
  case 'development':
    // ApiRootUrl = "https://cs.wxmin.minshop.vip/gateway/"//线上环境
    ApiRootUrl = "http://192.168.1.33:9010/gateway/"
    break;
  case 'production':
    ApiRootUrl = "https://cs.wxmin.minshop.vip/gateway/"//线上环境
    break;
}

// 设置请求基地址
request.config.baseURL = ApiRootUrl
request.config.timeout = 10000

request.interceptors.request.use((request) => {
  // 给所有请求添加自定义header，带上token信息让服务器验证用户登陆
  request.headers['token'] = wx.getStorageSync('token');
  // console.log('flyio发请求,request为', request);
  wx.showNavigationBarLoading()
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    wx.hideNavigationBarLoading()
    if (response.data.code === 0) {
      return promise.resolve(response.data)
    } else if (response.data.code === 401) {
      wx.redirectTo({
        url: "/pages/index/index"
      });
    } else {
      wx.showToast({
        title: response.data.msg,
        icon: 'none'
      })
      return promise.reject(response.data)
    }
  },
  (err, promise) => {
    wx.hideNavigationBarLoading()
    if (err.status == 0) {
      wx.showToast({
        title: '网络连接异常，请检查您的网络！',
        icon: 'none'
      })
    } else if (err.status == 1) {
      wx.showToast({
        title: '请求超时，请稍后再试！',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '加载失败，请稍后再试！',
        icon: 'none'
      })
    }
    //return promise.resolve()
  }
)

export default request
