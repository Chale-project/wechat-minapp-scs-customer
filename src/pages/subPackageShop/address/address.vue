<template>
  <view class="pages address">
    <view class="address-full" v-if="addressList.length>0">
      <van-swipe-cell class="address-list" right-width="65" v-for="(v,i) of addressList" :key="i" :data-id="v.id" async-close @close="deleteAddressItem">
        <view class="address-content">
          <!-- <view class="set-default-address" :data-id="v.id" :data-index="i" @click="setDefaultAddress">
            <van-icon class="check-icon" :name="v.isDefault=='yes'?'checked':'circle'" :color="v.isDefault=='yes'?'#e00000':'#666'" size="20px" />
          </view> -->
          <view class="address-info" @click="switchAddress(v.id)">
            <view class="address-title"><text class="address-name">{{v.contact}}</text><text class="address-mobile">{{v.mobile}}</text>
              <van-tag round color="#f85437" custom-class="address-tag" v-if="v.isDefault=='yes'">默认</van-tag>
            </view>
            <view class="address-detail ellipsis-2">{{v.spca+' '+v.address}}</view>
          </view>
          <view class="edit-cur-address" @click="editAddress(v.id)">
            <van-icon class="check-icon" name="edit" color="#666" size="20px" />
          </view>
        </view>
        <view slot="right" class="van-swipe-cell__right">删除</view>
      </van-swipe-cell>
    </view>

    <view class="address-empty" v-else>
      <image src="/static/images/user_center_empty.png" mode="widthFix" />
      <view class="empty-tips">还没有地址哦！</view>
    </view>

    <view class="address-add">
      <!-- <view class="address-add-wx">
        <van-button block custom-class="but-add-wx-address" @click="addWxAddress"><text class="add-address-icon"></text>绑定微信地址</van-button>
      </view> -->
      <view class="address-add-sys">
        <van-button block custom-class="but-add-address" @click="addAddress"><text class="add-address-icon">+</text>添加地址</van-button>
      </view>
    </view>

    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState, mapActions } from "vuex";
