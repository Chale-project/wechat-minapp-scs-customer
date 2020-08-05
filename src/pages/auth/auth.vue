<template >
  <view class="pages auth">
    <view class="auth-logo">
      <image src="/static/images/logo.png" />
    </view>
    <view class="auth-content">
      <van-button round block type="primary" v-if="canIUse" open-type="getUserInfo" lang="zh_CN" custom-class="but-wechat-auth" @getuserinfo="bindGetUserInfo">绑定微信登录</van-button>
    </view>
    <view class="clause">登录代表您同意<navigator url="/pages/subPackageOthers/set/agreement" class="clause-link">智慧便利店用户协议</navigator>
    </view>
  </view>
</template>

<script>
import wx from "wx";
import api from "@/utils/api";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      canIUse: wx.canIUse("button.open-type.getUserInfo")
    };
  },
  computed: {
    ...mapState(["openid", "storeId"])
  },
  created() {},

  mounted() {},

  onLoad() {},

  onShow() {},

  methods: {
    ...mapActions(["bindWxLogin", "setAccessRecort"]),

    //绑定微信账号

    bindGetUserInfo(e) {
      let data = e.mp.detail;
      if (data.errMsg == "getUserInfo:ok") {
        let _decryptData = {
          encryptedData: data.encryptedData,
          iv: data.iv,
          openid: this.openid
        };
        this.bindWxLogin(_decryptData).then(res => {
          if (this.storeId != null) this.setAccessRecort(this.storeId);

          wx.navigateBack({
            delta: 2
          });
        });
      }
    }
  }
};
</script>

<style lang="less">
@import "../../../static/css/common";
.auth {
  padding: 50px 30px;
  .auth-logo {
    margin: 0 auto 100px;
    text-align: center;
    image {
      .wh(98px, 98px);
    }
  }
  .auth-content {
    position: relative;
    .but-wechat-auth {
      .but-default();
      .fontSize(16px);
    }
  }
  .clause {
    width: 100%;
    position: absolute;
    left: 50%;
    bottom: 50px;
    transform: translateX(-50%);
    text-align: center;
    .clause-link {
      display: inline;
      .textColor(#f85437;);
    }
  }
}
</style>
