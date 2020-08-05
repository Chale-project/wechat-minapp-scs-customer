<template>
  <view class="pages virtual">
    <view class="search-container">
      <van-search :value="keywords" placeholder="搜索商品" show-action @focus="onFocus" @clear="onClear" @change="onChangekeywords" @search="onSearchGoods" @cancel="onCancel" custom-class="search-custom-class" field-class="search-field-class" input-class="search-input-class" background="background:#fff;" />
    </view>

    <view class="virtual-goods-category" v-if="categoryList.length>0">
      <van-tabs animated :active="curIndex" :line-width="60" :swipe-threshold="3" @change="switchCategory">
        <van-tab :title="k.categoryName" v-for="(k,i) of categoryList" :key="i"></van-tab>
      </van-tabs>
    </view>

    <block v-if="!isSearch">
      <view class="virtual-goods-content" v-if="goodsList.length>0">
        <view class="virtual-goods-cell">
          <van-row gutter="15">
            <van-col span="12" v-for="(v,j) of goodsList" :key="j">
              <view class="virtual-goods-item">
                <view class="virtual-goods-item-thumb" :style="'height:'+imgH+'px'" @click="goGoodsDetail(v.id)">
                  <image :src="v.goodsImage?v.goodsImage:errDefaultImage" @error="errImg(j)" mode="aspectFit" />
                </view>
                <view class="virtual-goods-item-others">
                  <view class="virtual-goods-item-title ellipsis" @click="goGoodsDetail(v.id)">{{v.goodsName}}</view>
                  <view class="virtual-goods-item-price-sales ellipsis">
                    <view class="virtual-goods-item-price color-red ellipsis">￥{{v.salePrice}}</view>
                    <view class="virtual-goods-item-operate">
                      <!-- <van-button round size="small" custom-class="but-buy-now" @click="goOrderPay(v.id)">秒购</van-button> -->
                    </view>
                  </view>
                </view>
                <view class="virtual-goods-item-tag"><text>{{v.goodsType=='5'?'直充':v.goodsType=='6'?'卡密':'热销'}}</text></view>
              </view>
            </van-col>
          </van-row>
        </view>
        <view class="no-more" v-show="noMore">没有更多了！</view>
      </view>
      <view class="no-data" v-else>
        <Empty desc="店家还没有上架商品哦！" />
      </view>
    </block>

    <block v-else>
      <view class="virtual-goods-search-header">搜索结果</view>
      <view class="virtual-goods-content" v-if="searchGoodsList.length>0">
        <view class="virtual-goods-cell">
          <van-row gutter="15">
            <van-col span="12" v-for="(v,j) of searchGoodsList" :key="j">
              <view class="virtual-goods-item">
                <view class="virtual-goods-item-thumb" :style="'height:'+imgH+'px'" @click="goGoodsDetail(v.id)">
                  <image :src="v.goodsImage?v.goodsImage:errDefaultImage" @error="errImg(j)" mode="aspectFit" />
                </view>
                <view class="virtual-goods-item-others">
                  <view class="virtual-goods-item-title ellipsis" @click="goGoodsDetail(v.id)">{{v.goodsName}}</view>
                  <view class="virtual-goods-item-price-sales ellipsis">
                    <view class="virtual-goods-item-price color-red ellipsis">￥{{v.salePrice}}</view>
                    <view class="virtual-goods-item-operate">
                      <!-- <van-button round size="small" custom-class="but-buy-now" @click="goOrderPay(v.id)">秒购</van-button> -->
                    </view>
                  </view>
                </view>
                <view class="virtual-goods-item-tag"><text>{{v.goodsType=='5'?'直充':v.goodsType=='6'?'卡密':'热销'}}</text></view>
              </view>
            </van-col>
          </van-row>
        </view>
        <view class="no-more" v-show="noSearchMore">没有更多了！</view>
      </view>
      <view class="no-data" v-else>
        <Empty desc="没有相关商品哦！" />
      </view>
    </block>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";
import { mapState } from "vuex";

