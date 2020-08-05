<template >
  <view class="pages login">
    <view class="login-logo">
      <image src="/static/images/logo.png" />
    </view>
    <view class="login-form">
      <van-cell-group :border="false">
        <van-field type="number" label="手机号" maxlength="11" :value="mobile" placeholder="请输入手机号" @change="bindMobile" />
        <van-field type="number" label="验证码" maxlength="6" :value="smscode" use-button-slot placeholder="请输入短信验证码" @change="bindSmscode">
          <van-button slot="button" size="small" round custom-class="but-send-smscode" :disabled="codeDisabled" @click="getSmsCode">{{butVerifyCode}}</van-button>
        </van-field>
      </van-cell-group>
    </view>
    <form @submit="formSubmit" @reset="formReset" :report-submit='true'>
      <button type="default" form-type="submit" class="but-default-submit" hover-class="but-default-submit-active" :disabled="loginDisabled">确认绑定</button>
    </form>
  </view>
</template>

<script>
import wx from "wx";
import util from "@/utils/util";
import api from "@/utils/api";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      formId: null,
      mobile: "",
      smscode: "",
      butVerifyCode: "获取验证码",
      countDownVal: 59,
      codeDisabled: !1,
      loginDisabled: !1
    };
  },
  computed: {},

  created() {},

  mounted() {},

  onLoad() {},

  onShow() {},

  methods: {
    ...mapMutations(["setUserInfo"]),
    //手机号input
    bindMobile(e) {
      this.mobile = e.mp.detail;
    },
    //验证码input
    bindSmscode(e) {
      this.smscode = e.mp.detail;
    },

    //获取短信验证码
    getSmsCode() {
      let flag = !0,
        _mobile = this.mobile;
      let reg = /^(1)[0-9]{10}$/;
      if (this.codeDisabled) {
        return false;
      }
      if (!reg.test(_mobile)) {
        util.showToastError("请输入有效的手机号码！");
        flag = !1;
        return false;
      }
      const res = api
        .getSmsCode({ mobile: _mobile })
        .then(res => {
          this.showTimeout();
          util.showToastSuccess("发送成功！");
        })
        .catch(err => {});
    },

    //倒计时
    showTimeout() {
      let currentTime = this.countDownVal;
      let timer = setInterval(() => {
        this.butVerifyCode = currentTime + "秒";
        this.codeDisabled = !0;
        currentTime--;
        if (currentTime <= 0) {
          clearInterval(timer);
          this.butVerifyCode = "获取验证码";
          this.countDownVal = 59;
          this.codeDisabled = !1;
        }
      }, 1e3);
    },

    //检验手机号验证码输入
    checkMobileCode() {
      let reg = /^(1)[0-9]{10}$/,
        _mobile = this.mobile,
        _code = this.smscode;
      if (!reg.test(_mobile)) {
        util.showToastError("请输入有效的手机号码！");
        return false;
      } else if (!/^\d{6}$/.test(_code)) {
        util.showToastError("请输入6位有效验证码！");
        return false;
      } else {
        return true;
      }
    },

    formSubmit(e) {
      this.formId = e.mp.detail.formId;

      this.bindUserMobile();
    },

    // 绑定用户手机号
    bindUserMobile() {
      let flag = this.checkMobileCode();
      if (flag) {
        let param = {
          mobilePhone: this.mobile,
          verificationCode: this.smscode
        };
        api
          .bindMobile(param)
          .then(res => {
            let _userInfo = res.info;
            wx.setStorageSync("userInfo", _userInfo);
            this.setUserInfo(_userInfo);
            api.saveFormId(this.formId);
            util.navigateBack();
          })
          .catch(err => {});
      }
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
page {
  background-color: #fff;
}

.login {
  padding: 40px 15px 0;
  .login-logo {
    margin: 0 auto;
    text-align: center;
    image {
      .wh(98px, 98px);
      margin-bottom: 30px;
    }
  }
  .login-form {
    margin-bottom: 60px;
    .but-send-smscode {
      .but-default();
    }
  }
  .but-go-login {
    .but-default();
    .fontSize(16px);
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
