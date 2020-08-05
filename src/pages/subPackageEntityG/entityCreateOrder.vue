<template>
  <view class="pages order-create">
    <view class="order-customer-address">
      <!-- 地址为空 -->
      <view class="order-address-empty" v-if="!orderAddressInfo.info.id" @click="addAddressTap">
        <van-icon class="icon-warn" name="info" size="20px" color="#e00000" />
        <view class="order-address-empty-text">请添加收货地址</view>
      </view>

      <!-- 地址存在 -->
      <view class="order-address-full" v-else @click="selectAddressTap">
        <van-icon class="icon-location" name="location" size="20px" />
        <view class="order-address-info">
          <view class="order-address-consignee ellipsis">收货人：<text class="consignee-name">{{orderAddressInfo.info.contact}}</text><text class="consignee-mobile">{{orderAddressInfo.info.mobile}}</text></view>
          <view class="order-address-detail ellipsis-2">收货地址：<text class="consignee-address">{{orderAddressInfo.info.spca+' '+orderAddressInfo.info.address}}</text></view>
        </view>
      </view>
    </view>

    <!-- 团购 -->
    <view class="order-group" v-if="saleType=='group'&&groupUserList.length>0">
      <view class="order-group-header">
        <view class="group-header-tag">[正在{{groupId?'参':'开'}}团]</view>
        <view class="group-header-desc">立即支付，即可{{groupId?'参':'开'}}团成功</view>
      </view>
      <view class="order-group-body">
        <block v-if="!groupId">
          <view class="join-group-user" v-for="(v,i) of groupUserList" :key="i" v-if="v.isMaster">
            <image :src="v.headPic?v.headPic:errDefaultImage" @error="errAvatar(i)" mode="aspectFit" />
            <view class="join-group-tag">待支付</view>
          </view>
          <view class="join-group-unknown"><text>?</text></view>
        </block>
        <block v-else>
          <view class="join-group-user">
            <image :src="groupUserList[0].headPic?groupUserList[0].headPic:errDefaultImage" @error="errAvatar(0)" mode="aspectFit" />
            <view class="join-group-tag">团长</view>
          </view>
          <view class="join-group-user">
            <image :src="groupUserList[groupUserList.length-1].headPic?groupUserList[groupUserList.length-1].headPic:errDefaultImage" @error="errAvatar(groupUserList.length-1)" mode="aspectFit" />
            <view class="join-group-tag">待支付</view>
          </view>
        </block>

      </view>
    </view>

    <view class="order-goods">
      <view class="order-item">
        <!-- <view class="order-seller-info">
          <image class="order-seller-logo" :src="v.logo?v.logo:'/static/images/default_logo_1x1.jpg'" mode="widthFix" /><text class="order-seller-name">{{v.supplierName}}</text>
        </view> -->
        <view class="order-goods-info">
          <view class="order-goods-list" v-for="(k,j) of orderGoodsList" :key="j">
            <view class="order-goods-thumb">
              <image :src="k.itemImages?k.itemImages:'/static/images/default_logo_1x1.jpg'" @error="errImg(j)" />
            </view>
            <view class="order-goods-others">
              <view class="order-goods-title ellipsis-2">{{k.goodsTitle}}</view>
              <view class="order-goods-spec ellipsis">{{k.specificationItems}}</view>
              <view class="order-goods-price-num">
                <view class="order-goods-price">￥{{k.price}}</view>
                <view class="order-goods-number">
                  <van-stepper :value="k.num" integer min="1" step="1" @change="onChangeItemGoodsNum($event,k.goodsDescId,j)" />
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="order-money-info">
          <view class="order-item-money">
            <view class="order-item-money-title">商品金额：</view>
            <view class="order-item-money-value">￥{{goodsMoney}}</view>
          </view>
          <view class="order-item-money" v-if="deliveryType==='platform'">
            <view class="order-item-money-title">配送费：</view>
            <view class="order-item-money-value"><text class="free-postage" v-if="freePostage>0&&!isFreeDeliveryMoney">满{{freePostage}}元免配送费，</text>{{isFreeDeliveryMoney?'免配送费':'￥'+deliveryMoney}}</view>
          </view>
        </view>

      </view>

    </view>

    <view class="order-others" v-if="!saleType">
      <van-cell-group>
        <van-cell title="优惠券" :value="couponChecked.id?'可优惠 -￥'+couponChecked.value:couponText" is-link @click="switchCoupon" custom-class="order-others-cell" value-class='coupon-preferential-value' v-if="couponList.length>0">
          <view slot="icon" class="slot-icon slot-icon-coupon">券</view>
        </van-cell>
        <van-cell title="会员优惠" :value="'-￥' + userCardDiscount" custom-class="order-others-cell" value-class='user-card-preferential-value' v-if="userCardDiscount>0">
          <view slot="icon" class="slot-icon slot-icon-card">卡</view>
        </van-cell>
        <van-cell title="积分抵扣" :value="isUseIntegral?'可抵扣 -￥'+integralRebate:'不使用积分'" custom-class="order-others-cell" value-class='integral-preferential-value' v-if="initialIntegralRebate>0">
          <view slot="icon" class="slot-icon slot-icon-integral">分</view>
          <view slot="right-icon">
            <van-switch :checked="isUseIntegral" active-color="#07c160" size="24px" custom-class="switch-integral" @change="onChangeIntegral" />
          </view>

        </van-cell>
      </van-cell-group>
    </view>

    <view class="order-remarks">
      <van-cell-group>
        <van-field label="订单备注" :value="remarks" :border="false" placeholder="买家留言" @change="bindRemarks" />
      </van-cell-group>
    </view>

    <!-- 优惠券相关区域 -->
    <van-popup :show="showCoupon" position="bottom" z-index="999" @close="closeCoupon" custom-class="order-coupon-popup-box">
      <view class="order-coupon-popup-content">
        <view class="close-popup" @click="closeCoupon">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="coupon-popup-header">优惠券</view>
        <view class="coupon-popup-body">
          <scroll-view class="coupon-scroll-area" scroll-y="true">
            <view class="coupon-content" v-if="couponList.length>0">
              <view class="coupon-list coupon-type-mall" v-for="(v,i) of couponList" :key="i">
                <view class="coupon-list-face-info">
                  <view class="coupon-tips">超值抵扣券</view>
                  <view class="coupon-list-face-left">
                    <view class="coupon-list-face-val used">￥<text>{{v.usedAmount}}</text></view>
                    <view class="coupon-list-face-rule ellipsis">满{{v.meetAmount}}元可用</view>
                  </view>
                  <view class="coupon-list-face-right">
                    <view class="coupon-list-face-name ellipsis">{{v.title}}</view>
                    <view class="coupon-list-face-expired ellipsis">有效期：</view>
                    <view class="coupon-list-face-vid ellipsis-2">{{v.validStartTime}}至{{v.validEndTime}}</view>
                  </view>
                </view>
                <view class="coupon-list-status using" @click="choiceCoupon(i)">
                  <view class="circle-dot-top"></view>
                  <view class="circle-dot-bottom"></view>
                  <block v-if="v.checked">
                    <van-icon name="passed" size="30px" color="#57be6a" />
                    <view>已选</view>
                  </block>
                  <block v-else>
                    <van-icon name="circle" size="30px" />
                    <view>选我</view>
                  </block>
                </view>
              </view>
            </view>

            <Empty desc="没有可用的优惠券哦^_^" v-else />

          </scroll-view>
        </view>
        <view class="coupon-popup-footer">
          <van-button round block custom-class="but-sure-coupon" @click="sureCoupon">确认</van-button>
        </view>
      </view>
    </van-popup>

    <!-- 底部确认订单并支付 -->
    <van-submit-bar :price="finalPaymentMoney" button-text="提交订单" @submit="orderCreate" />

    <van-notify id="van-notify" />

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";
import { mapState, mapMutations, mapActions } from "vuex";
import Notify from "../../../static/vant/notify/notify";
export default {
  components: {
    Empty
  },
  data() {
    return {
      idsNum: null,
      groupId: null, //团ID

      orderType: "physicalGoods", //physicalGoods：平台实物订单；
      saleType: null, // group：拼团；seckill：秒杀
      deliveryTypeIndex: 0,
      deliveryType: "platform", //'platform':平团配送；

      hasAddress: !1, //是否存在地址
      orderGoodsList: [], // 商品信息
      goodsMoney: 0, // 商品总金额
      deliveryMoney: 0, // 配送总金额
      totalPrice: 0, // 订单总价格

      isFreeDeliveryMoney: !1, // 是否免配送费
      freePostage: 0, // 满多少配送费

      finalPaymentMoney: 0, // 应付总金额

      // 会员卡等级抵扣金额
      userCardDiscount: 0,

      showCoupon: !1, // 显示隐藏优惠券内容区域
      couponList: [], // 优惠券列表
      //使用的优惠券
      couponChecked: {
        id: null,
        value: 0
      },
      couponText: "没有可使用的优惠券", // 优惠券提示语

      isUseIntegral: !1, // 是否使用积分
      // 积分抵扣金额
      integralRebate: 0,
      initialIntegralRebate: 0, // 初始状态抵扣金额

      //拼团
      groupUserList: [], // 团成员

      remarks: "",

      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["orderAddress", "orderAddressInfo", "storeId"])
  },
  created() {},

  mounted() {},

  methods: {
    ...mapMutations(["setOrderAddress"]),
    ...mapActions(["getOrderAddress"]),

    //init
    init() {
      this.groupUserList = [];
      this.remarks = "";
      this.isUseIntegral = !1;
      this.userCardDiscount = 0;
      this.showCoupon = !1;
      this.couponList = [];
      this.couponChecked = {
        id: null,
        value: 0
      };
      this.couponText = "没有可使用的优惠券";
      this.isUseIntegral = !1;
      this.integralRebate = 0;
      this.initialIntegralRebate = 0;
    },

    //数量改变
    onChangeItemGoodsNum(e, id, j) {
      const num = e.mp.detail || 1;
      const _orderGoodsList = this.orderGoodsList;
      _orderGoodsList[j].num = num;
      let _idsNum = this.idsNum;
      const _itemArr = _idsNum.split(",");
      for (const i in _itemArr) {
        if (_itemArr[i].indexOf(id) > -1) {
          _itemArr[i] = `${id}~${num}`;
        }
      }
      this.idsNum = _itemArr.join(",");
      this.getOrderInfo();
    },

    //绑定备注信息到对应的订单
    bindRemarks(e) {
      this.remarks = e.mp.detail;
    },

    //优惠券开关显示
    switchCoupon() {
      this.showCoupon = !this.showCoupon;
    },

    //优惠券关闭
    closeCoupon() {
      this.showCoupon = !1;
    },

    //确认优惠券信息填写完善
    sureCoupon() {
      this.closeCoupon();
    },

    //选择可用优惠券
    choiceCoupon(i) {
      const _couponList = this.couponList;
      for (const j in _couponList) {
        if (j == i) _couponList[j].checked = !_couponList[j].checked;
        else _couponList[j].checked = !1;
      }
      for (const k in _couponList) {
        if (_couponList[k].checked) {
          this.couponChecked.id = _couponList[k].id;
          this.couponChecked.value = _couponList[k].usedAmount;
          break;
        } else {
          this.couponChecked.id = null;
          this.couponChecked.value = 0;
        }
      }
      this.getOrderInfo();
    },

    //是否使用积分
    onChangeIntegral(e) {
      if (e.mp.detail) {
        this.integralRebate = this.initialIntegralRebate;
      } else {
        this.integralRebate = 0;
      }
      this.isUseIntegral = e.mp.detail;
      this.calcPaymentMoney();
    },

    //添加地址
    addAddressTap() {
      this.setOrderAddress(!0);
      let url = `/pages/subPackageShop/addressAdd/addressAdd?idsNum=${
        this.idsNum
      }&stp=${this.saleType}`;
      util.navigateTo(url);
    },

    //选择切换地址
    selectAddressTap() {
      this.setOrderAddress(!0);

      let url = `/pages/subPackageShop/address/address?idsNum=${
        this.idsNum
      }&stp=${this.saleType}`;
      util.navigateTo(url);
    },

    //查询订单
    async getOrderInfo() {
      const data = {
        shopId: this.storeId,
        carts: this.idsNum,
        orderType: this.orderType,
        saleType: this.saleType,
        groupOrderId: this.groupId,
        couponId: this.couponChecked.id
      };
      const info = await api
        .getAllBeforeOrder(data)
        .then(res => {
          let data = res.info;
          //商品
          if (data.orderDesc.length > 0) {
            const _orderGoodsList = data.orderDesc;
            _orderGoodsList.map(i => {
              i.price = util.moneyFormat(i.price);
            });
            this.orderGoodsList = _orderGoodsList;
          } else {
            this.orderGoodsList = [];
          }

          // 团成员
          if (data.userList && data.userList.length > 0) {
            this.groupUserList = data.userList;
          } else {
            this.groupUserList = [];
          }

          //商品金额
          this.goodsMoney = util.moneyFormat(data.goodsPrice);

          //商配送费
          this.deliveryMoney = util.moneyFormat(data.deliveryCost);

          this.isFreeDeliveryMoney = data.free; // 是否免配送费
          this.freePostage = util.moneyFormat(data.freePostage); // 满多少免配送费

          if (!this.saleType) {
            //会员卡等级抵扣金额
            this.userCardDiscount = util.moneyFormat(data.discount);

            //优惠券
            if (data.couponList.length > 0) {
              this.couponText = "可选择优惠券";
              const _couponList = data.couponList;
              _couponList.map(i => {
                i.usedAmount = util.moneyFormat(i.usedAmount);
                i.meetAmount = util.moneyFormat(i.meetAmount);
              });
              this.couponList = _couponList;
            } else {
              this.couponText = "没有可使用的优惠券";
              this.couponList = [];
            }

            this.initialIntegralRebate = util.moneyFormat(data.pointsDeduction);

            if (this.isUseIntegral)
              this.integralRebate = util.moneyFormat(data.pointsDeduction);
            else this.integralRebate = 0;
          }

          this.calcPaymentMoney();
        })
        .catch(err => {
          console.log(err);
        });
    },

    //计算最终支付金额
    calcPaymentMoney() {
      const a = this.goodsMoney * 100;
      const b = this.deliveryMoney * 100;
      const c = this.userCardDiscount * 100;
      const d = this.couponChecked.value * 100;
      const e = this.integralRebate * 100;

      this.finalPaymentMoney = a + b - c - d - e;
    },

    //创建订单前校验
    checkOrderData() {
      if (!this.orderAddressInfo.info.id) {
        util.showToastError("请添加收货地址！");
        return false;
      } else {
        return true;
      }
    },

    //创建订单
    orderCreate() {
      const _flag = this.checkOrderData();
      //提交订单数据
      if (_flag) {
        const _stp = this.saleType;
        let data = {
          shopId: this.storeId,
          orderType: this.orderType,
          saleType: this.saleType,
          groupOrderId: this.groupId,
          deliveryType: this.deliveryType,
          addressId: this.orderAddressInfo.info.id,
          pickPhoneNumber: this.selfMentionMobile,
          carts: this.idsNum,
          couponId: this.couponChecked.id,
          integral: this.isUseIntegral,
          buyerMessage: this.remarks
        };
        this.createOrder(data);
      }
    },

    //创建订单
    async createOrder(data) {
      const order = await api
        .createAllOrder(data)
        .then(res => {
          let url = "";
          let _platform = res.result.platform;
          let _orderId = res.result.orderId;
          let _groupId = res.result.groupOrderId;
          if (_groupId)
            url = `/pages/subPackageShop/payment/payment?platform=${_platform}&orderId=${_orderId}&groupId=${_groupId}`;
          else
            url = `/pages/subPackageShop/payment/payment?platform=${_platform}&orderId=${_orderId}`;

          util.redirectTo(url);
        })
        .catch(err => {
          console.log(err);
        });
    },

    //处理no found 图片
    errImg(j) {
      this.orderGoodsList[j].itemImages = this.errDefaultImage;
    },

    //处理no found 图片
    errAvatar(i) {
      this.groupUserList[i].headPic = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.init();

    this.idsNum = options.idsNum;

    const _stp = options.stp;
    const _groupId = options.groupId;

    if (_stp) this.saleType = _stp;
    else this.saleType = null;

    if (_groupId) this.groupId = _groupId;
    else this.groupId = null;

    // 获取收获地址
    await this.getOrderAddress({
      shopId: this.storeId,
      addressId: null
    });

    await Promise.all([this.getOrderInfo()]);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../static/css/common";

.order-create {
  position: relative;
  padding-bottom: 60px;
  .order-customer-address {
    margin-bottom: 10px;
    .backgroundColor(#fff);
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAAGCAIAAACKML1zAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFEQjdCMkQwQjkwMzExRTk5OTQxOEVFNTI1Q0M1QUJCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFEQjdCMkQxQjkwMzExRTk5OTQxOEVFNTI1Q0M1QUJCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QURCN0IyQ0VCOTAzMTFFOTk5NDE4RUU1MjVDQzVBQkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QURCN0IyQ0ZCOTAzMTFFOTk5NDE4RUU1MjVDQzVBQkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz66WzIfAAAAZklEQVR42mL8vXY5AxgwSkgxW9oyMDIykAXOvPr36PN/hgECktyM5uJMTOS5/f//v6eP/3/yiM5uZhoN9wEJd2jQj4b7gLicaTTcB8rxjP///RsN9wEIdwkpptFwH5BwB5Y0AAEGADr2WNzqkrnCAAAAAElFTkSuQmCC");
    background-repeat: repeat-x;
    background-position: left bottom;
    min-height: 50px;
    padding: 15px;
    .order-address-empty {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      justify-content: space-between;
      .backgroundColor(#ff976a);
      .order-address-empty-text {
        width: calc(100% - 50px);
        .textColor(#fff);
      }
      .icon-warn {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .icon-arrow {
        width: 18px;
        height: 18px;
      }
    }
    .order-address-full {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon-location {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
      .order-address-info {
        width: calc(100% - 30px);
        .order-address-consignee {
          margin-bottom: 5px;
          .fontSize(16px);
          .consignee-name {
            padding-right: 10px;
          }
        }
      }
    }
  }

  .order-group {
    margin-bottom: 10px;
    .backgroundColor(#fff);
    .order-group-header {
      display: flex;
      padding: 10px 15px 10px 35px;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc0Rjc5NUFDQTM4RTExRTlCNjdEQzUzMjc4ODk5RkU4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc0Rjc5NUFEQTM4RTExRTlCNjdEQzUzMjc4ODk5RkU4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzRGNzk1QUFBMzhFMTFFOUI2N0RDNTMyNzg4OTlGRTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzRGNzk1QUJBMzhFMTFFOUI2N0RDNTMyNzg4OTlGRTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz74JvMeAAAExklEQVR42txaTYgcRRR+71X1JNnJisluFAJZRIMIBteTIip4EGVVDASFXERZUOMPBlSCBz2IIAiugoL4g4ioGMH14OohiHjQg2AuiiBBVEyigmJc2bi7M91dz6969mdmt3u6Z3Zm7fHBm6me7pp6X72feq+q+fSBCXKGiSQiYktKnPAKKdqOUolZKeCYIjK7cfmwkt6kzCOi7oSSvE+sL4njaCiIKYsWnFCkq+OxKhnBkJBHQiGjVIgsbZBi4hshxzSaVYiRTIGynIevazEjkwB3M9q/UJ8pFwhDMpZ0lUBz1zuWD9Acyug8DpDHYuVrcDWb/h+bBMTblTGpplGNnH0vE8QqXboQ8zOwmHtT7wr3BIjkPeD9JXQWbNayN5mdhUZhvrNC9REwNbPJ0HRfgCyTcUw2XmVRHu9gnC0hB1eGCCbLXJcK/Mtsno+sODUgWxcnUSWZZBKrxeeBDOsuWerr0Dsi7qmzSycPR2IQkboTwMcM39XhI2LT86glnXbYCBiH4SLqPYg00wrAl4GH88DATPZ0uN5cAiDX5caWRpj+NunSicaXVvaKGn0SlvxAHojNIOj7V5J4Cov7C1jZo0IaUY5gKpV3YGW3UUkIatmN2Z1S1urWxfCpYkCs3gU3LA2IFp9iPlIJ5l4xpv57PhAK7qDy0va5Yd5vrHst39nZ7CkxEKot7txbNPxaKjfZokD+F2QHWvrldMnnfo2wPYggakkF4OtZW+MBNC3VTB8ZGI1wG6ceKI1wjrPzIADIE9IDeZybEkVY4BCKp6uRqk/4yq4EOLZBvl0t1QDRn+vAnjx4SwtaTcra2KfqY7g4gpuH/E8lU9IpZPmfCMnTqvqDnTdtfeQkHnoQ5dwTJbQ2pFVmEqr5Eu19uc7ua2xR9yxC3omSes+oEn8ME9qeCcSoo4BDsqYeWooPlzcS8Jjbyodsem2dlKawqsryT8e44WAjZcQiyhPrgYivGP1Gj1uzoNofAb+UQELWveuAsLOpG7LK5KjEZNO2MZJP5dbdFaaLS+smSt9lpvFq6n5rsdF2sp/jyo6yAjHOHc2uR2BiJhQowo3GJM9pabWhn8WxvCs5GbOJlN7WZAEqY0pPH7HTG4TiWpZGtgHrAcf0GMLYvv9Y3D+46cQLk/oPvr7HLH8IGWfQTjbwLG4cBZ/f1LGKReZyamyfloHeApBHmtc4byqchCVuiVpXgcdKXRQWSOMHorBSotxFbKBKXd0EjRzHKAdhu+cuTcyFaD+Koc9sloltVCMIezypJroCbX/C+/fS7z+BpwKNLxDS13uf8HLj3LxHGtEdodxeVfNGG63PBRLdzS6e7ksl74/yDFaRitmARjSanufZmXn9K3vDgDGIMyrM9+D6dF9T+e4nxL5Zs+dQKMPEsU2tLp1PPNW/1sFnkEq82O/sd7E7xbqv1qlAaeWFHMdr4wx/2qWMiwWB6DcY5KKOLcslqUJKfqYtgJo3M7o5lTYcfS2Sn7LaIJTnw0Bv7XzLJ/2MWijT61wXGfTPo/HQTJHzXRtucZ9j2bwfo7/ckeNnSOXa/EWHUcWp0/t+08WFwhUiBngVNfop1B0P4XK8kf3mhQnWjPqgDXSeLSDTWWj1C+V4ClXE8aIvQv0rwAB4yqDA8ISxQgAAAABJRU5ErkJggg==")
        15px center no-repeat;
      background-size: 15px 15px;
      .group-header-tag {
        width: 70px;
        .textColor(#f85437);
      }
      .group-header-desc {
        width: calc(100% - 70px);
      }
    }
    .order-group-body {
      padding: 10px 15px;
      display: flex;
      justify-content: center;
      .join-group-user,
      .join-group-unknown {
        position: relative;
        width: 45px;
        height: 45px;
        margin: 5px;
        text-align: center;
        line-height: 45px;
        .textColor(#999);
        image {
          width: 44px;
          height: 44px;
          .borderRadius(50%);
          border: 0.5px solid #f85437;
        }
        .join-group-tag {
          position: absolute;
          height: 14px;
          left: 2px;
          right: 2px;
          top: 37px;
          line-height: 14px;
          text-align: center;
          .textColor(#fff);
          .fontSize(9px);
          .borderRadius(7px);
          .backgroundColor(#f85437);
          z-index: 9;
        }
      }
      .join-group-unknown {
        border: 0.5px dashed #999;
        .borderRadius(50%);
        .backgroundColor(#f1f1f1);
      }
    }
  }

  .order-goods {
    margin-bottom: 10px;
    .order-item {
      margin-bottom: 5px;
      .backgroundColor(#fff);
      .order-seller-info {
        position: relative;
        padding: 10px 15px;
        .order-seller-logo {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        .order-seller-name {
          .textColor(#666);
        }
      }
      .order-seller-info::after {
        .backgroundLine();
      }
      .order-goods-info {
        position: relative;
        .order-goods-list {
          position: relative;
          padding: 10px 15px;
          display: flex;
          .order-goods-thumb {
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
          .order-goods-others {
            width: calc(100% - 90px);
            .order-goods-title {
              height: 40px;
              .fontSize(15px);
            }
            .order-goods-spec {
              .textColor(#999);
            }
            .order-goods-price-num {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .order-goods-price {
                flex: 1;
                font-weight: bold;
                .fontSize(15px);
                .color-red();
              }
              .order-goods-number {
                flex: 1;
                text-align: right;
                .textColor(#999);
              }
            }
          }
        }
        .order-goods-list::after {
          .backgroundLine(15px, 0);
        }
        .order-goods-list:last-child::after {
          height: 0;
        }
      }
      .order-goods-info::after {
        .backgroundLine();
      }
      .order-money-info {
        position: relative;
        padding: 10px 15px;
        .order-item-money {
          margin-bottom: 5px;
        }
        .order-item-money,
        .order-freight-money {
          display: flex;
          .order-item-money-title,
          .order-freight-money-title {
            width: 90px;
            // text-align: right;
          }
          .order-item-money-value,
          .order-freight-money-value {
            flex: 1;
            text-align: right;
            .color-red();
            .free-postage {
              .textColor(#f85437);
            }
          }
        }
      }
      .order-money-info::after {
        .backgroundLine();
      }
    }
  }

  //
  .order-others,
  .order-remarks {
    margin-bottom: 10px;
  }
  .order-others .order-others-cell {
    align-items: center;
  }
  .order-others {
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
    .slot-icon-card {
      .backgroundLiearGraientLR(#ff8b57, #ff7054);
    }
    .slot-icon-coupon {
      .backgroundLiearGraientLR(#fe7980, #fc6070);
    }
    .slot-icon-integral {
      .backgroundLiearGraientLR(#57be6a, #5dc870);
    }
    .user-card-preferential-value {
      .textColor(#ff7e55);
    }
    .coupon-preferential-value {
      .textColor(#fd6c77);
    }
    .integral-preferential-value {
      .textColor(#57be6a);
    }
    .switch-integral {
      margin-left: 10px;
      vertical-align: middle;
    }
  }

  // 订单优惠券
  .order-coupon-popup-box {
    overflow-y: visible;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .order-coupon-popup-content {
      position: relative;
      box-sizing: border-box;
      .coupon-popup-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 12px 15px;
        z-index: 10;
        font-weight: bold;
        .fontSize(16px);
      }
      .coupon-popup-body {
        height: 330px;
        padding: 45px 15px 70px;
        .coupon-scroll-area {
          height: 100%;
          background: #f1f1f1;

          .coupon-content {
            box-sizing: border-box;
            padding: 5px;
            .coupon-list {
              display: flex;
              border-radius: 4px;
              margin-bottom: 10px;
              overflow: hidden;
            }

            .coupon-list-face-info {
              position: relative;
              box-sizing: border-box;
              width: calc(100% - 90px);
              height: 100px;
              padding: 10px;
              background: #fff;
            }

            .coupon-tips {
              position: absolute;
              width: 80px;
              height: 22px;
              left: 10px;
              top: 10px;
              border-radius: 2px;
              color: #fff;
              font-size: 12px;
              text-align: center;
              line-height: 22px;
            }

            .coupon-type-mall .coupon-tips {
              background: #f85437;
            }

            .coupon-type-seller .coupon-tips {
              background: #f23030;
            }

            .coupon-list-face-left {
              position: relative;
              width: 90px;
              height: 80px;
              float: left;
              box-sizing: border-box;
              padding: 25px 0 5px;
              text-align: center;
            }
            .coupon-list-face-left::after {
              position: absolute;
              width: 1px;
              content: "";
              top: 20px;
              bottom: 15px;
              right: 0;
              background: #ddd;
            }
            .coupon-list-face-val text {
              font-size: 24px;
              line-height: 1.4;
            }

            .coupon-list-face-val.using {
              color: #ff4e00;
            }

            .coupon-list-face-val.used {
              color: #999;
            }
            .coupon-list-face-rule {
              font-size: 12px;
            }
            .coupon-list-face-right {
              width: calc(100% - 90px);
              height: 80px;
              float: left;
              box-sizing: border-box;
              padding: 10px 0 5px 10px;
            }

            .coupon-list-face-name {
              margin-bottom: 5px;
              color: #454545;
            }

            .coupon-list-face-vid {
              font-size: 11px;
              color: #999;
            }

            .coupon-list-status {
              position: relative;
              width: 80px;
              height: 80px;
              display: flex;
              padding: 10px 5px;
              align-items: center;
              text-align: center;
              justify-content: center;
              flex-direction: column;
              border-left: 1px dashed #f1f1f1;
              color: #fff;
              font-size: 16px;
            }

            .circle-dot-top,
            .circle-dot-bottom {
              position: absolute;
              left: -5px;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #f1f1f1;
            }

            .circle-dot-top {
              top: -4px;
            }

            .circle-dot-bottom {
              bottom: -4px;
            }

            .coupon-list-status.using {
              background: #f85437;
            }

            .coupon-list-status.used,
            .coupon-list-status.invalid {
              background: #b6b6b6;
            }

            .coupon-type-seller .coupon-list-status.using {
              background: #f23030;
            }
          }
        }
      }
      .coupon-popup-footer {
        position: absolute;
        height: 50px;
        padding: 10px 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .but-sure-coupon {
          width: 80%;
          height: 50px;
          line-height: 50px;
          .but-default();
          .fontSize(16px);
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
