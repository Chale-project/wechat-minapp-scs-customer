<template>
  <view class="pages profile">
    <van-cell-group>
      <van-cell>
        <view slot="title" class="profile-avatar">
          <view class="avatar-title">头像</view>
          <view class="avatar-image">
            <image :src="userInfo.headPic?userInfo.headPic:'/static/images/avatar_default.png'" mode="widthFix" />
          </view>
        </view>
      </van-cell>
      <van-field :value="userInfo.nickname" label="昵称" placeholder="请填写昵称" @change="onChangeNickname" input-class="textstyle" />
      <van-cell :value="userInfo.phoneNumber?userInfo.phoneNumber:'去绑定'" title="手机号" :is-link="userInfo.phoneNumber?false:true" @click="goToBindMobile" value-class="textstyle" />
      <van-cell :value="userInfo.gender=='man'?'男':'女'" title="性别" is-link @click="toggleSex" value-class="textstyle" />
      <van-field :value="userInfo.age" label="年龄" type="number" placeholder="请填写年龄" @change="onChangeAge" input-class="textstyle" />
      <!-- <van-field :value="userInfo.idNumber" label="身份证" :maxlength="18" placeholder="请填写身份证" @change="onChangeIdNumber" input-class="textstyle" /> -->
      <!-- <van-field :value="userInfo.bodyStature" label="身高" type="number" placeholder="请填写身高（单位：cm）" @change="onChangeBodyStature" input-class="textstyle" /> -->
      <!-- <van-field :value="userInfo.bodyWeight" label="体重" type="number" placeholder="请填写体重（单位：kg）" @change="onChangeBodyWeight" input-class="textstyle" /> -->

      <van-cell :value="pca" title="省市区" is-link @click="choicePCA" value-class="textstyle" />
      <van-field :value="userInfo.address" label="详细地址" placeholder="请填写详细地址" @change="onChangeAddress" input-class="textstyle" />

    </van-cell-group>
    <view class="submit-button">
      <van-button round block custom-class="but-save-profile" @click="saveProfile">保存修改</van-button>
    </view>

    <!-- 性别选择 -->
    <van-action-sheet title="选择性别" cancel-text="取消" :show="showSex" :actions="sexList" @close="onCloseSex" @cancel="onCloseSex" @select="onSelectSex" />

    <van-popup :show="showArea" position="bottom" @close="closeArea">
      <van-area :area-list="areaList" @confirm="sureArea" @cancel="cancelArea" />
    </van-popup>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState } from "vuex";
// import AreaList from "../../../../static/area/area";

export default {
  data() {
    return {
      showSex: false,
      sexList: [{ index: 0, name: "男" }, { index: 1, name: "女" }],
      showArea: !1,
      areaList: [],
      pca: "请选择省市区"
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  created() {},

  onLoad(options) {
    wx.request({
      url: "https://cashier.youzan.com/wsctrade/uic/address/getAllRegion.json",
      success: response => {
        this.areaList = response.data.data;
      }
    });
  },

  onShow() {
    const _province = this.userInfo.province || "";
    const _city = this.userInfo.city || "";
    const _area = this.userInfo.area || "";
    if (!_province && !_city && !_area) {
      this.pca = "请选择省市区";
    } else {
      this.pca = _province + " " + _city + " " + _area;
    }
  },
  mounted() {},
  methods: {
    //设置昵称
    onChangeNickname(e) {
      const _nickname = e.mp.detail;
      this.userInfo.nickname = _nickname;
    },

    //去绑定手机号
    goToBindMobile() {
      if (!this.userInfo.phoneNumber) {
        const url = `/pages/subPackageOthers/bindMobile/bindMobile`;
        util.navigateTo(url);
      }
    },

    //设置年龄
    onChangeAge(e) {
      const _age = e.mp.detail;
      this.userInfo.age = _age;
    },

    //设置身份证
    onChangeIdNumber(e) {
      const _idNumber = e.mp.detail;
      this.userInfo.idNumber = _idNumber;
    },

    //设置身高
    onChangeBodyStature(e) {
      const _bodyStature = e.mp.detail;
      this.userInfo.bodyStature = _bodyStature;
    },

    //设置体重
    onChangeBodyWeight(e) {
      const _bodyWeight = e.mp.detail;
      this.userInfo.bodyWeight = _bodyWeight;
    },

    //展示性别选择
    toggleSex() {
      this.showSex = !this.showSex;
    },

    //关闭性别选择
    onCloseSex() {
      this.showSex = false;
    },

    //选择性别
    onSelectSex(e) {
      console.log(e);
      let _index = e.mp.detail.index;
      if (_index == 0) {
        this.userInfo.gender = "man";
      } else {
        this.userInfo.gender = "woman";
      }
      this.onCloseSex();
    },

    //设置详细地址
    onChangeAddress(e) {
      const _address = e.mp.detail;
      this.userInfo.address = _address;
    },

    //选择省市区
    choicePCA() {
      this.showArea = !0;
    },

    //关闭省市区选择
    closeArea() {
      this.showArea = !1;
    },

    //确认选择的
    sureArea(e) {
      let province = e.mp.detail.detail.province;
      let city = e.mp.detail.detail.city;
      let county = e.mp.detail.detail.county;

      this.userInfo.province = province;
      this.userInfo.city = city;
      this.userInfo.area = county;
      this.pca = province + " " + city + " " + county;

      this.showArea = !1;
    },

    //取消选择的
    cancelArea() {
      this.showArea = !1;
    },

    //保存个人信息
    async saveProfile() {
      let data = this.userInfo;
      const info = await api
        .modifyUserInfo(data)
        .then(res => {
          util.showToastSuccess("修改成功！");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.profile {
  position: relative;
  .profile-avatar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .avatar-title {
      width: calc(100% - 40px);
    }
    .avatar-image {
      width: 40px;
      height: 40px;
      .borderRadius(50%);
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      image {
        width: 100%;
      }
    }
  }
  .textstyle {
    text-align: right;
    .textColor(#666);
  }

  .submit-button {
    margin: 30px;
    .but-save-profile {
      .but-default();
    }
  }
}
</style>
