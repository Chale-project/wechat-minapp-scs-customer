<template>
  <view class="pages spike">
    <view class="search-container">
      <van-search :value="keywords" placeholder="搜索商品" show-action @focus="onFocus" @clear="onClear" @change="onChangekeywords" @search="onSearchGoods" @cancel="onCancel" custom-class="search-custom-class" field-class="search-field-class" input-class="search-input-class" background="background:#fff;" />
    </view>
    <view class="spike-status">
      <van-tabs :active="curStatus" color="#f85437" @change="switchSpikeStatus">
        <van-tab :title="v.title" v-for="(v,i) of spikeStatus" :key="i"></van-tab>
      </van-tabs>
    </view>

    <block v-if="!isSearch">
      <view class="spike-goods-content" v-if="goodsList.length>0">
        <view class="spike-goods-item" v-for="(v,j) of goodsList" :key="j">
          <view class="spike-goods-item-thumb" @click="goGoodsDetail(v.id)">
            <image :src="v.coverImage?v.coverImage:errDefaultImage" @error="errImg(j)" mode="aspectFit" />
          </view>
          <view class="spike-goods-item-others">
            <view class="spike-goods-item-title ellipsis-2" @click="goGoodsDetail(v.id)">{{v.title}}</view>
            <view class="spike-goods-item-price-status">
              <view class="spike-goods-item-price" @click="goGoodsDetail(v.id)">
                <view class="spike-price">￥<text>{{v.seckillPrice}}</text></view>
                <view class="original-price">￥<text>{{v.originalPrice}}</text></view>
              </view>
              <view class="spike-goods-item-status">
                <button :class="v.state=='notStarted'?'status-button not-start':v.state=='started'&&v.num<=0?'status-button over':v.state=='started'?'status-button started':v.state=='overed'?'status-button over':'status-button'" hover-class="status-button-active" :disabled="v.state=='started'&&v.num<=0?true:v.state!='overed'?false:true" @click="goGoodsDetail(v.id)">{{v.state=='notStarted'?'即将开始':v.state=='started'&&v.num <= 0?'已抢光':v.state=='started'?'立即抢购':v.state=='overed'?'已结束':''}}</button>
                <view class="status-time" v-if="v.state!='overed'">
                  {{v.state=='notStarted'?'距开始 ':v.state=='started'?'距结束 ':''}} <i-count-down :target="v.residualTime" :clear-timer="clearTimer" show-day @callback="countDownCallback(j,v.state)"></i-count-down>
                </view>
                <view class="spike-goods-sales" v-else-if="v.state=='overed'&&v.stockCount>0">
                  {{v.stockCount}}件已被抢
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="no-more" v-show="noMore">没有更多了！</view>
      </view>
      <view class="no-data" v-else>
        <Empty desc="没有此状态下的秒杀商品哦！" />
      </view>
    </block>

    <block v-else>
      <view class="spike-goods-search-header">搜索结果</view>
      <view class="spike-goods-content" v-if="searchGoodsList.length>0">
        <view class="spike-goods-item" v-for="(v,j) of searchGoodsList" :key="j">
          <view class="spike-goods-item-thumb" @click="goGoodsDetail(v.id)">
            <image :src="v.coverImage?v.coverImage:errDefaultImage" @error="errImg(j)" mode="aspectFit" />
          </view>
          <view class="spike-goods-item-others">
            <view class="spike-goods-item-title ellipsis-2" @click="goGoodsDetail(v.id)">{{v.title}}</view>
            <view class="spike-goods-item-price-status">
              <view class="spike-goods-item-price" @click="goGoodsDetail(v.id)">
                <view class="spike-price">￥<text>{{v.seckillPrice}}</text></view>
                <view class="original-price">￥<text>{{v.originalPrice}}</text></view>
              </view>
              <view class="spike-goods-item-status">
                <button :class="v.state=='notStarted'?'status-button not-start':v.state=='started'&&v.num<=0?'status-button over':v.state=='started'?'status-button started':v.state=='overed'?'status-button over':'status-button'" hover-class="status-button-active" :disabled="v.state=='started'&&v.num<=0?true:v.state!='overed'?false:true" @click="goGoodsDetail(v.id)">{{v.state=='notStarted'?'即将开始':v.state=='started'&&v.num <= 0?'已抢光':v.state=='started'?'立即抢购':v.state=='overed'?'已结束':''}}</button>
                <view class="status-time" v-if="v.state!='overed'">
                  {{v.state=='notStarted'?'距开始 ':v.state=='started'?'距结束 ':''}} <i-count-down :target="v.residualTime" :clear-timer="clearTimer" @callback="countDownSearchCallback(j,v.state)"></i-count-down>
                </view>
                <view class="spike-goods-sales" v-else-if="v.state=='overed'&&v.stockCount>0">
                  {{v.stockCount}}件已被抢
                </view>
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
      spikeStatus: [
        { title: "即将开始" },
        { title: "进行中" },
        { title: "已结束" }
      ],
      status: "notStarted",

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

      this.getSearchSpikeGoodsList();
    },

    //取消
    onCancel(e) {
      this.isSearch = !1;
      this.keywords = null;
    },

    //切换拼购状态
    switchSpikeStatus(e) {
      let _type = e.mp.detail.index;
      switch (_type) {
        case 1:
          this.curStatus = 1;
          this.status = "started";
          break;
        case 2:
          this.curStatus = 2;
          this.status = "overed";
          break;
        default:
          this.curStatus = 0;
          this.status = "notStarted";
      }
      this.init();
      this.getGoods();
    },

    //详情
    goGoodsDetail(id) {
      const url = `/pages/subPackageSpike/spikeGDetail?id=${id}`;
      util.navigateTo(url);
    },

    //倒计时结束回调
    countDownCallback(i, s) {
      // const _goodsList = this.goodsList;
      // if (s == "notStarted") {
      //   _goodsList[i].state = "started";
      // } else if (s == "started") {
      //   _goodsList[i].state = "overed";
      // }
    },

    //倒计时结束回调
    countDownSearchCallback(i, s) {
      // const _goodsList = this.searchGoodsList;
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
        .getSpikeGList(data)
        .then(res => {
          let _data = res.page;
          let curlist = _data.list;
          let _list = this.goodsList;
          this.allPage = _data.totalPage;
          if (curlist.length > 0) {
            this.noMore = !1;
            curlist.map(i => {
              i.originalPrice = util.moneyFormat(i.originalPrice);
              i.seckillPrice = util.moneyFormat(i.seckillPrice);
              if (i.state == "notStarted")
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
    async getSearchSpikeGoodsList() {
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
        .getSpikeGList(data)
        .then(res => {
          let _data = res.page;
          const _list = this.searchGoodsList;
          const curlist = _data.list;
          this.allSearchPage = _data.totalPage;
          if (curlist.length > 0) {
            this.noSearchMore = !1;
            curlist.map(i => {
              i.originalPrice = util.moneyFormat(i.originalPrice);
              i.seckillPrice = util.moneyFormat(i.seckillPrice);
              if (i.state == "notStarted") {
                i.residualTime = util.timeStamp(i.startTime);
              } else if (i.state == "started") {
                i.residualTime = util.timeStamp(i.endTime);
              }
            });
            const _newList = _list.concat(curlist);
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
          this.getSearchSpikeGoodsList();
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
.spike {
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

  .spike-status {
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
  .spike-goods-content {
    margin-top: 97px;
    .spike-goods-item {
      position: relative;
      display: flex;
      background: #fff;
      padding: 10px 15px;
      overflow: hidden;
      .spike-goods-item-thumb {
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
      }
      .spike-goods-item-others {
        width: calc(100% - 100px);
        .spike-goods-item-title {
          height: 40px;
          .fontSize(15px);
        }
        .spike-goods-item-price-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;
          overflow: hidden;
          .spike-goods-item-price {
            flex: 1;
            .spike-price {
              .textColor(#ff0303);
            }
            .spike-price text {
              .fontSize(24px);
            }
            .original-price {
              text-decoration: line-through;
              .textColor(#999);
            }
          }
          .spike-goods-item-status {
            flex: 2;
            text-align: right;
            .status-button {
              display: inline-block;
              padding: 7px 14px;
              line-height: 1;
              .borderRadius(2px);
              .fontSize(13px);
              .textColor(#fff);
              background-color: rgba(204, 204, 204, 1);
            }
            .status-button.not-start {
              background-color: rgba(29, 180, 120, 1);
            }
            .status-button.started {
              background-color: rgba(248, 84, 55, 1);
            }
            .status-button.over {
              background-color: rgba(204, 204, 204, 1);
            }

            button[disabled].status-button {
              opacity: 0.6;
            }
            .status-button-active {
              opacity: 0.6;
            }
            .status-time {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-top: 12px;
              line-height: 1px;
              color: #999;
              font-size: 12px;
            }
          }
        }
      }
    }

    .spike-goods-item::after {
      .backgroundLine();
    }

    .no-more {
      padding: 30px 15px;
      text-align: center;
      .textColor(#999);
    }
  }
  .spike-goods-search-header {
    position: relative;
    margin-top: 97px;
    padding: 15px;
    font-size: 15px;
    background-color: #fff;
  }
  .spike-goods-search-header + .spike-goods-content {
    margin-top: 0;
  }
  .spike-goods-search-header::before {
    content: "";
    position: absolute;
    width: 2px;
    top: 10px;
    bottom: 10px;
    left: 0;
    background-color: #f85437;
  }
  .spike-goods-search-header + .no-data {
    margin-top: 0;
  }
  .no-data {
    margin-top: 97px;
  }
}
</style>
