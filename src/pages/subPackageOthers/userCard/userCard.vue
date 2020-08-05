<template>
  <view class="pages user-card">
    <view class="user-store-card">
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
    <view class="user-operating-but">
      <button type="default" open-type="getPhoneNumber" class="but-default-submit but-plain" hover-class="but-default-submit-active" :disabled="userInfo.phoneNumber?true:false" v-if="!userInfo.phoneNumber" @getphonenumber="bindGetPhoneNumber">领取会员卡</button>
      <form @submit="formSubmit" :report-submit='true' v-else>
        <button type="default" form-type="submit" class="but-default-submit but-plain" hover-class="but-default-submit-active">同步到卡包</button>
      </form>
    </view>

    <view class="user-interest-wap">
      <view class="user-interest-header"> <text>会员权益</text> </view>
      <view class="user-interest-content">
        <block v-if="storeUserInfo.membershipName!='普通会员'">
          <view>1：会员满{{storeUserInfo.freePostage?storeUserInfo.freePostage+'元':''}}免配送费</view>
          <view>2：会员等级专享{{storeUserInfo.discount?storeUserInfo.discount:''}}折扣</view>
          <view>3：订单支付时，使用积分抵扣订单金额的{{storeUserInfo.exchangeRatio?storeUserInfo.exchangeRatio+'%':'抵扣比例'}}</view>
        </block>
        <block v-else>
          <view>1：订单支付时，使用积分抵扣订单金额的{{storeUserInfo.exchangeRatio?storeUserInfo.exchangeRatio+'%':'抵扣比例'}}</view>
        </block>

        <!-- <van-row gutter="15">
          <van-col span="8">
            <view class="interest-item">
              <view class="interest-item-icon">
                <van-icon name="vip-card-o" color="#f85437" size="30px" />
              </view>
              <view class="interest-item-title">
                等级折扣
              </view>
            </view>
          </van-col>
          <van-col span="8">
            <view class="interest-item">
              <view class="interest-item-icon">
                <van-icon name="gift-o" color="#f85437" size="30px" />
              </view>
              <view class="interest-item-title">
                优惠券
              </view>
            </view>
          </van-col>
          <van-col span="8">
            <view class="interest-item">
              <view class="interest-item-icon">
                <van-icon name="flower-o" color="#f85437" size="30px" />
              </view>
              <view class="interest-item-title">
                积分抵扣
              </view>
            </view>
          </van-col>
        </van-row> -->
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      storeUserInfo: {}
    };
  },
  computed: {
    ...mapState(["storeId", "userInfo"])
  },
  created() {},

  mounted() {},
  methods: {
    ...mapMutations(["setUserInfo"]),

    //获取微信手机号回调
    bindGetPhoneNumber(e) {
      const that = this;
      let data = e.mp.detail;
      if (data.errMsg == "getPhoneNumber:ok") {
        util.login().then(res => {
          const _code = res.code;
          api
            .getSessionByCode(_code)
            .then(res => {
              const _encodeData = {
                encryptedData: data.encryptedData,
                iv: data.iv,
                openid: res.openid
              };
              this.bindUserMobile(_encodeData);
            })
            .catch(() => {
              console.log("session_key:获取失败");
            });
        });
      } else {
        util.showToastError("更多优惠将与你擦肩而过哦！");
      }
    },

    //绑定手机号
    bindUserMobile(_encodeData) {
      api
        .bindWxMobile(_encodeData)
        .then(res => {
          let _userInfo = res.info;
          wx.setStorageSync("userInfo", _userInfo);
          this.setUserInfo(_userInfo);
        })
        .catch(err => {});
    },

    //关联卡包
    formSubmit(e) {
      this.formId = e.mp.detail.formId;
      this.getWxCard();
    },

    //同步到微信卡券
    async getWxCard() {
      const that = this;
      const _info = await api
        .getCardCoupon(that.storeId)
        .then(res => {
          const _cardList = res.result;
          wx.addCard({
            cardList: _cardList,
            success: function(res) {
              util.showToastError("领取成功，请到微信-我的-卡包中查看");
              api.sendCardCouponWxMessage({
                storeid: that.storeId,
                formid: that.formId
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取会员卡信息
    async getUserStoreCard() {
      const info = await api
        .getUserStoreInfo(this.storeId)
        .then(res => {
          if (res.result.shopCustomerInfo) {
            const _info = res.result.shopCustomerInfo;
            _info.freePostage = util.moneyFormat(_info.freePostage);
            this.storeUserInfo = _info;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  async onLoad(options) {
    await Promise.all([this.getUserStoreCard()]);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.user-card {
  .user-store-card {
    position: relative;
    padding: 20px 15px 10px;
    height: 130px;
    margin: 15px;
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
  }

  .user-operating-but {
    margin: 15px 15px 20px;
    .but-default-submit.but-plain {
      width: 60%;
      background: transparent;
      border-radius: 3px;
      border: 1rpx solid #f85437;
      line-height: 2.7;
      color: #f85437;
    }
  }

  .user-interest-wap {
    margin: 15px 0;
    .user-interest-header {
      padding: 10px 15px;
      text {
        .fontSize(18px);
      }
    }
    .user-interest-content {
      padding: 10px 15px;
      .interest-item {
        text-align: center;
        .interest-item-icon,
        .interest-item-title {
          padding: 5px 0;
        }
      }
    }
  }
}
</style>
