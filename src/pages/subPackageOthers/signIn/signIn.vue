<template >
  <view class="pages signin">
    <view class="signin-header">
      <span v-for="(item, index) in bubbles" :key="index"></span>
    </view>
    <view class="signin-face">
      <view class="signin-integral">
        <view class="signin-value"><text>{{signIntegral}}</text></view>
        <view class="signin-title">获得积分</view>
      </view>
      <van-button round custom-class="but-sign-in" @click="bindSignIn" :disabled="!isOpenSign">{{todaySign?'已签到':'点我签到'}}</van-button>
      <view class="signin-days">
        <view class="signin-value"><text>{{signDays}}</text> 天</view>
        <view class="signin-title">已连续签到</view>
      </view>
    </view>
    <view class="signin-record" v-if="isOpenSign">
      <view class="sign-in-item" v-for="(v,i) of signRecordList" :key="i">
        <view v-if="v.sign" class="sign-in-item-tag active">
          <van-icon name="success" color="#fff" size="20px" />
        </view>
        <view v-else class="sign-in-item-tag">+{{v.integral}}</view>
        <view class="sign-in-item-time">{{v.signDate}}</view>
      </view>
    </view>

    <Empty v-else desc="店家暂未开启签到哦！" />

    <view class="wx-ad">
      <ad unit-id="adunit-74db91e27ff3b641" :ad-intervals="30"></ad>
    </view>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";
