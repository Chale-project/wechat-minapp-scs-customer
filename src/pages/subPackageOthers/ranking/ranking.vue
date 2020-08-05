<template >
  <view class="pages ranking">
    <view class="ranking-header">
      <view class="ranking-position">
        <view class="ranking-posi ranking-no-second ">
          <view class="ranking-posi-avatar">
            <image src="/static/images/ranking_second_bg.png" class="ranking-second-bg" mode="widthFix" />
            <image src="/static/images/default_logo_1x1.jpg" class="ranking-second-avatar" mode="widthFix" />
          </view>
          <view class="ranking-posi-name ellipsis">admin</view>
          <view class="ranking-posi-value ellipsis">销售额：1024</view>

        </view>
        <view class="ranking-posi ranking-no-first">
          <view class="ranking-posi-avatar">
            <image src="/static/images/ranking_first_bg.png" class="ranking-first-bg" mode="widthFix" />
            <image src="/static/images/default_logo_1x1.jpg" class="ranking-first-avatar" mode="widthFix" />
          </view>
          <view class="ranking-posi-name ellipsis">admin</view>
          <view class="ranking-posi-value ellipsis">销售额：1024</view>

        </view>
        <view class="ranking-posi ranking-no-third">
          <view class="ranking-posi-avatar">
            <image src="/static/images/ranking_third_bg.png" class="ranking-third-bg" mode="widthFix" />
            <image src="/static/images/default_logo_1x1.jpg" class="ranking-third-avatar" mode="widthFix" />
          </view>
          <view class="ranking-posi-name ellipsis">admin</view>
          <view class="ranking-posi-value ellipsis">销售额：1024</view>

        </view>
      </view>

      <view class="ranking-description">
        <view class="ranking-logo"></view>
        <view class="ranking-desc"></view>
      </view>

    </view>
    <view class="ranking-content">
      <van-tabs color="#f85437" animated @change="switchChargeType">
        <van-tab title="店铺排行榜">
          <view class="ranking-list-content">
            <scroll-view scroll-y style="height: 250px;">
              <view class="ranking-item">
                <view class="ranking-item-number">1</view>
                <view class="ranking-item-avatar">
                  <image src="/static/images/default_logo_1x1.jpg" @error="errShopLogo" mode="widthFix" />
                </view>
                <view class="ranking-item-info">
                  <view class="ranking-item-name">一切皆虚幻</view>
                  <view class="ranking-item-value">销售额：1024</view>
                </view>
              </view>
            </scroll-view>

          </view>
          <!-- <Empty desc="虚席以待！" /> -->

        </van-tab>
        <van-tab title="个人排行榜">
        </van-tab>

      </van-tabs>
    </view>

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
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
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

  onLoad() {},

  async onShow() {
    await Promise.all([]);
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
page {
  .backgroundLiearGraientTB(#571b8c, #551b8b);
}
.ranking {
  .ranking-header {
    position: relative;
    padding: 10px 15px;
    .ranking-position {
      display: flex;
      .ranking-posi {
        flex: 1;
        padding: 0 15px;
        .ranking-posi-avatar {
          position: relative;
          width: 70px;
          height: 70px;
          box-sizing: content-box;
          padding: 12px 9px 12px 5px;
          text-align: center;
          border-radius: 50%;
          .ranking-first-bg,
          .ranking-second-bg,
          .ranking-third-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99;
          }
          .ranking-first-avatar,
          .ranking-second-avatar,
          .ranking-third-avatar {
            width: 100%;
            border-radius: 50%;
            overflow: hidden;
          }
          image {
            width: 100%;
          }
        }
        .ranking-posi-name {
          text-align: center;
          font-size: 10px;
          color: #fff;
        }
        .ranking-posi-value {
          font-size: 10px;
          color: #fcef06;
        }
      }
      .ranking-no-first {
      }
      .ranking-no-second {
        margin-top: 10px;
      }
      .ranking-no-third {
        margin-top: 20px;
      }
    }
  }

  .ranking-content {
    .ranking-list-content {
      .ranking-item {
        display: flex;
        .ranking-item-number {
          width: 30px;
          padding: 5px;
        }
        .ranking-item-avatar {
          width: 60px;
          padding: 5px;
          image {
            width: 100%;
          }
        }
        .ranking-item-info {
          width: calc(100% - 90px);
        }
      }
    }
  }
}
</style>

