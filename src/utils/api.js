import request from './request'

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

const api = {
  /**
   * 公共接口
   */
  // 微信登录通过code获取session_key
  AuthLoginByWeixin: (paramObj) => request.get('customer/getSessionIdByCode/' + paramObj.code),

  // 微信登录通过code获取session_key(new)
  getSessionByCode: (code) => request.get('customer/getSessionKeyByCode/' + code),

  // 通过encryptedData，session_key，iv解密用户unionId
  //绑定微信登录
  bindWxLogin: (paramObj) => request.post('customer/getWxUserInfo', paramObj),

  // 存储用户小程序formId
  saveFormId: (id) => request.get('customerData/saveFormId/' + id),

  //上传文件接口
  uploadFile: ApiRootUrl + 'basic/file/upload',

  //发送验证码
  getSmsCode: (paramObj) => request.get('customer/registerSmsSend/' + paramObj.mobile),

  //查询手机号归属运营商
  queryMobileOperator: (mobile) => request.get('virtualGoods/agency/search/' + mobile),

  // 通过终端码获取商户storeId
  getStoreIdByCode: (id) => request.get('shop/getShopIdByPolymerizationCode/' + id),

  // 获取商户信息
  getStoreInfo: (id) => request.get('shop/getShopInfo/' + id),

  // 获取可领取卡券
  getCardCoupon: (id) => request.get('shopCard/wxAddCard/' + id),

  // 领卡券微信消息推送
  sendCardCouponWxMessage: (paramObj) => request.get('wxMaMessage/sendWxCardMessage/' + paramObj.storeid + '/' + paramObj.formid),

  // 通过广告位获取广告
  getAdList: (id) => request.get('advert/queryAdvertByNumber/' + id),

  /**
  * 引导页接口
  */
  // 获取附近门店
  getNearbyStoreList: (paramObj) => request.post('shop/getNearbyShopModel', paramObj),

  //添加访问记录
  setAccessRecort: (paramObj) => request.post('customers/step/history/visitRecord', paramObj),

  // 获取访问记录的门店
  getAccessRecordList: (paramObj) => request.post('customers/step/history/list', paramObj),

  // 获取搜索门店
  getSearchStore: (paramObj) => request.post('shop/page/list', paramObj),

  /**
   * 首页接口
   */
  // 首页轮播图接口
  getBanner: (id) => request.get('advert/queryAdvert/' + id),

  // 首页获取商品各栏目商品
  getHomeCateGoods: (paramObj) => request.post('subjects/list', paramObj),


  /**
   * 商品相关接口
   */
  //获取一级分类列表
  getFirstLvCategoryList: (id) => request.get('category/list/' + id),
  //获取二级分类列表
  getSecondLvCategoryList: (id) => request.get('category/list/two/' + id),

  //获取商品列表
  getGoodsList: (paramObj) => request.post('goods/list', paramObj),

  //获取商品详情
  getGoodsInfo: (r) => request.get('goods/info/' + r),

  //商品搜索
  searchGoodsList: (paramObj) => request.post('goods/all/list', paramObj),

  /**
   * 买单接口
   */
  // 买单获取积分余额抵扣比例
  getIntegralBalance: (id) => request.put('shoube/integralBalance/' + id),

  // 余额买单
  payBillBalance: (paramObj) => request.put('shoube/balance/billPay/' + paramObj.money + '/' + paramObj.shopId + '/' + paramObj.useIntegral),

  /**
   * 下单接口
   */
  //立即购买查询订单
  getBeforeOrder: (paramObj) => request.post('order/NoActivityGoods/settlement', paramObj),

  //创建订单
  createOrder: (paramObj) => request.post('order/affirmOrder', paramObj),

  //聚合预结算查询订单
  getAllBeforeOrder: (paramObj) => request.post('order/poly/settlement', paramObj),

  //聚合创建订单
  createAllOrder: (paramObj) => request.post('order/confirmOrder', paramObj),

  //查询订单支付金额及余额
  getPayMoneyCurBalance: (id) => request.get('order/balance/' + id),

  //获取预结算订单地址
  getOrderAddress: (id) => request.get('order/balance/' + id),

  /**
  * 地址相关接口
  */
  //添加地址
  addAddress: (paramObj) => request.post('address/add', paramObj),

  //获取地址列表
  getAddressList: (paramObj) => request.post('address/page/list', paramObj),

  //设为默认地址
  setDefaultAddress: (r) => request.get('address/checked/' + r),

  //删除地址
  deleteAddress: (r) => request.delete('address/deleted/' + r),

  //获取地址详情
  getAddressInfo: (r) => request.get('address/info/' + r),

  //修改地址信息
  editAddress: (paramObj) => request.put('address/modify', paramObj),

  //支付
  payment: (paramObj) => request.post('shoube/pay', paramObj),

  //取消支付回调
  cancelPayCallback: (id) => request.put('shoube/cancelPay/' + id),

  //余额支付
  payBalance: (id) => request.put('shoube/balancePay/' + id),

  //获取订单各状态数
  getUserStoreInfo: (id) => request.get('order/info/' + id),

  //获取订单列表
  getOrderList: (paramObj) => request.post('order/page', paramObj),

  //订单详情
  getOrderDetail: (r) => request.get('order/Info/' + r),

  //取消订单
  cancelOrder: (r) => request.get('order/cancel/' + r),

  //确认收货
  sureReceived: (r) => request.get('order/confirmReceipt/' + r),

  //获取核销二维码
  getVerificationCode: (r) => request.get('order/getOrderIdPic/' + r),

  //修改个人信息
  modifyUserInfo: (paramObj) => request.put('customerData/modify', paramObj),

  // 绑定个人手机号
  bindMobile: (paramObj) => request.post('customerData/bindingPhone', paramObj),

  // 绑定微信手机号
  bindWxMobile: (paramObj) => request.post('customerData/binding/phone', paramObj),

  //获取用户协议
  getAgreement: (r) => request.get('customer/getProtocol/C_Protocal'),

  /**
   * 会员签到
   */
  // 获取签到信息
  getSignInfo: (id) => request.get('signRecord/info/' + id),

  // 点签到
  setSign: (id) => request.get('signRecord/sign/' + id),

  /**
   * 会员积分
   */
  // 获取积分消费记录
  getIntegralRecord: (paramObj) => request.post('integral/page', paramObj),

  /**
   * 优惠券
   */
  // 获取优惠券列表
  getCouponList: (paramObj) => request.post('coupon/canTake', paramObj),

  // 领取优惠券
  getCoupon: (paramObj) => request.post('coupon/take', paramObj),

  // 我的优惠券
  getMyCouponList: (paramObj) => request.post('coupon/hasTake', paramObj),

  /**
   * 储值卡余额
   */
  // 获取储值卡列表
  getChargeCardList: (id) => request.get('rechargeCard/list/' + id),

  // 我的余额充值消费记录
  getBalanceRecord: (paramObj) => request.post('rechargeCard/page', paramObj),

  /**
 * 虚拟商品
 */
  //获取虚拟商品类目
  getPlatformGCategoryList: (paramObj) => request.post('virtualGoods/category/pageQuery', paramObj),

  //获取虚拟商品列表
  getPlatformGGoodsList: (paramObj) => request.post('virtualGoods/pageQuery', paramObj),

  //获取虚拟商品详情
  getPlatformGoodsInfo: (id) => request.get('virtualGoods/info/' + id),



  /**
  * 订单收货地址
  */
  //获取用户收货地址与商家配送范围匹配
  getOrderAddressInfo: (paramObj) => request.post('address/getAddress', paramObj),

  /**
  * 拼购
  */
  //获取拼购商品列表
  getGroupGList: (paramObj) => request.post('goodsGroup/list', paramObj),

  //获取拼购商品详情
  getGroupGInfo: (id) => request.get('goodsGroup/info/' + id),

  //获取商品拼购列表
  getGoodsGroupList: (id) => request.get('orderGroup/list/' + id),

  //获取拼购商品订单详情
  getGroupInfo: (id) => request.get('orderGroup/getInfo/' + id),

  //获取我的团列表
  getMyGrouplist: (paramObj) => request.post('orderGroup/myGroupOrderlist', paramObj),


  /**
  * 秒杀
  */
  //获取秒杀商品列表
  getSpikeGList: (paramObj) => request.post('seckillGoods/page/list', paramObj),

  //获取秒杀商品详情
  getSpikeGInfo: (id) => request.get('seckillGoods/infoMore/' + id),


}

export default api
