<template>
  <view class="pages virtual-order-pay">
    <view class="virtual-order-pay-content">
      <van-cell-group custom-class="virtual-goods-info">
        <van-cell icon="gift-o" title="商品名称" :value="goodsInfo.goodsName" value-class="virtual-goods-name"> </van-cell>
        <van-cell icon="cash-on-deliver" title="商品售价" :value="'￥'+(goodsInfo.salePrice||'0.00')" value-class="virtual-goods-price"> </van-cell>
        <van-cell icon="flag-o" title="购买方式" :value="goodsInfo.goodsType=='5'?'直充':goodsInfo.goodsType=='6'?'卡密':'其他'"> </van-cell>
        <van-cell icon="points" title="购买数量" v-if="goodsInfo.goodsType=='6'">
          <view slot="right-icon">
            <van-stepper :value="rechargeNumber" integer min="1" step="1" @change="onChangeRechargeNumber" />
          </view>
        </van-cell>
        <van-cell icon="points" title="购买数量" v-else-if="goodsInfo.goodsType=='5'&&goodsInfo.goodsId=='8350'">
          <view slot="right-icon">
            <van-stepper :value="rechargeNumber" integer min="1" step="1" @change="onChangeRechargeNumber" />
          </view>
        </van-cell>
        <van-cell icon="records" title="订单小计" :value="'￥'+finalPaymentMoney" value-class="virtual-goods-price"> </van-cell>

        <van-field left-icon="edit" required :value="rechargeAccount" label="充值账号" placeholder="请输入充值账号" v-if="goodsInfo.goodsType=='5'" @change="onChangeRechargeAccount" />
      </van-cell-group>
    </view>

    <!-- <view class="virtual-order-pay-description" v-if="goodsInfo.virtualGoodsSpec">
      <van-icon name="info" color="#e00000" size="20px" />
      <view class="warning-info">
        <wxParse :content="goodsInfo.virtualGoodsSpec" />

      </view>
    </view> -->

    <view class="virtual-order-pay-footer">
      <button type="default" open-type="getUserInfo" lang="zh_CN" class="but-default-submit" hover-class="but-default-submit-active" :disabled="orderPayDisabled" v-if="isNewUser" @getuserinfo="bindGetUserInfo">立即购买</button>
      <form @submit="formSubmit" :report-submit='true' v-else>
        <button type="default" form-type="submit" class="but-default-submit" hover-class="but-default-submit-active" :disabled="orderPayDisabled">立即购买</button>
      </form>

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
        </view>
        <view class="pay-popup-footer">
          <form @submit="payFormSubmit" :report-submit='true'>
            <button type="default" form-type="submit" class="but-default-submit but-pay-wechat" hover-class="but-default-submit-active" :disabled="disabledBut">微信支付 {{goodsInfo.salePrice}} 元</button>
          </form>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import wxParse from "mpvue-wxparse";
