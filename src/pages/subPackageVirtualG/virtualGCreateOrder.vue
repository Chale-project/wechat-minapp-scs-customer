<template>
  <view class="pages virtual-order-create">
    <view class="virtual-order-create-face">
      <van-cell-group custom-class="virtual-goods-info">
        <van-cell icon="gift-o" title="商品名称" :value="goodsInfo.goodsTitle" value-class="virtual-goods-name"> </van-cell>
        <van-cell icon="cash-on-deliver" title="商品原价" :value="'￥'+(goodsInfo.original||'0.00')" value-class="virtual-goods-price"> </van-cell>
        <van-cell icon="balance-pay" title="活动价格" :value="'￥'+(goodsInfo.price||'0.00')" value-class="virtual-goods-price"> </van-cell>
        <van-cell icon="flag-o" title="购买方式" :value="goodsInfo.goodsType=='5'?'直充':goodsInfo.goodsType=='6'?'卡密':'其他'"> </van-cell>
        <van-cell icon="points" title="购买数量">
          <view slot="right-icon">
            <van-stepper :value="rechargeNumber" integer min="1" step="1" :disabled="goodsInfo.goodsType=='5'&&goodsInfo.virtualGoodsNumber=='8350'?false:goodsInfo.goodsType!='6'?true:false" @change="onChangeRechargeNumber" />
          </view>
        </van-cell>
        <van-field left-icon="edit" required :value="rechargeAccount" label="充值账号" placeholder="请输入充值账号" v-if="goodsInfo.goodsType=='5'" @change="onChangeRechargeAccount" />
        <van-field left-icon="records" label="订单备注" :value="remarks" placeholder="买家留言" @change="bindRemarks" />
      </van-cell-group>
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

    <!-- 底部确认订单并支付 -->
    <van-submit-bar :price="finalPaymentMoney" button-text="提交订单" @submit="orderCreate" />

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
      idsNum: null,
      groupId: null, //团ID
      orderType: "virtualGoods", //virtualGoods：虚拟商品订单；
      saleType: null, // group：拼团；seckill：秒杀
      deliveryType: "platform", //'home':送货上门；'shop':到店自提；'platform':平台配送

      goodsInfo: {},
      rechargeNumber: 1,
      rechargeAccount: null,

      //拼团
      groupUserList: [], // 团成员
      finalPaymentMoney: 0, // 最终支付金额
      remarks: "",

      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["storeId"])
  },

  created() {},

  mounted() {},

  methods: {
    init() {
      this.groupUserList = [];
      this.rechargeNumber = 1;
      this.rechargeAccount = "";
      this.remarks = "";
    },

    //购买数量
    onChangeRechargeNumber(e) {
      const num = e.mp.detail || 1;
      this.rechargeNumber = num;
      const id = this.idsNum.split("~")[0];
      this.idsNum = `${id}~${num}`;
      this.calcPaymentMoney();
    },

    //冲值帐号
    onChangeRechargeAccount(e) {
      this.rechargeAccount = e.mp.detail;
    },

    //绑定备注信息到对应的订单
    bindRemarks(e) {
      this.remarks = e.mp.detail;
    },

    //计算最终支付金额
    calcPaymentMoney() {
      const a = this.goodsInfo.price * 100;
      const n = this.rechargeNumber;
      this.finalPaymentMoney = a * n;
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

    //创建订单
    orderCreate() {
      const _flag = this.checkData();
      //提交订单数据
      if (_flag) {
        const _stp = this.saleType;
        let data = {
          shopId: this.storeId,
          orderType: this.orderType,
          saleType: this.saleType,
          groupOrderId: this.groupId,
          deliveryType: this.deliveryType,
          carts: this.idsNum,
          rechargeAccount: this.rechargeAccount,
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

    //查询订单
    async getOrderInfo() {
      const data = {
        shopId: this.storeId,
        carts: this.idsNum,
        saleType: this.saleType,
        groupOrderId: this.groupId
      };
      const info = await api
        .getAllBeforeOrder(data)
        .then(res => {
          let data = res.info;

          this.finalPaymentMoney = data.payment;

          //商品
          if (data.orderDesc.length > 0) {
            const _orderGoodsInfo = data.orderDesc[0];

            _orderGoodsInfo.original = util.moneyFormat(
              _orderGoodsInfo.original
            );
            _orderGoodsInfo.price = util.moneyFormat(_orderGoodsInfo.price);
            this.goodsInfo = _orderGoodsInfo;
          } else {
            this.goodsInfo = {};
          }

          // 团成员
          if (data.userList && data.userList.length > 0) {
            this.groupUserList = data.userList;
          } else {
            this.groupUserList = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  async onLoad(options) {
    this.init();

    this.idsNum = options.idsNum;
    this.rechargeNumber = options.idsNum.split("~")[1];
    const _stp = options.stp;
    const _groupId = options.groupId;

    if (_stp) this.saleType = _stp;
    else this.saleType = null;

    if (_groupId) this.groupId = _groupId;
    else this.groupId = null;

    await Promise.all([this.getOrderInfo()]);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../static/css/common";
.virtual-order-create {
  .virtual-order-create-face {
    margin-bottom: 10px;
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

  .order-remarks {
    margin-bottom: 10px;
  }
}
</style>
