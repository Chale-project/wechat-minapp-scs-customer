<template>
  <view class="pages order-detail">

    <view class="order-detail-cancel" v-if="orderInfo.orderStatus=='cancel'">
      <image src="/static/images/icon_error.png" mode="widthFix" />
      <text>订单已取消</text>
    </view>

    <view class="order-detail-cancel" v-else-if="orderInfo.orderStatus=='refunded'">
      <image src="/static/images/order_detail_unpay.png" mode="widthFix" />
      <text>订单已退款</text>
    </view>

    <view class="order-detail-status" v-else>
      <van-steps :steps="steps" :active="activeSteps" custom-class="order-status-steps" active-color="#333" />
    </view>

    <view class="order-detail-address-getcode">
      <block v-if="orderInfo.orderType=='onlineOrder'">
        <block v-if="orderInfo.deliveryType=='home'">
          <view class="order-detail-address">
            <view class="order-detail-address-icon">
              <van-icon name="location" color="#f85437" size="20px" />
            </view>
            <view class="order-detail-address-info">
              <view class="order-detail-address-consignee"><text class="consignee-name">{{addressInfo.consignee}}</text> <text>{{addressInfo.mobile}}</text></view>
              <view class="order-detail-address-detail">{{addressInfo.address}}</view>
            </view>
          </view>
        </block>
        <block v-else-if="orderInfo.deliveryType=='shop'">
          <view class="order-detail-getcode" v-if="orderInfo.orderStatus!='unpay'&&orderInfo.orderStatus!='cancel'&&orderInfo.orderStatus!='waitGroup'">
            <view class="order-detail-getcode-title">取货码：</view>
            <view class="order-detail-getcode-number">{{orderInfo.verificationCode}}</view>
            <view class="order-detail-getcode-image">
              <canvas canvas-id="myQrcode"></canvas>
            </view>
          </view>
        </block>
      </block>
      <block v-else>

      </block>
    </view>

    <view class="order-detail-content">
      <view class="order-detail-seller-info">
        <block v-if="storeModelInfo!=null">
          <image class="seller-logo" :src="storeModelInfo.shopLogo?storeModelInfo.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errShopLogo" />
          <view class="seller-name ellipsis">{{storeModelInfo.shopName}}</view>
        </block>
        <block v-else>
          <image class="seller-logo" src="/static/images/default_logo_1x1.jpg" />
          <view class="seller-name ellipsis" v-if="orderInfo.orderType=='physicalGoods'">平台自营-实物商品</view>
          <view class="seller-name ellipsis" v-else-if="orderInfo.orderType=='virtualGoods'">平台自营-虚拟商品</view>
        </block>

      </view>
      <view class="order-detail-goods-info">
        <block v-if="orderInfo.orderType=='virtualGoods'">

          <view class="order-goods-list" v-for="(v,i) of goodsInfo" :key="i">
            <view class="order-goods-info">
              <view class="goods-thumb">
                <block v-if="v.operation">
                  <image v-if="v.operation==0" src="/static/images/icon_10010.jpg" />
                  <image v-else-if="v.operation==1" src="/static/images/icon_10086.jpg" />
                  <image v-else-if="v.operation==2" src="/static/images/icon_10000.jpg" />
                </block>
                <block v-else>
                  <image :src="v.itemImages?v.itemImages:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" />
                </block>
              </view>
              <view class="goods-others">
                <view class="goods-title ellipsis-2">{{v.goodsTitle}}</view>
                <view class="goods-spec ellipsis" v-if="v.account">冲值帐号:{{v.account}}</view>
                <view class="goods-spec ellipsis" v-if="v.virtualGoodsType=='0'">充值面额：{{v.faceValue}}元</view>
                <view class="goods-spec ellipsis" v-if="v.virtualGoodsType=='2'">充值面额：{{v.flowSize%1024>0?v.flowSize+'M':v.flowSize/1024+'G'}}</view>
                <view class="goods-price-number">
                  <view class="goods-price">￥{{v.price}}</view>
                  <view class="goods-number">X {{v.num}}</view>
                </view>
              </view>

            </view>
            <view class="goods-exchange" v-if="orderInfo.orderStatus!='unpay'&&orderInfo.orderStatus!='cancel'&&orderInfo.orderStatus!='refunded'&&v.virtualGoodsType=='6'">
              <view class="goods-exchange-header">兑换方式：</view>
              <view class="goods-exchange-content">{{v.cardsInfo?v.cardsInfo:''}}</view>
            </view>

          </view>
        </block>
        <block v-else>
          <view class="order-goods-list" v-for="(v,i) of goodsInfo" :key="i">
            <view class="order-goods-info" @click="goGoodsDetail(v)">
              <view class="goods-thumb">
                <image :src="v.itemImages?v.itemImages:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" />
              </view>
              <view class="goods-others">
                <view class="goods-title ellipsis-2">{{v.goodsTitle}}</view>
                <view class="goods-spec ellipsis">{{v.specificationItems?v.specificationItems:''}}</view>
                <view class="goods-price-number">
                  <view class="goods-price">￥{{v.price}}</view>
                  <view class="goods-number">X {{v.num}}</view>
                </view>
              </view>
            </view>

          </view>
        </block>

      </view>
    </view>

    <view class="order-detail-money">
      <view class="order-detail-money-item">
        <view class="order-detail-money-title">商品金额：</view>
        <view class="order-detail-money-value">+{{orderInfo.goodsPrice}}</view>
      </view>
      <view class="order-detail-money-item">
        <view class="order-detail-money-title">配送费：</view>
        <view class="order-detail-money-value">+{{orderInfo.deliveryCost>0?orderInfo.deliveryCost:'0.00'}}</view>
      </view>
      <view class="order-detail-money-item" v-if="orderInfo.couponAmount>0">
        <view class="order-detail-money-title">优惠券抵扣：</view>
        <view class="order-detail-money-value">-{{orderInfo.couponAmount}}</view>
      </view>
      <view class="order-detail-money-item" v-if="orderInfo.memberAmount>0">
        <view class="order-detail-money-title">会员折扣：</view>
        <view class="order-detail-money-value">-{{orderInfo.memberAmount}}</view>
      </view>
      <view class="order-detail-money-item" v-if="orderInfo.pointsDeduction>0">
        <view class="order-detail-money-title">积分抵扣：</view>
        <view class="order-detail-money-value">-{{orderInfo.pointsDeduction}}</view>
      </view>
      <view class="order-detail-money-item order-actual-money">
        <view class="order-detail-money-title">支付金额：</view>
        <view class="order-detail-money-value">￥{{orderInfo.payment}}</view>
      </view>

      <view class="order-detail-money-item order-actual-money" v-if="orderInfo.orderStatus=='refunded'">
        <view class="order-detail-money-title">退款金额：</view>
        <view class="order-detail-money-value">￥{{orderInfo.payment}}</view>
      </view>
    </view>

    <view class="order-detail-remark">
      <view class="order-detail-remark-item">
        <view class="order-detail-remark-title">备注：</view>
        <view class="order-detail-remark-value" v-if="orderInfo.orderType=='immediately'">线下店铺买单的订单</view>
        <view class="order-detail-remark-value" v-else-if="orderInfo.orderType=='charge'">店铺储值的订单</view>
        <view class="order-detail-remark-value" v-else>{{orderInfo.remark||'--'}}</view>
      </view>
    </view>

    <view class="order-detail-distribution" v-if="orderInfo.orderType=='onlineOrder'&&orderInfo.deliveryType=='home'">
      <view class="distribution-icon">
        <image src="/static/images/distribution_icon.jpg" mode="widthFix" />
      </view>
      <view class="distribution-info">
        <block v-if="orderInfo.deliveryman">
          <view class="distribution-name ellipsis">配送人：<text>{{orderInfo.deliveryman}}</text></view>
          <view class="distribution-tel ellipsis">联系方式：<text>{{orderInfo.deliverymanPhone}}</text></view>
        </block>
        <block v-else>
          <view class="distribution-none">暂无配送信息</view>
        </block>
      </view>
    </view>

    <view class="order-detail-info">
      <view class="order-detail-info-title">订单信息</view>
      <view class="order-detail-info-body">
        <view class="order-detail-info-list ellipsis">订单编号：{{orderInfo.orderNumber}}</view>
        <view class="order-detail-info-list ellipsis" v-if="orderInfo.orderStatus!='unpay'&&orderInfo.orderStatus!='cancel'">支付方式：{{orderInfo.payType=='weixin'?'微信':orderInfo.payType=='alipay'?'支付宝':orderInfo.payType=='balance'?'余额':'其他'}}</view>
        <view class="order-detail-info-list ellipsis">创建时间：{{orderInfo.addDataTime}}</view>
        <view class="order-detail-info-list ellipsis" v-if="orderInfo.paymentTime">支付时间：{{orderInfo.paymentTime}}</view>
        <view class="order-detail-info-list ellipsis" v-if="orderInfo.onsignTime">发货时间：{{orderInfo.onsignTime}}</view>
        <view class="order-detail-info-list ellipsis" v-if="orderInfo.endTime">签收时间：{{orderInfo.endTime}}</view>
        <view class="order-detail-info-list ellipsis" v-if="orderInfo.closeTime">完成时间：{{orderInfo.closeTime}}</view>
      </view>
    </view>

    <view class="order-detail-operates">
      <van-button custom-class="but-order-operates" @click="callSellerPhone">联系店家</van-button>

      <!-- 待付款 -->
      <block v-if="orderInfo.orderStatus=='unpay'">
        <van-button custom-class="but-order-operates but-order-cancel" @click="cancelOrder">取消订单</van-button>
        <van-button custom-class="but-order-operates but-order-gotopay" @click="goOnPay">继续支付</van-button>
      </block>
      <!-- 已支付 -->
      <block v-else-if="orderInfo.orderStatus=='paid'"></block>
      <!-- 待发货 -->
      <block v-else-if="orderInfo.orderStatus=='waitSending'"></block>
      <!-- 已发货 -->
      <block v-else-if="orderInfo.orderStatus=='shipped'">
        <van-button custom-class="but-order-operates but-order-sure-receipt" @click="sureReceipt">确认收货</van-button>
      </block>
      <!-- 已送达 -->
      <block v-else-if="orderInfo.orderStatus=='arrived'">
        <van-button custom-class="but-order-operates but-order-sure-receipt" @click="sureReceipt">确认收货</van-button>
      </block>
      <!-- 待收货 -->
      <block v-else-if="orderInfo.orderStatus=='waitReceiving'">
        <van-button custom-class="but-order-operates but-order-sure-receipt" @click="sureReceipt">确认收货</van-button>
      </block>
      <!-- 已收货 -->
      <block v-else-if="orderInfo.orderStatus=='receipted'"></block>
      <!-- 已完成 -->
      <block v-else-if="orderInfo.orderStatus=='success'"></block>

    </view>

    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Dialog from "../../../../static/vant/dialog/dialog";
