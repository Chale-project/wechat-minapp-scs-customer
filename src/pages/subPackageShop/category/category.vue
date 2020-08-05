<template >
  <view class="pages category">
    <view class="category-type">
      <block v-if="firstLv">
        <view v-for="(item,index) in sortType" class="category-sort" :class="item.active?'active':''" :key="index" :data-index="index" @click="changeSort">{{item.name}}
          <block v-if="item.sort==='Asc'">
            <image src="/static/images/sort_asc.png" mode="widthFix" />
          </block>
          <block v-else-if="item.sort==='Desc'">
            <image src="/static/images/sort_desc.png" mode="widthFix" />
          </block>
          <block v-else-if="item.sort=='synthesize'">
          </block>
          <block v-else-if="item.sort==''">
            <image src="/static/images/sort_default.png" mode="widthFix" />
          </block>
        </view>
      </block>
      <block v-else>
        <view v-for="(item,index) in sortTypes" class="category-sort" :class="item.active?'active':''" :key="index" :data-index="index" @click="changeSort">{{item.name}}
          <block v-if="item.sort==='Asc'">
            <image src="/static/images/sort_asc.png" mode="widthFix" />
          </block>
          <block v-else-if="item.sort==='Desc'">
            <image src="/static/images/sort_desc.png" mode="widthFix" />
          </block>
          <block v-else-if="item.sort=='synthesize'">
          </block>
          <block v-else-if="item.sort==''">
            <image src="/static/images/sort_default.png" mode="widthFix" />
          </block>
        </view>
      </block>

    </view>

    <view class="category-content">
      <view class="category-goods clearfix">
        <view class="category-goods-item float-left" v-for="(v,i) of goodsList" :key="i">
          <navigator :url="'/pages/subPackageShop/goods/goods?goodsId='+v.id" hover-class="none">
            <view class="goods-item-image" :style="'height:'+imgH+'px'">
              <image :src="v.smImage?v.smImage:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="widthFix" />
            </view>
            <view class="goods-item-title ellipsis">{{v.title}}</view>
            <view class="goods-item-price-Sales ellipsis">
              <view class="goods-item-price color-red ellipsis">￥{{v.price/100}}</view>
              <view class="goods-item-sales ellipsis">销量{{v.stockCount?v.stockCount:0}}</view>
            </view>
          </navigator>
        </view>
      </view>
      <view class="no-more" v-show="noMore">没有更多啦…</view>
    </view>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
