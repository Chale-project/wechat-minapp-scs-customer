<template>
  <view class="pages pay-success">
    <view class="pay-success-content">
      <view class="pay-success-icon">
        <van-icon name="success" color="#fff" size="24px" />
      </view>
      <view class="pay-success-text">
        <text>支付成功</text>
      </view>

    </view>
    <!--  -->
    <view class="pay-success-store-info" v-if="storeInfo.groupPic">
      <block v-for="(v,i) of storeInfo.groupPic" :key="i" v-if="storeInfo.groupPic.length>0">
        <view class="store-qr-code">
          <image :src="v.groupQrCodePic?v.groupQrCodePic:errDefaultImage" @click="previewImage(v.groupQrCodePic)" @error="errImg(i)" mode="widthFix" />
        </view>
        <view class="store-desc">{{v.groupQrDescription}}</view>
      </block>
    </view>

    <view class="pay-success-button">
      <van-button custom-class="but-go-shopping" @click="goShopping">继续购物</van-button>
      <!-- <van-button class="but-go-order" custom-class="pay-button" @click="goOrder">查看订单</van-button> -->
    </view>

    <!-- ad -->
    <view class="pay-success-ad" v-if="imagesList.length>0">
      <swiper-tem :current="curIndex" :images="imagesList" mode="aspectFit" @toPath="goToPath" />
      <text class="ad-tag">广告</text>
    </view>

    <view class="wx-ad">
      <ad unit-id="adunit-3d772744a95b3458" :ad-intervals="30"></ad>
    </view>
    <!-- 返回店铺首页 -->
    <back-home />
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import swiperTem from "@/components/swiper";
import backHome from "@/components/backHome";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    swiperTem,
    backHome
  },
  data() {
    return {
      curIndex: 0,
      imagesList: [],
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {
    ...mapState(["isNewUser", "storeId", "storeInfo"])
  },

  watch: {
    storeId() {
      const that = this;
      const route = getCurrentPages().pop().route;
      if (route == "pages/subPackageShop/paySuccess/paySuccess") {
        const storeId = that.storeId;
        that.getStoreInfo({ storeId, that });
      }
    }
  },

  created() {},

  mounted() {},

  methods: {
    ...mapActions(["AuthLoginByWeixin", "getStoreInfo", "setOptionsQuery"]),

    //继续购物
    goShopping() {
      wx.switchTab({
        url: "/pages/sort/sort"
      });
    },

    //查看订单
    goOrder() {
      const url = `/pages/subPackageShop/order/order`;
      util.redirectTo(url);
    },
    //查看图片
    previewImage(url) {
      let _urls = [];
      _urls.push(url);
      wx.previewImage({
        urls: _urls // 需要预览的图片http链接列表
      });
    },

    //广告图链接
    goToPath(e) {
      if (e && e.indexOf("/pages") != -1) {
        util.navigateTo(e);
      }
    },

    //获取广告图
    async getAd() {
      const res = await api
        .getAdList("D2019052931")
        .then(res => {
          const list = res.result.files;
          if (list.length > 0) this.imagesList = list;
          else this.imagesList = [];
        })
        .catch(err => {});
    },

    //处理no found 图片
    errImg(i) {
      this.storeInfo.groupPic[i].groupQrCodePic = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    const that = this;

    that.setOptionsQuery({ options, that });

    if (that.isNewUser) that.AuthLoginByWeixin();

    await Promise.all([that.getAd()]);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.pay-success {
  position: relative;
  .pay-success-content {
    padding: 50px 15px 30px;
    .pay-success-icon {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      text-align: center;
      line-height: 65px;
      .borderRadius(50%);
      .backgroundColor(#4bc065);
    }
    .pay-success-text {
      padding: 20px 0 0;
      text-align: center;
      .fontSize(20px);
      .textColor(#333);
    }
  }

  .pay-success-store-info {
    margin-bottom: 10px;
    .store-qr-code {
      width: 200px;
      height: 200px;
      margin: 0 auto 20px;
      image {
        width: 100%;
      }
    }
    .store-desc {
      padding: 10px 15px;
      text-indent: 2em;
      .textColor(#666);
    }
  }
  .pay-success-button {
    padding: 0 15px;
    text-align: center;
    .but-go-shopping {
      border: 1px solid #f85437;
      .borderRadius(4px);
    }
    .but-go-order {
      margin-left: 10px;
    }
    .pay-button {
      height: 38px;
      line-height: 38px;
      background: transparent;
      .borderColor(#666);
      .borderRadius(6px);
    }
  }

  .pay-success-ad {
    position: relative;
    margin: 50px 15px 10px;
    max-height: 200px;
    overflow: hidden;
    .slide-image {
      width: 100%;
      height: 100%;
    }
    .ad-tag {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      padding: 0 2px;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
      text-align: center;
      font-size: 10px;
      z-index: 99;
    }
  }
  .wx-ad {
    position: relative;
    margin: 20px 15px;
  }
}
</style>
