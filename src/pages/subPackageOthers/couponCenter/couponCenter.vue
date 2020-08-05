<template >
  <view class="pages coupon-center">
    <view class="coupon-full" v-if="couponList.length>0">

      <view class="coupon-list" v-for="(v,i) of couponList" :key="i">
        <view class="coupon-list-face-info" @click="showMessage(v.spec)">
          <view class="coupon-tips">超值抵扣券</view>
          <view class="coupon-list-face-left">
            <view class="coupon-list-face-val">￥<text>{{v.usedAmount}}</text></view>
            <view class="coupon-list-face-rule ellipsis">满{{v.meetAmount}}元可用</view>
          </view>
          <view class="coupon-list-face-right">
            <view class="coupon-list-face-name ellipsis">{{v.title}}</view>
            <view class="coupon-list-face-expired ellipsis">有效期：</view>
            <view class="coupon-list-face-vid ellipsis-2">{{v.validStartTime}}至{{v.validEndTime}}</view>
          </view>
        </view>
        <view class="coupon-list-status">
          <view class="circle-dot-top"></view>
          <view class="circle-dot-bottom"></view>
          <view class="coupon-surplus">剩余{{v.residueCount}}张</view>
          <van-button round size="small" custom-class="but-immediate-use" @click="bindReceiveCoupon(v.id,i)">立即领取</van-button>
        </view>
      </view>

      <view class="no-more" v-show="noMore">没有更多了！</view>

    </view>

    <Empty desc="暂无可领优惠券！" v-else />

    <van-dialog :message="message" title="提示" @close="closeDialog" :show="showDialog" />

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
      curPage: 1,
      pageSize: 20,
      allPage: null,
      noMore: !1,
      couponList: [],
      message: "",
      showDialog: !1
    };
  },
  computed: {
    ...mapState(["storeId"])
  },
  created() {},

  mounted() {},

  methods: {
    //初始化
    init() {
      this.curPage = 1;
      this.couponList = [];
      this.noMore = !1;
      this.showDialog = !1;
      this.message = "";
    },

    //
    showMessage(msg) {
      if (!msg) return;
      this.message = msg;
      this.showDialog = !0;
    },

    //关闭Dialog
    closeDialog() {
      this.showDialog = !1;
    },

    //领取优惠券
    async bindReceiveCoupon(id, index) {
      const _couponList = this.couponList;
      const coupon = await api
        .getCoupon({
          couponId: id
        })
        .then(res => {
          --_couponList[index].residueCount;
          util.showToastSuccess("领取成功！");
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取系统优惠券
    async getSysCouponList() {
      let data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          usedShopId: this.storeId
        }
      };
      const coupon = await api
        .getCouponList(data)
        .then(res => {
          let data = res.result;
          let _list = data.list;
          let list = this.couponList;
          this.allPage = data.totalPage;
          if (_list.length > 0) {
            this.noMore = !1;
            _list.map(i => {
              i.usedAmount = util.moneyFormat(i.usedAmount);
              i.meetAmount = util.moneyFormat(i.meetAmount);
            });
            const _newList = list.concat(_list);
            this.couponList = _newList;
          } else {
            this.noMore = !0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  onLoad() {},

  async onShow() {
    this.init();
    await Promise.all([this.getSysCouponList()]);
  },

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      Promise.all([this.getSysCouponList()]);
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
.coupon-center {
  .coupon-full {
    box-sizing: border-box;
    padding: 10px 15px;
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
      background: #f85437;
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

    .coupon-list-face-val {
      color: #ff4e00;
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

    .coupon-list-face-expired {
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

    .coupon-list-status {
      background: #f85437;
    }

    .coupon-surplus {
      margin-bottom: 5px;
      font-size: 12px;
    }

    .but-immediate-use {
      height: 26px;
      box-sizing: border-box;
      padding: 0 10px;
      font-size: 11px;
      color: #f23030;
      line-height: 2;
      border: 2px solid #e55b2a;
      border-radius: 30px;
      background: #fff;
    }

    .no-more {
      padding: 30px 15px;
      text-align: center;
      .textColor(#999);
    }
  }
}
</style>
