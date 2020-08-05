<template >
  <view class="pages pay">
    <view class="pay-container">
      <view class="pay-container-header">
        <view class="merchant-info">
          <view class="merchant-title"><text>付款给商家</text></view>
          <view class="merchant-name"><text>名称：{{storeInfo.shopName}}</text></view>
        </view>
        <view class="merchant-logo">
          <image :src="storeInfo.shopLogo?storeInfo.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errImg" mode="widthFix" />
        </view>
      </view>
      <view class="pay-container-body">
        <view class="pay-money-title">金额</view>
        <view class="pay-money-form">
          <view class="money-icon">￥</view>
          <view class="money-input">
            <van-field :value="inputMoney" type="digit" focus placeholder="请输入付款金额" :border="false" @change="onChangeMoney" />
          </view>
        </view>
      </view>
      <view class="recharge-checkbox">
        <van-checkbox :value="recharge" checked-color="#f85437" label-class="recharge-label" @change="onChangeRecharge">购买储值卡享更多优惠哦！</van-checkbox>
      </view>
      <view class="pay-container-footer">
        <button type="default" open-type="getUserInfo" lang="zh_CN" class="but-default-submit" hover-class="but-default-submit-active" :disabled="disabledBut" v-if="isNewUser" @getuserinfo="bindGetUserInfo">立即买单</button>
        <form @submit="formSubmit" :report-submit='true' v-else>
          <button type="default" form-type="submit" class="but-default-submit" hover-class="but-default-submit-active" :disabled="disabledBut">{{recharge?'立即购买':'立即买单'}}</button>
        </form>
      </view>
    </view>

    <van-popup :show="showPay" position="bottom" :close-on-click-overlay="false" custom-class="pay-popup-box">
      <view class="pay-popup-content">
        <view class="close-popup" @click="closePay">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="pay-popup-header">确认支付</view>
        <view class="pay-popup-body">
          <scroll-view class="pay-scroll-area" scroll-y="true">
            <view class="pay-content">
              <van-icon name="gem-o" size="24px" color="red" custom-style="vertical-align:middle;margin-right:10px;" />
              <text>支付即会员，可享更多超值优惠！</text>
            </view>
          </scroll-view>
          <view class="pay-type-discount">
            <van-cell-group :border="false">
              <!-- <van-cell title="积分抵扣" :value="isUseIntegral?'可抵扣 -￥'+integralRebate:'不使用积分'" custom-class="order-others-cell" value-class='integral-preferential-value' v-if="initialIntegralRebate>0"> -->
              <van-cell title="积分抵扣" :value="isUseIntegral?'可抵扣 -￥'+integralRebate:'不使用积分'" custom-class="order-others-cell" value-class='integral-preferential-value'>
                <view slot="icon" class="slot-icon slot-icon-integral">分</view>
                <view slot="right-icon">
                  <van-switch :checked="isUseIntegral" active-color="#07c160" size="24px" custom-class="switch-integral" @change="onChangeIntegral" />
                </view>
              </van-cell>
            </van-cell-group>
          </view>

          <view class="pay-type-content">
            <view class="pay-type-header">支付方式</view>
            <view class="pay-type-body">
              <van-radio-group :value="payType">
                <van-cell-group>
                  <van-cell data-name="wechat" @click="onClickPayType">
                    <view slot="title" class="pay-type-cell-title">
                      <van-icon name="wechat" class="pay-type-icon" size="20px" color="#4bc065" />
                      <view class="van-cell-text">微信支付</view>
                    </view>
                    <van-radio name="wechat" checked-color="#f85437" />
                  </van-cell>
                  <van-cell data-name="balance" @click="onClickPayType">
                    <view slot="title" class="pay-type-cell-title">
                      <van-icon name="paid" class="pay-type-icon" size="20px" color="#f85437" />
                      <view class="van-cell-text">余额支付 <text>（当前余额：{{balance}} 元）</text></view>
                    </view>
                    <van-radio name="balance" checked-color="#f85437" />
                  </van-cell>
                </van-cell-group>
              </van-radio-group>
            </view>
          </view>
        </view>
        <view class="pay-popup-footer">
          <form @submit="surePay" :report-submit='true'>
            <button type="default" form-type="submit" class="but-default-submit but-pay-wechat" hover-class="but-default-submit-active" :disabled="disabledBut">确认支付 ￥{{payMoney||'0.00'}} 元</button>
          </form>
        </view>
      </view>
    </van-popup>

    <van-popup :show="showRechargeCardPay" position="bottom" custom-class="pay-popup-box">
      <view class="pay-popup-content">
        <view class="close-popup" @click="closeRechargePay">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="pay-popup-header">储值享优惠</view>
        <view class="pay-popup-body">
          <scroll-view class="pay-scroll-area" scroll-y="true">
            <view class="charge-content" v-if="chargeCardList.length>0">
              <van-row gutter="15">
                <van-col span="12" custom-class="charge-card-item" v-for="(v,i) of chargeCardList" :key="i">
                  <view :class="v.checked?'charge-card-content active':'charge-card-content'" @click="choiceCharge(i)">
                    <view class="charge-card-title ellipsis">{{v.cardName}}</view>
                    <view class="charge-card-value">
                      ￥
                      <text>{{v.cardMoney}}</text>
                    </view>
                    <view class="charge-card-desc ellipsis">{{v.presentMoney>0?' 送'+v.presentMoney+'元余额':''}}{{v.presentIntegral>0?' 送'+v.presentIntegral+'积分':''}}{{v.presentCoupon>0?' 送'+v.presentCoupon+'优惠券':''}}</view>
                  </view>
                </van-col>
              </van-row>
            </view>
            <Empty desc="店家还未添加储值卡^_^" v-else />

          </scroll-view>
        </view>

        <view class="pay-popup-footer">
          <form @submit="sureRechargePay" :report-submit='true'>
            <button type="default" form-type="submit" class="but-default-submit but-pay-wechat" hover-class="but-default-submit-active" :disabled="disabledRecharge">立即储值</button>
          </form>
        </view>
      </view>

    </van-popup>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import pay from "@/utils/pay";
