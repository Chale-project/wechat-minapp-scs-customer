<template >
  <view class="pages balance-record">
    <view class="balance-record-header">
      <view class="balance-record-face">
        <view class="balance-record-face-value"><text>{{balanceTotal}}</text> 元</view>
        <view class="balance-record-face-title">当前余额</view>
      </view>
    </view>
    <view class="balance-record-content" v-if="balanceRecordList.length>0">
      <van-cell-group>
        <van-cell :title="v.source=='recharge'?'充值获得':v.source=='present'?'充值赠送':v.source=='expenditure'?'消费扣除':'未知'" :value="v.source=='recharge'?'+ '+v.money:v.source=='present'?'+ '+v.money:v.source=='expenditure'?'- '+v.money:''+v.money" :label="v.addDataTime" :value-class="v.source=='recharge'?'value-number color-plus':v.source=='present'?'value-number color-plus':v.source=='expenditure'?'value-number color-minus':'value-number '" v-for="(v,i) of balanceRecordList" :key="i" />
      </van-cell-group>
      <view class="no-more" v-show="noMore">没有更多了！</view>
    </view>

    <view class="no-data" v-else>
      <Empty desc="没有记录哦！" />
    </view>

    <!-- 返回店铺首页 -->
    <back-home />
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";
import backHome from "@/components/backHome";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Empty,
    backHome
  },
  data() {
    return {
      curPage: 1,
      pageSize: 20,
      allPage: null,
      noMore: !1,
      balanceTotal: 0,
      balanceRecordList: []
    };
  },
  computed: {
    ...mapState(["storeId"])
  },
  created() {},

  mounted() {},

  methods: {
    ...mapActions(["setOptionsQuery"]),

    //初始化
    init() {
      this.curPage = 1;
      this.balanceRecordList = [];
      this.noMore = !1;
    },

    //获取余额记录
    async getBalanceList() {
      let data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          shopId: this.storeId
        }
      };
      const balanceRecord = await api
        .getBalanceRecord(data)
        .then(res => {
          let data = res.page;
          let _list = data.list;
          let list = this.balanceRecordList;
          this.allPage = data.totalPage;
          this.balanceTotal = util.moneyFormat(data.where.money);
          if (_list.length > 0) {
            _list.map(i => {
              i.money = util.moneyFormat(i.money);
            });
            const _newList = list.concat(_list);

            this.balanceRecordList = _newList;
            this.noMore = !1;
          } else {
            this.noMore = !0;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },

  onLoad(options) {
    const that = this;
    this.setOptionsQuery({ options, that });
  },

  async onShow() {
    this.init();
    await Promise.all([this.getBalanceList()]);
  },

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      Promise.all([this.getBalanceList()]);
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
.balance-record {
  position: relative;
  .balance-record-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 15px 15px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    .backgroundColor(#fff);

    z-index: 9;
    .balance-record-face {
      padding: 15px;
      text-align: center;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      .backgroundColor(#f85437);
      .balance-record-face-value {
        margin-bottom: 20px;
        .textColor(#fff);
        .fontSize(16px);
      }
      .balance-record-face-title {
        .textColor(#333);
      }
    }
  }
  .balance-record-content {
    position: relative;
    margin-top: 102px;
    .value-number {
      line-height: 42px;
    }
    .color-plus {
      .textColor(#f85437);
    }
    .color-minus {
      .textColor(#57be6a);
    }
    .no-more {
      padding: 30px 15px;
      text-align: center;
      .textColor(#999);
    }
  }

  .no-data {
    position: relative;
    margin-top: 102px;
  }
}
</style>
