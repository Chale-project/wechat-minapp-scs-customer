/**
 * 支付相关服务
 */
import wx from 'wx';
import api from '@/utils/api';
/**
 * 判断用户是否登录
 */
function payOrder(data) {
  return new Promise(function (resolve, reject) {
    api.payment(data).then((res) => {
      // console.log('请求接口shoubei/pay后的结果', res)
      const payParam = res.result;
      // console.log('payParam这些应该是后台计算好的签名等', payParam.timeStamp)
      const timeStampParam = payParam.timeStamp ? payParam.timeStamp : '';
      const nonceStrParam = payParam.nonceStr ? payParam.nonceStr : '';
      const packageParam = payParam.packages ? payParam.packages : '';
      const signTypeParam = payParam.signType ? payParam.signType : '';
      const paySignParam = payParam.paySign ? payParam.paySign : '';
      wx.requestPayment({
        'timeStamp': timeStampParam,
        'nonceStr': nonceStrParam,
        'package': packageParam,
        'signType': signTypeParam,
        'paySign': paySignParam,
        'success': function (res) {
          resolve(res);
        },
        'fail': function (res) {
          res.oid = payParam.attach
          reject(res);
        },
        'complete': function (res) {
          res.oid = payParam.attach
          reject(res);
        }
      });
    }).catch(err => {
      console.log(err);
    });
  });
}

const pay = {
  payOrder
}

export default pay
