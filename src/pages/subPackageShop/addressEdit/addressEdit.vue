<template>
  <view class="pages address">
    <van-cell-group>
      <van-field :value="address.contact" label="收货人" placeholder="请输入收货人" @change="onChangeName" />
      <van-field :value="address.mobile" label="手机号" type="number" maxlength="11" placeholder="请输入手机号" @change="onChangeMobile" />

      <van-cell is-link custom-class="address-operate-cell" @click="chooseLocation">
        <view slot="title">
          <text class="address-operate-title">选择省市区</text>
          <text class="address-operate-desc">{{address.spca}}</text>
        </view>
      </van-cell>

      <van-field :value="address.address" label="详细地址" placeholder="请输入详细地址" autosize @change="onChangeDetail" />
      <van-switch-cell title="设为默认" :checked="isDefault" active-color="#f85437" @change="setDefault" />
    </van-cell-group>

    <view class="address-add">
      <van-button round block custom-class="but-add-address" @click="editAddress">确认修改</van-button>
    </view>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      address: {},
      addressId: null,
      isDefault: !1
    };
  },
  computed: {
    ...mapState(["orderAddress", "storeId"])
  },
  created() {},

  mounted() {},

  methods: {
    ...mapMutations(["setOrderAddress"]),
    ...mapActions(["getOrderAddress"]),

    //绑定用户名
    onChangeName(e) {
      this.address.contact = e.mp.detail;
    },

    //绑定手机号
    onChangeMobile(e) {
      this.address.mobile = e.mp.detail;
    },

    //绑定详细地址
    onChangeDetail(e) {
      this.address.address = e.mp.detail;
    },

    //设为默认
    setDefault() {
      this.isDefault = !this.isDefault;
      if (this.isDefault) {
        this.address.isDefault = "yes";
      } else {
        this.address.isDefault = "no";
      }
    },

    //选择地址
    chooseLocation() {
      util.getWxSetting().then(res => {
        if (res.authSetting["scope.userLocation"]) {
          util.chooseWxLocation().then(res => {
            this.getAddreLatLong(res);
          });
        } else {
          util.openWxSetting().then(res => {
            util.chooseWxLocation().then(res => {
              this.getAddreLatLong(res);
            });
          });
        }
      });
    },

    //获取地址经纬度信息
    getAddreLatLong(info) {
      this.address.spca = info.address;
      this.address.addressLatitude = info.latitude;
      this.address.addressLongitude = info.longitude;
    },

    //获取地址信息
    async getAddressInfo() {
      const info = await api
        .getAddressInfo(this.addressId)
        .then(res => {
          let data = res.info;
          if (data.isDefault == "yes") this.isDefault = !0;
          else this.isDefault = !1;
          this.address = res.info;
        })
        .catch(err => {
          console.log(err);
        });
    },

    checkData: function() {
      let flag = !1,
        _name = this.address.contact,
        _phone = this.address.mobile,
        _spca = this.address.spca,
        _detail = this.address.address;
      if (!_name) {
        util.showToastError("请输入收货人！");
        flag = !1;
      } else if (!/^(1)[0-9]{10}$/.test(_phone)) {
        util.showToastError("请输入有效的手机号！");
        flag = !1;
      } else if (!_spca) {
        util.showToastError("请选择省市区！");
        flag = !1;
      } else if (!_detail) {
        util.showToastError("请输入详细地址！");
        flag = !1;
      } else {
        flag = !0;
      }
      return flag;
    },

    // 编辑地址
    editAddress() {
      let flag = this.checkData();
      flag && this.apiEditAddress();
    },

    //编辑地址请求数据
    async apiEditAddress() {
      const address = await api
        .editAddress(this.address)
        .then(res => {
          const _id = res.result.id;
          util.showToastSuccess("编辑成功！");
          if (this.orderAddress) {
            this.getOrderAddress({
              shopId: this.storeId,
              addressId: _id
            }).then(res => {
              util.navigateBack(1);
            });
          } else {
            util.navigateBack(1);
            // util.redirectTo("/pages/subPackageShop/address/address");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  async onLoad(options) {
    let id = options.addressId;
    this.addressId = id;
    await Promise.all([this.getAddressInfo()]);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.address {
  position: relative;

  .address-operate-cell {
    padding-left: 105px;
    .address-operate-title {
      margin-left: -90px;
    }
    .address-operate-desc {
      padding-left: 22px;
    }
  }
  .address-add {
    padding: 0 30px;
    margin-top: 50px;
    .but-add-address {
      .fontSize(16px);
      .but-default();
    }
  }
}
</style>
