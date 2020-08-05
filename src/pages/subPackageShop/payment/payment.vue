<template>
  <view class="pages payment">
    <view class="pay-money">
      应付金额：<text>{{payMoney}}</text> 元
    </view>

    <view class="pay-title">选择支付方式：</view>
    <view class="pay-type">
      <view :class="payType=='wechat'?'pay-type-itme checked':'pay-type-itme'" @click="checkPayType" data-type="wechat" v-if="payMoney>0">
        <van-icon name="wechat" size="24px" color="#4bc065" class="pay-type-logo" />
        <view class="pay-type-name">微信支付</view>
        <van-icon v-if="payType=='wechat'" name="checked" size="20px" color="#e00000" class="pay-type-icon" />
        <van-icon v-else name="circle" size="20px" class="pay-type-icon" />
      </view>
      <view :class="payType=='balance'?'pay-type-itme checked':'pay-type-itme'" @click="checkPayType" data-type="balance" v-if="platform!='oppVirtual'&&platform!='oppEntity'">
        <van-icon name="balance-pay" size="24px" color="#0ae" class="pay-type-logo" />
        <view class="pay-type-name">店铺余额<text>（当前余额：{{curBalance}} 元）</text></view>
        <van-icon v-if="payType=='balance'" name="checked" size="20px" color="#e00000" class="pay-type-icon" />
        <van-icon v-else name="circle" size="20px" class="pay-type-icon" />
      </view>
    </view>

    <view class="pay-button">
      <form @submit="formSubmit" :report-submit='true'>
        <button type="default" form-type="submit" class="but-default-submit but-pay" hover-class="but-default-submit-active" :disabled="canPay">确认支付</button>
      </form>
      <van-button round block custom-class="but-cancel-pay" @click="cancelPay">取消支付</van-button>
    </view>
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import pay from "@/utils/pay";
import { mapState } from "vuex";
export default {
  data() {
    return {
      platform: "mch", //oppVirtual:'平台虚拟；oppEntity:'平台实物；'mch:'商户商品'；
      payType: "wechat", // 'wechat'：微信支付 'balance'：余额支付
      orderType: "onlineOrder",
      payMoney: 0,
      curBalance: 0,
      canPay: !1
    };
  },

  computed: {
    ...mapState(["storeInfo"])
  },

  created() {},

  mounted() {},

  methods: {
    checkPayType(e) {
      let _type = e.mp.currentTarget.dataset.type;
      this.payType = _type;
    },

    formSubmit(e) {
      api.saveFormId(e.mp.detail.formId);
      this.surePay();
    },

    //确认支付
    surePay() {
      if (this.storeInfo.state == "disabled") {
        util.showToastError("该店铺被禁用！");
        return false;
      }

      if (this.payType == "balance") {
        if (this.curBalance - this.payMoney < 0) {
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
        orderId: this.orderId,
        orderType: this.orderType,
        payType: this.payType
      };
      const _pay = await pay
        .payOrder(data)
        .then(res => {
          if (res.errMsg === "requestPayment:ok") {
            util.showToastSuccess("支付成功！");
            if (this.groupId) {
              const url = `/pages/subPackageGroupBuy/groupJoin?groupId=${
                this.groupId
              }`;
              util.reLaunch(url);
            } else {
              setTimeout(() => {
                util.goToPaySuccess();
              }, 500);
            }
          }
        })
        .catch(err => {
          if (err.errMsg === "requestPayment:fail cancel") {
            util.showToastError("取消支付！");
          } else {
            util.showToastError(err.msg);
          }
        });
    },

    //余额支付
    async balancePay() {
      const _pay = await api
        .payBalance(this.orderId)
        .then(res => {
          util.showToastSuccess("支付成功！");
          if (this.groupId) {
            const url = `/pages/subPackageGroupBuy/groupJoin?groupId=${
              this.groupId
            }`;
            util.reLaunch(url);
          } else {
            setTimeout(() => {
              util.goToPaySuccess();
            }, 500);
          }
        })
        .catch(err => {});
    },

    //获取应付金额 及可用余额
    async getPayMoneyCurBalance(id) {
      const _money = await api
        .getPayMoneyCurBalance(id)
        .then(res => {
          if (res.result.payment == 0) this.payType = "balance";

          this.payMoney = util.moneyFormat(res.result.payment);
          this.curBalance = util.moneyFormat(res.result.balance);
        })
        .catch(err => {
          console.log(err);
        });
    },

    //取消支付
    cancelPay() {
      util.navigateBack(1);
    }
  },

  async onLoad(options) {
    this.payType = "wechat";
    
    const _platform = options.platform;
    const _orderId = options.orderId;
    const _groupId = options.groupId;

    this.platform = _platform;

    this.orderId = _orderId;

    if (_platform == "oppVirtual") this.orderType = "virtualGoods";
    else if (_platform == "oppEntity") this.orderType = "physicalGoods";
    else this.orderType = "onlineOrder";

    if (_groupId) this.groupId = _groupId;
    else this.groupId = null;

    await this.getPayMoneyCurBalance(_orderId);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.payment {
  position: relative;
  .pay-money {
    padding: 20px 15px;
    text {
      .fontSize(20px);
      .textColor(#e00000);
    }
  }
  .pay-title {
    padding: 10px 15px;
    font-weight: bold;
    .backgroundColor(#fff);
    .fontSize(16px);
    text {
      font-weight: normal;
      .fontSize(15px);
    }
  }
  .pay-type {
    padding: 10px 15px;
    .backgroundColor(#fff);
    .pay-type-itme {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 10px;
      padding: 10px 15px;
      border: 1px solid #eee;
      .borderRadius(4px);
      .pay-type-logo {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
      .pay-type-name {
        width: calc(100% - 60px);
        .fontSize(16px);
        text {
          margin-left: 5px;
          .fontSize(13px);
          .textColor(#0ae);
        }
      }
    }
    .pay-type-itme.checked {
      .borderColor(#e00000);
    }
  }
  .pay-button {
    margin: 30px 15px 10px;
    .but-pay {
      margin-bottom: 15px;
    }
    .but-cancel-pay {
      .fontSize(15px);
      .but-default(#fbb850);
    }
  }
}
</style>
