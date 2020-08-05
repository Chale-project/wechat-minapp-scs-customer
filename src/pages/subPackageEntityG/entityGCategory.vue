<template >
  <view class="pages sort">
    <view class="sort-goods-search">
      <view class="search-container" @click="goToSearch">
        <van-icon name="search" class="healthy-search-icon" color="#999" size="20px" />搜索
      </view>
    </view>
    <view class="sort-goods-content" v-if="oneSortList.length>0">

      <scroll-view class="sort-nav" scroll-y="true">
        <view :class="i==curSort?'sort-nav-item ellipsis active':'sort-nav-item ellipsis'" @click="switchNav(i,v.id)" v-for="(v,i) of oneSortList" :key="i">{{v.categoryName}}</view>
      </scroll-view>

      <scroll-view class="sort-sub-nav clearfix" scroll-y="true" bindscrolltolower="onReachBottom">
        <view class="sub-nav-list float-left" v-for="(v,i) of subSortList" :key="i">
          <navigator :url="'/pages/subPackageEntityG/entityGList?id='+v.id+'&title='+v.categoryName" hover-class="none">
            <view class="sort-image" :style="'height:'+imgH+'px'">
              <image :src="v.categoryLogo?v.categoryLogo:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="aspectFit" />
            </view>
            <view class="sort-text ellipsis">{{v.categoryName}}</view>
          </navigator>
        </view>

        <view class="no-more" v-show="noMore">没有更多分类…</view>
      </scroll-view>
    </view>

    <Empty desc="店家太懒还没上架商品^_^" v-else />

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Empty
  },
  data() {
    return {
      imgH: null,
      platformGoodsType: "physical", // 平台商品类型 "physical":实物；"virtual":虚拟；
      curPage: 1,
      pageSize: 20,
      allPage: null,
      canTap: !1,
      curSort: 0,
      oneSortList: [],
      subSortList: [],

      noMore: !1,
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {},

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
      this.oneSortList = [];
      this.subSortList = [];
      this.curPage = 1;
      this.noMore = !1;
    },

    //去搜索页面
    goToSearch() {
      util.navigateTo("/pages/subPackageOthers/search/search");
    },

    //切换商品一级分类
    switchNav(i, id) {
      if (i == this.curSort) return;
      if (!this.canTap) return;

      this.curSort = i;
      this.subSortList = [];
      this.curPage = 1;
      this.getTwoSort(id);
    },

    //获取商品分类一级
    async getOneSort() {
      const _category = await api
        .getPlatformGCategoryList({
          currentPage: 1,
          pageSize: 9999,
          where: {
            parentId: "0",
            platformGoodsType: this.platformGoodsType
          }
        })
        .then(res => {
          const data = res.page;
          const one_list = data.list;
          if (one_list.length > 0) {
            this.oneSortList = one_list;
            const pid = one_list[this.curSort].id;
            this.getTwoSort(pid);
          }
        })
        .catch(err => {});
    },

    //获取商品分类二级
    async getTwoSort(id) {
      const one = await api
        .getPlatformGCategoryList({
          currentPage: this.curPage,
          pageSize: this.pageSize,
          where: {
            parentId: id,
            platformGoodsType: this.platformGoodsType
          }
        })
        .then(res => {
          this.canTap = !0;
          const data = res.page;
          const list = this.subSortList;
          const two_list = data.list;
          if (two_list.length > 0) {
            this.noMore = !1;
            this.subSortList = list.concat(two_list);
          } else {
            this.noMore = !0;
          }
        })
        .catch(err => {});
    },

    //处理no found 图片
    errImg(i) {
      this.subSortList[i].categoryLogo = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.init();
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.imgH = (res.windowWidth - (100 + 12 * 4)) / 3;
      }
    });
    await Promise.all([this.getOneSort()]);
  },

  onShow() {},

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      this.getTwoSort();
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
      width: 100px;
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

    .sort-sub-nav {
      width: calc(100% - 100px);
      height: 100%;
      box-sizing: border-box;
      padding-left: 12px;
      .backgroundColor(#fff);
      .sub-nav-list {
        box-sizing: border-box;
        width: 33.33%;
        padding: 12px 12px 0 0;
        .sort-image {
          width: 100%;
          overflow: hidden;
          .borderRadius(4px);
          image {
            width: 100%;
            height: 100%;
            .backgroundColor(#f7f7f7);
          }
        }
        .sort-text {
          padding: 10px 0;
          text-align: center;
        }
      }
      .no-more {
        padding: 30px 15px;
        text-align: center;
        .textColor(#999);
      }
    }
  }
}
</style>
