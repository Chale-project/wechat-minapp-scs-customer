<template>
  <view class="pages user">
    <view class="user-info" @click="goToProfile">
      <view class="user-avatar">
        <img :src="userInfo.headPic?userInfo.headPic:'/static/images/default_logo_1x1.jpg'" mode="widthFix" />
      </view>
      <view class="user-account-number">
        <view class="user-name ellipsis">{{userInfo.nickname?userInfo.nickname:'昵称'}}</view>
        <view class="user-mobile">{{mobile?mobile:'手机号未绑定'}}</view>
      </view>
    </view>

    <view class="user-order-card">
      <view class="user-order-card-header">
        <van-cell-group>
          <van-cell title="我的订单" value="全部订单" value-class="go-more" is-link url="/pages/subPackageOthers/selfOrder/selfOrder" />
        </van-cell-group>
      </view>
      <view class="user-order-card-body">
        <view class="user-order-grids">
          <navigator :url="v.url+v.status" class="user-order-status-item" hover-class="navigator-hover" v-for="(v,i) of orderStatus" :key="i">
            <view class="user-order-icon">
              <van-tag round color="#f85437" class="order-tag-box" custom-class="order-tag-number" v-if="v.num>0">{{v.num}}</van-tag>
              <img :src="v.icon">
            </view>
            <view class="user-order-text ellipsis">{{v.title}}</view>
          </navigator>
        </view>
      </view>
    </view>

    <view class="user-store-card" data-url="/pages/subPackageOthers/userCard/userCard" @click="goToLink">
      <view class="user-card-header">
        <view class="store-info">
          <view class="store-logo">
            <image :src="storeUserInfo.shopLogo?storeUserInfo.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errShopLogo" mode="widthFix" />
          </view>
          <view class="store-name">{{storeUserInfo.shopName}}会员</view>
        </view>
        <view class="store-card-qricon">
          <van-icon name="qr" color="#fff" size="40px" />
        </view>
      </view>
      <view class="user-card-content">
        <view class="user-card-level">{{storeUserInfo.membershipName}}</view>
        <view class="user-card-level-desc">永久有效</view>
      </view>
      <view class="user-card-footer" v-if="storeUserInfo.cardCode">No.{{storeUserInfo.cardCode}}</view>
    </view>

    <view class="user-cbi-card">
      <view class="user-coupon-info" data-url="/pages/subPackageOthers/couponMy/couponMy" @click="goToLink">
        <view class="cbi-value ellipsis">{{storeUserInfo.couponCount||0}}</view>
        <view class="cbi-title">优惠券</view>
      </view>
      <view class="user-balance-info" data-url="/pages/subPackageOthers/balanceRecord/balanceRecord" @click="goToLink">
        <view class="cbi-value ellipsis">{{storeUserInfo.balance||'0.00'}}</view>
        <view class="cbi-title">余额</view>
      </view>
      <view class="user-integral-info" data-url="/pages/subPackageOthers/integral/integral" @click="goToLink">
        <view class="cbi-value ellipsis">{{storeUserInfo.customerIntegral||0}}</view>
        <view class="cbi-title">积分</view>
      </view>
    </view>

    <view class="user-options-card">
      <van-cell-group custom-class="user-options-card-item">
        <van-cell is-link data-url="/pages/subPackageGroupBuy/groupUList" @click="goToLink">
          <view slot="title">
            <img class="icon-default" src="/static/images/user_center_group.png" />
            <span class="van-cell-text">我的拼团</span>
          </view>
        </van-cell>
        <van-cell is-link data-url="/pages/subPackageShop/address/address" @click="goToAddress">
          <view slot="title">
            <img class="icon-default" src="/static/images/user_center_address.png" />
            <span class="van-cell-text">我的地址</span>
          </view>
        </van-cell>
        <van-cell is-link @click="contactPhone">
          <view slot="title">
            <img class="icon-default" src="/static/images/user_center_tel.png" />
            <span class="van-cell-text">联系店家</span>
          </view>
        </van-cell>
        <van-cell is-link data-url="/pages/subPackageOthers/set/set" @click="goToLink">
          <view slot="title">
            <img class="icon-default" src="/static/images/user_center_set.png" />
            <span class="van-cell-text">设置</span>
          </view>
        </van-cell>
      </van-cell-group>

    </view>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      mobile: "",
      formId: null,
      orderCount: {},
      storeUserInfo: {},
      orderStatus: [],
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["isNewUser", "userInfo", "storeId"])
  },

  watch: {
    storeId() {
      const that = this;
      const route = getCurrentPages().pop().route;
      if (route == "pages/user/user") {
        const storeId = that.storeId;
        that.getStoreInfo({ storeId, that });
      }
    }
  },

  created() {},

  mounted() {},

  methods: {
    ...mapMutations(["setOrderAddress"]),
    ...mapActions([
      "AuthLoginByWeixin",
      "setOptionsQuery",
      "setAccessRecort",
      "getStoreInfo"
    ]),

    //手机号set
    setMobile() {
      let _mobile = this.userInfo.phoneNumber;
      if (_mobile != null) this.mobile = util.mobileToStar(_mobile);
    },

    //个人资料
    goToProfile() {
      let url = "/pages/subPackageOthers/profile/profile";
      util.navigateTo(url);
    },

    //到我的地址列表去
    goToAddress(e) {
      let url = e.mp.currentTarget.dataset.url;
      this.setOrderAddress(!1);
      util.navigateTo(url);
    },

    //个人中心栏目入口
    goToLink(e) {
      let url = e.mp.currentTarget.dataset.url;
      util.navigateTo(url);
    },

    //联系店家
    contactPhone() {
      const phoneNumber = this.storeUserInfo.shopPhoneNumber;
      wx.makePhoneCall({
        phoneNumber
      });
    },

    async getUserStoreInfo() {
      const info = await api
        .getUserStoreInfo(this.storeId)
        .then(res => {
          this.orderCount = res.result.orderSanalysis;
          this.setOrderStatus();
          if (res.result.shopCustomerInfo) {
            const _info = res.result.shopCustomerInfo;
            _info.balance = util.moneyFormat(_info.balance);
            this.storeUserInfo = _info;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //设置订单状态
    setOrderStatus() {
      let statusList = [
        {
          status: 1,
          title: "待付款",
          icon: "/static/images/order_status_1.png",
          url: "/pages/subPackageOthers/selfOrder/selfOrder?status=",
          num: this.orderCount.unpay || 0
        },
        {
          status: 2,
          title: "待发货",
          icon: "/static/images/order_status_2.png",
          url: "/pages/subPackageOthers/selfOrder/selfOrder?status=",
          num: this.orderCount.waitSending || 0
        },
        {
          status: 3,
          title: "待收货/自提",
          icon: "/static/images/order_status_3.png",
          url: "/pages/subPackageOthers/selfOrder/selfOrder?status=",
          num: this.orderCount.waitReceiving || 0
        },
        {
          status: 4,
          title: "已完成",
          icon: "/static/images/order_status_4.png",
          url: "/pages/subPackageOthers/selfOrder/selfOrder?status=",
          num: 0
        }
      ];
      this.orderStatus = statusList;
    },

    //处理no found 图片
    errShopLogo() {
      this.storeUserInfo.shopLogo = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    const that = this;

    that.setOptionsQuery({ options, that });

    if (that.isNewUser) {
      that.AuthLoginByWeixin().then(() => {
        that.getUserStoreInfo();
        that.setAccessRecort(that.storeId);
        that.setMobile();
      });
    } else {
      that.getUserStoreInfo();
      that.setMobile();
    }
  },

  onShow() {},

  //下拉刷新
  async onPullDownRefresh() {
    await Promise.all([this.getUserStoreInfo()]);
    wx.stopPullDownRefresh();
  },

  //分享
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res);
    }
    return {
      title: `${this.userInfo.nickname}给你分享一个超赞的小店`,
      path: `/pages/user/user?storeId=${this.storeId}`
    };
  }
};
</script>

<style lang="less">
@import "../../../static/css/common";
.user {
  .user-info {
    position: relative;
    box-sizing: border-box;
    height: 110px;
    padding: 10px 30px 10px 15px;
    display: flex;
    align-items: center;
    .backgroundColor(#f85437);
    .user-avatar {
      .wh(70px, 70px);
      margin-right: 10px;
      .borderRadius(50%);
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .user-account-number {
      width: calc(100% - 80px);
      .textColor(#fff);
      .user-name {
        padding-bottom: 5px;
        .fontSize(16px);
      }
      .user-mobile {
        .fontSize(15px);
      }
    }
  }
  .user-info::after {
    position: absolute;
    width: 24px;
    height: 24px;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-family: vant-icon;
    font-size: 12px;
    color: #fff;
    content: "\F00A";
    text-align: center;
    line-height: 24px;
  }
  .user-order-card {
    margin-bottom: 10px;
    .user-order-grids {
      display: flex;
      align-items: center;
      text-align: center;
      padding: 15px 5px;
      .backgroundColor(#fff);
      .user-order-status-item {
        .wh(25%, 100%);
        .user-order-icon {
          .wh(30px, 30px);
          margin: 0 auto;
          position: relative;
          text-align: center;
          img {
            .wh(28px, 28px);
          }
          .order-tag-box {
            position: absolute;
            right: -10px;
            top: -8px;
            z-index: 9;
            .order-tag-number {
              line-height: 1.1;
              padding: 0.2em 0.45em;
            }
          }
        }
        .user-order-text {
          padding: 5px;
        }
      }
      .navigator-hover {
        .backgroundColor(#fff);
      }
    }
  }

  .user-store-card {
    position: relative;
    padding: 20px 15px 10px;
    height: 130px;
    margin: 0 15px 10px;
    border-radius: 6px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    background: -webkit-radial-gradient(ellipse, #d9d919, #7c6218);
    background: -moz-radial-gradient(ellipse, #d9d919, #7c6218);
    background: radial-gradient(ellipse, #d9d919, #7c6218);
    .textColor(#fff);

    .user-card-header {
      margin-bottom: 5px;
      display: flex;
      .store-info {
        width: calc(100% - 50px);
        display: flex;
        align-items: center;
        .store-logo {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          border-radius: 50%;
          text-align: center;
          overflow: hidden;
          image {
            width: 40px;
          }
        }
        .store-name {
          width: calc(100% - 50px);
          .fontSize(16px);
        }
      }
      .store-card-qricon {
        width: 40px;
        height: 40px;
        margin-left: 10px;
      }
    }
    .user-card-content {
      height: 65px;
      .user-card-level {
        padding: 15px 0 5px;
        .fontSize(16px);
        .textColor(#fee3b3);
      }
      .user-card-level-desc {
        .textColor(#fee3b3);
      }
    }
    .user-card-footer {
      height: 15px;
      text-align: right;
    }
    .form-submit {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 99;
      background: transparent;
      text-indent: 99999999px;
    }
  }

  .user-cbi-card {
    display: flex;
    align-items: center;
    text-align: center;
    padding: 20px 15px;
    margin: 0 15px 10px;
    border-radius: 6px;
    -webkit-box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
    background: #fff;
    .user-coupon-info,
    .user-balance-info,
    .user-integral-info {
      position: relative;
      flex: 1;
      .cbi-value {
        padding-bottom: 5px;
        .textColor(#f85437);
      }
      .cbi-title {
        padding-top: 5px;
      }
    }
    .user-coupon-info::after,
    .user-balance-info::after {
      position: absolute;
      content: "";
      width: 1rpx;
      top: 0;
      bottom: 0;
      right: 0;
      .backgroundColor(#ccc);
    }
  }

  .user-options-card {
    .user-options-card-item {
      margin-bottom: 10px;
      .icon-default {
        margin-right: 10px;
      }
    }
    .user-options-card-item.hidden {
      display: none;
    }
  }

  .go-more {
    .textColor();
  }
}
</style>
