<template>
  <view class="pages im-order-detail">
    <view class="im-order-detail-top">
      <view class="shop-logo">
        <image :src="orderInfo.storeModelInfo.shopLogo?orderInfo.storeModelInfo.shopLogo:'/static/images/default_logo_1x1.jpg'" mode="widthFix" @error="errShopLogo" />
      </view>
      <view class="shop-name">
        {{orderInfo.storeModelInfo.shopName}}
      </view>
      <view class="order-pay-money">
        -￥ <text>{{orderInfo.payment}}</text>
      </view>
    </view>

    <view class="im-order-detail-money">
      <view class="im-order-detail-money-item" v-if="orderInfo.memberAmount>0">
        <view class="im-order-detail-money-title">会员折扣：</view>
        <view class="im-order-detail-money-value">-￥ {{orderInfo.memberAmount}}</view>
      </view>
      <view class="im-order-detail-money-item" v-if="orderInfo.pointsDeduction>0">
        <view class="im-order-detail-money-title">积分抵扣：</view>
        <view class="im-order-detail-money-value">-￥ {{orderInfo.pointsDeduction}}</view>
      </view>

    </view>

    <view class="im-order-detail-info">
      <view class="im-order-detail-info-title">订单信息</view>
      <view class="im-order-detail-info-body">
        <van-cell-group :border="false">
          <van-cell title="订单编号：" value-class="detail-value-info" :value="orderInfo.orderNumber" :border="false" />
          <van-cell title="支付方式：" value-class="detail-value-info" :value="orderInfo.payType=='weixin'?'微信':orderInfo.payType=='alipay'?'支付宝':orderInfo.payType=='balance'?'余额':'其他'" :border="false" />
          <van-cell title="创建时间：" value-class="detail-value-info" :value="orderInfo.addDataTime" :border="false" />
          <van-cell title="支付时间：" value-class="detail-value-info" :value="orderInfo.paymentTime" :border="false" />
          <van-cell title="完成时间：" value-class="detail-value-info" :value="orderInfo.closeTime" :border="false" />
        </van-cell-group>
      </view>
    </view>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState } from "vuex";
export default {
  data() {
    return {
      orderId: null,

      orderInfo: {
        storeModelInfo: {
          shopLogo: null,
          shopName: null
        },
        orderNumber: "", //订单编号F
        goodsPrice: 0, //商品总金额
        memberAmount: 0, //会员折扣金额
        couponAmount: 0, //优惠券抵扣金额
        pointsDeduction: 0, //积分抵扣金额
        payType: null, // 支付方式
        payment: 0, //支付总金额
        addDataTime: "", //订单创建时间
        paymentTime: "", //订单支付时间
        onsignTime: "", //订单发货时间
        endTime: "", //订单签收时间
        closeTime: "" //订单完成时间
      },

      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["storeInfo"])
  },
  created() {},

  mounted() {},

  methods: {
    async getOrderDetail() {
      const detail = await api
        .getOrderDetail(this.orderId)
        .then(res => {
          let data = res.info;
          this.setOrderInfo(data);
        })
        .catch(err => {
          console.log(err);
        });
    },

    //设置订单信息
    setOrderInfo(data) {
      this.orderInfo.storeModelInfo = data.shopInfoModel;

      this.orderInfo.orderNumber = data.orderId;
      this.orderInfo.goodsPrice = util.moneyFormat(data.goodsPrice);

      this.orderInfo.memberAmount = util.moneyFormat(data.memberAmount);
      this.orderInfo.couponAmount = util.moneyFormat(data.couponAmount);
      this.orderInfo.pointsDeduction = util.moneyFormat(data.pointsDeduction);

      this.orderInfo.payType = data.payType;
      this.orderInfo.payment = util.moneyFormat(data.payment);
      this.orderInfo.addDataTime = data.addDataTime;
      this.orderInfo.paymentTime = data.paymentTime;
      this.orderInfo.onsignTime = data.onsignTime;
      this.orderInfo.endTime = data.endTime;
      this.orderInfo.closeTime = data.closeTime;
    },

    //处理no found 图片
    errShopLogo() {
      this.orderInfo.storeModelInfo.shopLogo = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.orderId = options.orderId;
    await Promise.all([this.getOrderDetail()]);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.im-order-detail {
  position: relative;
  .im-order-detail-top {
    padding: 30px 15px;
    .backgroundColor(#fff);
    .shop-logo {
      width: 40px;
      height: 40px;
      margin: 0 auto 20px;
      .borderRadius(50%);
      text-align: center;
      line-height: 40px;
      overflow: hidden;
      image {
        width: 100%;
      }
    }
    .shop-name {
      padding: 5px 15px 20px;
      text-align: center;
    }
    .order-pay-money {
      padding: 10px 15px;
      text-align: center;
      .textColor(#f85437);
      text {
        .fontSize(18px);
      }
    }
  }

  .im-order-detail-money {
    position: relative;
    margin-bottom: 10px;
    padding: 10px 15px;
    .backgroundColor(#fff);
    .im-order-detail-money-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      .im-order-detail-money-title {
        flex: 1;
      }
      .im-order-detail-money-value {
        flex: 1;
        text-align: right;
        .textColor(#666);
      }
    }
    .im-order-detail-money-item.order-actual-money::after {
      position: absolute;
      content: "";
      left: -15px;
      right: -15px;
      top: 0;
      height: 1px;
      transform: scaleY(0.5);
      overflow: hidden;
      .backgroundColor(#eee);
    }
  }

  .im-order-detail-info {
    .backgroundColor(#fff);
    .im-order-detail-info-title {
      position: relative;
      padding: 10px 15px;
      .fontSize(20px);
    }
    .im-order-detail-info-title::after {
      .backgroundLine();
    }
    .im-order-detail-info-body {
      padding: 10px 15px;
      .detail-value-info {
        flex: 2;
      }
    }
  }
}
</style>
