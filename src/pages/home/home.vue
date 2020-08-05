<template >
  <view class="pages healthy">
    <view class="healthy-top">
      <view class="top-switch-store" @click="topSwitchStore">
        <van-icon name="exchange" custom-class="exchange-icon" color="#fff" size="20px" />
        <text class="top-text">切换门店</text>
      </view>
      <!-- 商品搜索 -->
      <view class="healthy-search" @click="goToSearch">
        <van-icon name="search" class="healthy-search-icon" color="#999" size="20px" />搜索
      </view>
    </view>

    <!-- 商品banner图 -->
    <view class="healthy-banner">
      <swiper-tem :current="curIndex" :images="imagesList" height="200px" @toPath="goToPath" />
    </view>

    <!-- 栏目导航 -->
    <view class="healthy-category clearfix">
      <navigator :url="v.path" class="category-link" hover-class="category-link-active" v-for="(v,i) of subMenu" :key="i">
        <view class="category-icon">
          <image :src="v.icon?v.icon:'/static/images/default_logo_1x1.jpg'" mode="widthFix" />
        </view>
        <view class="category-text">{{v.name}}</view>
      </navigator>
    </view>

    <!-- 商户店铺设置的商品栏目 -->
    <view class="healthy-panel" v-for="(v,i) of cateGoodsList" :key="i">
      <view class="healthy-panel-header">
        <view class="healthy-panel-text">
          <image :src="i%2>0?'/static/images/healthy_icon_m_l.png':'/static/images/healthy_icon_m_r.png'" mode="widthFix" /><text>{{v.subjectName}}</text>
        </view>
      </view>
      <view class="healthy-panel-body">
        <view class="healthy-goods clearfix" v-if="v.goodsList.length>0">
          <view class="healthy-goods-item float-left" v-for="(k,j) of v.goodsList" :key="j">
            <navigator :url="'/pages/subPackageShop/goods/goods?id='+k.id" hover-class="none">
              <view class="goods-item-image" :style="'height:'+imgH+'px'">
                <image :src="k.coverImage?k.coverImage:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="widthFix" />
              </view>
              <view class="goods-item-title ellipsis">{{k.title}}</view>
            </navigator>
            <view class="goods-item-price-Sales ellipsis">
              <view class="goods-item-price color-red ellipsis">￥{{k.price}}</view>
              <view class="goods-item-but-cart" v-if="k.goodsDesc.length>0">
                <van-icon name="cart-o" class="but-add-cart" color="#e00" size="20px" @click="choiceSpec($event,k)" />
                <!-- <van-button round size="small" custom-class="but-choice-spec" @click="choiceSpec(v)">选规格</van-button> -->
              </view>
              <view class="goods-item-num-operate" v-else>
                <view class="operate-minus" v-show="k.cartNumber>0" @click="minusCart(k.id)">-</view>
                <view class="operate-number ellipsis" v-show="k.cartNumber>0">{{k.cartNumber}}</view>
                <view class="operate-plus" @click="addCart(k)">+</view>
              </view>
            </view>
          </view>
        </view>
        <view class="healthy-goods-empty" v-else>
          <image src="/static/images/user_center_empty.png" mode="widthFix" />
          <text>没有此类目下的商品</text>
        </view>
      </view>
    </view>

    <!-- 热销商品 -->
    <view class="healthy-panel" v-if="goodsList.length>0">
      <view class="healthy-panel-header">
        <view class="healthy-panel-text">
          <image src="/static/images/healthy_icon_m_l.png" mode="widthFix" /><text>为您推荐</text>
        </view>
      </view>
      <view class="healthy-panel-body">
        <view class="healthy-goods clearfix">
          <view class="healthy-goods-item float-left" v-for="(v,i) of goodsList" :key="i">
            <navigator :url="'/pages/subPackageShop/goods/goods?id='+v.id" hover-class="none">
              <view class="goods-item-image" :style="'height:'+imgH+'px'">
                <image :src="v.coverImage?v.coverImage:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="widthFix" />
              </view>
              <view class="goods-item-title ellipsis">{{v.title}}</view>
            </navigator>

            <view class="goods-item-price-Sales ellipsis">
              <view class="goods-item-price color-red ellipsis">￥{{v.price}}</view>
              <view class="goods-item-but-cart" v-if="v.goodsDesc.length>0">
                <van-icon name="cart-o" class="but-add-cart" color="#e00" size="20px" @click="choiceSpec($event,v)" />
                <!-- <van-button round size="small" custom-class="but-choice-spec" @click="choiceSpec(v)">选规格</van-button> -->
              </view>
              <view class="goods-item-num-operate" v-else>
                <view class="operate-minus" v-show="v.cartNumber>0" @click="minusCart(v.id)">-</view>
                <view class="operate-number ellipsis" v-show="v.cartNumber>0">{{v.cartNumber}}</view>
                <view class="operate-plus" @click="addCart(v)">+</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <van-dialog id="van-dialog" :show="showDialog" use-slot show-cancel-button cancel-button-text="取消" confirm-button-text="加入购物车" :title="dialogTitle" @cancel="cancelDialog" @confirm="confirmAddCart">
      <view class="spec-container">
        <view class="spec-title">规格</view>
        <view class="spec-content">
          <van-tag plain custom-class="spec-tag" :color="v.checked?'#f85437':'#999'" v-for="(v,i) of specList" :key="i" @click="checkSpecTag(v.id)">{{v.specificationItems}}</van-tag>
        </view>
        <view class="spec-footer">
          <view class="operate-minus" v-if="specCartNumber>0" @click="minusSpecNum">-</view>
          <view class="operate-number ellipsis" v-if="specCartNumber>0">{{specCartNumber}}</view>
          <view class="operate-plus" @click="addSpecNum">+</view>
        </view>

      </view>
    </van-dialog>

    <!-- 营业状态 -->
    <van-dialog id="van-dialog-a" :show="showBusinessState" title="提示" cancel-button-text="取消" confirm-button-text="查看其他商家" message="非营业时间，店家暂不接单哦！" :show-cancel-button="true" @close="onCancelDialog" @confirm="seeOtherStore" />

    <canvas :style="{position:'fixed', width: '100%', height: '100%',left:'0rpx', top:'0rpx',display:displayGoodBox ? 'block' : 'none'}" canvas-id="myCanvas" />

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import AddShopCar from "@/utils/AddShopCar";
import swiperTem from "@/components/swiper";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    swiperTem
  },
  data() {
    return {
      imgH: null,
      curIndex: 0,
      imagesList: [],
      subMenu: [
        {
          name: "领券中心",
          icon: "/static/images/icon_home_coupons.png",
          path: "/pages/subPackageOthers/couponCenter/couponCenter"
        },
        {
          name: "会员储值",
          icon: "/static/images/icon_home_charge.png",
          path: "/pages/subPackageOthers/charge/charge"
        },
        {
          name: "积分签到",
          icon: "/static/images/icon_home_signin.png",
          path: "/pages/subPackageOthers/signIn/signIn"
        },
        {
          name: "店铺订单",
          icon: "/static/images/icon_home_order.png",
          path: "/pages/subPackageShop/order/order"
        },
        {
          name: "限时秒杀",
          icon: "/static/images/icon_home_spike.png",
          path: "/pages/subPackageSpike/spikeGList"
        },
        {
          name: "拼团购",
          icon: "/static/images/icon_home_group.png",
          path: "/pages/subPackageGroupBuy/groupGList"
        },
        {
          name: "一起玩",
          icon: "/static/images/icon_home_play.png",
          path: "/pages/subPackageVirtualG/virtualGCategory"
        },
        {
          name: "发现好货",
          icon: "/static/images/icon_home_sort.png",
          path: "/pages/subPackageEntityG/entityGCategory"
        }
        // {
        //   name: "大转盘",
        //   icon: "/static/images/icon_home_play.png",
        //   path: "/pages/subPackageOthers/wheel/wheel"
        // }
        // {
        //   name: "排行榜",
        //   icon: "/static/images/icon_home_play.png",
        //   path: "/pages/subPackageOthers/ranking/ranking"
        // }
      ],
      showBinding: !0,
      cateGoodsList: [],
      curPage: 1,
      pageSize: 20,
      allPage: null,
      errDefaultImage: "/static/images/default_logo_1x1.jpg",

      goodsList: [],

      storeName: "智慧便利店",

      showDialog: !1,
      dialogTitle: "标题",
      specList: [],
      specCartNumber: 1,

      displayGoodBox: !1,
      touchPoint: {},

      localCart: [],

      //店铺营业状态
      showBusinessState: !1
    };
  },

  computed: {
    ...mapState(["isNewUser", "storeId"])
  },

  watch: {
    storeId() {
      const that = this;
      const routeList = getCurrentPages();
      for (const i in routeList) {
        if (routeList[i].route == "pages/home/home") {
          that.init();
          const storeId = that.storeId;
          that.getStoreInfo({ storeId, that }).then(res => {
            that.storeName = res.shopName;
            util.setNavigationBarTitle(res.shopName);
            if (res.businessState == "disabled") that.onOpenDialog();
            else if (
              res.businessState != "enabled" &&
              res.businessState != "0:00,24:00"
            )
              that.setOpenDialog(res);
          });
          that.getHealthyBanner();
          that.getHomeCateGoodsList();
          that.getRecomGoods();
        }
      }
    }
  },

  methods: {
    ...mapActions(["AuthLoginByWeixin", "setOptionsQuery", "getStoreInfo"]),

    init() {
      this.curIndex = 0;
      this.imagesList = [];
      this.curPage = 1;
      this.goodsList = [];
      this.cateGoodsList = [];
    },

    //切换店铺
    topSwitchStore() {
      util.navigateTo("/pages/index/index");
    },

    //去搜索页面
    goToSearch() {
      util.navigateTo("/pages/subPackageOthers/search/search");
    },

    //广告图链接
    goToPath(e) {
      if (e && e.indexOf("/pages") != -1) {
        util.navigateTo(e);
      }
    },

    //展开未营业提示
    onOpenDialog() {
      this.showBusinessState = !0;
    },

    //设置店铺非营业时间
    setOpenDialog(res) {
      const _businessTime = res.businessState;
      const _businessTimeStart = `${_businessTime.split(",")[0]}:00`;
      const _businessTimeEnd = `${_businessTime.split(",")[1]}:00`;
      let curDate = new Date();
      let year = curDate.getFullYear();
      let month = curDate.getMonth() + 1;
      let day = curDate.getDate();

      const startDate = `${year}/${month}/${day} ${_businessTimeStart}`;
      const endDate = `${year}/${month}/${day} ${_businessTimeEnd}`;
      const startTimeStamp = util.timeStamp(startDate);
      const endTimeStamp = util.timeStamp(endDate);
      const curTimeStamp = curDate.getTime();
      if (curTimeStamp < startTimeStamp || curTimeStamp > endTimeStamp) {
        this.showBusinessState = !0;
      }
    },

    //查看跟多商家
    seeOtherStore() {
      util.navigateTo("/pages/index/index");
    },

    //取消
    onCancelDialog() {
      this.showBusinessState = !1;
    },

    //选择规格
    choiceSpec(e, v) {
      this.touchPoint = e;
      const _specList = [...v.goodsDesc];
      if (_specList.length > 1) {
        this.showDialog = !0;
        this.dialogTitle = v.title;

        const _id = v.id;

        const _localCart = [...this.localCart];
        const _specListNew = _specList.map(item => {
          item.checked = !1;
          return item;
        });
        const localCartArr = _localCart.filter(item => {
          if (item.goodsId == _id) {
            return item;
          }
        });

        if (localCartArr.length > 0) {
          for (const i in _specListNew) {
            for (const j in localCartArr) {
              if (_specListNew[i].id === localCartArr[j].id) {
                _specListNew[i].cartNumber = localCartArr[j].cartNumber;
                _specListNew[i].checked = !0;
                this.specCartNumber = localCartArr[j].cartNumber;
                break;
              } else {
                if (i == _specListNew.length - 1) {
                  _specListNew[0].cartNumber = this.specCartNumber;
                  _specListNew[0].checked = !0;
                }
              }
            }
          }
        } else {
          _specListNew[0].cartNumber = this.specCartNumber;
          _specListNew[0].checked = !0;
        }

        this.specList = _specListNew;
      } else {
        this.showDialog = !1;
        const _spec = _specList[0];
        this.addOnleCart(_spec);
      }
    },

    //切换规格标签
    checkSpecTag(id) {
      const _specList = [...this.specList];
      this.specList.map(item => {
        if (item.id === id) {
          item.checked = !item.checked;
          this.specCartNumber = item.cartNumber == 0 ? 1 : item.cartNumber;
        } else {
          item.checked = !1;
        }
      });
      this.specList = _specList;
    },

    //取消
    cancelDialog() {
      this.showDialog = !1;
      this.specList = [];
      this.specCartNumber = 1;
    },

    //确认加入购物车
    confirmAddCart() {
      const _checkedSpecArr = this.specList.filter(item => {
        if (item.checked) return item;
      });
      const checkedSpecObj = _checkedSpecArr[0];
      let cartObj = {
        checked: !0,
        id: checkedSpecObj.id,
        cartNumber: this.specCartNumber,
        title: checkedSpecObj.title,
        price: checkedSpecObj.descPrice,
        simage: checkedSpecObj.itemImages,
        spec: checkedSpecObj.specificationItems,
        goodsId: checkedSpecObj.goodsId
      };
      this.dialogCartAdd(cartObj);
    },

    //创建购物车加
    dialogCartAdd(obj) {
      const _cart = this.localCart;
      if (_cart.length > 0) {
        for (const i in _cart) {
          if (_cart[i].id === obj.id) {
            _cart[i].cartNumber = obj.cartNumber;
            // util.showToastSuccess("加入成功！");
            this.flyActivity();
            wx.setStorageSync("localCart-" + this.storeId, _cart);
            this.specCartNumber = 1;
            this.specList = [];
            this.showDialog = !1;
            return false;
          } else {
            if (i == _cart.length - 1) {
              _cart.push(obj);
              // util.showToastSuccess("加入成功！");
              this.flyActivity();
              wx.setStorageSync("localCart-" + this.storeId, _cart);
            }
          }
        }
      } else {
        _cart.push(obj);
        wx.setStorageSync("localCart-" + this.storeId, _cart);
      }
      // util.showToastSuccess("加入成功！");
      this.flyActivity();
      this.specCartNumber = 1;
      this.specList = [];
      this.showDialog = !1;
    },

    //飞入动效
    flyActivity() {
      const e = this.touchPoint;
      let finger = {};
      finger["x"] = e.clientX / wx.getSystemInfoSync().windowWidth * 750; //点击的位置
      finger["y"] = e.clientY / wx.getSystemInfoSync().windowWidth * 750;
      AddShopCar.startAddShopAnimation(
        [
          {
            x: wx.getSystemInfoSync().windowWidth / 10 * 7 * 2,
            y:
              750 *
                wx.getSystemInfoSync().windowHeight /
                wx.getSystemInfoSync().windowWidth -
              0
          },
          finger
        ],
        this
      );
    },

    //规格商品加
    addSpecNum() {
      this.specCartNumber = ++this.specCartNumber;
    },

    //规格商品减
    minusSpecNum() {
      if (this.specCartNumber > 1) {
        this.specCartNumber = --this.specCartNumber;
      } else {
        this.specCartNumber = 1;
        return false;
      }
    },

    //单规格购物车加
    addOnleCart(e) {
      let cartObj = {
        checked: !0,
        id: e.id,
        cartNumber: 1,
        title: e.title,
        price: e.descPrice,
        simage: e.itemImages,
        spec: e.specificationItems,
        goodsId: e.goodsId
      };
      this.setCartAdd(cartObj);
    },

    //购物车加
    addCart(e) {
      let cartObj = {
        checked: !0,
        id: e.id,
        cartNumber: 1,
        title: e.title,
        simage: e.coverImage,
        price: e.price * 100,
        spec: "",
        goodsId: e.id
      };
      this.setCartAdd(cartObj);
      this.setItemGoodsNumberAdd(e.id);
    },

    //购物车减
    minusCart(id) {
      this.setCartMinus(id);
      this.setItemGoodsNumberMinus(id);
    },

    //创建购物车加
    setCartAdd(obj) {
      const _cart = this.localCart;
      if (_cart.length > 0) {
        for (const i in _cart) {
          if (_cart[i].id === obj.id) {
            ++_cart[i].cartNumber;
            wx.setStorageSync("localCart-" + this.storeId, _cart);
            this.flyActivity();
            return false;
          } else {
            if (i == _cart.length - 1) {
              _cart.push(obj);
              wx.setStorageSync("localCart-" + this.storeId, _cart);
              this.flyActivity();
            }
          }
        }
      } else {
        _cart.push(obj);
        wx.setStorageSync("localCart-" + this.storeId, _cart);
        this.flyActivity();
      }
    },

    //商品列表数量加
    setItemGoodsNumberAdd(id) {
      const _goodsList = this.goodsList;
      _goodsList.map(item => {
        if (item.id === id) {
          item.cartNumber = ++item.cartNumber;
        }
      });
    },

    //创建购物车减
    setCartMinus(id) {
      const _cart = this.localCart;
      for (const i in _cart) {
        if (_cart[i].id === id) {
          --_cart[i].cartNumber;
          if (_cart[i].cartNumber < 1) {
            _cart.splice(i, 1);
          }
          wx.setStorageSync("localCart-" + this.storeId, _cart);
        }
      }
    },

    //商品列表数量减
    setItemGoodsNumberMinus(id) {
      const _goodsList = this.goodsList;
      _goodsList.map(item => {
        if (item.id === id) {
          --item.cartNumber;
          if (item.cartNumber < 1) {
            item.cartNumber = 0;
          }
        }
      });
    },

    //获取广告图
    async getHealthyBanner() {
      const res = await api
        .getBanner(this.storeId)
        .then(res => {
          this.imagesList = res.result;
        })
        .catch(err => {});
    },

    //获取热销商品
    async getRecomGoods() {
      const goods = await api
        .getGoodsList({
          currentPage: this.curPage,
          pageSize: this.pageSize,
          where: {
            isRecommend: "recommend",
            shopId: this.storeId
          }
        })
        .then(res => {
          let data = res.page;
          let recomlist = data.list;
          this.allPage = data.totalPage;
          if (recomlist.length > 0) {
            this.setGoodsList(recomlist);
          }
        })
        .catch(err => {});
    },
    //
    setGoodsList(list) {
      list.map(item => {
        item.price = util.moneyFormat(item.price);
      });
      const _goodsList = [...this.goodsList].concat(list);
      const _localCart = [...this.localCart];
      if (_localCart.length > 0) {
        for (const i in _goodsList) {
          for (const j in _localCart) {
            if (_goodsList[i].id === _localCart[j].id) {
              _goodsList[i].cartNumber = _localCart[j].cartNumber;
            }
          }
        }
      }
      this.goodsList = _goodsList;
    },

    //获分类及商品数据
    async getHomeCateGoodsList() {
      const goods = await api
        .getHomeCateGoods({
          currentPage: 1,
          pageSize: 99,
          where: {
            shopId: this.storeId
          }
        })
        .then(res => {
          let data = res.page;
          let _list = data.list;
          const _localCart = [...this.localCart];
          if (_list.length > 0) {
            for (const i in _list) {
              const _goodsList = _list[i].goodsList;
              if (_goodsList.length > 0) {
                for (const j in _goodsList) {
                  _goodsList[j].price = util.moneyFormat(_goodsList[j].price);
                  if (_localCart.length > 0) {
                    for (const k in _localCart) {
                      if (_goodsList[j].id === _localCart[k].id) {
                        _goodsList[j].cartNumber = _localCart[k].cartNumber;
                      }
                    }
                  }
                }
              }
            }

            this.cateGoodsList = _list;
          }
        })
        .catch(err => {});
    },

    //处理no found 图片
    errImg(i) {
      this.goodsList[i].coverImage = this.errDefaultImage;
    }
  },

  onLoad(options) {
    this.init();
    const that = this;
    that.setOptionsQuery({ options, that });
    wx.getSystemInfo({
      success: function(res) {
        that.imgH = (res.windowWidth - 60) / 2;
      }
    });
    const storeId = that.storeId;
    that.getStoreInfo({ storeId, that }).then(res => {
      that.storeName = res.shopName;
      util.setNavigationBarTitle(res.shopName);
      if (res.businessState == "disabled") that.onOpenDialog();
      else if (
        res.businessState != "enabled" &&
        res.businessState != "0:00,24:00"
      )
        that.setOpenDialog(res);
    });
    that.getHealthyBanner();
    that.getHomeCateGoodsList();
    that.getRecomGoods();
  },

  onShow() {
    const that = this;
    that.localCart = wx.getStorageSync("localCart-" + that.storeId) || [];
    if (that.isNewUser) Promise.all([that.AuthLoginByWeixin()]);
  },

  //下拉刷新
  onPullDownRefresh() {
    this.init();
    const that = this;
    that.localCart = wx.getStorageSync("localCart-" + that.storeId) || [];
    const storeId = that.storeId;
    that.getStoreInfo({ storeId, that }).then(res => {
      that.storeName = res.shopName;
      util.setNavigationBarTitle(res.shopName);
      if (res.businessState == "disabled") that.onOpenDialog();
      else if (
        res.businessState != "enabled" &&
        res.businessState != "0:00,24:00"
      )
        that.setOpenDialog(res);
    });
    that.getHealthyBanner();
    that.getHomeCateGoodsList();
    that.getRecomGoods();
    wx.stopPullDownRefresh();
  },

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      this.getRecomGoods();
    }
  },

  //分享
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res);
    }
    return {
      title: this.storeName,
      path: `/pages/home/home?storeId=${this.storeId}`
    };
  }
};
</script>

