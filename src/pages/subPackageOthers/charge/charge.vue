<template >
  <view class="pages charge">
    <view class="charge-header">
      <view class="cur-balance">
        <text>{{curBalance}} </text>元
      </view>
      <view>当前余额</view>
    </view>
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

    <view class="charge-submit">
      <form @submit="formSubmit" :report-submit='true'>
        <button type="default" form-type="submit" class="but-default-submit" hover-class="but-default-submit-active" :disabled="chargeDisabled">立即储值</button>
      </form>
    </view>
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import pay from "@/utils/pay";
import Empty from "@/components/empty";
import { mapState } from "vuex";
export default {
  components: {
    Empty
  },
  data() {
    return {
      orderType: "charge",
      curBalance: "0.00",
      chargeCardList: [],
      checkedCardId: null,
      chargeDisabled: !0
    };
  },
  computed: {
    ...mapState(["storeId", "storeInfo"])
  },

  created() {},

  mounted() {},

  methods: {
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

    formSubmit(e) {
      api.saveFormId(e.mp.detail.formId);
      this.submitCharge();
    },

    //充值
    async submitCharge() {
      if (this.chargeDisabled) return;

      if (this.storeInfo.state == "disabled") {
        util.showToastError("该店铺被禁用！");
        return false;
      }

      const data = {
        shopId: this.storeId,
        orderType: this.orderType,
        rechargeCardId: this.checkedCardId
      };
      this.chargeDisabled = !0;
      const charge = await pay
        .payOrder(data)
        .then(res => {
          this.chargeDisabled = !1;
          if (res.errMsg === "requestPayment:ok") {
            util.showToastSuccess("支付成功！");
            setTimeout(() => {
              util.goToPaySuccess();
            }, 500);
          }
        })
        .catch(err => {
          this.chargeDisabled = !1;
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
          this.curBalance = util.moneyFormat(res.money);
          if (res.list.length > 0) {
            const _list = res.list;
            _list.map(i => {
              i.cardMoney = util.moneyFormat(i.cardMoney);
              i.presentMoney = util.moneyFormat(i.presentMoney);
            });
            this.chargeCardList = _list;

            this.chargeDisabled = !1;
            this.chargeCardList[0].checked = !0;
            this.checkedCardId = this.chargeCardList[0].id;
          } else {
            this.chargeDisabled = !0;
            this.chargeCardList = [];
            this.checkedCardId = null;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  onLoad() {},

  async onShow() {
    await Promise.all([this.getChargeList()]);
  },

  //上拉加载
  onReachBottom() {}
};
</script>

<style lang="less">
@import "../../../../static/css/common";
.charge {
  &-header {
    margin: 0 15px 10px;
    padding: 20px 15px;
    text-align: center;
    border-bottom: 0.5px solid #ddd;
    .cur-balance {
      padding: 10px 0;
      text {
        .fontSize(24px);
        .textColor(#f85437);
      }
    }
  }
  &-content {
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

  .charge-submit {
    margin: 20px 15px;
    .but-charge-submit {
      .but-default();
      .fontSize(15px);
    }
  }
}
</style>
