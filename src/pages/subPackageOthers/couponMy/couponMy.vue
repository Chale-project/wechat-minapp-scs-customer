<template>
  <view class="pages coupon">
    <view class="coupon-type">
      <van-tabs :active="curStatus" color="#f85437" @change="switchStatus">
        <van-tab :title="v" v-for="(v,i) of tabNav" :key="i"></van-tab>
      </van-tabs>
    </view>
    <view class="coupon-content" v-if="couponList.length>0">
      <view class="coupon-list coupon-type-mall" v-for="(v,i) of couponList" :key="i">
        <view class="coupon-list-face-info" @click="showMessage(v.spec)">
          <view class="coupon-tips">超值抵扣券</view>
          <view class="coupon-list-face-left">
            <view :class="v.couponStatus=='notUsed'?'coupon-list-face-val using':'coupon-list-face-val used'">￥<text>{{v.usedAmount}}</text></view>
            <view class="coupon-list-face-rule ellipsis">满{{v.meetAmount}}元可用</view>
          </view>
          <view class="coupon-list-face-right">
            <view class="coupon-list-face-name ellipsis">{{v.title}}</view>
            <view class="coupon-list-face-expired ellipsis">有效期：</view>
            <view class="coupon-list-face-vid ellipsis-2">{{v.validStartTime}}至{{v.validEndTime}}</view>
          </view>
        </view>
        <view :class="v.couponStatus=='notUsed'?'coupon-list-status using':'coupon-list-status used'">
          <view class="circle-dot-top"></view>
          <view class="circle-dot-bottom"></view>
          <block v-if="v.couponStatus=='notUsed'">
            <button class="but-default immediate-use" hover-class="but-default-active" @click="immediateUse">立即使用</button>
          </block>
          <block v-else-if="v.couponStatus=='hasUse'">
            <text>已使用</text>
          </block>
          <block v-else-if="v.couponStatus=='hasInvalid'">
            <text>已失效</text>
          </block>
        </view>
      </view>

      <!--没有更多了  -->
      <view class="no-more" v-show="noMore">没有更多记录了！</view>

    </view>

    <view class="no-coupon" v-else>
      <Empty desc="暂时没有此状态下优惠券^_^" />
      <view class="but-receive-coupon" v-if="curStatus==0">
        <van-button round block custom-class="but-get-coupon" @click="getCouponCenter">领券中心</van-button>
      </view>
    </view>

    <van-dialog :message="message" title="提示" @close="closeDialog" :show="showDialog" />

    <!-- 返回店铺首页 -->
    <back-home />

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";
import backHome from "@/components/backHome";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Empty,
    backHome
  },
  data() {
    return {
      curStatus: 0,

      tabNav: ["未使用", "已使用", "已失效"],
      couponType: "notUsed",
      hidden: true,

      curPage: 1,
      pageSize: 20,
      totalPage: null,
      couponList: [],

      noCoupon: !1,
      message: "",
      showDialog: !1,

      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["isNewUser", "storeId"])
  },
  created() {},

  mounted() {},

  methods: {
    ...mapActions(["AuthLoginByWeixin", "setOptionsQuery", "setAccessRecort"]),

    init() {
      this.curPage = 1;
      this.couponList = [];
      this.noCoupon = !1;
      this.showDialog = !1;
      this.message = "";
    },

    //切换优惠券状态
    switchStatus(e) {
      let _type = e.mp.detail.index;
      switch (_type) {
        case 1:
          this.curStatus = 1;
          this.couponType = "hasUse";
          break;
        case 2:
          this.curStatus = 2;
          this.couponType = "hasInvalid";
          break;
        default:
          this.curStatus = 0;
          this.couponType = "notUsed";
      }
      this.init();
      this.getCouponList();
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

    //立即使用
    immediateUse() {
      wx.switchTab({
        url: "/pages/sort/sort"
      });
    },

    //领券中心去
    getCouponCenter() {
      const url = `/pages/subPackageOthers/couponCenter/couponCenter`;
      util.navigateTo(url);
    },

    //获取优惠券列表
    async getCouponList() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          usedShopId: this.storeId,
          status: this.couponType
        }
      };

      const coupon = await api
        .getMyCouponList(data)
        .then(res => {
          const data = res.result;
          let _list = data.list;
          let _couponList = this.couponList;

          this.allPage = data.totalPage;
          if (_list.length > 0) {
            _list.map(i => {
              i.usedAmount = util.moneyFormat(i.usedAmount);
              i.meetAmount = util.moneyFormat(i.meetAmount);
            });
            const _newList = _couponList.concat(_list);
            this.couponList = _newList;
          } else {
            this.noCoupon = !0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //处理no found 图片
    errImg(i, j) {
      this.couponList[i].couponDescModelList[
        j
      ].itemImages = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.init();
    const that = this;
    this.setOptionsQuery({ options, that });

    if (that.isNewUser)
      that.AuthLoginByWeixin().then(() => {
        that.setAccessRecort(that.storeId);
      });

    await Promise.all([this.getCouponList()]);
  },

  onShow() {},

  //onReachBottom
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      this.getCouponList();
    } else {
      this.noCoupon = !0;
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
page {
  height: 100%;
}
.coupon {
  position: relative;
  .coupon-type {
    position: fixed;
    height: 44px;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 999;
    .backgroundColor(#fff);
  }

  .coupon-content {
    box-sizing: border-box;
    margin-top: 44px;
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

    .immediate-use.but-default {
      box-sizing: border-box;
      padding: 0 10px;
      font-size: 12px;
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

  .no-coupon {
    margin: 30px 15px;
    text-align: center;
  }

  .but-receive-coupon {
    margin-top: 80px;
    .but-get-coupon {
      .but-default();
      .fontSize(16px);
    }
  }
}
</style>
