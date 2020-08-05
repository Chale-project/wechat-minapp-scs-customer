<template >
  <view class="pages search">
    <view class="search-type">
      <van-search :value="keywords" placeholder="请输入商品关键词" show-action @change="onChangekeywords" @search="onSearch" @cancel="onCancel" @clear="onClear">
      </van-search>
    </view>

    <view class="search-content">
      <view class="search-goods clearfix">
        <view class="search-goods-item float-left" v-for="(v,i) of goodsList" :key="i">
          <navigator :url="v.shopId?'/pages/subPackageShop/goods/goods?id='+v.id:'/pages/subPackageEntityG/entityGDetail?id='+v.id" hover-class="none">
            <view class="goods-item-image" :style="'height:'+imgH+'px'">
              <image :src="v.coverImage?v.coverImage:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="widthFix" />
            </view>
            <view class="goods-item-title ellipsis">{{v.title}}</view>
            <view class="goods-item-price-Sales ellipsis">
              <view class="goods-item-price color-red ellipsis">￥{{v.price}}</view>
              <!-- <view class="goods-item-sales ellipsis">销量{{v.stockCount?v.stockCount:0}}</view> -->
            </view>
          </navigator>
        </view>
      </view>
      <view class="no-more" v-show="noMore">没有更多搜索商品了！</view>
    </view>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState } from "vuex";
export default {
  data() {
    return {
      imgH: null,
      keywords: "",
      curPage: 1,
      pageSize: 10,
      allPage: null,
      goodsList: [],
      noMore: !1
    };
  },

  computed: {
    ...mapState(["storeId"])
  },

  onLoad() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.imgH = (res.windowWidth - 60) / 2;
      }
    });
  },

  async onShow() {
    this.init();
    await Promise.all([this.getGoodsList()]);
  },

  mounted() {},

  methods: {
    init() {
      this.curPage = 1;
      this.goodsList = [];
      this.noMore = !1;
    },

    //输入关键词
    onChangekeywords(e) {
      this.keywords = e.mp.detail;
    },

    //监听搜索
    onSearch(e) {
      if (!this.keywords) {
        util.showToastError("请输入搜索关键词！");
        return false;
      }
      this.init();
      this.getGoodsList();
    },

    //取消搜索
    onCancel(e) {
      this.keywords = "";
      this.init();
      this.getGoodsList();
    },

    //监听清空控件
    onClear(e) {
      this.keywords = "";
    },

    //获取商品列表
    async getGoodsList() {
      let data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          title: this.keywords,
          shopId: this.storeId
        }
      };
      const list = await api
        .searchGoodsList(data)
        .then(res => {
          let list = this.goodsList;
          let curlist = res.page.list;
          this.allPage = res.page.totalPage;
          if (curlist.length > 0) {
            this.noMore = !1;
            curlist.map(i => {
              i.price = util.moneyFormat(i.price);
            });

            const _newList = list.concat(curlist);

            this.goodsList = _newList;
          } else {
            this.noMore = !0;
          }
        })
        .catch(err => {});
    },

    //处理no found 图片
    errImg(i) {
      this.goodsList[i].coverImage = this.errDefaultImage;
    }
  },

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      this.getGoodsList();
    } else {
      this.noMore = !0;
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
.search {
  .search-type {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    border-bottom: 0.5px solid #eee;
    .backgroundColor(#fff);
    .van-search {
      padding: 5px 15px;
      .van-cell {
        line-height: 30px;
        .borderRadius(6px);
        .van-cell__left-icon-wrap,
        .van-cell__right-icon-wrap {
          height: 30px;
          .van-cell__left-icon {
            line-height: 30px;
          }
        }
        .van-field__input {
          height: 30px;
        }
        .van-field__clear-root {
          height: 30px;
        }
      }
    }
  }
  .search-content {
    padding: 10px 15px;
    margin-top: 45px;
    .search-goods-item {
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
        justify-content: space-between;
        padding: 5px;
        .goods-item-price {
          flex: 1;
        }
        .goods-item-sales {
          flex: 1;
          text-align: right;
          .textColor(#666);
        }
      }
    }
    .search-goods-item:nth-child(2n) {
      margin-left: 7.5px;
    }
    .search-goods-item:nth-child(2n + 1) {
      margin-right: 7.5px;
    }

    .no-more {
      padding: 30px 15px;
      text-align: center;
      .textColor(#999);
    }
  }
}
</style>
