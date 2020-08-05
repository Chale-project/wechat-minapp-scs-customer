<template>
  <view class="pages goods">
    <view class="goods-banner" :style="{maxHeight:imgH}">
      <swiper-tem :images="imagesList" :height="imgH" />
    </view>

    <view class="goods-base-info">
      <view class="goods-title">{{goodsInfo.goodsName}}</view>
      <view class="goods-price-sales">
        <text class="goods-price">￥{{goodsInfo.salePrice}}</text>
        <text class="goods-stock">库存：{{goodsInfo.num}}</text>
      </view>
      <view class="goods-share">
        <image src="/static/images/share_icon.png" mode="widthFix" />
        <van-button block custom-class="but-share" open-type="share">分享</van-button>
      </view>
    </view>

    <view class="goods-operate">
      <van-cell-spike>
        <van-cell is-link class="goods-attr" custom-class="goods-operate-cell" v-if="goodsSpecList.length>0" @click="showGoodsAttr">
          <view slot="title">
            <text class="goods-operate-title">{{checkedGoodsInfo.checked?'已选择':'请选择'}}</text>
            <text class="goods-attr-choiced">{{checkedGoodsInfo.specificationItems}}</text>
          </view>
        </van-cell>
      </van-cell-spike>
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
                  <view :class="v.checked?'goods-attr-tag selected':'goods-attr-tag'" v-for="(v,j) of goodsSpecList" :key="j" @click="toggleSkuValue(v.id)">{{v.specificationItems}}</view>
                </view>
              </view>

            </view>
            <view class="goods-number-content">
              <view class="goods-number-title">数量</view>
              <van-stepper :value="curNumber" integer min="1" step="1" :disabled="goodsInfo.goodsType=='5'?true:false" @change="onChangeGoodsNumber" />
            </view>
          </scroll-view>
        </view>
        <view class="goods-popup-footer">
          <van-button round block custom-class="but-choice-ok" :disabled="choiceOkStatus" @click="choiceOk">选好了</van-button>
        </view>
      </view>
    </van-popup>

    <!-- 底部导航 -->
    <van-goods-action>
      <van-goods-action-icon icon="shop-o" text="店铺" link-type="switchTab" url="/pages/home/home" />
      <van-goods-action-icon icon="chat-o" text="客服" open-type="contact" />
      <van-goods-action-button text="立即购买" custom-class="but-buy-action" :disabled="buyDisabled" @click="buyNowBut" />
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

      goodsId: "",
      operationType: 1, // 1:立即购买
      goodsInfo: {},
      goodsSpecList: [], //商品规格list
      imagesList: [], // banner图
      contents: null,
      checkedGoodsInfo: {}, //已选择的商品
      choiceOkStatus: !0,

      curNumber: 1, // 购买数量

      buyDisabled: !0,

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
      this.operationType = 1;
      this.goodsInfo = {};
      this.imagesList = [];

      this.checkedGoodsInfo = {};
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

    //设置商品购买数量
    onChangeGoodsNumber(e) {
      this.curNumber = e.mp.detail;
    },

    //获取商品基本信息
    async getGoodsInfo() {
      const info = await api
        .getPlatformGoodsInfo(this.goodsId)
        .then(res => {
          this.buyDisabled = !1;

          let _info = res.result;

          _info.salePrice = util.moneyFormat(_info.salePrice * 100);

          util.setNavigationBarTitle(_info.goodsName);

          this.goodsInfo = _info;

          if (_info.commodityDescModelList.length > 0)
            this.setGoodsSpec(_info.commodityDescModelList);
          else this.goodsSpecList = [];

          if (_info.virtualGoodsSpec)
            this.contents = decodeURIComponent(_info.virtualGoodsSpec);
          else this.contents = null;
          if (_info.image) {
            let imgArr = _info.image.split(","); //处理商品banner图
            for (let i in imgArr) {
              let obj = {};
              obj.picPath = imgArr[i];
              this.imagesList.push(obj);
            }
          } else {
            this.imagesList = [{ picPath: this.errDefaultImage }];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //设置商品规格属性
    setGoodsSpec(arr) {
      for (const i in arr) {
        arr[i].descPrice = util.moneyFormat(arr[i].descPrice * 100);
        if (i == 0) arr[i].checked = !0;
        else arr[i].checked = !1;
      }
      this.goodsSpecList = arr;
      this.setCheckedSpec();
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

    //立即秒购
    buyNowBut() {
      this.operationType = 1;
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
      }
      this.closeGoodsAttr();
    },

    //校验库存
    checkStock() {
      let flag = !0;
      let _stock = this.checkedGoodsInfo.seckillNum || this.goodsInfo.num || 0;

      if (this.curNumber - _stock > 0) flag = !1;
      else flag = !0;

      return flag;
    },

    //秒杀跳转到订单创建页面
    goToOrder(obj) {
      const _flag = this.checkStock();
      if (!_flag) {
        util.showToastError("灰常遗憾，库存已不足了！");
        return;
      }

      let url = "";
      if (this.goodsInfo.platformGoodsType == "physical")
        url = `/pages/subPackageEntityG/entityCreateOrder?idsNum=${obj.id}~${
          obj.number
        }`;

      util.navigateTo(url);
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

  onShow() {},

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res);
    }
    let _path = `/pages/subPackageEntityG/entityGDetail?id=${
      this.goodsId
    }&uId=${this.userInfo.id}&storeId=${this.storeId}`;

    return {
      title: this.goodsInfo.title,
      path: _path,
      imageUrl: this.goodsInfo.coverImage
    };
  }
};
</script>
<style lang="less">
@import "../../../static/css/common";
.goods {
  position: relative;
  .goods-banner {
    overflow: hidden;
    img {
      width: 100%;
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
      .goods-spikebuy-price {
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
    .goods-number-content {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 15px;
      background-color: #fff;
    }
    .goods-number-content::after {
      .backgroundLine();
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

  .van-goods-action {
    z-index: 10;
  }
  .but-buy-action {
    font-size: 14px;
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
          .goods-attr-original-price {
            text-decoration: line-through;
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
}
</style>
