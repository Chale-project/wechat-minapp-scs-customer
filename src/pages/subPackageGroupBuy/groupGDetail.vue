<template>
  <view class="pages goods">
    <view class="goods-banner" :style="{maxHeight:imgH}">
      <swiper-tem :images="imagesList" :height="imgH" />
    </view>
    <van-row custom-class="active-plate">
      <van-col span="14">
        <view class="active-price">
          ￥ <text class="active-price-value">{{goodsInfo.groupPrice}}</text>
          <view class="active-price-tag">
            <van-icon name="friends-o" size="16px" color="#f85437" />
            <text>{{goodsInfo.groupPeopleCount}}人拼</text>
          </view>
        </view>
        <view class="original-price">
          单买价：￥ <text>{{goodsInfo.originalPrice}}</text>
        </view>
      </van-col>
      <van-col span="10">
        <view class="count-down" v-if="goodsInfo.state=='started'">
          <view class="count-down-title">距结束还剩：</view>
          <view class="count-down-time">
            <i-count-down :target="targetTime" :format="myFormat" :clear-timer="clearTimer" show-day @callback="countDownCallback"></i-count-down>
          </view>
        </view>
        <view class="goods-active-status" v-else-if="goodsInfo.state=='notStart'">
          团购还没开始，亲稍候再来哦^_^
        </view>
        <view class="goods-active-status" v-else-if="goodsInfo.state=='over'">
          团购已结束，亲下次来早点哦^_^
        </view>

      </van-col>
    </van-row>

    <view class="goods-base-info">
      <view class="goods-title">{{goodsInfo.title}}</view>
      <view class="goods-price-sales">
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

      </van-cell-group>
    </view>

    <view class="goods-group-info" v-if="goodsGroupList.length>0">
      <view class="goods-group-header">已有<text>{{goodsGroupTotal||0}}</text>个团正在进行中</view>
      <view class="goods-group-body">
        <swiper autoplay="true" circular="true" vertical="true" :display-multiple-items="goodsGroupList.length>1?2:1" interval="5000" :style="goodsGroupList.length>1?'height:150px;':'height:75px;'">
          <swiper-item v-for="(v,i) of goodsGroupList" :key="i">
            <view class="group-item">
              <view class="group-item-left">
                <view class="group-captain" v-for="(k,j) of v.userList" :key="j" v-if="k.isMaster">
                  <image :src="k.headPic?k.headPic:errDefaultImage" @error="errAvatar(i,j)" mode="aspectFit" />
                </view>
                <view class="group-member-add">
                  <image src="/static/images/user_unknown.png" mode="aspectFit" />
                </view>
              </view>
              <view class="group-item-center">
                <view class="group-differ">还差<text>{{v.waitGroupOrderCount}}人</text>成团</view>
                <view class="group-count-down">剩余 <i-count-down :target="v.endGroupTime" :clear-timer="clearTimer" show-day @callback="countDownCallbackGroupList"></i-count-down>
                </view>
              </view>
              <view class="group-item-right">
                <van-button round block custom-class="but-go-group" @click="goToGroupJoin(v.groupOrderId)">去参团</van-button>
              </view>
            </view>
          </swiper-item>

        </swiper>

      </view>
      <view class="goods-group-footer">
        <van-cell is-link custom-class="goods-group-cell" @click="showPlayWay">
          <view slot="title">
            <text class="goods-group-title">玩法</text>
            <text class="goods-group-choiced">开团/参团 - 邀请好友 - 满员发货（不满员退款）</text>
          </view>
        </van-cell>
      </view>
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
            <view class="goods-attr-group-price">￥{{checkedGoodsInfo.groupPrice}} <text>{{goodsInfo.groupPeopleCount}}人拼</text></view>
            <view class="goods-attr-original-price">￥{{checkedGoodsInfo.descPrice}}</view>
            <view class="goods-attr-stock">库存：{{checkedGoodsInfo.groupNum||0}}件</view>
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
              <van-stepper :value="curNumber" integer min="1" step="1" @change="onChangeGoodsNumber" />
            </view>
          </scroll-view>
        </view>
        <view class="goods-popup-footer">
          <van-button round block custom-class="but-choice-ok" :disabled="choiceOkStatus" @click="choiceOk">选好了</van-button>
        </view>
      </view>
    </van-popup>

    <van-popup :show="showPlay" position="bottom" custom-class="play-way-box" @close="onClosePopup">
      <view class="play-way-content">
        <view class="close-popup" @click="onClosePopup">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="play-way-header">玩法流程</view>
        <view class="play-way-body">
          <scroll-view class="playway-scroll-area" scroll-y="true" lower-threshold="50">
            <view class="playway-content">
              <view class="home-panel">
                <view class="home-panel-body">
                  <view class="playway-container">
                    <view class="playway-group-open">
                      <view class="playway-group-open-title"><text>开团流程</text></view>
                      <view class="playway-group-content">
                        <timeAxis :timeline="openList" />
                      </view>
                    </view>
                    <view class="playway-group-join">
                      <view class="playway-group-join-title"><text>参团流程</text></view>
                      <view class="playway-group-content">
                        <timeAxis :timeline="joinList" color="#f19b38" />
                      </view>
                    </view>
                  </view>
                </view>
              </view>

            </view>
          </scroll-view>
        </view>
        <view class="play-way-footer">
          <button type="default" class="but-default-submit but-playway-wechat" hover-class="but-default-submit-active" @click="onClosePopup">关闭</button>
        </view>
      </view>
    </van-popup>

    <!-- 底部导航 -->
    <van-goods-action>
      <van-goods-action-icon icon="shop-o" text="店铺" link-type="switchTab" url="/pages/home/home" />
      <van-goods-action-icon icon="cart" text="购物车" link-type="switchTab" :info="cartTotalNumber>0?cartTotalNumber:''" url="/pages/cart/cart" />

      <van-goods-action-button :text="'单独购买 ￥'+checkedGoodsInfo.descPrice||0" type="warning" custom-class="but-buy-action" @click="buyByAlone" />
      <van-goods-action-button :text="'我要开团 ￥'+checkedGoodsInfo.groupPrice||0" custom-class="but-buy-action" :disabled="buyDisabled" @click="buyByGroup" />
    </van-goods-action>
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import wxParse from "mpvue-wxparse";
import swiperTem from "@/components/swiper";
import timeAxis from "@/components/timeAxis";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    swiperTem,
    wxParse,
    timeAxis
  },
  data() {
    return {
      imgH: "250px",
      showAttr: !1,
      showPlay: !1,
      contents: null,
      openList: [
        {
          title: "点击“我要开团”按钮；",
          url: "https://fcloud.minshop.vip/group/k_group_1.jpg"
        },
        {
          title: "提交并成功支付订单；",
          url: "https://fcloud.minshop.vip/group/k_group_2.jpg"
        },
        {
          title: "点击“邀请好友参团”按钮并成功分享；",
          url: "https://fcloud.minshop.vip/group/k_group_4.jpg"
        },
        {
          title:
            "在团有效时间内，凑齐人数就拼购成功，商家在24小时内发货；未凑齐人数就拼购失败，系统将原路退款到付款账户；",
          url: "https://fcloud.minshop.vip/group/c_group_5.jpg"
        }
      ], //开团玩法

      joinList: [
        {
          title: "点击“我要参团”按钮；",
          url: "https://fcloud.minshop.vip/group/c_group_2.jpg"
        },
        {
          title: "提交并成功支付订单；",
          url: "https://fcloud.minshop.vip/group/c_group_3.jpg"
        },
        {
          title: "点击“邀请好友参团”按钮并成功分享；",
          url: "https://fcloud.minshop.vip/group/k_group_4.jpg"
        },
        {
          title:
            "在团有效时间内，凑齐人数就拼购成功，商家在24小时内发货；未凑齐人数就拼购失败，系统将原路退款到付款账户；",
          url: "https://fcloud.minshop.vip/group/c_group_5.jpg"
        }
      ], //参团玩法

      //倒计时
      targetTime: 0,
      myFormat: ["天", "时", "分", "秒"],
      clearTimer: false,
      goodsId: "",
      goodsSpecList: [], //商品规格list
      operationType: 3, // 1:单独购买；2：购物车；3:我要开团
      choiceOkStatus: !0,
      goodsInfo: {},
      imagesList: [], //banner图
      checkedGoodsInfo: {
        descPrice: 0,
        groupPrice: 0
      }, //已选择的商品
      curNumber: 1,

      goodsGroupList: [],
      goodsGroupTotal: 0,

      cartList: [],
      cartTotalNumber: 0,

      errDefaultImage: "/static/images/default_logo_1x1.jpg",
      errDefaultAvatar: "/static/images/user_unknown.png"
    };
  },

  computed: {
    ...mapState(["isNewUser", "userInfo", "storeId"]),
    buyDisabled() {
      const _status = this.goodsInfo.state;
      if (_status != "started") return !0;
      else return !1;
    }
  },

  created() {},

  mounted() {},

  methods: {
    ...mapActions(["AuthLoginByWeixin", "setOptionsQuery", "setAccessRecort"]),

    //数据初始化
    init() {
      this.showAttr = !1;
      this.showPlay = !1;
      this.operationType = 3;
      this.goodsInfo = {};
      this.imagesList = [];

      this.checkedGoodsInfo = {
        descPrice: 0,
        groupPrice: 0
      };
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

    //显示拼团玩法
    showPlayWay() {
      this.showPlay = !0;
    },

    //关闭 拼团玩法
    onClosePopup() {
      this.showPlay = !1;
    },

    //设置商品购买数量
    onChangeGoodsNumber(e) {
      this.curNumber = e.mp.detail;
    },

    //倒计时回调
    countDownCallback() {
      this.targetTime = 0;
      this.goodsInfo.state = "over";
    },

    //团列表item时间到回调

    countDownCallbackGroupList() {
      // this.getGoodsGroupList();
    },

    //去参团
    goToGroupJoin(id) {
      const url = `/pages/subPackageGroupBuy/groupJoin?groupId=${id}`;
      util.navigateTo(url);
    },

    //获取商品基本信息
    async getGoodsInfo() {
      const info = await api
        .getGroupGInfo(this.goodsId)
        .then(res => {
          let _info = res.info;
          _info.originalPrice = util.moneyFormat(_info.originalPrice);
          _info.groupPrice = util.moneyFormat(_info.groupPrice);
          util.setNavigationBarTitle(_info.title);
          this.goodsInfo = _info;

          if (_info.state == "started") {
            this.targetTime = new Date().getTime() + _info.residualTime * 1000;
          } else {
            this.targetTime = 0;
          }

          if (_info.goodsGroupDescModels.length > 0)
            this.setGoodsSpec(_info.goodsGroupDescModels);
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
        arr[i].descPrice = util.moneyFormat(arr[i].descPrice);
        arr[i].groupPrice = util.moneyFormat(arr[i].groupPrice);
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

    //加入购物车操作
    addCartBut() {
      this.operationType = 2;
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

    //单独购买
    buyByAlone() {
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

    //开团购买
    buyByGroup() {
      this.operationType = 3;
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
          id: curSpecGoods.goodsDescId||curSpecGoods.goodsId,
          number: this.curNumber
        };
        this.goToOrder(obj);
      } else if (this.operationType == 2) {
        const curSpecGoods = this.checkedGoodsInfo;
        const obj = {
          checked: !0,
          id: curSpecGoods.goodsDescId,
          cartNumber: this.curNumber,
          title: curSpecGoods.title,
          price: curSpecGoods.descPrice * 100,
          simage: curSpecGoods.itemImages,
          spec: curSpecGoods.specificationItems,
          goodsId: curSpecGoods.goodsId
        };
        this.addCart(obj);
      } else if (this.operationType == 3) {
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
      let _stock = this.checkedGoodsInfo.groupNum || this.goodsInfo.num || 0;

      if (this.curNumber - _stock > 0) flag = !1;
      else flag = !0;

      return flag;
    },

    //立即购买，开团购买跳转到订单创建页面
    goToOrder(obj) {
      if (this.operationType == 3) {
        const _status = this.goodsInfo.state;
        if (_status == "notStart") {
          util.showToastError("团购还没开始，亲稍候再来哦^_^");
          return;
        } else if (_status == "over") {
          util.showToastError("团购已结束，亲下次来早点哦^_^");
          return;
        }
      }

      const _flag = this.checkStock();
      if (!_flag) {
        util.showToastError("灰常遗憾，库存已不足了！");
        return;
      }

      const _operationType = this.operationType;
      const _platformGoodsType = this.goodsInfo.platformGoodsType;
      let url = "";
      switch (_operationType) {
        case 1:
          if (_platformGoodsType == "virtual")
            url = `/pages/subPackageVirtualG/virtualGCreateOrderPay?id=${
              obj.id
            }`;
          else if (_platformGoodsType == "physical")
            url = `/pages/subPackageEntityG/entityCreateOrder?idsNum=${
              obj.id
            }~${obj.number}`;
          else
            url = `/pages/subPackageShop/orderCreate/orderCreate?idsNum=${
              obj.id
            }~${obj.number}`;

          break;
        case 3:
          if (_platformGoodsType == "virtual")
            url = `/pages/subPackageVirtualG/virtualGCreateOrder?idsNum=${
              obj.id
            }~${obj.number}&stp=group`;
          else if (_platformGoodsType == "physical")
            url = `/pages/subPackageEntityG/entityCreateOrder?idsNum=${
              obj.id
            }~${obj.number}&stp=group`;
          else
            url = `/pages/subPackageShop/orderCreate/orderCreate?idsNum=${
              obj.id
            }~${obj.number}&stp=group`;

          break;
      }

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

    //获取该商品的已成团列表
    async getGoodsGroupList() {
      const list = await api
        .getGoodsGroupList(this.goodsId)
        .then(res => {
          this.goodsGroupTotal = res.result.orderCount;
          let _list = res.result.list;
          if (_list.length > 0) {
            _list.map(i => {
              i.endGroupTime = util.timeStamp(i.endGroupTime);
            });
            this.goodsGroupList = _list;
          } else {
            this.goodsGroupList = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
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
    },

    //处理no found 图片
    errAvatar(i, j) {
      this.goodsGroupList[i].userList[j].headPic = this.errDefaultImage;
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

    await Promise.all([that.getGoodsInfo(), that.getGoodsGroupList()]);
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
    let _path = `/pages/subPackageGroupBuy/groupGDetail?id=${
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
  .active-plate {
    .backgroundLiearGraientLR(#ff5129, #ff8314);
    .active-price {
      display: flex;
      align-items: center;
      padding: 5px 15px;
      color: #fff;
      overflow: hidden;
      .active-price-value {
        font-size: 28px;
      }
      .active-price-tag {
        display: inline-block;
        margin-left: 10px;
        padding: 1px 2px;
        background: #fff;
        .borderRadius(1px);
        .van-icon-friends-o {
          vertical-align: middle;
        }
        text {
          font-size: 12px;
          padding: 1px;
          background: #f85437;
        }
      }
    }
    .original-price {
      padding: 3.5px 15px;
      color: #fff;
    }
    .count-down {
      padding: 6px 15px 5px 10px;
      text-align: center;
      background: #fff2e8;
      .count-down-title {
        margin-bottom: 5px;
        color: #f61434;
      }
      .count-down-time {
        height: 34px;
        line-height: 12px;
        color: #f61434;
      }
    }

    .goods-active-status {
      height: 57px;
      display: flex;
      align-items: center;
      padding: 5px 15px;
      color: #fff;
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
      .goods-groupbuy-price {
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

  .goods-group-info {
    margin-bottom: 10px;
    .backgroundColor(#fff);
    .goods-group-header {
      position: relative;
      padding: 10px 15px 10px 20px;
      .fontSize(12px);
      .textColor(#333);
      text {
        .textColor(#f85437);
        .fontSize(16px);
      }
    }
    .goods-group-header::before {
      position: absolute;
      content: "";
      left: 15px;
      top: 12px;
      bottom: 12px;
      width: 2px;
      .backgroundColor(#f85437);
    }
    .goods-group-body {
      position: relative;
      padding: 10px 15px;

      .group-item {
        padding: 10px 0;
        display: flex;
        align-items: center;
        .group-item-left {
          position: relative;
          width: 90px;
          .group-captain,
          .group-member-add {
            width: 45px;
            height: 45px;
            .borderRadius(50%);
            overflow: hidden;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .group-member-add {
            position: absolute;
            left: 40px;
            top: 0;
            z-index: 9;
          }
        }
        .group-item-center {
          width: calc(100% - 170px);
          padding: 0 10px;
          .group-differ {
            margin-bottom: 5px;
            text {
              .textColor(#f85437);
            }
          }
          .group-count-down {
            display: flex;
            align-items: center;
            line-height: 1px;
            .textColor(#999);
            text {
              color: #f85437;
            }
          }
        }
        .group-item-right {
          width: 80px;
          .but-go-group {
            height: 32px;
            line-height: 30px;
            .textColor(#fff);
            border: 1px solid #f85437;
            .backgroundColor(#f85437);
          }
        }
      }
    }
    .goods-group-body::after {
      .backgroundLine(30px, 0);
    }
    .goods-group-footer {
      .goods-group-cell {
        padding-left: 60px;
        .goods-group-title {
          margin-left: -45px;
        }
        .goods-group-choiced {
          padding-left: 17px;
          font-size: 12px;
        }
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
    font-size: 13px;
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
          .goods-attr-group-price {
            .fontSize(16px);
            .color-red();
            text {
              display: inline-block;
              margin-left: 10px;
              padding: 0 4px;
              border: 0.5px solid #f85437;
              .fontSize(10px);
              .borderRadius(4px);
              vertical-align: text-top;
            }
          }
          .goods-attr-original-price {
            .fontSize(12px);
            .textColor(#f85437);
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

  // 玩法弹出层
  .play-way-box {
    overflow-y: visible;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .play-way-content {
      position: relative;
      box-sizing: border-box;
      .play-way-header {
        padding: 20px 15px;
        text-align: center;
      }
      .play-way-body {
        min-height: 400px;
        padding-bottom: 60px;
        .playway-scroll-area {
          height: 430px;
          .playway-content {
            position: relative;
            padding: 0 15px 20px;
            text {
              .textColor(#999);
            }
            .playway-group-open-title,
            .playway-group-join-title {
              margin-bottom: 15px;
              text {
                display: inline-block;
                padding: 10px 30px 10px 15px;
                background: #f85437;
                color: #fff;
                text-align: center;
                font-size: 24px;
                border-top-right-radius: 25px;
                border-bottom-right-radius: 25px;
              }
            }
            .playway-group-join-title {
              text {
                background: #f19b38;
              }
            }
            .playway-group-content {
              padding: 10px 0 20px 15px;
            }
          }
          .playway-content::after {
            .backgroundLine();
          }
        }
      }
      .play-way-footer {
        position: absolute;
        height: 50px;
        padding: 10px 30px 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .but-playway-wechat {
          .but-default(#f85437);
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