export default {
  components: {
    Empty
  },
  data() {
    return {
      keywords: null,
      isSearch: !1,
      searchGoodsList: [],
      curSearchPage: 1,
      allSearchPage: null,
      noSearchMore: !1,

      platformGoodsType: "virtual", // 平台商品类型 "physical":实物；"virtual":虚拟；

      imgH: null,
      curIndex: 0,
      categoryId: null,
      categoryList: [],
      sortId: null,
      curPage: 1,
      pageSize: 20,
      allPage: null,
      goodsList: [],
      noMore: !1,

      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["storeId"])
  },

  created() {},

  mounted() {},

  methods: {
    init() {
      this.keywords = null;
      this.isSearch = !1;
      this.curSearchPage = 1;
      this.allSearchPage = null;
      this.searchGoodsList = [];

      this.sortId = null;

      this.curPage = 1;
      this.allPage = null;
      this.goodsList = [];
      this.noMore = !1;
    },

    //获取焦点
    onFocus() {
      this.isSearch = !0;
    },

    //清除
    onClear() {
      this.keywords = null;
    },

    //输入关键词
    onChangekeywords(e) {
      this.keywords = e.mp.detail;
    },

    //搜索
    onSearchGoods(e) {
      if (!this.keywords) {
        util.showToastError("请输入商品名称！");
        return false;
      }
      this.curSearchPage = 1;
      this.allSearchPage = null;
      this.searchGoodsList = [];

      this.getSearchVirtualGoodsList();
    },

    //取消
    onCancel(e) {
      this.isSearch = !1;
      this.keywords = null;
    },

    //详情
    goGoodsDetail(id) {
      const url = `/pages/subPackageVirtualG/virtualGDetail?id=${id}`;
      util.navigateTo(url);
    },

    //秒购
    goOrderPay(id) {
      const url = `/pages/subPackageVirtualG/virtualGCreateOrderPay?id=${id}`;
      util.navigateTo(url);
    },

    //切换商品类目
    switchCategory(e) {
      this.init();

      this.curIndex = e.mp.detail.index;
      const id = this.categoryList[e.mp.detail.index].id;
      this.sortId = id;

      this.getGoods();
    },

    //获取类目
    async getCategory() {
      const _category = await api
        .getPlatformGCategoryList({
          currentPage: 1,
          pageSize: 9999,
          where: {
            parentId: this.categoryId,
            platformGoodsType: this.platformGoodsType
          }
        })
        .then(res => {
          let data = res.page;
          let _list = data.list;
          if (_list.length > 0) {
            this.categoryList = _list;
            const _sortId = _list[this.curIndex].id;
            this.sortId = _sortId;
            this.getGoods();
          } else {
            this.categoryList = [];
            this.getGoods();
          }
        })
        .catch(err => {});
    },

    //获取类目对应商品
    async getGoods() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          shopId: this.storeId,
          categoryId: this.sortId || this.categoryId,
          platformGoodsType: this.platformGoodsType
        }
      };
      const _goods = await api
        .getPlatformGGoodsList(data)
        .then(res => {
          let _data = res.page;
          let curlist = _data.list;
          let _list = this.goodsList;
          this.allPage = _data.totalPage;
          if (curlist.length > 0) {
            this.noMore = !1;
            curlist.map(i => {
              i.salePrice = util.moneyFormat(i.salePrice);
            });
            const _newList = _list.concat(curlist);
            this.goodsList = _newList;
          } else {
            this.noMore = !0;
          }
        })
        .catch(err => {});
    },

    //搜索商品
    async getSearchVirtualGoodsList() {
      const data = {
        currentPage: this.curSearchPage,
        pageSize: this.pageSize,
        where: {
          categoryId: this.sortId || this.categoryId,
          goodsName: this.keywords
        }
      };
      const _storeList = await api
        .getPlatformGGoodsList(data)
        .then(res => {
          let _data = res.page;
          const list = this.searchGoodsList;
          const curlist = _data.list;
          this.allSearchPage = _data.totalPage;
          if (curlist.length > 0) {
            this.noSearchMore = !1;
            curlist.map(i => {
              i.salePrice = util.moneyFormat(i.salePrice);
            });
            const _newList = list.concat(curlist);
            this.searchGoodsList = _newList;
          } else {
            this.noSearchMore = !0;
          }
        })
        .catch(err => {});
    },

    //处理no found 图片
    errImg(j) {
      this.goodsList[j].goodsImage = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.init();
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.imgH = (res.windowWidth - 45) / 2;
      }
    });

    const _title = options.title;
    const _id = options.id;
    this.categoryId = _id;
    wx.setNavigationBarTitle({
      title: _title
    });

    this.curIndex = 0;
    await Promise.all([this.getCategory()]);
  },

  onShow() {},

  //onReachBottom
  onReachBottom() {
    const _isSearch = this.isSearch;
    switch (_isSearch) {
      case true:
        this.curSearchPage = this.curSearchPage + 1;
        if (this.curSearchPage <= this.allSearchPage) {
          this.getSearchVirtualGoodsList();
        } else {
          this.noSearchMore = !0;
        }
        break;
      case false:
        this.curPage = this.curPage + 1;
        if (this.curPage <= this.allPage) {
          this.getGoods();
        } else {
          this.noMore = !0;
        }
        break;
    }
  }
};
</script>

