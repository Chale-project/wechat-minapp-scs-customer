<template>
  <view class="pages groupbuy">

    <view class="groupbuy-status">
      <van-tabs :active="curStatus" color="#f85437" @change="switchGroupbuyStatus">
        <van-tab :title="v.title" v-for="(v,i) of groupbuyStatus" :key="i"></van-tab>
      </van-tabs>
    </view>

    <view class="groupbuy-goods-content" v-if="groupList.length>0">
      <view class="groupbuy-goods-item" v-for="(v,j) of groupList" :key="j" @click="goGroupDetail(v.groupOrderId)">
        <view class="groupbuy-item-store-status">
          <view class="groupbuy-item-store">
            <image class="store-logo" :src="v.shopLogo?v.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errShopLogo(j)" />
            <view class="store-name ellipsis">{{v.shopId?v.shopName:'平台自营'}}</view>
          </view>
          <view class="groupbuy-item-status">
            <text class="status-waiting" v-if="v.state=='waitGroup'">待成团</text>
            <text class="status-success" v-else-if="v.state=='success'">拼团成功</text>
            <text class="status-fail" v-else-if="v.state=='fail'">拼团失败</text>
            <text class="status-unpay" v-else-if="v.state=='unpay'">待支付</text>
          </view>
        </view>
        <view class="groupbuy-item-goods">
          <view class="groupbuy-goods-item-thumb">
            <image :src="v.coverImage?v.coverImage:errDefaultImage" @error="errImg(j)" mode="aspectFit" />
          </view>
          <view class="groupbuy-goods-item-others">
            <view class="groupbuy-goods-item-title ellipsis-2">{{v.title}}</view>
            <view class="groupbuy-goods-item-spec ellipsis">{{v.specificationItems}}</view>
            <view class="groupbuy-goods-item-price color-red ellipsis">
              <view class="original-price">￥<text>{{v.originalPrice}}</text></view>
              <view class="groupbuy-price">￥{{v.groupPrice}}</view>
              <view class="groupbuy-tag">{{v.groupPeopleCount}}人拼购价</view>
            </view>
          </view>
        </view>

      </view>
      <view class="no-more" v-show="noMore">没有更多了！</view>
    </view>
    <view class="no-data" v-else>
      <Empty desc="没有此状态下的拼购订单哦！" />
    </view>

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
      curStatus: 0,
      groupbuyStatus: [
        { title: "进行中" },
        { title: "拼团成功" },
        { title: "全部" }
      ],
      status: "waitGroup",

      curPage: 1,
      pageSize: 20,
      allPage: null,
      groupList: [],
      noMore: !1,

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
      this.curPage = 1;
      this.groupList = [];
      this.noMore = !1;
    },

    //切换拼购状态
    switchGroupbuyStatus(e) {
      let _type = e.mp.detail.index;
      switch (_type) {
        case 1:
          this.curStatus = 1;
          this.status = "success";
          break;
        case 2:
          this.curStatus = 2;
          this.status = null;
          break;
        default:
          this.curStatus = 0;
          this.status = "waitGroup";
      }
      this.init();
      this.getGroupList();
    },

    //详情
    goGroupDetail(id) {
      const url = `/pages/subPackageGroupBuy/groupJoin?groupId=${id}`;
      util.navigateTo(url);
    },

    //获取拼团列表
    async getGroupList() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          state: this.status,
        }
      };
      const _goods = await api
        .getMyGrouplist(data)
        .then(res => {
          let _data = res.result;
          let curlist = _data.list;
          let _list = this.groupList;
          this.allPage = _data.totalPage;
          if (curlist.length > 0) {
            this.noMore = !1;
            curlist.map(i => {
              i.originalPrice = util.moneyFormat(i.originalPrice);
              i.groupPrice = util.moneyFormat(i.groupPrice);
            });
            const _newList = _list.concat(curlist);
            this.groupList = _newList;
          } else {
            this.noMore = !0;
          }
        })
        .catch(err => {});
    },

    //处理no found 图片
    errImg(j) {
      this.groupList[j].coverImage = this.errDefaultImage;
    },

    //处理no found 图片
    errShopLogo(j) {
      this.groupList[j].shopLogo = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.init();
    await Promise.all([this.getGroupList()]);
  },

  onShow() {},

  //onReachBottom
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      this.getGroupList();
    } else {
      this.noMore = !0;
    }
  }
};
</script>

<style lang="less">
@import "../../../static/css/common";
.groupbuy {
  .groupbuy-status {
    position: fixed;
    height: 44px;
    left: 0;
    top: 0;
    right: 0;
    padding-bottom: 1px;
    background: #fff;
    overflow: hidden;
    z-index: 999;
  }
  .groupbuy-goods-content {
    margin-top: 44px;
    .groupbuy-goods-item {
      position: relative;
      background: #fff;
      padding: 10px 15px;
      overflow: hidden;
      .groupbuy-item-store-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        .groupbuy-item-store {
          display: flex;
          align-items: center;
          flex: 2;
          image {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            .borderRadius(50%);
          }
        }
        .groupbuy-item-status {
          flex: 1;
          text-align: right;
          .status-waiting {
            .textColor(#e00000);
          }
          .status-success {
            .textColor(#07c160);
          }
          .status-fail {
            .textColor(#ff976a);
          }
          .status-unpay {
            .textColor(#999);
          }
        }
      }
      .groupbuy-item-goods {
        display: flex;
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
        }
        .groupbuy-goods-item-others {
          width: calc(100% - 100px);
          .groupbuy-goods-item-title {
            height: 40px;
            .fontSize(15px);
          }
          .groupbuy-goods-item-spec {
            .textColor(#999);
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

  .no-data {
    margin-top: 44px;
  }
}
</style>