import api from "@/utils/api";
import util from "@/utils/util";
import pay from "@/utils/pay";
import Empty from "@/components/empty";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Empty,
    wxParse
  },
  data() {
    return {
      showPay: !1,

      orderType: "virtualGoods",
      goodsId: null,
      goodsInfo: {},
      rechargeNumber: 1,
      rechargeAccount: null,
      orderPayDisabled: !1,
      finalPaymentMoney: 0,
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["isNewUser", "openid", "storeId"])
  },

  created() {},

  mounted() {},

  methods: {
    ...mapActions(["checkIsNewUser", "bindWxLogin", "setAccessRecort"]),

    //购买数量
    onChangeRechargeNumber(e) {
      this.rechargeNumber = e.mp.detail || 1;
      this.countPayment();
    },

    //冲值帐号
    onChangeRechargeAccount(e) {
      this.rechargeAccount = e.mp.detail;
    },

    countPayment() {
      this.finalPaymentMoney = util.moneyFormat(
        this.goodsInfo.salePrice * 100 * this.rechargeNumber
      );
    },

    //正常支付
    formSubmit(e) {
      api.saveFormId(e.mp.detail.formId);
      this.bindOrderPay();
    },

    //弹出层支付
    payFormSubmit(e) {
      api.saveFormId(e.mp.detail.formId);
      this.bindOrderPay();
    },

    //关闭支付弹出层
    closePay() {
      this.showPay = !1;
    },

    //绑定微信
    bindGetUserInfo(e) {
      let data = e.mp.detail;
      if (data.errMsg == "getUserInfo:ok") {
        let _decryptData = {
          encryptedData: data.encryptedData,
          iv: data.iv,
          openid: this.openid
        };
        this.bindWxLogin(_decryptData).then(res => {
          this.setAccessRecort(this.storeId);
          this.showPay = !0;
        });
      }
    },

    //校验数据
    checkData() {
      let flag = !0;
      const _type = this.goodsInfo.goodsType;
      if (_type == "5") {
        if (!this.rechargeAccount) {
          util.showToastError("请输入充值账号！");
          flag = !1;
          return false;
        }
      }
      return flag;
    },

    //立即购买
    bindOrderPay() {
      const _flag = this.checkData();
      _flag && this.virtualPayOrder();
    },

    //下单支付
    async virtualPayOrder() {
      const _type = this.goodsInfo.goodsType;
      let _data = {};
      if (_type == "5") {
        _data = {
          shopId: this.storeId,
          type: _type,
          id: this.goodsInfo.id,
          account: this.rechargeAccount,
          orderType: this.orderType,
          number: this.rechargeNumber
        };
      } else if (_type == "6") {
        _data = {
          shopId: this.storeId,
          type: _type,
          id: this.goodsInfo.id,
          orderType: this.orderType,
          number: this.rechargeNumber
        };
      }
      this.orderPayDisabled = !0;

      const orderPay = await pay
        .payOrder(_data)
        .then(res => {
          this.orderPayDisabled = !1;
          if (res.errMsg === "requestPayment:ok") {
            util.showToastSuccess("支付成功！");
            setTimeout(() => {
              util.goToPaySuccess();
            }, 500);
          }
        })
        .catch(err => {
          this.orderPayDisabled = !1;
          if (err.errMsg === "requestPayment:fail cancel") {
            util.showToastError("取消支付！");
          } else {
            util.showToastError(err.msg);
          }
        });
    },

    //获取虚拟商品详情
    async getGoodsInfo() {
      await api
        .getPlatformGoodsInfo(this.goodsId)
        .then(res => {
          let _info = res.result;
          _info.faceValue = util.moneyFormat(_info.faceValue * 100);
          _info.salePrice = util.moneyFormat(_info.salePrice * 100);
          this.goodsInfo = _info;
          this.countPayment();
        })
        .catch(err => {});
    }
  },

  async onLoad(options) {
    this.rechargeNumber = 1;
    const that = this;
    that.goodsId = options.id;
    that.checkIsNewUser(that).then(() => {
      that.setAccessRecort(that.storeId);
    });

    await Promise.all([that.getGoodsInfo()]);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../static/css/common";
.virtual-order-pay {
  .virtual-order-pay-content {
    .virtual-goods-info {
      .van-cell__title {
        flex: 1;
      }
      .van-cell__value {
        flex: 3;
        color: #999;
      }

      .virtual-goods-name {
        text-align: left;
      }
      .virtual-goods-price {
        color: #f85437;
      }
    }
  }
  .virtual-order-pay-description {
    display: flex;
    padding: 10px 15px 85px;
    .warning-info {
      width: calc(100% - 20px);
      overflow: hidden;
      margin-left: 5px;
    }
  }

  .virtual-order-pay-footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 30px 30px;
    background: #f1f1f1;
    .but-buy-now {
      .but-default(#f85437);
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
        padding-bottom: 70px;
        .pay-scroll-area {
          height: 100%;
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
        }
      }
      .pay-popup-footer {
        position: absolute;
        height: 50px;
        padding: 10px 30px 25px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .but-pay-wechat {
          .but-default(#57be6a);
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