import Dialog from "../../../../static/vant/dialog/dialog";
export default {
  data() {
    return {
      curPage: 1,
      pageSize: 20,
      allPage: null,
      addressList: []
    };
  },
  computed: {
    ...mapState(["orderAddress", "storeId"])
  },
  created() {},

  mounted() {},

  methods: {
    ...mapActions(["getOrderAddress"]),

    init() {
      this.curPage = 1; //初始化地址起始页
      this.addressList = []; //初始化地址列表
    },

    //绑定微信地址
    addWxAddress() {
      const that = this;
      wx.chooseAddress({
        success(res) {
          that.apiAddAddress(res);
        },
        fail(err) {
          util.showToastError("获取微信地址失败！");
        }
      });
    },

    //添加地址请求数据
    async apiAddAddress(obj) {
      const _data = {
        contact: obj.userName,
        mobile: obj.telNumber,
        province: obj.provinceName,
        city: obj.cityName,
        town: obj.countyName,
        address: obj.detailInfo,
        isDefault: "no"
      };
      const address = await api
        .addAddress(_data)
        .then(res => {
          util.showToastSuccess("添加成功！");
          this.init();
          this.getAddressList();
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 添加地址
    addAddress() {
      if (this.orderAddress) {
        let options = this.$root.$mp.query,
          _idsNum = options.idsNum,
          _stp = options.stp;
        let url = `/pages/subPackageShop/addressAdd/addressAdd?idsNum=${_idsNum}&stp=${_stp}`;
        util.navigateTo(url);
      } else {
        let url = "/pages/subPackageShop/addressAdd/addressAdd";
        util.navigateTo(url);
      }
    },

    // 编辑地址
    editAddress(id) {
      if (this.orderAddress) {
        let options = this.$root.$mp.query,
          _idsNum = options.idsNum,
          _stp = options.stp;
        let url = `/pages/subPackageShop/addressEdit/addressEdit?idsNum=${_idsNum}&stp=${_stp}&addressId=${id}`;
        util.navigateTo(url);
      } else {
        let url = `/pages/subPackageShop/addressEdit/addressEdit?&addressId=${id}`;
        util.navigateTo(url);
      }
    },

    // 删除地址
    deleteAddressItem(e) {
      let _id = e.mp.currentTarget.dataset.id;
      const { position, instance } = e.mp.detail;

      switch (position) {
        case "right":
          Dialog.confirm({
            title: "提示",
            message: "确认删除该地址么？"
          })
            .then(() => {
              const cart = api
                .deleteAddress(_id)
                .then(res => {
                  util.showToastSuccess("删除成功!");
                  instance.close();
                  this.init();
                  this.getAddressList();
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(() => {
              instance.close();
            });
          break;
      }
    },

    // 设为默认
    async setDefaultAddress(e) {
      console.log(e);
      let _index = e.mp.currentTarget.dataset.index;
      let _id = e.mp.currentTarget.dataset.id;
      let list = this.addressList;
      let curItem = list[_index];
      const _default = await api
        .setDefaultAddress(_id)
        .then(res => {
          curItem.isDefault = "yes";
          this.init();
          this.getAddressList();
        })
        .catch(err => {
          console.log(err);
        });
    },

    //切换地址
    switchAddress(id) {
      if (this.orderAddress) {
        util.showWxLoading("切换中");
        this.getOrderAddress({
          shopId: this.storeId,
          addressId: id
        }).then(res => {
          util.hideWxLoading();
          util.navigateBack(1);
        });
      } else {
        return;
      }
    },

    //获取地址列表
    async getAddressList() {
      const address = await api
        .getAddressList({
          currentPage: this.curPage,
          pageSize: this.pageSize
        })
        .then(res => {
          let list = this.addressList;
          let _list = res.page.list;
          this.allPage = res.page.totalPage;
          if (_list.length > 0) {
            this.addressList = list.concat(_list);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  async onShow() {
    this.init();
    await Promise.all([this.getAddressList()]);
  },

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage >= this.allPage) {
      this.getAddressList();
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.address {
  position: relative;
  .address-full {
    margin-top: 10px;
    margin-bottom: 50px;
    .backgroundColor(#fff);
    .address-list {
      .address-content {
        position: relative;
        display: flex;
        align-items: center;
        padding: 10px 15px;
        .set-default-address {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 62px;
          margin-right: 5px;
        }
        .address-info {
          width: calc(100% - 30px);
          max-height: 62px;
          overflow: hidden;
          .address-title {
            margin-bottom: 3px;
            .fontSize(16px);
            .address-name {
              margin-right: 10px;
            }
            .address-mobile {
              .textColor(#666);
              margin-right: 10px;
            }
            .address-tag {
              padding: 1.5px 0.5em;
              line-height: 27rpx;
              vertical-align: top;
            }
          }
          .address-detail {
            .textColor(#666);
          }
        }
        .edit-cur-address {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 62px;
        }
      }
      .address-content::after {
        .backgroundLine(15px, -65px);
      }
      .address-content:last-child::after {
        .backgroundLine(0, 0, 0);
      }
      .van-swipe-cell__right {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 65px;
        height: 100%;
        color: #fff;
        .fontSize(15px);
        .backgroundColor(#f44);
      }
    }
  }

  //  没有地址
  .address-empty {
    padding-top: 150px;
    text-align: center;
    image {
      width: 80px;
    }
    .empty-tips {
      padding: 15px;
      .textColor(#999);
    }
  }

  .address-add {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 6px 0 0;
    background-color: #f1f1f1;
    .address-add-wx {
      flex: 1;
      .but-add-wx-address {
        .fontSize(16px);
        .but-default(#57be6a);
      }
    }
    .address-add-sys {
      flex: 1;
      .but-add-address {
        .fontSize(16px);
        .but-default();
        .add-address-icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 10px;
          line-height: 14px;
          text-align: center;
          border: 1px solid #fff;
          .borderRadius(50%);
          .textColor(#fff);
          .fontSize(16px);
        }
      }
    }
  }
}
</style>
