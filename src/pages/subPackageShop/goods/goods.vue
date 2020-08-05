<template>
  <view class="pages goods">
    <view class="goods-banner" :style="{maxHeight:imgH}">
      <swiper-tem :images="imagesList" :height="imgH" />
    </view>

    <view class="goods-base-info">
      <view class="goods-title">{{goodsInfo.title}}</view>
      <view class="goods-price-sales">
        <text class="goods-price">￥{{goodsInfo.price}}</text>
        <text class="goods-sales">已售 {{goodsInfo.stockCount}} 件</text>
        <text class="goods-stock">库存：{{goodsInfo.num}}</text>
      </view>
      <view class="goods-share">
        <image src="/static/images/share_icon.png" mode="widthFix" />
        <van-button block custom-class="but-share" open-type="share">分享</van-button>
      </view>
    </view>

    <view class="goods-operate">
      <van-cell-group>
        <van-cell is-link class="goods-attr" custom-class="goods-operate-cell" v-if="goodsSpecList.length>0" @click="showGoodsAttr">
          <view slot="title">
            <text class="goods-operate-title">{{checkedGoodsInfo.checked?'已选择':'请选择'}}</text>
            <text class="goods-attr-choiced">{{checkedGoodsInfo.specificationItems}}</text>
          </view>
        </van-cell>
        <van-cell is-link class="goods-parameter" custom-class="goods-operate-cell" v-if="goodsSpaList.length>0" @click="showGoodsParameter">
          <view slot="title">
            <text class="goods-operate-title">参数</text>
            <text class="goods-parameter-choiced"></text>
          </view>
        </van-cell>
      </van-cell-group>
    </view>

    <view class="goods-detail">
      <view class="goods-detail-title">商品详情</view>
      <view class="goods-detail-content">

        <wxParse :content="contents" v-if="contents" />
        <view class="content-empty" v-else>
          <image src="/static/images/user_center_empty.png" mode="widthFix" />
          <view class="empty-tips">店家太懒还没有详细介绍哦！</view>
        </view>
      </view>
    </view>

    <!-- 商品属性选择内容 -->
    <van-popup :show="showAttr" position="bottom" @close="closeGoodsAttr" custom-class="goods-attr-popup-box">
      <view class="goods-attr-popup-content">
        <view class="close-popup" @click="closeGoodsAttr">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="goods-popup-header">
          <view class="goods-attr-thumb">
            <image :src="checkedGoodsInfo.itemImages?checkedGoodsInfo.itemImages:'/static/images/default_logo_1x1.jpg'" @error="errImg" mode="widthFix" />
          </view>
          <view class="goods-attr-others">
            <view class="goods-attr-price">￥{{checkedGoodsInfo.descPrice}}</view>
            <view class="goods-attr-stock">库存：{{checkedGoodsInfo.number||0}}件</view>
          </view>
        </view>
        <view class="goods-popup-body">
          <scroll-view class="goods-attr-scroll-area" scroll-y="true">
            <view class="goods-attr-content">

              <view class="goods-attr-item">
                <view class="goods-attr-name">规格</view>
                <view class="goods-attr-list">
                  <view :class="v.checked?'goods-attr-tag selected':'goods-attr-tag'" v-for="(v,j) of goodsSpecList" :key="j" @click="toggleSkuValue(v.id)"><text class="goods-attr-tag-mark" v-if="v.seckill">秒</text>{{v.specificationItems}}</view>
                </view>
              </view>

            </view>
            <view class="goods-number-content">
              <view class="goods-number-title">数量</view>
              <van-stepper :value="curNumber" integer min="1" step="1" @change="onChangeGoodsNumber" />
            </view>
          </scroll-view>
        </view>
        <view class="goods-popup-footer">
          <van-button round block custom-class="but-choice-ok" :disabled="choiceOkStatus" @click="choiceOk">选好了</van-button>
        </view>
      </view>
    </van-popup>

    <!-- 商品参数区域 -->
    <van-popup :show="showPar" position="bottom" @close="closeGoodsParameter" custom-class="goods-par-popup-box">
      <view class="goods-par-popup-content">
        <view class="close-popup" @click="closeGoodsParameter">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="goods-popup-header">商品参数</view>
        <view class="goods-popup-body">
          <scroll-view class="goods-par-scroll-area" scroll-y="true">
            <view class="goods-par-content">
              <view class="goods-par-list" v-for="(v,i) of goodsSpaList" :key="i">
                <view class="goods-par-name">{{v.name}}</view>
                <view class="goods-par-desc">{{v.value}}</view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </van-popup>

    <!-- 底部导航 -->
    <van-goods-action>
      <van-goods-action-icon icon="shop-o" text="店铺" @click="goToStore" />
      <van-goods-action-icon icon="cart" text="购物车" link-type="switchTab" :info="cartTotalNumber>0?cartTotalNumber:''" url="/pages/cart/cart" />
      <van-goods-action-button text="加入购物车" type="warning" @click="addCartBut" />
      <van-goods-action-button text="立即购买" @click="buyNowBut" />
    </van-goods-action>
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import wxParse from "mpvue-wxparse";
import swiperTem from "@/components/swiper";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    swiperTem,
    wxParse
  },
  data() {
    return {
      imgH: "250px",
      showAttr: !1,
      showPar: !1,
      contents: null,
      goodsId: "",
      goodsSpecList: [], //商品规格list
      goodsSpaList: [], //商品参数list
      operationType: 1, // 1:立即购买；2:加入购车
      choiceOkStatus: !0,
      goodsInfo: {},
      imagesList: [], //banner图
      checkedGoodsInfo: {}, //已选择的商品
      curNumber: 1,
      cartList: [],
      cartTotalNumber: 0,
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {
    ...mapState(["isNewUser", "userInfo", "storeId"])
  },

  created() {},

  mounted() {},

  methods: {
    ...mapActions(["AuthLoginByWeixin", "setOptionsQuery", "setAccessRecort"]),

    //数据初始化
    init() {
      this.showAttr = !1;
      this.showPar = !1;
      this.operationType = 1;
      this.goodsInfo = {};
      this.checkedGoodsInfo = {};
      this.imagesList = [];
      this.curNumber = 1;
      this.choiceOkStatus = !0;
    },

    //显示商品属性选择
    showGoodsAttr(e) {
      this.showAttr = !this.showAttr;
    },

    //关闭商品属性选择
    closeGoodsAttr() {
      this.showAttr = !1;
    },

    //显示商品参数
    showGoodsParameter() {
      this.showPar = !this.showPar;
    },

    //关闭商品参数
    closeGoodsParameter() {
      this.showPar = !1;
    },

    //设置商品购买数量
    onChangeGoodsNumber(e) {
      this.curNumber = e.mp.detail;
    },

    //获取商品基本信息
    async getGoodsInfo() {
      const info = await api
        .getGoodsInfo(this.goodsId)
        .then(res => {
          let _info = res.info;
          _info.price = util.moneyFormat(_info.price);
          util.setNavigationBarTitle(_info.title);
          this.goodsInfo = _info;

          if (_info.goodsCommodity) this.goodsSpaList = _info.goodsCommodity;
          else this.goodsSpaList = [];

          if (_info.goodsDesc.length > 0) this.setGoodsSpec(_info.goodsDesc);
          else this.goodsSpecList = [];

          if (_info.spec) this.contents = decodeURIComponent(_info.spec);
          else this.contents = null;

          if (_info.image) {
            let imgArr = _info.image.split(","); //处理商品banner图
            for (let i in imgArr) {
              let obj = {};
              obj.picPath = imgArr[i];
              this.imagesList.push(obj);
            }
          } else {
            this.imagesList = [{ picPath: errDefaultImage }];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //设置商品规格属性
    setGoodsSpec(arr) {
      for (const i in arr) {
        arr[i].descPrice = util.moneyFormat(arr[i].descPrice);
        if (i == 0) arr[i].checked = !0;
        else arr[i].checked = !1;
      }
      this.goodsSpecList = arr;
      this.setCheckedSpec();
    },

    //设置已选中的规格属性值
    setCheckedSpec() {
      let _arr = this.goodsSpecList;
      for (const i in _arr) {
        if (_arr[i].checked) {
          this.checkedGoodsInfo = _arr[i];
        }
      }
      this.choiceOkStatus = !1;
    },

    //选择商品规格属性值
    toggleSkuValue(id) {
      let speclist = this.goodsSpecList;
      for (let j in speclist) {
        if (speclist[j].id === id) {
          speclist[j].checked = !0;
        } else {
          speclist[j].checked = !1;
        }
      }
      this.setCheckedSpec();
    },

    //加入购物车操作
    addCartBut() {
      this.operationType = 2;

      const _flag = this.checkStock();
      if (!_flag) {
        util.showToastError("库存不足！");
        return false;
      }

      if (this.goodsSpecList.length > 0) {
        if (this.goodsSpecList.length > 1) this.showGoodsAttr();
        else this.choiceOk();
      } else {
        const obj = {
          checked: !0,
          id: this.goodsInfo.id,
          cartNumber: 1,
          title: this.goodsInfo.title,
          simage: this.goodsInfo.coverImage,
          price: this.goodsInfo.price * 100,
          spec: this.goodsInfo.specificationItems,
          goodsId: this.goodsInfo.id
        };
        this.addCart(obj);
      }
    },

    //加入购物车
    addCart(obj) {
      const _cart = this.cartList;
      if (_cart.length > 0) {
        for (const i in _cart) {
          if (_cart[i].id === obj.id) {
            if (this.goodsSpecList.length > 0)
              _cart[i].cartNumber = obj.cartNumber;
            else ++_cart[i].cartNumber;

            this.countCartNumber();
            util.showToastSuccess("加入成功！");
            wx.setStorageSync("localCart-" + this.storeId, _cart);
            return false;
          } else {
            if (i == _cart.length - 1) {
              _cart.push(obj);
              this.countCartNumber();
              util.showToastSuccess("加入成功！");
              wx.setStorageSync("localCart-" + this.storeId, _cart);
            }
          }
        }
      } else {
        _cart.push(obj);
        this.countCartNumber();
        util.showToastSuccess("加入成功！");
        wx.setStorageSync("localCart-" + this.storeId, _cart);
      }
    },

    //立即购买
    buyNowBut() {
      this.operationType = 1;

      const _flag = this.checkStock();
      if (!_flag) {
        util.showToastError("灰常遗憾，库存已不足了！");
        return false;
      }

      if (this.goodsSpecList.length > 0) {
        if (this.goodsSpecList.length > 1) this.showGoodsAttr();
        else this.choiceOk();
      } else {
        const obj = {
          id: this.goodsInfo.id,
          number: 1
        };
        this.goToOrder(obj);
      }
    },

    //选好了
    choiceOk() {
      if (this.operationType == 1) {
        const curSpecGoods = this.checkedGoodsInfo;
        const obj = {
          id: curSpecGoods.id,
          number: this.curNumber
        };
        this.goToOrder(obj);
      } else if (this.operationType == 2) {
        const curSpecGoods = this.checkedGoodsInfo;
        const obj = {
          checked: !0,
          id: curSpecGoods.id,
          cartNumber: this.curNumber,
          title: curSpecGoods.title,
          price: curSpecGoods.descPrice * 100,
          simage: curSpecGoods.itemImages,
          spec: curSpecGoods.specificationItems,
          goodsId: curSpecGoods.goodsId
        };
        this.addCart(obj);
      }
      this.closeGoodsAttr();
    },

    //校验库存
    checkStock() {
      let flag = !0;
      let _stock = this.checkedGoodsInfo.number || this.goodsInfo.num || 0;

      if (this.curNumber - _stock > 0) flag = !1;
      else flag = !0;

      return flag;
    },

    //立即购买跳转到订单创建页面
    goToOrder(obj) {
      let url = `/pages/subPackageShop/orderCreate/orderCreate?idsNum=${
        obj.id
      }~${obj.number}`;
      util.navigateTo(url);
    },

    countCartNumber() {
      let number = 0,
        _cart = this.cartList;
      for (const i in _cart) {
        number += _cart[i].cartNumber;
      }
      this.cartTotalNumber = number;
    },

    //返回店铺首页
    goToStore() {
      wx.switchTab({
        url: "/pages/home/home"
      });
    },

    //处理no found 图片
    errImg(i) {
      this.checkedGoodsInfo.itemImages = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.init();

    const that = this;
    that.goodsId = options.id;

    wx.getSystemInfo({
      success: function(res) {
        that.imgH = `${res.windowWidth}px`;
      }
    });

    that.setOptionsQuery({ options, that });

    if (that.isNewUser)
      that.AuthLoginByWeixin().then(() => {
        that.setAccessRecort(that.storeId);
      });

    await Promise.all([that.getGoodsInfo()]);
  },

  onShow() {
    this.cartList = wx.getStorageSync("localCart-" + this.storeId) || [];
    this.countCartNumber();
  },

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res);
    }
    let _path = `/pages/subPackageShop/goods/goods?id=${this.goodsId}&uId=${
      this.userInfo.id
    }&storeId=${this.storeId}`;

    return {
      title: this.goodsInfo.title,
      path: _path,
      imageUrl: this.goodsInfo.coverImage
    };
  }
};
</script>
<style lang="less">
@import "../../../../static/css/common";
.goods {
  position: relative;
  .goods-banner {
    // max-height: 264px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .active-plate {
    .backgroundLiearGraientLR(#ff5129, #ff8314);
    .active-price {
      height: 58px;
      padding: 5px 15px;
      color: #fff;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI4AAAAdCAYAAAB8D1TlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkYzc5Y2RiYS1iNDhlLWU5NDktODM5Yi1jMTg5MTUxMTBmNWMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTJGRjc1NzBBQ0MxMTFFNzg5MzA4RDA0MkQyOEI2NjIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTJGRjc1NkZBQ0MxMTFFNzg5MzA4RDA0MkQyOEI2NjIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmIzNGEyODU2LTBlZTgtMDE0Yi1hZDA1LTZhMzY3OWVmYTYwOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpkYzc5Y2RiYS1iNDhlLWU5NDktODM5Yi1jMTg5MTUxMTBmNWMiLz4gPC9y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");
      background-size: 40%;
      background-position: 15px 40px;
      background-repeat: no-repeat;
      text {
        font-size: 26px;
      }
    }
    .count-down {
      padding: 5px 15px;
      text-align: center;
      background: #fff2e8;
      .count-down-title {
        margin-bottom: 5px;
        color: #f61434;
      }
      .count-down-time {
        height: 34px;
        line-height: 14px;
        color: #f61434;
      }
    }
  }
  .goods-base-info {
    position: relative;
    margin-bottom: 10px;
    padding: 5px 30px 5px 15px;
    .backgroundColor(#fff);

    .goods-title {
      padding: 5px 0;
    }
    .goods-price-sales {
      padding: 5px 0;
      .goods-price,
      .goods-spike-price {
        padding-right: 10px;
        font-weight: bold;
        .fontSize(16px);
        .color-red();
      }
      .goods-original-price {
        padding-right: 10px;
        text-decoration: line-through;
        .fontSize(12px);
        .textColor(#999);
      }
      .goods-sales,
      .goods-stock {
        margin-right: 5px;
        .textColor(#999);
      }
    }
    .goods-share {
      position: absolute;
      width: 30px;
      height: 30px;
      right: 0;
      top: 4px;
      line-height: 30px;
      .but-share {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 100%;
        padding: 0;
        text-indent: 999999px;
        background: transparent;
        background-color: none;
        border: 0;
        opacity: 0;
        z-index: 99;
        .borderRadius(0);
      }
      image {
        width: 20px;
      }
    }
  }
  .goods-operate {
    margin-bottom: 10px;
    .goods-operate-title {
      .textColor(#666);
    }
    .goods-operate-cell {
      padding-left: 60px;
      .goods-operate-title {
        margin-left: -45px;
      }
      .goods-parameter-choiced,
      .goods-attr-choiced,
      .goods-freight-choiced {
        padding-left: 17px;
      }
    }
  }

  .goods-detail {
    padding-bottom: 120px;
    .goods-detail-title {
      padding: 10px 15px;
      .backgroundColor(#fff);
    }
    .goods-detail-content {
      image {
        width: 100%;
        height: 100%;
      }
    }
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

  // 商品属性区域
  .goods-attr-popup-box {
    overflow-y: visible;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .goods-attr-popup-content {
      position: relative;
      box-sizing: border-box;
      .goods-popup-header {
        position: absolute;
        display: flex;
        top: -50px;
        left: 0;
        right: 0;
        padding: 20px 15px;
        z-index: 10;
        .goods-attr-thumb {
          width: 80px;
          height: 80px;
          margin-right: 10px;
          .borderRadius(4px);
          overflow: hidden;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .goods-attr-others {
          width: calc(100% - 110px);
          padding-top: 35px;
          padding-right: 20px;
          .goods-attr-price {
            .fontSize(16px);
            .color-red();
          }
          .goods-attr-stock {
            .textColor(#666);
          }
        }
      }
      .goods-popup-body {
        height: 320px;
        padding: 70px 0;
        .goods-attr-scroll-area {
          height: 100%;
          .goods-attr-content {
            position: relative;
            padding: 0 15px 20px;
            .goods-attr-item {
              margin-bottom: 10px;
              .goods-attr-name {
                margin-bottom: 10px;
                .fontSize(16px);
              }
              .goods-attr-list {
                .goods-attr-tag {
                  position: relative;
                  display: inline-block;
                  margin-right: 15px;
                  margin-bottom: 15px;
                  padding: 6px 15px;
                  .borderRadius(4px);
                  .backgroundColor(#f1f1f1);
                  .goods-attr-tag-mark {
                    position: absolute;
                    width: 15px;
                    height: 15px;
                    padding: 1px;
                    right: 4px;
                    top: 0;
                    border-bottom-left-radius: 2px;
                    border-bottom-right-radius: 2px;
                    text-align: center;
                    .fontSize(10px);
                    .textColor(#fff);
                    .backgroundColor(rgba(248, 84, 55, 0.7));
                  }
                }
                .goods-attr-tag.selected {
                  .backgroundColor(#f85437);
                  .textColor(#fff);
                }
              }
            }
          }
          .goods-attr-content::after {
            .backgroundLine();
          }
          .goods-number-content {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px;
          }
          .goods-number-content::after {
            .backgroundLine();
          }
        }
      }
      .goods-popup-footer {
        position: absolute;
        height: 50px;
        padding: 10px 30px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .but-choice-ok {
          height: 50px;
          line-height: 50px;
          .but-default(#f85437);
          .fontSize(16px);
        }
      }

      .close-popup {
        position: absolute;
        width: 24px;
        height: 24px;
        right: 10px;
        top: 10px;
        z-index: 999;
      }
    }
  }

  .goods-par-popup-box {
    overflow-y: visible;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .goods-par-popup-content {
      position: relative;
      box-sizing: border-box;
      .goods-popup-header {
        padding: 20px 15px;
        text-align: center;
      }
      .goods-popup-body {
        height: 300px;
        .goods-par-scroll-area {
          height: 100%;
          .goods-par-content {
            position: relative;
            padding: 0 15px 20px;
            .goods-par-list {
              position: relative;
              padding: 10px 0;
              display: flex;
              align-content: center;
              .goods-par-name {
                width: 100px;
                .textColor(#333);
              }
              .goods-par-desc {
                width: calc(100% - 100px);
                .textColor(#999);
              }
            }
            .goods-par-list::after {
              .backgroundLine();
            }
          }
        }
      }
    }

    .close-popup {
      position: absolute;
      width: 24px;
      height: 24px;
      right: 10px;
      top: 10px;
      z-index: 999;
    }
  }
}
</style>
