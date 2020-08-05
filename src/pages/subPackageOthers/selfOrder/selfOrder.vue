<template>
  <view class="pages order">
    <view class="order-type">
      <van-tabs :active="curStatus" color="#f85437" @change="switchOrderStatus" swipe-threshold="5">
        <van-tab :title="v.title" v-for="(v,i) of orderHeader" :key="i"></van-tab>
      </van-tabs>
    </view>
    <view class="order-content">
      <scroll-view class="order-scroll-area" scroll-y="true" bindscrolltolower="onReachBottom" v-if="orderList.length>0">
        <view class="order-item" v-for="(v,i) of orderList" :key="i">
          <view class="order-seller-info">
            <block v-if="v.shopInfoModel!=null">
              <image class="seller-logo" :src="v.shopInfoModel.shopLogo?v.shopInfoModel.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errShopLogo(i)" />
              <view class="seller-name ellipsis">{{v.shopInfoModel.shopName}}</view>
            </block>
            <block v-else>
              <image class="seller-logo" src="/static/images/default_logo_1x1.jpg" />
              <view class="seller-name ellipsis" v-if="v.orderType=='physicalGoods'">平台自营-实物商品</view>
              <view class="seller-name ellipsis" v-else-if="v.orderType=='virtualGoods'">平台自营-虚拟商品</view>
            </block>

            <view class="order-status" v-if="v.state=='unpay'">待付款</view>
            <view class="order-status" v-else-if="v.state=='paid'">已支付</view>
            <view class="order-status" v-else-if="v.state=='waitSending'">待发货</view>
            <view class="order-status" v-else-if="v.state=='waitGroup'">待成团</view>
            <view class="order-status" v-else-if="v.state=='shipped'">已发货</view>
            <view class="order-status" v-else-if="v.state=='arrived'">已送达</view>
            <view class="order-status" v-else-if="v.state=='waitReceiving'">待收货</view>
            <view class="order-status" v-else-if="v.state=='receipted'">已收货</view>
            <view class="order-status" v-else-if="v.state=='success'">已完成</view>
            <view class="order-status" v-else-if="v.state=='cancel'">已取消</view>
            <view class="order-status" v-else-if="v.state=='refund'">售后</view>
            <view class="order-status" v-else-if="v.state=='refunded'">已退款</view>
          </view>
          <view class="order-goods-info" @click="seeOrder($event,v.id,v.orderType)">

            <block v-if="v.orderType=='immediately'">
              <view class="order-goods-list order-goods-offline">
                <view class="goods-thumb">
                  <view class="corner-marker"><text>门店买单</text></view>
                  <image src="/static/images/offline_order_default_img.jpg" />
                </view>
                <view class="goods-others">
                  <view class="goods-title ellipsis-2">线下买单商品记录</view>
                </view>
              </view>
            </block>
            <block v-else-if="v.orderType=='charge'">
              <view class="order-goods-list order-goods-offline">
                <view class="goods-thumb">
                  <view class="corner-marker"><text>店铺储值</text></view>
                  <image src="/static/images/offline_order_default_img.jpg" />
                </view>
                <view class="goods-others">
                  <view class="goods-title ellipsis-2">店铺储值订单</view>
                </view>
              </view>
            </block>
            <block v-else-if="v.orderType=='virtualGoods'">
              <view class="order-goods-list" v-for="(k,j) of v.orderDescModelList" :key="j">
                <view class="goods-thumb">
                  <block v-if="k.operation!=null">
                    <image v-if="k.operation==0" src="/static/images/icon_10010.jpg" />
                    <image v-else-if="k.operation==1" src="/static/images/icon_10086.jpg" />
                    <image v-else-if="k.operation==2" src="/static/images/icon_10000.jpg" />
                  </block>
                  <block v-else>
                    <image :src="k.itemImages?k.itemImages:'/static/images/default_logo_1x1.jpg'" @error="errImg(i,j)" />
                  </block>
                </view>
                <view class="goods-others">
                  <view class="goods-title ellipsis-2">{{k.goodsTitle}}</view>
                  <view class="goods-spec ellipsis" v-if="k.account">冲值帐号:{{k.account}}</view>
                  <view class="goods-spec ellipsis" v-if="k.virtualGoodsType=='0'">充值面额：{{k.faceValue}}元</view>
                  <view class="goods-spec ellipsis" v-if="k.virtualGoodsType=='2'">流量额度：{{k.flowSize%1024>0?k.flowSize+'M':k.flowSize/1024+'G'}}</view>
                  <view class="goods-price-number">
                    <view class="goods-price">￥ {{k.price}}</view>
                    <view class="goods-number">X {{k.num}}</view>
                  </view>
                </view>
              </view>
            </block>
            <block v-else>
              <view class="order-goods-list" v-for="(k,j) of v.orderDescModelList" :key="j">
                <view class="goods-thumb">
                  <image :src="k.itemImages?k.itemImages:'/static/images/default_logo_1x1.jpg'" @error="errImg(i,j)" />
                </view>
                <view class="goods-others">
                  <view class="goods-title ellipsis-2">{{k.goodsTitle}}</view>
                  <view class="goods-spec ellipsis">{{k.specificationItems?k.specificationItems:''}}</view>
                  <view class="goods-price-number">
                    <view class="goods-price">￥{{k.price}}</view>
                    <view class="goods-number">X {{k.num}}</view>
                  </view>
                </view>
              </view>
            </block>
          </view>

          <view class="order-others" v-if="v.orderType=='immediately'">共计：<text class="order-total-money">￥{{v.payment}}元</text></view>
          <view class="order-others" v-else-if="v.orderType=='charge'">共计：<text class="order-total-money">￥{{v.payment}}元</text></view>
          <view class="order-others" v-else>共<text class="order-total-num">{{v.goodsNumber}}</text>件商品，共计：<text class="order-total-money">￥{{v.payment}}{{v.deliveryCost>0?'（含配送费：'+v.deliveryCost+'元）':''}}</text></view>
          <view class="order-others" v-if="v.orderType=='onlineOrder'&&v.deliveryType=='shop'&&v.state!='unpay'&&v.state!='cancel'&&v.state!='waitGroup'">
            <view class="order-getcode">
              <view class="order-getcode-number">提货码：<text>{{v.verificationCode}}</text></view>

              <view class="order-getcode-image" @click="getVerificationQrCode(v.id,v.verificationCode)">
                <van-icon name="qr" size="24px" />
              </view>
            </view>
          </view>
          <view class="order-others-time">下单时间：<text class="order-add-time">{{v.addDataTime}}</text></view>

          <view class="order-operate">
            <!-- 待付款 -->
            <block v-if="v.state=='unpay'">
              <van-button round custom-class="but-order-operation but-cancel-order" @click="cancelOrder($event,v.id)">取消订单</van-button>
              <van-button round custom-class="but-order-operation but-go-pay" @click="goPay($event,v.id,v.saleOrderId,v.saleType,v.orderType)">去付款</van-button>
            </block>
            <!-- 已支付 -->
            <block v-else-if="v.state=='paid'">

            </block>
            <!-- 待发货 -->
            <block v-else-if="v.state=='waitSending'">
              <!-- <van-button round custom-class="but-order-operation but-check-after-sale" @click="applyAfterSale($event,v.id)">申请售后</van-button> -->
            </block>
            <!-- 已发货 -->
            <block v-else-if="v.state=='shipped'">
              <van-button round custom-class="but-order-operation but-sure-received" @click="sureReceived($event,v.id)">确认收货</van-button>
              <!-- <van-button round custom-class="but-order-operation but-check-logistics" @click="checkLogistics($event,v.id)">查看物流</van-button> -->
              <!-- <van-button round custom-class="but-order-operation but-check-after-sale" @click="applyAfterSale($event,v.id)">申请售后</van-button> -->
            </block>
            <!-- 已送达 -->
            <block v-else-if="v.state=='arrived'">
              <van-button round custom-class="but-order-operation but-sure-received" @click="sureReceived($event,v.id)">确认收货</van-button>
              <!-- <van-button round custom-class="but-order-operation but-check-logistics" @click="checkLogistics($event,v.id)">查看物流</van-button> -->
              <!-- <van-button round custom-class="but-order-operation but-check-after-sale" @click="applyAfterSale($event,v.id)">申请售后</van-button> -->
            </block>
            <!-- 待收货 -->
            <block v-else-if="v.state=='waitReceiving'">
              <!-- <van-button round custom-class="but-order-operation but-check-logistics" @click="checkLogistics($event,v.id)">查看物流</van-button> -->
              <van-button round custom-class="but-order-operation but-sure-received" @click="sureReceived($event,v.id)">确认收货</van-button>
              <!-- <van-button round custom-class="but-order-operation but-check-after-sale" @click="applyAfterSale($event,v.id)">申请售后</van-button> -->
            </block>
            <!-- 已收货 -->
            <block v-else-if="v.state=='receipted'||v.state=='success'">
              <van-button round custom-class="but-order-operation but-see-order" @click="seeOrder($event,v.id,v.orderType)">查看订单</van-button>
              <!-- <van-button round custom-class="but-order-operation but-go-assess" @click="goAssess($event,v.orderId)">评价</van-button> -->
            </block>
          </view>
        </view>
        <view class="no-order" v-show="noOrder">没有订单了！</view>
      </scroll-view>

      <Empty v-else desc="没有此状态下的订单哦^_^！" />

    </view>

    <van-dialog id="van-dialog-a" :show="showCancenOrder" title="提示" cancel-button-text="留下宝贝" message="确认取消该订单吗？" :show-cancel-button="true" @close="onCancelDialog" @confirm="onConfirmDialog" />

    <van-dialog id="van-dialog-b" :show="showQrCode" use-slot :show-confirm-button="false" :show-cancel-button="true" cancel-button-text="关闭" @close="onCloseDialog">
      <view class="dialog-qr-image">
        <image :src="dialogVerificationCodePic?dialogVerificationCodePic:errDefaultImage" @error="errQrImg" mode="widthFix" />
      </view>
      <view class="dialog-verification-code">{{dialogVerificationCode}}</view>
    </van-dialog>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";
