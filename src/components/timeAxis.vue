<template>
  <view class="time-axis">
    <view :class="color!='#f85437'?'time-axis-item bgc':'time-axis-item'" v-for="(v,i) of timeline" :key="i">
      <view class="time-axis-item-index" :style="{background:color}">{{i+1}}</view>
      <view class="time-axis-item-title">{{v.title}}</view>
      <view class="time-axis-item-content">
        <image :src="v.url" mode="widthFix" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "timeAxis",
  props: {
    color: {
      type: String,
      default: "#f85437"
    },
    timeline: {
      type: Array,
      default: []
    }
  },
  data() {
    return {};
  },
  created() {}
};
</script>

<style lang="less">
//时间轴
.time-axis {
  position: relative;
  margin-bottom: 10px;
  overflow: hidden;
  .time-axis-item {
    position: relative;
    padding-left: 45px;
    .time-axis-item-index {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #fff;
      font-size: 24px;
      z-index: 10;
    }
    .time-axis-item-title {
      padding-bottom: 10px;
    }
    .time-axis-item-content {
      padding: 10px 0;
      image {
        width: 100%;
      }
    }
  }
  .time-axis-item::before {
    position: absolute;
    content: "";
    width: 1px;
    top: 0;
    bottom: 0;
    left: 15px;
    background: #f85437;
  }
  .time-axis-item.bgc::before {
    background: #f19b38;
  }
}
</style>