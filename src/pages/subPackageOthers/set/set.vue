<template>
  <view class="pages set">
    <van-cell-group>
      <van-cell title="用户协议" is-link data-url="/pages/subPackageOthers/set/agreement" @click="goToLink" />
      <van-cell title="当前版本" value="v1.0.0" />
      <van-cell title="关于本店" is-link data-url="/pages/subPackageOthers/set/about" @click="goToLink" />
    </van-cell-group>
  </view>
</template>

<script>
import util from "@/utils/util";
export default {
  data() {
    return {};
  },
  created() {},

  mounted() {},

  onShow() {},

  methods: {
    goToLink(e) {
      let url = e.mp.currentTarget.dataset.url;
      util.navigateTo(url);
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.set {
}
</style>
