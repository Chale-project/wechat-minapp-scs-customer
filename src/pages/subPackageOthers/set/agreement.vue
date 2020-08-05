<template>
  <view class="pages agreement">
    <view class="agreement-content">
      <wxParse :content="message" v-if="message" />
      <view class="content-empty" v-else>
        <image src="/static/images/user_center_empty.png" mode="widthFix" />
        <view class="empty-tips">用户协议走丢啦！</view>
      </view>
    </view>
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import wxParse from "mpvue-wxparse";
export default {
  components: {
    wxParse
  },
  data() {
    return {
      message: null
    };
  },
  computed: {},
  created() {},

  mounted() {},

  onLoad() {},

  methods: {
    async getAgreement() {
      const agreement = await api
        .getAgreement()
        .then(res => {
          let data = res.result;
          if (data) this.message = data.articleContent;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.agreement {
  position: relative;
  .agreement-content {
    padding: 10px 15px;
    line-height: 1.7;
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
}
</style>
