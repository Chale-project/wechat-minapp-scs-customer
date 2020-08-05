<template>
  <view class="pages goods">
    <view class="goods-banner" :style="{maxHeight:imgH}">
      <swiper-tem :images="imagesList" :height="imgH" />
    </view>

    <view class="goods-base-info">

      <view class="goods-title">{{goodsInfo.goodsName}}</view>
      <view class="goods-price-sales">
        <text class="goods-original-price">原价：￥{{goodsInfo.faceValue}}</text>
        <text class="goods-price">￥{{goodsInfo.salePrice}}</text>
        <!-- <text class="goods-sales">已销售0件</text>
        <text class="goods-stock">库存：0</text> -->
      </view>
      <view class="goods-share">
        <image src="/static/images/share_icon.png" mode="widthFix" />
        <van-button block custom-class="but-share" open-type="share" @click="shareGoods">分享</van-button>
      </view>
    </view>

    <view class="goods-detail">
      <view class="goods-detail-title">商品详情</view>
      <view class="goods-detail-content">

        <wxParse :content="goodsInfo.virtualGoodsSpec" v-if="goodsInfo.virtualGoodsSpec" />
        <view class="content-empty" v-else>
          <image src="/static/images/user_center_empty.png" mode="widthFix" />
          <view class="empty-tips">店家太懒还没有详细介绍哦！</view>
        </view>
      </view>
    </view>

    <!-- 底部导航 -->
    <van-goods-action>
      <van-goods-action-icon icon="shop-o" text="店铺" @click="goToStore" />
      <van-goods-action-icon icon="chat-o" text="客服" open-type="contact" />
      <van-goods-action-button text="立即购买" @click="buyNowBut" custom-class="but-buy-now" />
    </van-goods-action>
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import wxParse from "mpvue-wxparse";
import swiperTem from "@/components/swiper";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    swiperTem,
    wxParse
  },
  data() {
    return {
      imgH: "250px",
      imagesList: [], //banner图
      goodsId: null,
      goodsInfo: {},
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {
    ...mapState(["isNewUser", "userInfo", "storeId"])
  },

  created() {},

  mounted() {},

  methods: {
    ...mapActions(["AuthLoginByWeixin", "setOptionsQuery", "setAccessRecort"]),

    //获取商品基本信息
    async getGoodsInfo() {
      const info = await api
        .getPlatformGoodsInfo(this.goodsId)
        .then(res => {
          let _info = res.result;
          _info.faceValue = util.moneyFormat(_info.faceValue * 100);
          _info.salePrice = util.moneyFormat(_info.salePrice * 100);
          util.setNavigationBarTitle(_info.goodsName);

          this.goodsInfo = _info;

          this.imagesList = [];
          if (_info.goodsImage) {
            let imgArr = _info.goodsImage.split(","); //处理商品banner图
            for (let i in imgArr) {
              let obj = {};
              obj.picPath = imgArr[i];
              this.imagesList.push(obj);
            }
          } else {
            this.imagesList = [{ picPath: this.errDefaultImage }];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //立即购买
    buyNowBut() {
      let url = `/pages/subPackageVirtualG/virtualGCreateOrderPay?id=${
        this.goodsId
      }`;
      util.navigateTo(url);
    },

    //返回店铺首页
    goToStore() {
      wx.switchTab({
        url: "/pages/home/home"
      });
    },

    //处理no found 图片
    errImg(i) {
      this.checkedGoodsInfo.itemImages = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    const that = this;
    that.goodsId = options.id;

    wx.getSystemInfo({
      success: function(res) {
        that.imgH = `${res.windowWidth}px`;
      }
    });
    that.setOptionsQuery({ options, that });

    if (that.isNewUser)
      that.AuthLoginByWeixin().then(() => {
        that.setAccessRecort(that.storeId);
      });

    await Promise.all([that.getGoodsInfo()]);
  },

  onShow() {},

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res);
    }
    let _path = `/pages/subPackageVirtualG/virtualGDetail?id=${
      this.goodsId
    }&uId=${this.userInfo.id}&storeId=${this.storeId}`;

    return {
      title: this.goodsInfo.goodsName,
      path: _path,
      imageUrl: this.goodsInfo.goodsImage
    };
  }
};
</script>
<style lang="less">
@import "../../../static/css/common";
.goods {
  position: relative;
  .goods-banner {
    // max-height: 264px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }

  .goods-base-info {
    position: relative;
    margin-bottom: 10px;
    padding: 5px 30px 5px 15px;
    .backgroundColor(#fff);

    .goods-title {
      padding: 5px 0;
    }
    .goods-price-sales {
      padding: 5px 0;
      .goods-price,
      .goods-spike-price {
        padding-right: 10px;
        font-weight: bold;
        .fontSize(16px);
        .color-red();
      }
      .goods-original-price {
        padding-right: 10px;
        text-decoration: line-through;
        .fontSize(12px);
        .textColor(#999);
      }
      .goods-sales,
      .goods-stock {
        margin-right: 5px;
        .textColor(#999);
      }
    }
    .goods-share {
      position: absolute;
      width: 30px;
      height: 30px;
      right: 0;
      top: 4px;
      line-height: 30px;
      .but-share {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 100%;
        padding: 0;
        text-indent: 999999px;
        background: transparent;
        background-color: none;
        border: 0;
        opacity: 0;
        z-index: 99;
        .borderRadius(0);
      }
      image {
        width: 20px;
      }
    }
  }
  .goods-operate {
    margin-bottom: 10px;
    .goods-operate-title {
      .textColor(#666);
    }
    .goods-operate-cell {
      padding-left: 60px;
      .goods-operate-title {
        margin-left: -45px;
      }
      .goods-parameter-choiced,
      .goods-attr-choiced,
      .goods-freight-choiced {
        padding-left: 17px;
      }
    }
  }

  .goods-detail {
    padding-bottom: 120px;
    .goods-detail-title {
      padding: 10px 15px;
      .backgroundColor(#fff);
    }
    .goods-detail-content {
      image {
        width: 100%;
      }
    }
    .content-empty {
      padding: 100px 0;
      text-align: center;
      image {
        width: 80px;
      }
      .empty-tips {
        padding: 15px;
        .textColor(#999);
      }
    }
  }

  .but-buy-now {
    background-color: #f85437;
    border-color: #f85437;
  }
}
</style>
