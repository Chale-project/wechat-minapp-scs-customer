<template>
  <view class="pages groupbuy">
    <view class="search-container">
      <van-search :value="keywords" placeholder="搜索商品" show-action @focus="onFocus" @clear="onClear" @change="onChangekeywords" @search="onSearchGoods" @cancel="onCancel" custom-class="search-custom-class" field-class="search-field-class" input-class="search-input-class" background="background:#fff;" />
    </view>
    <view class="groupbuy-status">
      <van-tabs :active="curStatus" color="#f85437" @change="switchGroupbuyStatus">
        <van-tab :title="v.title" v-for="(v,i) of groupbuyStatus" :key="i"></van-tab>
      </van-tabs>
    </view>

    <block v-if="!isSearch">
      <view class="groupbuy-goods-content" v-if="goodsList.length>0">
        <view class="groupbuy-goods-item" v-for="(v,j) of goodsList" :key="j" @click="goGoodsDetail(v.id)">
          <view class="groupbuy-goods-item-thumb">
            <image :src="v.coverImage?v.coverImage:errDefaultImage" @error="errImg(j)" mode="aspectFit" />
            <!-- <view class="groupbuy-goods-item-tag"><text>拼购</text></view> -->
          </view>
          <view class="groupbuy-goods-item-others">
            <view class="groupbuy-goods-item-title ellipsis-2">{{v.title}}</view>
            <view class="groupbuy-goods-item-price color-red ellipsis">
              <view class="original-price">￥<text>{{v.originalPrice}}</text></view>
              <view class="groupbuy-price">￥{{v.groupPrice}}</view>
              <view class="groupbuy-tag">{{v.groupPeopleCount}}人拼购价</view>
            </view>
            <view class="groupbuy-goods-item-status">
              <view class="status-time" v-if="v.state!='over'">
                {{v.state=='notStart'?'距开始 ':v.state=='started'?'距结束 ':''}} <i-count-down :target="v.residualTime" :clear-timer="v.clearTimer" show-day @callback="countDownCallback(j,v.state)"></i-count-down>
              </view>
              <view class="groupbuy-goods-over" v-else-if="v.state=='over'">
                已结束
              </view>
            </view>
          </view>

        </view>

        <view class="no-more" v-show="noMore">没有更多了！</view>
      </view>
      <view class="no-data" v-else>
        <Empty desc="没有此状态下的拼购商品哦！" />
      </view>
    </block>

    <block v-else>
      <view class="groupbuy-goods-search-header">搜索结果</view>
      <view class="groupbuy-goods-content" v-if="searchGoodsList.length>0">
        <view class="groupbuy-goods-item" v-for="(v,j) of searchGoodsList" :key="j" @click="goGoodsDetail(v.id)">

          <view class="groupbuy-goods-item-thumb">
            <image :src="v.coverImage?v.coverImage:errDefaultImage" @error="errSearchImg(j)" mode="aspectFit" />
            <!-- <view class="groupbuy-goods-item-tag"><text>拼购</text></view> -->
          </view>
          <view class="groupbuy-goods-item-others">
            <view class="groupbuy-goods-item-title ellipsis-2">{{v.title}}</view>
            <view class="groupbuy-goods-item-price color-red ellipsis">
              <view class="original-price">￥<text>{{v.originalPrice}}</text></view>
              <view class="groupbuy-price">￥{{v.groupPrice}}</view>
              <view class="groupbuy-tag">{{v.groupPeopleCount}}人拼购价</view>
            </view>
            <view class="groupbuy-goods-item-status">
              <view class="status-time" v-if="v.state!='over'">
                {{v.state=='notStart'?'距开始 ':v.state=='started'?'距结束 ':''}} <i-count-down :target="v.residualTime" :clear-timer="clearTimer" show-day @callback="countDownSearchCallback(j,v.state)"></i-count-down>
              </view>
              <view class="groupbuy-goods-over" v-else-if="v.state=='over'">
                已结束
              </view>
            </view>
          </view>

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

      curStatus: 0,
      groupbuyStatus: [
        { title: "预告" },
        { title: "进行中" },
        { title: "全部" }
      ],
      status: "notStart",

      curPage: 1,
      pageSize: 20,
      allPage: null,
      goodsList: [],
      noMore: !1,
      //停止倒计时
      clearTimer: false,
      imgH: null,
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

      this.curPage = 1;
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

      this.getSearchGroupGoodsList();
    },

    //取消
    onCancel(e) {
      this.isSearch = !1;
      this.keywords = null;
    },

    //切换拼购状态
    switchGroupbuyStatus(e) {
      let _type = e.mp.detail.index;
      switch (_type) {
        case 1:
          this.curStatus = 1;
          this.status = "started";
          break;
        case 2:
          this.curStatus = 2;
          this.status = null;
          break;
        default:
          this.curStatus = 0;
          this.status = "notStart";
      }
      this.init();
      this.getGoods();
    },

    //详情
    goGoodsDetail(id) {
      const url = `/pages/subPackageGroupBuy/groupGDetail?id=${id}`;
      util.navigateTo(url);
    },

    //倒计时结束回调
    countDownCallback(i, s) {
      // let _goodsList = this.goodsList;
      // if (s == "notStart") {
      //   _goodsList[i].state = "started";
      // } else if (s == "started") {
      //   _goodsList[i].state = "over";
      // }
    },

    //倒计时结束回调
    countDownSearchCallback(i, s) {
      // let _goodsList = this.searchGoodsList;
      // if (s == "notStarted") {
      //   _goodsList[i].state = "started";
      // } else if (s == "started") {
      //   _goodsList[i].state = "overed";
      // }
    },

    //获取商品列表
    async getGoods() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          state: this.status,
          shopId: this.storeId
        }
      };
      const _goods = await api
        .getGroupGList(data)
        .then(res => {
          let _data = res.result;
          let curlist = _data.list;
          let _list = this.goodsList;
          this.allPage = _data.totalPage;
          if (curlist.length > 0) {
            this.noMore = !1;
            curlist.map(i => {
              i.originalPrice = util.moneyFormat(i.originalPrice);
              i.groupPrice = util.moneyFormat(i.groupPrice);
              if (i.state == "notStart")
                i.residualTime = util.timeStamp(i.startTime);
              else if (i.state == "started")
                i.residualTime = util.timeStamp(i.endTime);
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
    async getSearchGroupGoodsList() {
      const data = {
        currentPage: this.curSearchPage,
        pageSize: this.pageSize,
        where: {
          state: this.status,
          shopId: this.storeId,
          title: this.keywords
        }
      };
      const _storeList = await api
        .getGroupGList(data)
        .then(res => {
          let _data = res.result;
          const list = this.searchGoodsList;
          const curlist = _data.list;
          this.allSearchPage = _data.totalPage;
          if (curlist.length > 0) {
            this.noSearchMore = !1;
            curlist.map(i => {
              i.originalPrice = util.moneyFormat(i.originalPrice);
              i.groupPrice = util.moneyFormat(i.groupPrice);
              if (i.state == "notStart")
                i.residualTime = util.timeStamp(i.startTime);
              else if (i.state == "started")
                i.residualTime = util.timeStamp(i.endTime);
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
      this.goodsList[j].coverImage = this.errDefaultImage;
    },

    //处理no found 图片
    errSearchImg(j) {
      this.searchGoodsList[j].coverImage = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.imgH = (res.windowWidth - 45) / 2;
      }
    });

    this.init();
    await Promise.all([this.getGoods()]);
  },

  onShow() {},

  //onReachBottom
  onReachBottom() {
    const _isSearch = this.isSearch;
    switch (_isSearch) {
      case true:
        this.curSearchPage = this.curSearchPage + 1;
        if (this.curSearchPage <= this.allSearchPage) {
          this.getSearchGroupGoodsList();
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
.groupbuy {
  .search-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    padding-right: 5px;
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

  .groupbuy-status {
    position: fixed;
    height: 44px;
    left: 0;
    top: 52px;
    right: 0;
    padding-bottom: 1px;
    background: #fff;
    overflow: hidden;
    z-index: 999;
  }
  .groupbuy-goods-content {
    margin-top: 97px;
    .groupbuy-goods-item {
      position: relative;
      display: flex;
      background: #fff;
      padding: 10px 15px;
      overflow: hidden;
      .groupbuy-goods-item-thumb {
        position: relative;
        width: 90px;
        height: 90px;
        margin-right: 10px;
        text-align: center;
        background: #f8f8f8;
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
        }
        .groupbuy-goods-item-tag {
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
      .groupbuy-goods-item-others {
        width: calc(100% - 100px);
        .groupbuy-goods-item-title {
          height: 40px;
          .fontSize(15px);
        }
        .groupbuy-goods-item-price {
          display: flex;
          align-items: center;
          height: 24px;
          padding: 5px 0;
          line-height: 24px;
          overflow: hidden;
          .original-price {
            margin-right: 5px;
          }
          .groupbuy-price {
            margin-right: 10px;
          }
          .original-price text {
            .fontSize(24px);
          }
          .groupbuy-tag {
            position: relative;
            padding: 2px 2px 2px 5px;
            line-height: 1;
            .fontSize(12px);
            .textColor(#fff);
            .backgroundColor(#f85437);
            .borderRadius(2px);
          }
          .groupbuy-tag::before {
            position: absolute;
            top: 4px;
            left: -4px;
            content: "";
            width: 8px;
            height: 8px;
            transform: rotate(-45deg);
            background: #f85437;
            z-index: 10;
          }
        }
        .groupbuy-goods-item-status {
          text-align: right;
          .status-time {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 12px;
            line-height: 1px;
            color: #999;
            font-size: 12px;
            text {
              color: #f85437;
            }
          }
          .groupbuy-goods-over {
            font-size: 12px;
            color: #ff976a;
          }
        }
      }
    }

    .groupbuy-goods-item::after {
      .backgroundLine();
    }

    .no-more {
      padding: 30px 15px;
      text-align: center;
      .textColor(#999);
    }
  }
  .groupbuy-goods-search-header {
    position: relative;
    margin-top: 97px;
    padding: 15px;
    font-size: 15px;
    background-color: #fff;
  }
  .groupbuy-goods-search-header + .groupbuy-goods-content {
    margin-top: 0;
  }
  .groupbuy-goods-search-header::before {
    content: "";
    position: absolute;
    width: 2px;
    top: 10px;
    bottom: 10px;
    left: 0;
    background-color: #f85437;
  }
  .groupbuy-goods-search-header + .no-data {
    margin-top: 0;
  }
  .no-data {
    margin-top: 97px;
  }
}
</style>