import { mapState } from "vuex";
let interstitialAd = null;
export default {
  components: {
    Empty
  },
  data() {
    return {
      bubbles: 10,
      isOpenSign: !1,
      signIntegral: 0,
      signDays: 0,
      todaySign: !1,
      signRecordList: []
    };
  },
  computed: {
    ...mapState(["storeId"])
  },
  created() {},

  mounted() {},

  methods: {
    //点击签到
    bindSignIn() {
      if (!this.isOpenSign) {
        util.showToastError("店家暂未开启签到哦！");
        return false;
      }
      this.setSignIn();
    },

    //签到
    async setSignIn() {
      const sign = await api
        .setSign(this.storeId)
        .then(res => {
          this.getSignInInfo();
        })
        .catch(err => {
          console.log(err);
        });
    },

    //创建订单
    async getSignInInfo() {
      const sign = await api
        .getSignInfo(this.storeId)
        .then(res => {
          if (!res.info) {
            this.isOpenSign = !1;
          } else {
            this.isOpenSign = !0;
            const info = res.info;
            this.signIntegral = info.customerIntegral;
            this.signDays = info.continuousDay;
            this.todaySign = info.todaySign;
            this.signRecordList = info.time;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  onLoad() {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: "adunit-2d26a6ad7914af01"
      });
      interstitialAd.onLoad(() => {});
      interstitialAd.onError(err => {});
      interstitialAd.onClose(() => {});
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch(err => {
        console.error(err);
      });
    }
  },

  async onShow() {
    await Promise.all([this.getSignInInfo()]);
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
.signin {
  overflow: hidden;
  .signin-header {
    position: relative;
    width: 150%;
    height: 200px;
    margin-left: 50%;
    margin-top: -50px;
    transform: translateX(-50%);
    text-align: center;
    // .borderRadius(50%);
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
    .backgroundColor(#16cda7);
    //  .backgroundLiearGraientLR(#29aea5, #03eba9);
    overflow: hidden;
    span {
      position: absolute;
      // bottom 的设置是为了营造出气泡从页面底部冒出的效果；
      bottom: -160px;
      // 默认的气泡大小；
      width: 20px;
      height: 20px;
      background-color: rgba(255, 255, 255, 0.15);
      // 使用自定义动画使气泡渐现、上升和翻滚；
      animation: square 10s infinite;
      transition-timing-function: linear;
      &:nth-child(1) {
        left: 10%;
      }
      &:nth-child(2) {
        left: 20%;
        width: 80px;
        height: 80px;
        animation-delay: 2s;
        animation-duration: 7s;
      }
      &:nth-child(3) {
        left: 25%;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 70px;
        height: 70px;
        animation-duration: 8s;
        background-color: rgba(255, 255, 255, 0.3);
      }
      &:nth-child(5) {
        left: 70%;
      }
      &:nth-child(6) {
        left: 80%;
        width: 100px;
        height: 100px;
        animation-delay: 3s;
        background-color: rgba(255, 255, 255, 0.2);
      }
      &:nth-child(7) {
        left: 32%;
        width: 6px;
        height: 60px;
        animation-delay: 2s;
      }
      &:nth-child(8) {
        left: 55%;
        width: 50px;
        height: 50px;
        animation-delay: 4s;
        animation-duration: 15s;
      }
      &:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        animation-delay: 2s;
        animation-duration: 12s;
        background-color: rgba(255, 255, 255, 0.3);
      }
      &:nth-child(10) {
        left: 85%;
        width: 30px;
        height: 30px;
        animation-delay: 5s;
      }
    }
  }

  .signin-face {
    position: relative;
    margin-top: -150px;
    padding: 30px 15px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 10;
    .signin-integral,
    .signin-days {
      text-align: center;
      color: #fff;
      .signin-value {
        padding: 5px 0;
      }
      text {
        color: #f85437;
      }
    }
    .but-sign-in {
      position: relative;
      height: 90px;
      width: 90px;
      padding: 0;
      line-height: 90px;
      color: #fff;
      background-color: #f85437;
      border-radius: 50%;
      border-color: #f85437;
      font-size: 16px;
      animation: shadow-plus 2s infinite;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
    }
    .but-sign-in:active {
      transition: background-color 0.1s 0.3s, color 0.1s 0.3s,
        border-color 0.1s 0.3s;
      color: #eceff1;
      background-color: #16cda7;
      border-color: #16cda7;
      animation: anim-moema-1 0.3s forwards;
    }
    .but-sign-in::before {
      content: "";
      position: absolute;
      top: -20px;
      left: -20px;
      bottom: -20px;
      right: -20px;
      background: inherit;
      border-radius: 50%;
      z-index: -1;
      opacity: 0.4;
      -webkit-transform: scale3d(0.7, 0.5, 1);
      transform: scale3d(0.7, 0.5, 1);
    }
    .but-sign-in:active::before {
      animation: anim-moema-2 0.3s 0.3s forwards;
    }
  }

  @keyframes square {
    0% {
      opacity: 0.5;
      transform: translateY(0px) rotate(45deg);
    }
    25% {
      opacity: 0.75;
      transform: translateY(-400px) rotate(90deg);
    }
    50% {
      opacity: 1;
      transform: translateY(-600px) rotate(135deg);
    }
    100% {
      opacity: 0;
      transform: translateY(-1000px) rotate(180deg);
    }
  }
  @keyframes shadow-plus {
    from {
      box-shadow: 0 0 9px rgba(248, 84, 55, 0.5);
    }
    50% {
      box-shadow: 0 0 18px rgba(248, 84, 55, 1);
    }
    to {
      box-shadow: 0 0 9px rgba(248, 84, 55, 0.5);
    }
  }

  @keyframes anim-moema-1 {
    60% {
      -webkit-transform: scale3d(0.8, 0.8, 1);
      transform: scale3d(0.8, 0.8, 1);
    }

    85% {
      -webkit-transform: scale3d(1.1, 1.1, 1);
      transform: scale3d(1.1, 1.1, 1);
    }

    100% {
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }
  @keyframes anim-moema-2 {
    to {
      opacity: 0;
      -webkit-transform: scale3d(1, 1, 1);
      transform: scale3d(1, 1, 1);
    }
  }
  .signin-record {
    position: relative;
    margin-top: 30px;
    padding: 10px 15px;
    text-align: center;
    display: flex;
    justify-content: space-between;
    .sign-in-item {
      position: relative;
      display: inline-block;
      text-align: center;
      .sign-in-item-tag {
        width: 25px;
        height: 25px;
        border: 0.5px solid #e1e1e1;
        line-height: 25px;
        text-align: center;
        border-radius: 50%;
        .backgroundColor(#fff);
        .textColor(#e1e1e1);
        .fontSize(10px);
      }
      .sign-in-item-tag.active {
        border-color: #f85437;
        line-height: 40px;
        .backgroundColor(#f85437);
      }
      .sign-in-item-time {
        margin-top: 8px;
        .fontSize(12px);
      }
    }
  }
  .signin-record::before {
    content: "";
    position: absolute;
    width: calc(100% - 30px);
    height: 1px;
    top: 22px;
    .backgroundColor(#e1e1e1);
  }

  .wx-ad {
    position: relative;
    margin: 60px 15px 0;
  }
}
</style>