export default {
  data() {
    return {
      imgH: null,
      firstLv: null, //查询一级分类所有商品
      isHot: "", //是否是热销商品
      sortTypes: [],
      sortType: [],
      categoryId: null,
      curPage: 1,
      pageSize: 20,
      where: {},
      allPage: null,
      goodsList: [],
      noMore: !1,
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {},

  onLoad() {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.imgH = (res.windowWidth - 60) / 2;
      }
    });
  },

  mounted() {},

  methods: {
    //init
    init() {
      this.curPage = 1;
      this.goodsList = [];
      this.noMore = !1;
    },

    //设置一级分类type
    setType() {
      this.sortType = [
        {
          id: 0,
          type: "synthesize",
          name: "综合",
          active: true,
          sort: "synthesize"
        },
        { id: 1, type: "stockCount", name: "销量", active: false, sort: "" },
        { id: 2, type: "price", name: "价格", active: false, sort: "" }
      ];
    },
    //设置二级分类types
    setTypes() {
      this.sortTypes = [
        {
          id: 0,
          type: "synthesize",
          name: "综合",
          active: true,
          sort: "synthesize"
        },
        { id: 1, type: "stockCounts", name: "销量", active: false, sort: "" },
        { id: 2, type: "prices", name: "价格", active: false, sort: "" }
      ];
    },
    //切换筛选条件
    changeSort(e) {
      let _index = e.currentTarget.dataset.index;
      let _sortType = this.firstLv ? this.sortType : this.sortTypes;
      this.init();

      for (let i in _sortType) {
        if (_index == _sortType[i].id) {
          _sortType[i].active = true;

          if (_sortType[i].sort === "Asc") {
            _sortType[i].sort = "Desc";
          } else if (_sortType[i].sort === "Desc") {
            _sortType[i].sort = "Asc";
          } else if (_sortType[i].sort == "") {
            _sortType[i].sort = "Asc";
          }
          if (this.firstLv) {
            if (_index == 0) {
              this.where = {
                id: this.categoryId,
                synthesize: _sortType[i].sort
              };
            } else if (_index == 1) {
              this.where = {
                id: this.categoryId,
                stockCount: _sortType[i].sort
              };
            } else if (_index == 2) {
              this.where = {
                id: this.categoryId,
                price: _sortType[i].sort
              };
            }
          } else {
            if (_index == 0) {
              this.where = {
                categoryId: this.categoryId,
                synthesize: _sortType[i].sort
              };
            } else if (_index == 1) {
              this.where = {
                categoryId: this.categoryId,
                stockCounts: _sortType[i].sort
              };
            } else if (_index == 2) {
              this.where = {
                categoryId: this.categoryId,
                prices: _sortType[i].sort
              };
            }
          }
          this.getGoodsList();
        } else {
          _sortType[i].active = false;
          if (_sortType[i].type === "synthesize") {
            _sortType[i].sort = "synthesize";
          } else {
            _sortType[i].sort = "";
          }
        }
      }
    },

    //获取商品列表
    async getGoodsList() {
      let data = {};
      if (!this.isHot) {
        data = {
          currentPage: this.curPage,
          pageSize: this.pageSize,
          where: this.where
        };
      } else {
        let _where = this.where;
        _where.isHot = this.isHot;
        data = {
          currentPage: this.curPage,
          pageSize: this.pageSize,
          where: _where
        };
      }
      if (this.firstLv) {
        const _list = await api
          .getFirstLvGoodsList(data)
          .then(res => {
            let list = this.goodsList;
            let curlist = res.result.list;
            if (curlist.length > 0) {
              this.noMore = !1;
              this.goodsList = list.concat(curlist);
            } else {
              this.noMore = !0;
            }
          })
          .catch(err => {});
      } else {
        const list = await api
          .getGoodsList(data)
          .then(res => {
            let list = this.goodsList;
            let curlist = res.result.list;
            this.allPage = res.result.totalPage;
            if (curlist.length > 0) {
              this.noMore = !1;
              this.goodsList = list.concat(curlist);
            } else {
              this.noMore = !0;
            }
          })
          .catch(err => {});
      }
    },

    //处理no found 图片
    errImg(i) {
      this.goodsList[i].image = this.errDefaultImage;
    }
  },

  async onShow() {
    this.init();

    let id = this.$root.$mp.query.categoryId;
    let firstlv = this.$root.$mp.query.firstLv;
    let hot = this.$root.$mp.query.isHot;

    this.categoryId = id || null;
    this.firstLv = firstlv || null;
    if (firstlv) {
      this.setType();
      this.where = {
        id: id || null,
        synthesize: "synthesize"
      };
    } else {
      this.setTypes();
      this.where = {
        categoryId: id || null,
        synthesize: "synthesize"
      };
    }
    this.isHot = hot || "";

    await Promise.all([this.getGoodsList()]);
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
.category {
  .category-type {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.5px solid #eee;
    .backgroundColor(#fff);
    .category-sort {
      flex: 1;
      padding: 10px;
      text-align: center;
      image {
        width: 12px;
      }
    }
    .category-sort.active {
      .textColor(#f85437);
    }
  }
  .category-content {
    padding: 10px 15px;
    margin-top: 45px;
    .category-goods-item {
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
        padding: 0 5px;
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
    .category-goods-item:nth-child(2n) {
      margin-left: 7.5px;
    }
    .category-goods-item:nth-child(2n + 1) {
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
