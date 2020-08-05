module.exports = [
  {
    path: '/pages/index/index',
    name: 'index',
    config: {
      navigationBarTitleText: '发现门店',
      enablePullDownRefresh: true,
      backgroundColor: '#f85437',
      usingComponents: {
        "van-icon": "../../static/vant/icon/index",
        "van-cell": "../../static/vant/cell/index",
        "van-cell-group": "../../static/vant/cell-group/index",
        "van-search": "../../static/vant/search/index",
        "van-popup": "../../../static/vant/popup/index",
      }
    }
  },
  {
    path: '/pages/home/home',
    name: 'home',
    config: {
      navigationBarTitleText: '智慧便利店',
      enablePullDownRefresh: true,
      backgroundColor: '#f85437',
      usingComponents: {
        "van-icon": "../../static/vant/icon/index",
        "van-search": "../../static/vant/search/index",
        "van-tag": "../../static/vant/tag/index",
        "van-row": "../../static/vant/row/index",
        "van-col": "../../static/vant/col/index",
        "van-dialog": "../../static/vant/dialog/index",
        "van-button": "../../static/vant/button/index",
      }
    }
  },
  {
    path: '/pages/sort/sort',
    name: 'sort',
    config: {
      navigationBarTitleText: '精选商品',
      enablePullDownRefresh: true,
      backgroundColor: '#f85437',
      usingComponents: {
        "van-tag": "../../static/vant/tag/index",
        "van-icon": "../../static/vant/icon/index",
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-button": "../../static/vant/button/index",
        "van-dialog": "../../../static/vant/dialog/index",
      }
    }
  },

  {
    path: '/pages/pay/pay',
    name: 'pay',
    config: {
      navigationBarTitleText: '买单',
      usingComponents: {
        "van-icon": "../../static/vant/icon/index",
        "van-field": "../../static/vant/field/index",
        "van-button": "../../static/vant/button/index",
        "van-popup": "../../static/vant/popup/index",
        "van-cell": "../../static/vant/cell/index",
        "van-cell-group": "../../static/vant/cell-group/index",
        "van-radio": "../../static/vant/radio/index",
        "van-checkbox": "../../static/vant/checkbox/index",
        "van-radio-group": "../../static/vant/radio-group/index",
        "van-switch": "../../static/vant/switch/index",
        "van-row": "../../static/vant/row/index",
        "van-col": "../../static/vant/col/index",
      }
    }
  },
  {
    path: '/pages/cart/cart',
    name: 'cart',
    config: {
      navigationBarTitleText: '购物车',
      usingComponents: {
        "van-button": "../../static/vant/button/index",
        "van-icon": "../../static/vant/icon/index",
        "van-stepper": "../../static/vant/stepper/index",
        "van-dialog": "../../static/vant/dialog/index",
        "van-swipe-cell": "../../static/vant/swipe-cell/index",
      }
    }
  },
  {
    path: '/pages/user/user',
    name: 'user',
    config: {
      navigationBarTitleText: '我的',
      enablePullDownRefresh: true,
      usingComponents: {
        "van-tag": "../../static/vant/tag/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../static/vant/cell/index",
        "van-cell-group": "../../static/vant/cell-group/index",
      }
    }
  },
  {
    path: '/pages/auth/auth',
    name: 'auth',
    config: {
      navigationBarTitleText: '微信授权',
      usingComponents: {
        "van-icon": "../../static/vant/icon/index",
        "van-button": "../../static/vant/button/index",
      }
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/bindMobile/bindMobile',
    name: 'bindMobile',
    subPackage: true,
    config: {
      navigationBarTitleText: '绑定手机号',
      usingComponents: {
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-button": "../../../static/vant/button/index",
        "van-field": "../../../static/vant/field/index"
      }
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/userCard/userCard',
    name: 'userCard',
    subPackage: true,
    config: {
      navigationBarTitleText: '会员卡',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
      }
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/profile/profile',
    name: 'profile',
    subPackage: true,
    config: {
      navigationBarTitleText: '个人资料',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-button": "../../../static/vant/button/index",
        "van-field": "../../../static/vant/field/index",
        "van-area": "../../../static/vant/area/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-action-sheet": "../../../static/vant/action-sheet/index",
      }
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: 'pages/subPackageOthers/set/set',
    name: 'set',
    subPackage: true,
    config: {
      navigationBarTitleText: '设置',
      usingComponents: {
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
      }
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: 'pages/subPackageOthers/set/about',
    name: 'about',
    subPackage: true,
    config: {
      navigationBarTitleText: '关于我们',
      usingComponents: {}
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: 'pages/subPackageOthers/set/agreement',
    name: 'agreement',
    subPackage: true,
    config: {
      navigationBarTitleText: '用户协议',
      usingComponents: {}
    }
  },

  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/search/search',
    name: 'search',
    subPackage: true,
    config: {
      navigationBarTitleText: '搜索',
      usingComponents: {
        "van-search": "../../../static/vant/search/index",
      }
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/wheel/wheel',
    name: 'wheel',
    subPackage: true,
    config: {
      navigationBarTitleText: '幸运大转盘',
      usingComponents: {}
    }
  },

  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/category/category',
    name: 'category',
    subPackage: true,
    config: {
      navigationBarTitleText: '健康馆',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
      }
    }
  },

  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/goods/goods',
    name: 'goods',
    subPackage: true,
    config: {
      navigationBarTitleText: '商品详情',
      usingComponents: {
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-button": "../../../static/vant/button/index",
        "van-stepper": "../../../static/vant/stepper/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-goods-action": "../../../static/vant/goods-action/index",
        "van-goods-action-icon": "../../../static/vant/goods-action-icon/index",
        "van-goods-action-button": "../../../static/vant/goods-action-button/index",
        "i-count-down": "../../../static/vant/count-down/index",
      }
    }
  },
  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/payment/payment',
    name: 'payment',
    subPackage: true,
    config: {
      navigationBarTitleText: '立即支付',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-button": "../../../static/vant/button/index",
        "van-radio": "../../../static/vant/radio/index",
        "van-radio-group": "../../../static/vant/radio-group/index",
      }
    }
  },
  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/paySuccess/paySuccess',
    name: 'paySuccess',
    subPackage: true,
    config: {
      navigationBarTitleText: '支付成功',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-button": "../../../static/vant/button/index",
      }
    }
  },
  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/orderCreate/orderCreate',
    name: 'orderCreate',
    subPackage: true,
    config: {
      navigationBarTitleText: '确认订单',
      usingComponents: {
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-field": "../../../static/vant/field/index",
        "van-button": "../../../static/vant/button/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-submit-bar": "../../../static/vant/submit-bar/index",
        "van-notify": "../../../static/vant/notify/index",
        "van-switch": "../../../static/vant/switch/index",
        "van-dialog": "../../../static/vant/dialog/index",
        "van-stepper": "../../../static/vant/stepper/index",

      }
    }
  },
  {
    root: 'pages/subPackageVirtualG',
    path: '/pages/subPackageVirtualG/virtualGCreateOrder',
    name: 'virtualGCreateOrder',
    subPackage: true,
    config: {
      navigationBarTitleText: '确认订单',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-field": "../../../static/vant/field/index",
        "van-button": "../../../static/vant/button/index",
        "van-stepper": "../../../static/vant/stepper/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-submit-bar": "../../../static/vant/submit-bar/index",
      }
    }
  },
  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/order/order',
    name: 'order',
    subPackage: true,
    config: {
      navigationBarTitleText: '店铺订单',
      enablePullDownRefresh: true,
      usingComponents: {
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-dialog": "../../../static/vant/dialog/index",
        "van-button": "../../../static/vant/button/index",
      }
    }
  },
  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/orderDetail/orderDetail',
    name: 'orderDetail',
    subPackage: true,
    config: {
      navigationBarTitleText: '订单详情',
      usingComponents: {
        "van-tag": "../../../static/vant/tag/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-dialog": "../../../static/vant/dialog/index",
        "van-button": "../../../static/vant/button/index",
        "van-steps": "../../../static/vant/steps/index",
      }
    }
  },

  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/orderDetail/imOrderDetail',
    name: 'imOrderDetail',
    subPackage: true,
    config: {
      navigationBarTitleText: '订单详情',
      usingComponents: {
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
      }
    }
  },

  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/address/address',
    name: 'address',
    subPackage: true,
    config: {
      navigationBarTitleText: '地址列表',
      usingComponents: {
        "van-tag": "../../../static/vant/tag/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-button": "../../../static/vant/button/index",
        "van-dialog": "../../../static/vant/dialog/index",
        "van-swipe-cell": "../../../static/vant/swipe-cell/index",
      }
    }
  },
  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/addressAdd/addressAdd',
    name: 'addressAdd',
    subPackage: true,
    config: {
      navigationBarTitleText: '添加地址',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-button": "../../../static/vant/button/index",
        "van-field": "../../../static/vant/field/index",
        "van-area": "../../../static/vant/area/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-switch-cell": "../../../static/vant/switch-cell/index",
      }
    }
  },
  {
    root: 'pages/subPackageShop',
    path: '/pages/subPackageShop/addressEdit/addressEdit',
    name: 'addressEdit',
    subPackage: true,
    config: {
      navigationBarTitleText: '编辑地址',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-button": "../../../static/vant/button/index",
        "van-field": "../../../static/vant/field/index",
        "van-area": "../../../static/vant/area/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-switch-cell": "../../../static/vant/switch-cell/index",
      }
    }
  },

  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/couponCenter/couponCenter',
    name: 'couponCenter',
    subPackage: true,
    config: {
      navigationBarTitleText: '领券中心',
      usingComponents: {
        "van-dialog": "../../../static/vant/dialog/index",
        "van-button": "../../../static/vant/button/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-swipe-cell": "../../../static/vant/swipe-cell/index",
      }
    }
  },

  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/couponMy/couponMy',
    name: 'couponMy',
    subPackage: true,
    config: {
      navigationBarTitleText: '我的优惠券',
      usingComponents: {
        "van-dialog": "../../../static/vant/dialog/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-button": "../../../static/vant/button/index",
      }
    }
  },

  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/charge/charge',
    name: 'charge',
    subPackage: true,
    config: {
      navigationBarTitleText: '会员储值',
      usingComponents: {
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-field": "../../../static/vant/field/index",
        "van-button": "../../../static/vant/button/index",
        "van-popup": "../../../static/vant/popup/index",
      }
    }
  },

  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/signIn/signIn',
    name: 'signIn',
    subPackage: true,
    config: {
      navigationBarTitleText: '会员签到',
      navigationBarBackgroundColor: "#16cda7",
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-button": "../../../static/vant/button/index",
      }
    }
  },

  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/integral/integral',
    name: 'integral',
    subPackage: true,
    config: {
      navigationBarTitleText: '积分记录',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
      }
    }
  },

  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/balanceRecord/balanceRecord',
    name: 'balanceRecord',
    subPackage: true,
    config: {
      navigationBarTitleText: '余额',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
      }
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/selfOrder/selfOrder',
    name: 'selfOrder',
    subPackage: true,
    config: {
      navigationBarTitleText: '我的订单',
      enablePullDownRefresh: true,
      usingComponents: {
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-dialog": "../../../static/vant/dialog/index",
        "van-button": "../../../static/vant/button/index",
      }
    }
  },
  {
    root: 'pages/subPackageOthers',
    path: '/pages/subPackageOthers/ranking/ranking',
    name: 'ranking',
    subPackage: true,
    config: {
      navigationBarTitleText: '英雄榜',
      navigationBarBackgroundColor: "#571b8c",
      navigationBarTextStyle: "white",
      backgroundColor: "#571b8c",
      usingComponents: {
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
      }
    }
  },

  {
    root: 'pages/subPackageVirtualG',
    path: '/pages/subPackageVirtualG/virtualGCategory',
    name: 'virtualGCategory',
    subPackage: true,
    config: {
      navigationBarTitleText: '一起玩',
      usingComponents: {
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
      }
    }
  },

  {
    root: 'pages/subPackageVirtualG',
    path: '/pages/subPackageVirtualG/virtualGList',
    name: 'virtualGList',
    subPackage: true,
    config: {
      navigationBarTitleText: '商品',
      usingComponents: {
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-search": "../../static/vant/search/index",
        "van-button": "../../../static/vant/button/index",
      }
    }
  },

  {
    root: 'pages/subPackageVirtualG',
    path: '/pages/subPackageVirtualG/virtualGDetail',
    name: 'virtualGDetail',
    subPackage: true,
    config: {
      navigationBarTitleText: '商品详情',
      usingComponents: {
        "van-goods-action": "../../../static/vant/goods-action/index",
        "van-goods-action-icon": "../../../static/vant/goods-action-icon/index",
        "van-goods-action-button": "../../../static/vant/goods-action-button/index",
        "van-button": "../../../static/vant/button/index",
      }
    }
  },

  {
    root: 'pages/subPackageVirtualG',
    path: '/pages/subPackageVirtualG/virtualGCreateOrderPay',
    name: 'virtualGCreateOrderPay',
    subPackage: true,
    config: {
      navigationBarTitleText: '立即购买',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-field": "../../../static/vant/field/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-button": "../../../static/vant/button/index",
        "van-stepper": "../../../static/vant/stepper/index",
        "van-popup": "../../../static/vant/popup/index",
      }
    }
  },

  {
    root: 'pages/subPackageVirtualG',
    path: '/pages/subPackageVirtualG/virtualGMobileCharge',
    name: 'virtualGMobileCharge',
    subPackage: true,
    config: {
      navigationBarTitleText: '充值缴费',
      usingComponents: {
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-field": "../../../static/vant/field/index",
        "van-button": "../../../static/vant/button/index",
        "van-checkbox": "../../../static/vant/checkbox/index",
      }
    }
  },

  {
    root: 'pages/subPackageGroupBuy',
    path: '/pages/subPackageGroupBuy/groupGList',
    name: 'groupGList',
    subPackage: true,
    config: {
      navigationBarTitleText: '拼团购',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-tag": "../../../static/vant/tag/index",
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-search": "../../../static/vant/search/index",
        "van-button": "../../../static/vant/button/index",
        "i-count-down": "../../../static/vant/count-down/index",
      }
    }
  },
  {
    root: 'pages/subPackageGroupBuy',
    path: '/pages/subPackageGroupBuy/groupGDetail',
    name: 'groupGDetail',
    subPackage: true,
    config: {
      navigationBarTitleText: '商品详情',
      usingComponents: {
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-button": "../../../static/vant/button/index",
        "van-stepper": "../../../static/vant/stepper/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-goods-action": "../../../static/vant/goods-action/index",
        "van-goods-action-icon": "../../../static/vant/goods-action-icon/index",
        "van-goods-action-button": "../../../static/vant/goods-action-button/index",
        "i-count-down": "../../../static/vant/count-down/index",
      }
    }
  },

  {
    root: 'pages/subPackageGroupBuy',
    path: '/pages/subPackageGroupBuy/groupUList',
    name: 'groupUList',
    subPackage: true,
    config: {
      navigationBarTitleText: '我的拼团',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-tag": "../../../static/vant/tag/index",
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-search": "../../../static/vant/search/index",
        "van-button": "../../../static/vant/button/index",
      }
    }
  },

  {
    root: 'pages/subPackageGroupBuy',
    path: '/pages/subPackageGroupBuy/groupJoin',
    name: 'groupJoin',
    subPackage: true,
    config: {
      navigationBarTitleText: '拼购详情',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-button": "../../../static/vant/button/index",
        "van-stepper": "../../../static/vant/stepper/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "i-count-down": "../../../static/vant/count-down/index",
      }
    }
  },


  {
    root: 'pages/subPackageSpike',
    path: '/pages/subPackageSpike/spikeGList',
    name: 'spikeGList',
    subPackage: true,
    config: {
      navigationBarTitleText: '限时秒杀',
      usingComponents: {
        "van-tag": "../../../static/vant/tag/index",
        "van-tab": "../../../static/vant/tab/index",
        "van-tabs": "../../../static/vant/tabs/index",
        "van-search": "../../../static/vant/search/index",
        "van-button": "../../../static/vant/button/index",
        "i-count-down": "../../../static/vant/count-down/index",
      }
    }
  },

  {
    root: 'pages/subPackageSpike',
    path: '/pages/subPackageSpike/spikeGDetail',
    name: 'spikeGDetail',
    subPackage: true,
    config: {
      navigationBarTitleText: '商品详情',
      usingComponents: {
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-button": "../../../static/vant/button/index",
        "van-stepper": "../../../static/vant/stepper/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-goods-action": "../../../static/vant/goods-action/index",
        "van-goods-action-icon": "../../../static/vant/goods-action-icon/index",
        "van-goods-action-button": "../../../static/vant/goods-action-button/index",
        "i-count-down": "../../../static/vant/count-down/index",
      }
    }
  },

  {
    root: 'pages/subPackageEntityG',
    path: '/pages/subPackageEntityG/entityGCategory',
    name: 'entityGCategory',
    subPackage: true,
    config: {
      navigationBarTitleText: '发现好货',
      usingComponents: {}
    }
  },

  {
    root: 'pages/subPackageEntityG',
    path: '/pages/subPackageEntityG/entityGList',
    name: 'entityGList',
    subPackage: true,
    config: {
      navigationBarTitleText: '商品列表',
      usingComponents: {
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
        "van-search": "../../static/vant/search/index",
      }
    }
  },

  {
    root: 'pages/subPackageEntityG',
    path: '/pages/subPackageEntityG/entityGDetail',
    name: 'entityGDetail',
    subPackage: true,
    config: {
      navigationBarTitleText: '商品详情',
      usingComponents: {
        "van-row": "../../../static/vant/row/index",
        "van-col": "../../../static/vant/col/index",
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-button": "../../../static/vant/button/index",
        "van-stepper": "../../../static/vant/stepper/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-goods-action": "../../../static/vant/goods-action/index",
        "van-goods-action-icon": "../../../static/vant/goods-action-icon/index",
        "van-goods-action-button": "../../../static/vant/goods-action-button/index",
      }
    }
  },

  {
    root: 'pages/subPackageEntityG',
    path: '/pages/subPackageEntityG/entityCreateOrder',
    name: 'entityCreateOrder',
    subPackage: true,
    config: {
      navigationBarTitleText: '确认订单',
      usingComponents: {
        "van-icon": "../../../static/vant/icon/index",
        "van-cell": "../../../static/vant/cell/index",
        "van-popup": "../../../static/vant/popup/index",
        "van-field": "../../../static/vant/field/index",
        "van-button": "../../../static/vant/button/index",
        "van-cell-group": "../../../static/vant/cell-group/index",
        "van-submit-bar": "../../../static/vant/submit-bar/index",
        "van-notify": "../../../static/vant/notify/index",
        "van-switch": "../../../static/vant/switch/index",
        "van-dialog": "../../../static/vant/dialog/index",
        "van-stepper": "../../../static/vant/stepper/index",
      }
    }
  },
]
