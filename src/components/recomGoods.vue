<template>
  <view class="recom-goods">
    <view class="recom-header">
      <image src="/static/images/healthy_icon_t_l.png" mode="widthFix" />
      <text>精品推荐</text>
      <image src="/static/images/healthy_icon_t_r.png" mode="widthFix" />
    </view>
    <view class="recom-content clearfix">
      
      <view class="recom-goods-item float-left" v-for="(v, i) in recomGoodsList" :key="i">
        <view class="goods-item-image">
          <image :src="v.image?v.image:'/static/images/default_logo_1x1.jpg'" mode="widthFix" />
        </view>
        <view class="goods-item-title ellipsis">{{v.title}}</view>
        <view class="goods-item-price-Sales ellipsis">
          <view class="goods-item-price color-red ellipsis">￥{{v.price}}</view>
          <view class="goods-item-sales ellipsis">销量{{v.sales}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    recomGoodsList: {
      type: Array
    }
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="less">
@import "../../static/css/common";
.recom-goods {
  margin-top: 30px;
  .recom-header {
    padding: 5px 15px;
    text-align: center;
    text {
      padding: 0 15px;
    }
    image {
      width: 14px;
    }
  }
  .recom-content {
    padding: 10px 15px;
    .recom-goods-item {
      box-sizing: border-box;
      width: calc(50% - 7.5px);
      margin-bottom: 15px;
      padding-bottom: 5px;
      overflow: hidden;
      .borderRadius(6px);
      .backgroundColor(#fff);
      .goods-item-image {
        text-align: center;
        margin-bottom: 10px;
        overflow: hidden;
        image {
          width: 100%;
        }
      }
      .goods-item-title {
        padding: 0 5px;
        .fontSize(15px);
      }
      .goods-item-price-Sales {
        display: flex;
        justify-content: space-between;
        padding: 5px;
        .goods-item-price {
          flex: 1;
        }
        .goods-item-sales {
          flex: 1;
          text-align: right;
          .textColor(#666);
        }
      }
    }
    .recom-goods-item:nth-child(2n) {
      margin-left: 7.5px;
    }
    .recom-goods-item:nth-child(2n + 1) {
      margin-right: 7.5px;
    }
  }
}
</style>