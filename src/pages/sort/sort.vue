<template >
  <view class="pages sort">
    <view class="sort-goods-search">
      <view class="search-container" @click="goToSearch">
        <van-icon name="search" class="healthy-search-icon" color="#999" size="20px" />搜索
      </view>
    </view>
    <view class="sort-goods-content" v-if="oneSortList.length>0">

      <scroll-view class="sort-nav" scroll-y="true">
        <view :class="i==curSort?'sort-nav-item ellipsis active':'sort-nav-item ellipsis'" @click="switchNav(i,v.id)" v-for="(v,i) of oneSortList" :key="i">{{v.name}}</view>
      </scroll-view>

      <view class="sort-content">
        <view class="sort-sub-nav" v-if="hsaTwoSort">
          <van-tabs :active="curSubSort" :line-width="40" :swipe-threshold="3" @change="switchSubNav">
            <van-tab :title="v.name" v-for="(v,i) of subSortList" :key="i"></van-tab>
          </van-tabs>
        </view>

        <scroll-view class="category-goods clearfix" scroll-y="true" bindscrolltolower="onReachBottom" :style="hsaTwoSort?'height:calc(100% - 45px)':'height:100%'">
          <view class="category-goods-item" v-for="(v,i) of goodsList" :key="i">
            <view class="goods-item-image" @click="navigateToGoodsDetail(v.id)">
              <image :src="v.coverImage?v.coverImage:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="widthFix" />
            </view>
            <view class="goods-item-info">
              <view class="goods-item-title ellipsis-2" @click="navigateToGoodsDetail(v.id)">{{v.title}}</view>
              <view class="goods-item-others">
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
          <view class="no-more" v-show="noMore">没有更多啦…</view>
        </scroll-view>
      </view>
    </view>

    <Empty desc="店家太懒还没上架商品^_^" v-else />

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

    <canvas :style="{position:'fixed', width: '100%', height: '100%',left:'0rpx', top:'0rpx',display:displayGoodBox ? 'block' : 'none'}" canvas-id="myCanvas" />
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import AddShopCar from "@/utils/AddShopCar";
import Empty from "@/components/empty";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Empty
  },
  data() {
    return {
      storeIdChange: !1, // 店铺ID是否发现变化
      curPage: 1,
      pageSize: 20,
      allPage: null,
      canTap: !1,
      curSort: 0,
      curSubSort: 0,
      sortId: null,
      hsaTwoSort: !1,
      oneSortList: [],
      subSortList: [],

      goodsList: [],
      noMore: !1,
      showDialog: !1,
      dialogTitle: "标题",
      specList: [],
      specCartNumber: 1,
      displayGoodBox: !1,
      touchPoint: {},
      localCart: [],
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {
    ...mapState(["isNewUser", "storeId"])
  },

  watch: {
    storeId() {
      this.storeIdChange = !0;
    }
  },
  mounted() {},

  methods: {
    ...mapActions([
      "AuthLoginByWeixin",
      "setOptionsQuery",
      "setAccessRecort",
      "getStoreInfo"
    ]),

    init() {
      this.curSort = 0;
      this.curSubSort = 0;
      this.oneSortList = [];
      this.subSortList = [];
      this.curPage = 1;
      this.goodsList = [];
    },

    //去搜索页面
    goToSearch() {
      util.navigateTo("/pages/subPackageOthers/search/search");
    },

    //跳转商品详情
    navigateToGoodsDetail(id) {
      const url = `/pages/subPackageShop/goods/goods?id=${id}`;
      util.navigateTo(url);
    },

    //切换商品一级分类
    switchNav(i, id) {
      if (i == this.curSort) return;
      if (!this.canTap) return;

      this.curSort = i;
      this.curSubSort = 0;
      this.subSortList = [];

      this.curPage = 1;
      this.goodsList = [];
      this.getTwoSort(id);
    },

    //切换商品二级分类
    switchSubNav(e) {
      const _index = e.mp.detail.index;
      const _title = e.mp.detail.title;
      this.curSubSort = _index;
      const id = this.subSortList[_index].id;
      this.sortId = id;
      util.setNavigationBarTitle(_title);

      this.curPage = 1;
      this.goodsList = [];
      this.getGoodsList();
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

    //获取商品分类一级
    async getOneSort() {
      const one = await api
        .getFirstLvCategoryList(this.storeId)
        .then(res => {
          let one_list = res.list;
          if (one_list.length > 0) {
            this.oneSortList = one_list;
            if (this.curSort > one_list.length) this.curSort = 0;

            let pid = one_list[this.curSort].id;

            this.getTwoSort(pid);
          } else {
            util.showToastError("暂无商品！");
          }
        })
        .catch(err => {});
    },

    //获取商品分类二级
    async getTwoSort(id) {
      const one = await api
        .getSecondLvCategoryList(id)
        .then(res => {
          this.canTap = !0;
          let two_list = res.list;
          if (two_list.length > 0) {
            this.hsaTwoSort = !0;
            this.subSortList = two_list;
            if (this.curSubSort > two_list.length) this.curSubSort = 0;
            const cid = two_list[this.curSubSort].id;
            const _title = two_list[this.curSubSort].name;
            this.sortId = cid;
            util.setNavigationBarTitle(_title);
            this.getGoodsList();
          } else {
            this.hsaTwoSort = !1;
            const _id = this.oneSortList[this.curSort].id;
            const _title = this.oneSortList[this.curSort].name;
            this.sortId = _id;
            util.setNavigationBarTitle(_title);
            this.getGoodsList();
          }
        })
        .catch(err => {});
    },

    //获取商品列表
    async getGoodsList() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          shopId: this.storeId,
          categoryId: this.sortId
        }
      };
      const _goods = await api
        .getGoodsList(data)
        .then(res => {
          this.canTap = !0;

          let curlist = res.page.list;
          this.allPage = res.page.totalPage;
          if (curlist.length > 0) {
            this.noMore = !1;
            this.setGoodsList(curlist);
          } else {
            this.noMore = !0;
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

    //处理no found 图片
    errImg(i) {
      this.goodsList[i].coverImage = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    const that = this;
    that.curSort = options.curSort || 0;
    that.setOptionsQuery({ options, that });

    if (that.isNewUser)
      that.AuthLoginByWeixin().then(() => {
        that.setAccessRecort(that.storeId);
      });

    const storeId = that.storeId;
    that.getStoreInfo({ storeId, that });
  },

  onShow() {
    this.localCart = wx.getStorageSync("localCart-" + this.storeId) || [];
    if (this.storeIdChange) {
      this.init();
      this.getOneSort();
    }
  },

  onHide() {
    this.storeIdChange = !1;
  },

  onUnload() {
    this.storeIdChange = !1;
  },

  //下拉刷新
  onPullDownRefresh() {
    this.init();
    this.localCart = wx.getStorageSync("localCart-" + this.storeId) || [];
    this.getOneSort();

    wx.stopPullDownRefresh();
  },

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      this.getGoodsList();
    }
  }
};
</script>

<style lang="less">
@import "../../../static/css/common";
page {
  height: 100%;
}
.sort {
  .sort-goods-search {
    padding: 0 15px 10px;
    .backgroundColor(#f85437);
    .search-container {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
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

  .sort-goods-content {
    height: calc(100% - 50px);
    display: flex;
    justify-content: space-between;
    .sort-nav {
      box-sizing: border-box;
      width: 80px;
      height: 100%;
      .backgroundColor(#f4f4f4);
      .sort-nav-item {
        position: relative;
        padding: 12px 5px;
        text-align: center;
        .textColor(#666);
      }
      .sort-nav-item.active {
        .textColor(#333);
        .backgroundColor(#fff);
      }
      .sort-nav-item.active::after {
        position: absolute;
        content: "";
        width: 2px;
        top: 10px;
        bottom: 10px;
        left: 0;
        .backgroundColor(#f85437);
      }
    }

    .sort-content {
      box-sizing: border-box;
      width: calc(100% - 80px);
      height: 100%;
      padding-left: 12px;
      .backgroundColor(#fff);
      .sort-sub-nav {
        box-sizing: border-box;
        width: 100%;
        height: 45px;
        padding-right: 15px;
        .van-tabs--line {
          padding-top: 45px;
          .van-tabs__wrap {
            height: 45px;
          }
        }
        .van-tab {
          .fontSize(12px);
          padding: 9px 5px;
          line-height: 27px;
        }
        .van-tab.van-tab--active {
          .textColor(red);
        }
      }
      .category-goods {
        box-sizing: border-box;
        padding-top: 8px;
        .category-goods-item {
          position: relative;
          display: flex;
          padding: 5px 15px 5px 0;
          overflow: hidden;

          .goods-item-image {
            width: 60px;
            height: 60px;
            margin-right: 5px;
            text-align: center;
            overflow: hidden;
            image {
              width: 100%;
            }
          }
          .goods-item-info {
            width: calc(100% - 65px);
            .goods-item-title {
              height: 37px;
              overflow: hidden;
            }
            .goods-item-others {
              padding: 5px 0;

              display: flex;
              height: 23px;
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
        }

        .category-goods-item::after {
          bottom: 0;
          .backgroundLine(65px);
        }
        .category-goods-item:last-child::after {
          bottom: 0;
          .backgroundLine(0, 0, 0);
        }
        .no-more {
          padding: 30px 15px;
          text-align: center;
          .textColor(#999);
        }
      }
    }
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
