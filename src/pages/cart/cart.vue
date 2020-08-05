<template >
  <view class="pages cart">
    <block v-if="cartList.length>0">

      <view class="cart-full">
        <view class="cart-panel">
          <view class="cart-panel-body">
            <van-swipe-cell class="cart-goods-list" right-width="65" v-for="(v,i) of cartList" :key="i" async-close :data-gindex="i" @close="deleteCartItem">
              <view class="cart-goods-info">
                <van-icon class="check-icon" :name="v.checked?'checked':'circle'" :color="v.checked?'#f85437':'#999'" size="20px" :data-gindex="i" @click="chooseCurGoods" />
                <view class="cart-goods-image" @click="goToGoodsDetail(v.goodsId)">
                  <image :src="v.simage?v.simage:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="widthFix" />
                </view>
                <view class="cart-goods-others">
                  <view class="cart-goods-title ellipsis" @click="goToGoodsDetail(v.goodsId)">{{v.title}}</view>
                  <view class="cart-goods-attr" @click="goToGoodsDetail(v.goodsId)">{{v.spec}}</view>
                  <view class="cart-goods-price-number">
                    <view class="cart-goods-price color-red ellipsis">￥{{v.price}}</view>
                    <view class="cart-goods-number-operate">
                      <van-stepper :value="v.cartNumber" integer min="1" step="1" :data-gindex="i" @change="onChangeGoodsNum" />
                    </view>
                  </view>
                </view>
              </view>
              <view slot="right" class="van-swipe-cell__right">删除</view>
            </van-swipe-cell>
          </view>
        </view>
      </view>
    </block>
    <block v-else>
      <!-- 购物车为空 -->
      <view class="cart-empty">
        <view class="cart-empty-default">
          <view class="cart-empty-icon">
            <image src="/static/images/cart_empty.png" mode="widthFix" />
          </view>
          <view class="cart-empty-text">购物车还没有您心爱的宝贝~.~</view>
          <view class="cart-empty-button">
            <van-button round block custom-class="but-go-shopping" @click="goHealthy">去逛逛</van-button>
          </view>
        </view>

        <view class="cart-empty-recom">
          <!-- <RecomGoods :recomGoodsList="recomGoodsList" /> -->
        </view>
      </view>
    </block>

    <view class="cart-footer-nav" v-if="cartList.length>0">
      <view class="choose-all" @click="chooseAll">
        <van-icon class="check-icon" :name="allCheckedStatus?'checked':'circle'" :color="allCheckedStatus?'#f85437':'#999'" size="20px" /><text>全选</text>
      </view>
      <view class="total-money ellipsis">合计：<text>￥ {{checkedGoodsMoney}}</text></view>
      <view class="submit-control">
        <van-button square block custom-class="but-go-settlement" @click="settleAccount">去结算({{checkedGoodsNumber}})</van-button>
      </view>
    </view>

    <van-dialog id="van-dialog" />
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Dialog from "../../../static/vant/dialog/dialog";
import { mapState } from "vuex";
export default {
  data() {
    return {
      cartList: [],
      checkedGoodsNumber: 0,
      checkedGoodsMoney: "0.00",
      allCheckedStatus: !0,
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {
    ...mapState(["storeId"])
  },

  mounted() {},

  methods: {
    init() {
      this.cartList = [];
      this.checkedGoodsNumber = 0;
      this.checkedGoodsMoney = "0.00";
      this.allCheckedStatus = !0;
    },

    //跳转到商品列表
    goHealthy() {
      wx.switchTab({
        url: "/pages/sort/sort"
      });
    },

    //跳转到商品详情
    goToGoodsDetail(id) {
      let url = `/pages/subPackageShop/goods/goods?id=${id}`;
      util.navigateTo(url);
    },

    //购物车数量改变
    onChangeGoodsNum(e) {
      let gindex = e.mp.currentTarget.dataset.gindex;
      let num = e.mp.detail || 1;
      let cart = this.cartList;
      let item = cart[gindex];
      const goodsId = item.id;
      const _localCart = wx.getStorageSync("localCart-" + this.storeId) || [];
      item.cartNumber = num;
      _localCart[gindex].cartNumber = num;
      wx.setStorageSync("localCart-" + this.storeId, _localCart);
      this.isAllChecked();
      this.calcCheckedGoodsNumberMoney();
    },

    //购物车删除
    deleteCartItem(e) {
      let index = e.mp.currentTarget.dataset.gindex;
      const _localCart = wx.getStorageSync("localCart-" + this.storeId) || [];
      const cart = this.cartList;
      const { position, instance } = e.mp.detail;

      switch (position) {
        case "right":
          Dialog.confirm({
            title: "提示",
            message: "确认删除该宝贝么？",
            cancelButtonText: "留下宝贝"
          })
            .then(() => {
              instance.close();
              _localCart.splice(index, 1);
              wx.setStorageSync("localCart-" + this.storeId, _localCart);

              cart.splice(index, 1);
              this.calcCheckedGoodsNumberMoney();
            })
            .catch(() => {
              instance.close();
            });
          break;
      }
    },

    //是否全选
    isAllChecked() {
      let cart = this.cartList;
      for (let j in cart) {
        if (!cart[j].checked) {
          this.allCheckedStatus = !1;
          break;
        } else {
          this.allCheckedStatus = !0;
        }
      }
    },

    //计算已选中商品总个数和总金额
    calcCheckedGoodsNumberMoney() {
      let number = 0,
        money = 0,
        arr = this.cartList;

      for (const i in arr) {
        if (arr[i].checked) {
          number += arr[i].cartNumber;
          money += arr[i].cartNumber * arr[i].price;
        }
      }

      this.checkedGoodsNumber = number;
      this.checkedGoodsMoney = parseFloat(money).toFixed(2);
    },

    //点选商品
    chooseCurGoods(e) {
      const gindex = e.mp.currentTarget.dataset.gindex;
      let cart = this.cartList;
      let item = cart[gindex];
      item.checked = !item.checked;

      this.isAllChecked();
      this.calcCheckedGoodsNumberMoney();
    },

    //全选
    chooseAll() {
      let cart = this.cartList;
      let _allCheckedStatus = !this.allCheckedStatus;
      if (cart.length > 0) {
        for (let i in cart) {
          cart[i].checked = _allCheckedStatus;
        }
        this.allCheckedStatus = _allCheckedStatus;
        this.calcCheckedGoodsNumberMoney();
      } else {
        return false;
      }
    },

    //去结算
    settleAccount() {
      let _cartIdNum = [],
        cart = this.cartList;
      for (let i in cart) {
        if (cart[i].checked)
          _cartIdNum.push(cart[i].id + "~" + cart[i].cartNumber);
      }
      if (_cartIdNum.length > 0) {
        let carts = _cartIdNum.join(",");
        let url = `/pages/subPackageShop/orderCreate/orderCreate?idsNum=${carts}&source=cart`;
        util.navigateTo(url);
      } else {
        util.showToastError("请先挑选你所喜欢的商品!");
      }
    },

    //处理no found 图片
    errImg(i) {
      this.cartList[i].simage = this.errDefaultImage;
    }
  },

  onLoad(options) {},

  onShow() {
    this.init();
    const _cartList = wx.getStorageSync("localCart-" + this.storeId) || [];
    if (_cartList.length > 0) {
      _cartList.map(item => {
        item.price = util.moneyFormat(item.price);
      });
      this.cartList = _cartList;
      this.isAllChecked();
      this.calcCheckedGoodsNumberMoney();
    }
  },

  //上拉加载
  onReachBottom() {}
};
</script>

<style lang="less">
@import "../../../static/css/common";
page {
  .backgroundColor(#fff);
}
.cart {
  .check-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .cart-full {
    margin-bottom: 50px;

    .cart-panel {
      position: relative;

      margin-bottom: 10px;
      .cart-panel-header {
        position: relative;
        display: flex;
        align-items: center;
        padding: 12px 15px;
        .cart-seller-info {
          width: calc(100% - 30px);
          height: 20px;
          line-height: 20px;
          overflow: hidden;
          .cart-seller-logo {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            vertical-align: top;
          }
          .cart-seller-name {
            height: 20px;
            line-height: 20px;
            .textColor(#666);
          }
        }
      }
      .cart-panel-header::after {
        .backgroundLine();
      }
      .cart-panel-body {
        .cart-goods-info {
          position: relative;
          padding: 12px 15px;
          display: flex;
          align-items: center;
          .cart-goods-image {
            width: 80px;
            height: 80px;
            margin-right: 10px;
            .borderRadius(6px);
            overflow: hidden;
            image {
              width: 80px;
            }
          }
          .cart-goods-others {
            width: calc(100% - 120px);
            height: 80px;
            .cart-goods-title {
              margin-bottom: 5px;
            }
            .cart-goods-attr {
              height: 19px;
              margin-bottom: 5px;
              .textColor(#999);
            }
            .cart-goods-price-number {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .cart-goods-price {
                flex: 1;
              }
              .cart-goods-number {
                flex: 1;
              }
            }
          }
        }
        .cart-goods-info::after {
          .backgroundLine(15px, -65px);
        }
        .cart-goods-info:last-child::after {
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
    .cart-panel::after {
      .backgroundLine(0, 0);
    }
  }

  //去结算
  .cart-footer-nav {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    .backgroundColor(#fff);
    .choose-all {
      width: 60px;
      height: 100%;
      padding-left: 15px;
      display: flex;
      align-items: center;
    }
    .total-money {
      width: calc(100% - 215px);
      padding: 5px 10px;
      text-align: right;
    }
    .submit-control {
      width: 120px;
      .but-go-settlement {
        .but-default(#e00000);
        .fontSize(16px);
      }
    }
  }
  // 购物车为空
  .cart-empty {
    margin-bottom: 50px;
    .cart-empty-default {
      padding: 30px 15px;
      .backgroundColor(#fff);
      .cart-empty-icon {
        width: 80px;
        margin: 0 auto 15px;
        image {
          width: 100%;
        }
      }
      .cart-empty-text {
        margin-bottom: 50px;
        text-align: center;
        .textColor(#666);
      }
      .cart-empty-button {
        width: 70%;
        margin: 0 auto;
        .but-go-shopping {
          .fontSize(16px);
          .but-default(#f85437);
        }
      }
    }
  }
}
</style>