import drawQrcode from "weapp-qrcode";
import { mapState } from "vuex";
export default {
  data() {
    return {
      orderId: null,
      steps: [
        { text: "已下单", desc: "" },
        { text: "已付款", desc: "" },
        { text: "已发货", desc: "" },
        { text: "交易完成", desc: "" }
      ],
      activeSteps: 0,
      addressInfo: {
        consignee: "",
        mobile: "",
        address: ""
      },
      storeModelInfo: null, //订单来源店铺
      orderInfo: {
        orderType: null, //订单类型
        saleType: null, // 活动类型 'group':拼团； 'seckill': 秒杀
        groupId: null, // 团ID
        orderStatus: null, //订单状态
        deliveryType: null, //订单配送类型：'home':送货上门；'shop':到店自提
        deliveryCost: 0, //运费
        deliveryman: "", //配送人
        deliverymanPhone: "", //配送人电话
        orderNumber: "", //订单编号F
        goodsPrice: 0, //商品总金额
        verificationCode: null, // 自提订单核销码
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

      goodsInfo: [],

      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["storeInfo"])
  },
  created() {},

  mounted() {},

  async onShow() {
    let _orid = this.$root.$mp.query.orderId;
    this.orderId = _orid;
    await Promise.all([this.getOrderDetail()]);
  },

  methods: {
    async getOrderDetail() {
      const detail = await api
        .getOrderDetail(this.orderId)
        .then(res => {
          let data = res.info;
          this.setOrderStatus(data);
          this.setAddressInfo(data);
          this.setStoreInfo(data);
          this.setOrderInfo(data);
          this.setGoodsInfo(data.orderDescModelList);
        })
        .catch(err => {
          console.log(err);
        });
    },

    //设置订单状态显示
    setOrderStatus(data) {
      const _status = data.state;
      if (_status == "unpay") {
        this.activeSteps = 0;
      } else if (
        _status == "paid" ||
        _status == "waitSending" ||
        _status == "waitGroup"
      ) {
        this.activeSteps = 1;
      } else if (
        _status == "shipped" ||
        _status == "arrived" ||
        _status == "waitReceiving"
      ) {
        this.activeSteps = 2;
      } else if (_status == "receipted" || _status == "success") {
        this.activeSteps = 3;
      }

      if (data.addDataTime)
        this.steps[0].desc = data.addDataTime.substring(0, 10);
      else this.steps[0].desc = "";
      if (data.paymentTime)
        this.steps[1].desc = data.paymentTime.substring(0, 10);
      else this.steps[1].desc = "";
      if (data.onsignTime)
        this.steps[2].desc = data.onsignTime.substring(0, 10);
      else this.steps[2].desc = "";
      if (data.closeTime) this.steps[3].desc = data.closeTime.substring(0, 10);
      else this.steps[3].desc = "";
    },

    //设置地址信息
    setAddressInfo(data) {
      this.addressInfo.consignee = data.receiver;
      this.addressInfo.mobile = data.receiverMobile;
      this.addressInfo.address = data.receiverAddress;
    },

    // 订单来源店铺
    setStoreInfo(data) {
      this.storeModelInfo = data.shopInfoModel;
    },

    //设置订单信息
    setOrderInfo(data) {
      this.orderInfo.orderType = data.orderType;
      this.orderInfo.saleType = data.saleType;
      this.orderInfo.groupId = data.saleOrderId;

      this.orderInfo.orderStatus = data.state;
      this.orderInfo.deliveryCost = util.moneyFormat(data.deliveryCost);
      this.orderInfo.deliveryType = data.deliveryType;
      this.orderInfo.deliveryman = data.deliveryman;
      this.orderInfo.deliverymanPhone = data.deliverymanPhone;
      if (data.orderType === "onlineOrder" && data.deliveryType === "shop")
        this.setQrCode(data.id); // 仅到店自提订单生成取货二维码

      this.orderInfo.orderNumber = data.orderId;
      this.orderInfo.goodsPrice = util.moneyFormat(data.goodsPrice);

      this.orderInfo.verificationCode = data.verificationCode;

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
      this.orderInfo.remark = data.buyerMessage;
    },

    //设置商品信息
    setGoodsInfo(list) {
      list.map(i => {
        i.price = util.moneyFormat(i.price);
        i.faceValue = util.moneyFormat(i.faceValue);
      });
      this.goodsInfo = list;
    },

    //生成取货二维码
    setQrCode(code) {
      drawQrcode({
        width: 120,
        height: 120,
        canvasId: "myQrcode",
        text: code
      });
    },

    //取消订单
    cancelOrder() {
      Dialog.confirm({
        title: "提示",
        message: "确认取消该订单吗？",
        cancelButtonText: "留下宝贝"
      })
        .then(() => {
          const cart = api
            .cancelOrder(this.orderId)
            .then(res => {
              util.showToastSuccess("操作成功！");
              this.getOrderDetail();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },

    //继续支付
    goOnPay() {
      const otp = this.orderInfo.orderType;
      const stp = this.orderInfo.saleType;
      const gid = this.orderInfo.groupId;
      const id = this.orderId;
      let _platform = "mch";
      if (otp == "virtualGoods") _platform = "oppVirtual";
      else if (otp == "physicalGoods") _platform = "oppEntity";
      let url = "";
      if (stp == "group")
        url = `/pages/subPackageShop/payment/payment?platform=${_platform}&orderId=${id}&groupId=${gid}`;
      else
        url = `/pages/subPackageShop/payment/payment?platform=${_platform}&orderId=${id}`;

      util.navigateTo(url);
    },

    //到商品详情
    goGoodsDetail(e) {
      const otp = this.orderInfo.orderType;
      const stp = this.orderInfo.saleType;
      let url = "";
      switch (stp) {
        case "group":
          url = `/pages/subPackageGroupBuy/groupGDetail?id=${e.goodsGroupId}`;
          break;
        case "seckill":
          url = `/pages/subPackageSpike/spikeGDetail?id=${e.goodsSeckillId}`;
          break;
        default:
          if (otp == "physicalGoods") {
            url = `/pages/subPackageEntityG/entityGDetail?id=${e.goodsId}`;
          } else if (otp == "virtualGoods") {
            url = `/pages/subPackageVirtualG/virtualGDetail?id=${e.goodsId}`;
          } else if (otp == "onlineOrder") {
            url = `/pages/subPackageShop/goods/goods?id=${e.goodsId}`;
          }
          break;
      }
      util.navigateTo(url);
    },

    //确认收货
    async sureReceipt() {
      const cart = await api
        .sureReceived(this.orderId)
        .then(res => {
          util.showToastSuccess("操作成功！");
          this.getOrderDetail();
        })
        .catch(err => {
          console.log(err);
        });
    },

    //联系店家
    callSellerPhone() {
      const phoneNumber = this.storeModelInfo?this.storeModelInfo.phoneNumber:'18571470745';
      wx.makePhoneCall({
        phoneNumber
      });
    },

    //处理no found 图片
    errShopLogo() {
      this.storeModelInfo.shopLogo = this.errDefaultImage;
    },

    //处理no found 图片
    errImg(i) {
      this.goodsInfo[i].itemImages = this.errDefaultImage;
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.order-detail {
  position: relative;
  .order-detail-status {
    padding: 10px 15px 50px;
    .textColor(#fff);
    .backgroundColor(#f85437);
    .order-status-steps {
      padding: 0;
      .backgroundColor(#f85437);
    }
  }
  .order-detail-cancel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px 50px;
    .textColor(#fff);
    .backgroundColor(#f85437);

    image {
      width: 40px;
    }
  }
  .order-detail-address-getcode {
    margin: -30px 15px 10px;
    overflow: hidden;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);

    .borderRadius(4px);
    .backgroundColor(#fff);
    .order-detail-address {
      display: flex;
      padding: 10px 15px;
      align-items: center;
      .order-detail-address-icon {
        width: 30px;
        height: 30px;
        margin-right: 10px;
        padding-top: 10px;
      }
      .order-detail-address-info {
        width: calc(100% - 40px);
        .order-detail-address-consignee {
          margin-bottom: 10px;
          .fontSize(16px);
          .consignee-name {
            margin-right: 10px;
          }
        }
        .order-detail-address-detail {
          .textColor(#666);
        }
      }
    }
    .order-detail-getcode {
      display: flex;
      padding: 10px 15px;
      align-items: center;
      justify-content: space-between;
      .order-detail-getcode-title {
      }
      .order-detail-getcode-number {
        .fontSize(16px);
        .textColor(#f85437);
      }
      .order-detail-getcode-image {
        width: 120px;
        height: 120px;
        text-align: center;
        overflow: hidden;
        image {
          width: 100%;
        }
      }
    }
  }
  .order-detail-content {
    .backgroundColor(#fff);
    .order-detail-seller-info {
      position: relative;
      display: flex;
      padding: 10px 15px;
      .seller-logo {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        .borderRadius(50%);
      }
      .seller-name {
        width: calc(100% - 30px);
        .fontSize(15px);
      }
    }
    .order-detail-seller-info::after {
      .backgroundLine();
    }

    .order-detail-goods-info {
      position: relative;
      .order-goods-list {
        position: relative;
        padding: 10px 15px;
        .order-goods-info {
          display: flex;
          .goods-thumb {
            width: 80px;
            height: 80px;
            margin-right: 10px;
            overflow: hidden;
            .borderRadius(6px);
            image {
              width: 100%;
              height: 100%;
            }
          }
          .goods-others {
            width: calc(100% - 90px);
            .goods-title {
              height: 40px;
              .fontSize(15px);
            }
            .goods-spec {
              .textColor(#999);
            }
            .goods-price-number {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .goods-price {
                flex: 1;
                font-weight: bold;
                .fontSize(15px);
                .color-red();
              }
              .goods-number {
                flex: 1;
                text-align: right;
                .textColor(#999);
              }
            }
          }
        }

        .apply-after-sale {
          padding-top: 5px;
          text-align: right;
          .but-apply-after-sale {
            height: 32px;
            line-height: 32px;
            .borderColor(#333);
            .borderRadius(20px);
          }
        }

        .goods-exchange {
          margin-top: 10px;
          padding: 10px 0;
          border-top: 1rpx dashed #f1f1f1;
          .goods-exchange-header {
            margin-bottom: 10px;
          }
        }
      }
      .order-goods-list::after {
        .backgroundLine(15px, 0, 1px);
      }
      .order-goods-list:last-child::after {
        .backgroundLine(0, 0, 0);
      }
    }
    .order-detail-goods-info::after {
      .backgroundLine(0, 0, 1px);
    }
  }

  .order-detail-money {
    position: relative;
    margin-bottom: 10px;
    margin-top: 0.5px;
    padding: 10px 15px;
    .backgroundColor(#fff);
    .order-detail-money-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      .order-detail-money-title {
        flex: 1;
      }
      .order-detail-money-value {
        flex: 1;
        text-align: right;
        .textColor(#666);
      }
    }
    .order-detail-money-item.order-actual-money::after {
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
  .order-detail-remark {
    position: relative;
    margin-bottom: 10px;
    margin-top: 0.5px;
    padding: 10px 15px;
    .backgroundColor(#fff);
    .order-detail-remark-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      .order-detail-remark-title {
        width: 50px;
      }
      .order-detail-remark-value {
        width: calc(100% - 60px);
        .textColor(#666);
      }
    }
  }
  .order-detail-distribution {
    display: flex;
    margin-bottom: 10px;
    padding: 10px 15px;
    .backgroundColor(#fff);
    .distribution-icon {
      width: 40px;
      height: 40px;
      margin-right: 10px;
      image {
        width: 100%;
      }
    }
    .distribution-info {
      width: calc(100% - 50px);
      .distribution-name,
      .distribution-tel {
        padding-bottom: 4px;
      }
      text {
        .textColor(#999);
      }
    }
    .distribution-none {
      padding: 0 15px;
      line-height: 40px;
      .textColor(#999);
    }
  }

  .order-detail-info {
    margin-bottom: 0.5px;
    .backgroundColor(#fff);
    .order-detail-info-title {
      position: relative;
      padding: 10px 15px;
      .fontSize(16px);
    }
    .order-detail-info-title::after {
      .backgroundLine();
    }
    .order-detail-info-body {
      padding: 10px 15px;
      .order-detail-info-list {
        margin-bottom: 8px;
        .textColor(#666);
      }
    }
  }
  .order-detail-contact {
    position: relative;
    margin-bottom: 10px;
    .order-detail-contact-icon {
      position: absolute;
      width: 24px;
      height: 24px;
      left: 50%;
      top: 50%;
      transform: translate(-50px, -50%);
      z-index: 10;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .but-order-contact {
      text-indent: 30px;
    }
  }
  .order-detail-operates {
    margin-bottom: 10px;
    padding: 10px 15px;
    text-align: right;
    .but-order-operates {
      margin-left: 10px;
      height: 38px;
      line-height: 38px;
      background: transparent;
      .borderColor(#333);
      .borderRadius(20px);
    }
    .but-order-gotopay {
      .borderTextColor();
    }
    .but-order-view-logistics,
    .but-order-sure-receipt {
      .borderTextColor(#f55600);
    }
  }
}
</style>