<style lang="less">
@import "../../../static/css/common";
.healthy {
  .healthy-top {
    display: flex;
    .backgroundColor(#f85437);
    .top-switch-store {
      height: 30px;
      line-height: 30px;
      width: 90px;
      margin-bottom: 10px;
      padding: 0 10px 0 15px;
      .exchange-icon {
        margin-right: 5px;
        vertical-align: middle;
      }
      .top-text {
        .textColor(#fff);
      }
    }
    .healthy-search {
      width: calc(100% - 130px);
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      margin: 0 15px 10px 0;
      text-align: center;
      line-height: 40px;
      .textColor(#999);
      .borderRadius(20px);
      .backgroundColor(#fff);
      .healthy-search-icon {
        height: 20px;
        margin-right: 5px;
        .van-icon-search {
          vertical-align: top;
        }
      }
    }
  }

  .healthy-banner {
    max-height: 200px;
    overflow: hidden;
  }

  .healthy-category {
    margin-bottom: 5px;
    padding: 5px;
    .backgroundColor(#fff);
    .category-link {
      float: left;
      width: 25%;
      box-sizing: border-box;
      padding: 5px;
      text-align: center;
      .category-icon {
        margin-bottom: 10px;
        image {
          width: 40px;
          .borderRadius(50%);
        }
      }
    }
    .category-link-active {
      background-color: none;
    }
    .category-item {
      display: inline-block;
      width: 88.75px;
      height: 81px;
    }
  }

  .healthy-panel {
    margin-bottom: 10px;
    .healthy-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 15px;
      .healthy-panel-text {
        .fontSize(16px);
        text {
          padding: 0 10px;
        }
        image {
          width: 20px;
          vertical-align: top;
        }
      }
      .healthy-panel-more {
        .textColor(#666);
        .icon-more-arrow {
          vertical-align: middle;
        }
      }
    }
    .healthy-panel-body {
      padding: 10px 15px;
      .healthy-goods {
        min-height: 125px;
        .healthy-goods-item {
          box-sizing: border-box;
          width: calc(50% - 7.5px);
          margin-bottom: 15px;
          padding-bottom: 5px;
          overflow: hidden;
          .borderRadius(6px);
          .backgroundColor(#fff);
          .goods-item-image {
            text-align: center;
            margin-bottom: 10px;
            overflow: hidden;
            image {
              width: 100%;
            }
          }
          .goods-item-title {
            height: 20px;
            padding: 0 5px;
            line-height: 20px;
            .fontSize(15px);
          }
          .goods-item-price-Sales {
            display: flex;
            height: 23px;
            padding: 5px;
            overflow: hidden;
            .goods-item-price {
              width: 60%;
              line-height: 23px;
            }
            .goods-item-but-cart {
              width: 40%;
              padding: 1px 0;
              text-align: right;
              .but-choice-spec {
                height: 20px;
                line-height: 20px;
                padding: 0 5px;
                min-width: 50px;
                .fontSize(10px);
                .but-default();
              }
            }
            .goods-item-num-operate {
              width: 40%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              .operate-minus {
                width: 20px;
                height: 20px;
                margin-right: 5px;
                text-align: center;
                line-height: 20px;
                .textColor(#fff);
                .borderRadius(50%);
                .backgroundColor(#ccc);
              }
              .operate-number {
                width: calc(100% - 50px);
                height: 14px;
                line-height: 15px;
                text-align: center;
              }
              .operate-plus {
                width: 20px;
                height: 20px;
                margin-left: 5px;
                text-align: center;
                line-height: 20px;
                .textColor(#fff);
                .borderRadius(50%);
                .backgroundColor(#f85437);
              }
            }
          }
        }
        .healthy-goods-item:nth-child(2n) {
          margin-left: 7.5px;
        }
        .healthy-goods-item:nth-child(2n + 1) {
          margin-right: 7.5px;
        }
      }
      .healthy-goods-empty {
        display: flex;
        align-items: center;
        padding: 30px 15px;
        justify-content: center;
        text-align: center;
        image {
          width: 40px;
          margin-right: 10px;
        }
      }
    }
  }
  #van-dialog-a .van-dialog__header {
    text-align: center;
  }
  .van-dialog__header {
    padding: 15px 15px 0;
    text-align: left;
  }
  .spec-container {
    padding: 15px;
    max-height: 150px;
    overflow-y: auto;
    .spec-title {
      .fontSize(12px);
      margin-bottom: 10px;
    }
    .spec-content {
      .spec-tag {
        margin-right: 5px;
        padding: 4px 10px;
      }
    }
    .spec-footer {
      margin-top: 15px;
      text-align: right;
      .operate-minus {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        text-align: center;
        line-height: 20px;
        .textColor(#fff);
        .borderRadius(50%);
        .backgroundColor(#ccc);
      }
      .operate-number {
        display: inline-block;
        width: 50px;
        height: 20px;
        text-align: center;
      }
      .operate-plus {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-left: 5px;
        text-align: center;
        line-height: 20px;
        .textColor(#fff);
        .borderRadius(50%);
        .backgroundColor(#f85437);
      }
    }
  }
}
</style>
