<template>
  <view class="pages virtual">

    <view class="virtual-category-card" v-if="categoryList.length>0">
      <van-cell-group custom-class="virtual-category-group">
        <van-cell custom-class="virtual-category-item" is-link v-for="(v,i) of categoryList" :key="i" @click="goToLink(v.categoryType,v.id,v.categoryName)">
          <view slot="title">
            <img class="icon-default" :src="v.categoryLogo?v.categoryLogo:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="widthFix" />
            <span class="van-cell-text">{{v.categoryName}}</span>
          </view>
        </van-cell>
      </van-cell-group>

    </view>

    <Empty desc="虚拟商品暂未开放！" v-else />

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";

export default {
  components: {
    Empty
  },
  data() {
    return {
      platformGoodsType: "virtual", // 平台商品类型 "physical":实物；"virtual":虚拟；
      curPage: 1,
      pageSize: 9999,
      allPage: null,
      categoryList: [],
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {},

  created() {},

  mounted() {},

  methods: {
    //获取虚拟商品一级类目
    async getCategory() {
      const _category = await api
        .getPlatformGCategoryList({
          currentPage: this.curPage,
          pageSize: this.pageSize,
          where: {
            parentId: "0",
            platformGoodsType: this.platformGoodsType
          }
        })
        .then(res => {
          let data = res.page;
          let _list = data.list;
          this.allPage = data.totalPage;
          if (_list.length > 0) {
            this.categoryList = _list;
          } else {
            this.categoryList = [];
          }
        })
        .catch(err => {});
    },

    goToLink(b, i, t) {
      if (b == "hfll") {
        const url = `/pages/subPackageVirtualG/virtualGMobileCharge?title=${t}`;
        util.navigateTo(url);
      } else {
        const url = `/pages/subPackageVirtualG/virtualGList?id=${i}&title=${t}`;
        util.navigateTo(url);
      }
    },

    //处理no found 图片
    errImg(i) {
      this.categoryList[i].categoryLogo = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    await Promise.all([this.getCategory()]);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../static/css/common";
.virtual {
  .virtual-category-card {
    .virtual-category-group {
      margin-bottom: 10px;
      .icon-default {
        margin-right: 10px;
      }
      .virtual-category-item {
        padding: 13px 15px;
      }
    }
    .virtual-category-group.hidden {
      display: none;
    }
  }
}
</style>