<style lang="less">
@import "../../../static/css/common";
.virtual {
  .search-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    padding: 3px 5px 3px 0;
    background: #fff;
    overflow: hidden;
    z-index: 999;
    .van-search.search-custom-class {
      border-bottom: 1px solid #f1f1f1;
      .van-cell {
        line-height: 32px;
        background: #f2f2f2;
        .van-cell__left-icon-wrap {
          height: 32px;
        }
        .search-input-class {
          height: 32px;
          min-height: 32px;
        }
        .van-field__clear-root {
          height: 32px;
        }
      }
    }
  }
  .virtual-goods-category {
    position: fixed;
    height: 44px;
    left: 0;
    top: 58px;
    right: 0;
    z-index: 999;
  }
  .virtual-goods-content {
    margin-top: 103px;
    .virtual-goods-list {
      .van-card__thumb {
        width: 80px;
        height: 80px;
      }
      .goods-thumb-class {
        width: 100%;
      }
      .but-buy-now {
        .but-default(#f85437);
      }
    }

    .virtual-goods-cell {
      padding: 10px 15px;

      .virtual-goods-item {
        position: relative;
        margin-bottom: 15px;
        .borderRadius(4px);
        overflow: hidden;
        .virtual-goods-item-thumb {
          text-align: center;
          background: #f8f8f8;
          overflow: hidden;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .virtual-goods-item-others {
          padding-top: 5px;
          background-color: #fff;
          .virtual-goods-item-title {
            padding: 0 5px;
            .fontSize(15px);
          }
          .virtual-goods-item-price-sales {
            display: flex;
            height: 24px;
            padding: 5px;
            overflow: hidden;
            .virtual-goods-item-price {
              width: 60%;
              line-height: 24px;
            }
            .virtual-goods-item-operate {
              width: 40%;
              padding: 1px 0;
              text-align: right;
              .but-buy-now {
                height: 24px;
                line-height: 24px;
                min-width: 50px;
                padding: 0 5px;
                .but-default(#f85437);
              }
            }
          }
        }
        .virtual-goods-item-tag {
          position: absolute;
          width: 65px;
          height: 65px;
          left: -38px;
          top: -38px;
          z-index: 99;
          background-color: #f85437;
          transform: rotate(-45deg);
          text-align: center;
          line-height: 7.8;
          text {
            display: inline-block;
            width: 100%;
            color: #fff;
            font-size: 9px;
          }
        }
      }
    }
    .no-more {
      padding: 30px 15px;
      text-align: center;
      .textColor(#999);
    }
  }
  .search-container + .virtual-goods-content {
    margin-top: 59px;
  }
  .search-container + .virtual-goods-search-header {
    margin-top: 59px;
  }
  .virtual-goods-search-header {
    position: relative;
    margin-top: 103px;
    padding: 15px;
    font-size: 15px;
    background-color: #fff;
  }
  .virtual-goods-search-header + .virtual-goods-content {
    margin-top: 0;
  }
  .virtual-goods-search-header::before {
    content: "";
    position: absolute;
    width: 2px;
    top: 10px;
    bottom: 10px;
    left: 0;
    background-color: #f85437;
  }
  .virtual-goods-search-header + .no-data {
    margin-top: 0;
  }
  .no-data {
    margin-top: 103px;
  }
}
</style>