import { mapState } from "vuex";

export default {
  components: {
    Empty
  },
  data() {
    return {
      orderHeader: [
        { title: "全部" },
        { title: "待付款" },
        { title: "待发货" },
        { title: "待收货" },
        { title: "已完成" }
      ],
      curStatus: 0,
      curPage: 1,
      pageSize: 20,
      allPage: null,
      orderType: "",
      orderList: [],
      noOrder: !1,

      orderId: null,

      showCancenOrder: !1,
      showQrCode: !1,
      dialogVerificationCodePic: "/static/images/default_logo_1x1.jpg",
      dialogVerificationCode: null,
      qrimage: "",
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["storeId", "storeInfo"])
  },
  created() {},

  mounted() {},
  async onLoad() {
    let status = this.$root.$mp.query.status;
    switch (status) {
      case "1":
        this.curStatus = 1;
        this.orderType = "unpay";
        break;
      case "2":
        this.curStatus = 2;
        this.orderType = "waitSending";
        break;
      case "3":
        this.curStatus = 3;
        this.orderType = "waitReceiving";
        break;
      case "4":
        this.curStatus = 4;
        this.orderType = "success";
        break;
      default:
        this.curStatus = 0;
        this.orderType = "";
    }

    this.init();
    await Promise.all([this.getOrderList()]);
  },

  onShow() {},

  methods: {
    init() {
      this.curPage = 1;
      this.orderList = [];
      this.noOrder = !1;
    },
    //切换订单状态
    switchOrderStatus(e) {
      let _type = e.mp.detail.index;
      switch (_type) {
        case 1:
          this.curStatus = 1;
          this.orderType = "unpay";
          break;
        case 2:
          this.curStatus = 2;
          this.orderType = "waitSending";
          break;
        case 3:
          this.curStatus = 3;
          this.orderType = "waitReceiving";
          break;
        case 4:
          this.curStatus = 4;
          this.orderType = "success";
          break;
        default:
          this.curStatus = 0;
          this.orderType = "";
      }
      this.init();
      this.getOrderList();
    },

    //获取订单列表
    async getOrderList() {
      let data = {};
      if (!this.orderType) {
        data = {
          currentPage: this.curPage,
          pageSize: this.pageSize,
          where: {
            // shopId: this.storeId
          }
        };
      } else {
        data = {
          currentPage: this.curPage,
          pageSize: this.pageSize,
          where: {
            // shopId: this.storeId,
            state: this.orderType
          }
        };
      }

      const order = await api
        .getOrderList(data)
        .then(res => {
          const data = res.page;
          let _list = data.list;
          let _orderList = this.orderList;

          this.allPage = data.totalPage;
          if (_list.length > 0) {
            _list.map(i => {
              i.payment = util.moneyFormat(i.payment);
              i.deliveryCost = util.moneyFormat(i.deliveryCost);
              i.orderDescModelList.map(j => {
                j.price = util.moneyFormat(j.price);
              });
            });
            let _newlist = _orderList.concat(_list);
            this.orderList = _newlist;
          } else {
            this.noOrder = !0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //取消订单
    cancelOrder(e, id) {
      this.orderId = id;
      this.showCancenOrder = !0;
    },

    //确认
    onConfirmDialog() {
      const order = api
        .cancelOrder(this.orderId)
        .then(res => {
          this.showCancenOrder = !1;
          util.showToastSuccess("操作成功！");
          this.init();
          this.getOrderList();
        })
        .catch(err => {
          console.log(err);
        });
    },

    //取消
    onCancelDialog() {
      this.showCancenOrder = !1;
    },

    //去付款
    goPay(e, id, gid, stp, otp) {
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

    //查看物流
    checkLogistics(e, id) {
      const url = `/pages/subPackageShop/logistics/logistics?orderId=${id}`;
      util.navigateTo(url);
    },

    //确认收货
    async sureReceived(e, id) {
      const cart = await api
        .sureReceived(id)
        .then(res => {
          util.showToastSuccess("操作成功！");
          this.init();
          this.getOrderList();
        })
        .catch(err => {
          console.log(err);
        });
    },

    //查看订单详情
    seeOrder(e, id, type) {
      let url = "";
      if (type == "immediately") {
        url = `/pages/subPackageShop/orderDetail/imOrderDetail?orderId=${id}`;
      } else {
        url = `/pages/subPackageShop/orderDetail/orderDetail?orderId=${id}`;
      }
      util.navigateTo(url);
    },

    //评价
    goAssess(e, id) {
      const url = `/pages/subPackageShop/assess/assess?orderId=${id}`;
      util.navigateTo(url);
    },

    //弹出核销码
    async getVerificationQrCode(id, code) {
      const _code = await api
        .getVerificationCode(id)
        .then(res => {
          this.dialogVerificationCodePic = res.result;
          this.dialogVerificationCode = code;
          this.showQrCode = !0;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //关闭核销码弹窗
    onCloseDialog() {
      this.showQrCode = !1;
    },

    //处理no found 图片
    errShopLogo(i) {
      this.orderList[i].shopInfoModel.shopLogo = this.errDefaultImage;
    },

    //处理no found 图片
    errImg(i, j) {
      this.orderList[i].orderDescModelList[j].itemImages = this.errDefaultImage;
    },

    errQrImg() {
      this.dialogVerificationCodePic = this.errDefaultImage;
    }
  },

  //下拉刷新
  async onPullDownRefresh() {
    this.init();
    await Promise.all([this.getOrderList()]);
    wx.stopPullDownRefresh();
  },

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      this.getOrderList();
    } else {
      this.noOrder = !0;
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
page {
  height: 100%;
}
.order {
  position: relative;
  height: 100%;
  .order-type {
    position: fixed;
    height: 44px;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 999;
    .backgroundColor(#fff);
  }
  .order-content {
    box-sizing: border-box;
    padding-top: 44px;
    .order-scroll-area {
      height: 100%;
      .order-item {
        margin-bottom: 10px;
        .backgroundColor(#fff);
        .order-seller-info {
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
            width: calc(100% - 100px);
            .fontSize(15px);
          }
          .order-status {
            width: 70px;
            text-align: right;
            .textColor(#f55600);
          }
        }
        .order-seller-info::after {
          .backgroundLine();
        }
      }
      .order-goods-info {
        position: relative;
        .order-goods-list {
          position: relative;
          padding: 10px 15px;
          display: flex;
          .goods-thumb {
            position: relative;
            width: 80px;
            height: 80px;
            margin-right: 10px;
            overflow: hidden;
            .borderRadius(6px);
            image {
              width: 100%;
              height: 100%;
            }
            .corner-marker {
              position: absolute;
              width: 65px;
              height: 65px;
              left: -35px;
              top: -35px;
              z-index: 99;
              background-color: #f6cf46;
              transform: rotate(-45deg);
              text-align: center;
              line-height: 7.9;
              text {
                display: inline-block;
                width: 100%;
                color: #fff;
                font-size: 9px;
              }
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
        .order-goods-list::after {
          .backgroundLine(15px, 0, 1px);
        }
        .order-goods-list:last-child::after {
          .backgroundLine(0, 0, 0);
        }
      }
      .order-goods-info::after {
        .backgroundLine(0, 0, 1px);
      }
      .order-others {
        position: relative;
        padding: 10px 15px;
        text-align: right;
      }
      .order-others::after {
        .backgroundLine(0, 0, 1px);
      }
      .order-others-time {
        padding: 8px 15px;
        .fontSize(12px);
        .textColor(#999);
        text-align: right;
      }
      .order-getcode {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .order-getcode-number,
        .order-getcode-image {
          height: 24px;
          text {
            .textColor(#666);
          }
        }
      }
      .order-operate {
        position: relative;
        padding: 10px 15px;
        text-align: right;
        .but-order-operation {
          height: 32px;
          margin-left: 10px;
          line-height: 31px;
          color: #666;
          border-color: #666;
        }
        .but-go-pay {
          .borderTextColor();
        }
        .but-sure-received,
        .but-go-assess {
          .borderTextColor(#f55600);
        }
      }
    }
    .no-order {
      padding: 10px 15px 20px;
      text-align: center;
      .textColor(#999);
    }
  }
  .dialog-qr-image {
    width: 150px;
    height: 150px;
    margin: 30px auto 20px;
    image {
      width: 100%;
    }
  }
  .dialog-verification-code {
    padding: 10px 15px;
    text-align: center;
  }
}
</style>