import Empty from "@/components/empty";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Empty
  },
  data() {
    return {
      errDefaultImage: "/static/images/default_logo_1x1.jpg",
      inputMoney: null,
      orderType: "immediately",
      disabledBut: !0,
      showPay: !1,
      payType: "wechat",

      isUseIntegral: !1, // 是否使用积分
      integralRebate: 0, // 积分抵扣金额
      initialIntegralRebate: 0, // 初始状态抵扣金额
      ratio: 0, // 1积分可抵扣10分
      maxDeductPerc: 0, // 最大可抵扣10%

      balance: 0,

      payMoney: 0,

      time: 0,

      recharge: !1,
      //储值卡
      showRechargeCardPay: !1,
      disabledRecharge: !0,
      chargeCardList: [],
      checkedCardId: null
    };
  },
  computed: {
    ...mapState(["isNewUser", "openid", "storeId", "storeInfo"])
  },

  watch: {
    storeId() {
      const that = this;
      const route = getCurrentPages().pop().route;
      if (route == "pages/pay/pay") {
        const storeId = that.storeId;
        that.getStoreInfo({ storeId, that });
      }
    }
  },

  methods: {
    ...mapActions([
      "checkIsNewUser",
      "bindWxLogin",
      "getStoreInfo",
      "setOptionsQuery",
      "setAccessRecort"
    ]),

    //init
    init() {
      this.inputMoney = null;
      this.disabledBut = !0;
      this.showPay = !1;
      this.payType = "wechat";
      this.isUseIntegral = !1;
      this.integralRebate = 0;
      this.initialIntegralRebate = 0;
      this.ratio = 0;
      this.maxDeductPerc = 0;
      this.balance = 0;
      this.payMoney = 0;
      this.time = 0;

      this.recharge = !1;
      this.showRechargeCardPay = !1;
      this.disabledRecharge = !0;
      this.chargeCardList = [];
      this.checkedCardId = null;
    },

    //输入金额
    onChangeMoney(e) {
      const _inputMoney = e.mp.detail;
      if (_inputMoney - 0.01 >= 0) {
        this.disabledBut = !1;
        this.inputMoney = _inputMoney;
      } else {
        this.inputMoney = null;
        this.disabledBut = !0;
      }
    },

    //关闭支付弹出层
    closePay() {
      this.showPay = !1;
      setTimeout(() => {
        wx.showTabBar();
      }, 10);
    },

    loopLaveFormId(id) {
      this.time = setInterval(() => {
        api.saveFormId(id);
      }, 5e3);
    },

    //是否使用积分
    onChangeIntegral(e) {
      this.isUseIntegral = e.mp.detail;

      if (e.mp.detail) {
        this.integralRebate = this.initialIntegralRebate;
      } else {
        this.integralRebate = 0;
      }
      this.calcPaymentMoney();
    },

    //点击支付方式
    onClickPayType(e) {
      const { name } = e.currentTarget.dataset;
      this.payType = name;
    },

    //立即买单
    formSubmit(e) {
      api.saveFormId(e.mp.detail.formId);
      // this.loopLaveFormId(e.mp.detail.formId);
      if (this.recharge) {
        this.showRechargeCardPay = !0;
      } else {
        this.showRechargeCardPay = !1;
        const _flag = this.checkMoney();
        if (_flag) {
          this.calcPaymentMoney();
          wx.hideTabBar();
          this.showPay = !0;
        }
      }
    },

    //授权后立即买单
    bindGetUserInfo(e) {
      const _flag = this.checkMoney();
      if (_flag) {
        let data = e.mp.detail;
        if (data.errMsg == "getUserInfo:ok") {
          let _decryptData = {
            encryptedData: data.encryptedData,
            iv: data.iv,
            openid: this.openid
          };
          this.bindWxLogin(_decryptData).then(res => {
            this.setAccessRecort(this.storeId);
            this.getIntegralBalance();

            wx.hideTabBar();
            this.showPay = !0;
          });
        }
      }
    },

    //校验输入金额
    checkMoney() {
      let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
        inputMoney = this.inputMoney,
        flag = !0,
        limitminInputMoney = 0.01;
      if (this.storeInfo.state == "disabled") {
        util.showToastError("该店铺被禁用！");
        return false;
      }

      if (!reg.test(inputMoney)) {
        util.showToastError("请输入有效的支付金额！");
        flag = !1;
      } else if (inputMoney - limitminInputMoney < 0) {
        util.showToastError("至少支付一分钱！");
        flag = !1;
      }
      return flag;
    },

    //计算最终支付金额
    calcPaymentMoney() {
      let a = this.inputMoney * 100; //输入金额
      let b = this.initialIntegralRebate; //积分数
      let c = this.ratio; //比例
      let d = this.maxDeductPerc / 100; //最大抵扣百分比
      let e = 0;
      const f = parseInt(a * d / c);

      if (b > f) e = util.moneyFormat(c * f);
      else e = util.moneyFormat(c * b);

      this.integralRebate = e;
      if (this.isUseIntegral) {
        this.payMoney = util.moneyFormat(a - e * 100);
      } else {
        this.payMoney = util.moneyFormat(a);
      }
    },

    //确认支付
    surePay(e) {
      api.saveFormId(e.mp.detail.formId);
      if (this.payType == "balance") {
        if (this.balance - this.payMoney < 0) {
          util.showToastError("余额不足，请选择其他支付方式！");
          return;
        } else {
          this.balancePay();
        }
      } else {
        this.wxPay();
      }
    },

    //微信支付
    async wxPay() {
      let data = {
        totalAmount: parseInt(this.inputMoney * 100),
        shopId: this.storeId,
        orderType: this.orderType,
        payType: this.payType,
        use: this.isUseIntegral
      };
      this.disabledBut = !0;

      const _pay = await pay
        .payOrder(data)
        .then(res => {
          this.disabledBut = !1;
          if (res.errMsg === "requestPayment:ok") {
            this.init();
            util.showToastSuccess("支付成功！");
            wx.showTabBar();
            setTimeout(() => {
              util.goToPaySuccess();
            }, 500);
          }
        })
        .catch(err => {
          this.disabledBut = !1;
          if (err.errMsg === "requestPayment:fail cancel") {
            this.cancelPayCallback(err.oid);
            util.showToastError("取消支付！");
          } else {
            util.showToastError(err.msg);
          }
        });
    },

    // 取消支付回调
    async cancelPayCallback(id) {
      const callback = await api.cancelPayCallback(id);
    },

    //余额支付
    async balancePay() {
      const data = {
        money: parseInt(this.inputMoney * 100),
        shopId: this.storeId,
        orderType: this.orderType,
        payType: this.payType,
        useIntegral: this.isUseIntegral
      };
      this.disabledBut = !0;
      const _pay = await api
        .payBillBalance(data)
        .then(res => {
          this.disabledBut = !1;
          this.init();
          util.showToastSuccess("支付成功！");
          wx.showTabBar();
          setTimeout(() => {
            util.goToPaySuccess();
          }, 500);
        })
        .catch(err => {
          this.disabledBut = !1;
        });
    },

    //获取积分余额
    async getIntegralBalance() {
      const _ib = await api
        .getIntegralBalance(this.storeId)
        .then(res => {
          const info = res.result;

          this.initialIntegralRebate = info.integral; //积分
          this.ratio = info.exchangePrice; //兑换比例
          this.maxDeductPerc = info.exchangeRatio; //最大抵扣比例
          this.balance = util.moneyFormat(info.remaining); //余额
        })
        .catch(err => {});
    },

    //是否购买储值卡
    onChangeRecharge(e) {
      this.recharge = e.mp.detail;
      if (e.mp.detail) {
        this.getChargeList();
      }
    },

    //关闭储值popup
    closeRechargePay() {
      this.showRechargeCardPay = !1;
    },

    //点选充值卡
    choiceCharge(i) {
      const _chargeCardList = this.chargeCardList;
      _chargeCardList.map((item, index) => {
        if (index == i) {
          item.checked = !0;
          this.checkedCardId = item.id;
        } else {
          item.checked = !1;
        }
      });
    },

    //购买储值卡
    sureRechargePay(e) {
      api.saveFormId(e.mp.detail.formId);
      this.submitCharge();
    },

    //充值
    async submitCharge() {
      if (this.disabledRecharge) return;

      if (this.storeInfo.state == "disabled") {
        util.showToastError("该店铺被禁用！");
        return false;
      }

      const data = {
        shopId: this.storeId,
        orderType: "charge",
        rechargeCardId: this.checkedCardId
      };
      this.disabledRecharge = !0;
      const charge = await pay
        .payOrder(data)
        .then(res => {
          this.disabledRecharge = !1;
          if (res.errMsg === "requestPayment:ok") {
            util.showToastSuccess("支付成功！");
            this.recharge = !1;
            this.showRechargeCardPay = !1;
            this.getIntegralBalance();
          }
        })
        .catch(err => {
          this.disabledRecharge = !1;
          if (err.errMsg === "requestPayment:fail cancel") {
            util.showToastError("取消支付！");
          } else {
            util.showToastError(err.msg);
          }
        });
    },

    //获取充值列表
    async getChargeList() {
      const charge = await api
        .getChargeCardList(this.storeId)
        .then(res => {
          if (res.list.length > 0) {
            const _list = res.list;
            _list.map(i => {
              i.cardMoney = util.moneyFormat(i.cardMoney);
              i.presentMoney = util.moneyFormat(i.presentMoney);
            });
            this.chargeCardList = _list;

            this.disabledRecharge = !1;
            this.chargeCardList[0].checked = !0;
            this.checkedCardId = this.chargeCardList[0].id;
          } else {
            this.disabledRecharge = !0;
            this.chargeCardList = [];
            this.checkedCardId = null;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //处理no found 图片
    errImg(i) {
      this.storeInfo.shopLogo = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.init();
    const that = this;
    that.setOptionsQuery({ options, that }).then(() => {});
    await Promise.all([that.checkIsNewUser(that)]).then(() => {
      that.setAccessRecort(that.storeId);
      that.getIntegralBalance();
    });
  },

  onHide() {
    this.inputMoney = null;

    const _t = this.time;
    clearInterval(_t);
  },

  onUnload() {
    const _t = this.time;
    clearInterval(_t);
  },

  //分享
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res);
    }
    return {
      title: `智慧便利店-买单`,
      path: `/pages/pay/pay?storeId=${this.storeId}`
    };
  }
};
</script>

<style lang="less">
@import "../../../static/css/common";

.pay {
  &-container {
    position: relative;
    padding: 20px 15px;
    .backgroundColor(#fff);
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      .merchant-info {
        width: calc(100% - 50px);
        .merchant-title {
          .fontSize(15px);
          .textColor(#333);
          margin-bottom: 8px;
        }
        .merchant-name {
          .textColor(#999);
        }
      }
      .merchant-logo {
        width: 40px;
        height: 40px;
        margin-left: 10px;
        .borderRadius(50%);
        overflow: hidden;

        image {
          width: 100%;
        }
      }
    }
    &-body {
      margin-bottom: 20px;
      .pay-money-title {
        margin-bottom: 10px;
      }
      .pay-money-form {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .money-icon {
          width: 30px;
          .fontSize(20px);
        }
        .money-input {
          width: calc(100% - 30px);
        }
      }
    }
    .recharge-checkbox {
      margin-bottom: 20px;
      .recharge-label {
        .textColor(#999);
      }
    }
    &-footer {
      .but-pay {
        .but-default();
        .fontSize(16px);
      }
    }
  }

  // 弹出层支付
  .pay-popup-box {
    overflow-y: visible;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .pay-popup-content {
      position: relative;
      box-sizing: border-box;
      .pay-popup-header {
        padding: 20px 15px;
        text-align: center;
      }
      .pay-popup-body {
        min-height: 50px;
        padding-bottom: 80px;
        .pay-scroll-area {
          height: 100%;
          margin-bottom: 10px;
          .pay-content {
            position: relative;
            padding: 0 15px 20px;
            text {
              .textColor(#999);
            }
          }
          .pay-content::after {
            .backgroundLine();
          }
          .charge-content {
            padding: 20px 15px;
            .charge-card-item {
              padding-top: 7.5px;
              padding-bottom: 7.5px;
              .charge-card-content {
                padding: 10px;
                height: 146rpx;
                border: 0.5px solid #ddd;
                .borderRadius(4px);
                overflow: hidden;
                .charge-card-title {
                }
                .charge-card-value {
                  padding: 5px 0;
                  text-align: center;
                  .textColor(#f85437);
                  text {
                    .fontSize(24px);
                  }
                }
                .charge-card-desc {
                  text-align: right;
                  .textColor(#999);
                  .fontSize(12px);
                }
              }
              .charge-card-content.active {
                border-color: #f85437;
              }
            }
          }
        }
        .pay-type-content {
          .pay-type-header {
            padding: 10px 15px;
            .fontSize(16px);
          }
          .pay-type-body {
            .van-cell__title {
              flex: 3;
            }
            .pay-type-cell-title {
              display: flex;
              align-items: center;
              .pay-type-icon {
                height: 24px;
                line-height: 32px;
                margin-right: 5px;
                overflow: hidden;
              }
              .van-cell-text {
                text {
                  margin-left: 5px;
                  .fontSize(13px);
                  .textColor(#0ae);
                }
              }
            }
          }
        }
        .pay-type-discount {
          margin-bottom: 10px;
        }
        .pay-type-discount .order-others-cell {
          align-items: center;
        }
        .pay-type-discount {
          .slot-icon {
            display: inline-block;
            height: 16px;
            margin-right: 4px;
            padding: 0 4px;
            text-align: center;
            color: #fff;
            line-height: 16px;
            .fontSize(10px);
            .borderRadius(2px);
          }

          .slot-icon-integral {
            .backgroundLiearGraientLR(#57be6a, #5dc870);
          }

          .integral-preferential-value {
            .textColor(#57be6a);
          }
          .switch-integral {
            margin-left: 10px;
            vertical-align: middle;
          }
        }
      }
      .pay-popup-footer {
        position: absolute;
        height: 44px;
        padding: 15px 30px 20px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .but-pay-wechat {
        }
      }

      .close-popup {
        position: absolute;
        width: 24px;
        height: 24px;
        right: 10px;
        top: 10px;
        z-index: 999;
      }
    }
  }
}
</style>
