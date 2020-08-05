<template>
  <view class="back-home" @click="backHome">
    <van-icon name="shop" color="#f85437" size="30px" />
  </view>
</template>

<script>
export default {
  name: "backHome",
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    backHome() {
      wx.switchTab({
        url: "/pages/home/home"
      });
    }
  }
};
</script>

<style lang="less">
@keyframes backHome {
  from {
    opacity: 0.8;
    box-shadow: 0 0 4px 4px rgba(248, 84, 55, 0.5);
    transform: scale(0.8, 0.8);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 6px 4px rgba(248, 84, 55, 0.8);
    transform: scale(1, 1);
  }
  to {
    opacity: 0.8;
    box-shadow: 0 0 4px 4px rgba(248, 84, 55, 0.5);
    transform: scale(0.8, 0.8);
  }
}

.back-home {
  position: fixed;
  width: 40px;
  height: 40px;
  padding: 5px;
  border-radius: 50%;
  bottom: 40px;
  right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: backHome 5s infinite alternate;
  overflow: hidden;
  z-index: 9999999;
}
</style>