<template >
  <view class="pages integral">
    <view class="integral-header">
      <view class="integral-face">
        <view class="integral-face-value"><text>{{integralTotal}}</text></view>
        <view class="integral-face-title">当前可用积分</view>
      </view>
    </view>
    <view class="integral-content" v-if="integralList.length>0">
      <van-cell-group>
        <van-cell :title="v.source=='shopping'?'线上买单获得':v.source=='sign'?'签到获得':v.source=='cardSend'?'储值赠送':v.source=='orderCancel'?'取消订单返还':v.source=='deduction'?'积分抵扣':v.source=='immediately'?'门店买单获得':'未知'" :value="v.source=='shopping'?'+ '+v.integral:v.source=='sign'?'+ '+v.integral:v.source=='cardSend'?'+ '+v.integral:v.source=='orderCancel'?'+ '+v.integral:v.source=='deduction'?'- '+v.integral:v.source=='immediately'?'+ '+v.integral:''+v.integral" :label="v.addDataTime" :value-class="v.source=='shopping'?'value-number color-plus':v.source=='sign'?'value-number color-plus':v.source=='cardSend'?'value-number color-plus':v.source=='orderCancel'?'value-number color-plus':v.source=='deduction'?'value-number color-minus':v.source=='immediately'?'value-number color-plus':'value-number '" v-for="(v,i) of integralList" :key="i" />
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
      integralTotal: 0,
      integralList: []
    };
  },
  computed: {
    ...mapState(["isNewUser", "storeId"])
  },
  created() {},

  mounted() {},

  methods: {
    ...mapActions(["AuthLoginByWeixin", "setOptionsQuery", "setAccessRecort"]),

    //初始化
    init() {
      this.curPage = 1;
      this.integralList = [];
      this.noMore = !1;
    },

    //获取积分记录
    async getIntegralList() {
      let data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {
          shopId: this.storeId
        }
      };
      const integral = await api
        .getIntegralRecord(data)
        .then(res => {
          let data = res.page;
          let _list = data.list;
          let list = this.integralList;
          this.allPage = data.totalPage;
          this.integralTotal = data.where.integral;
          if (_list.length > 0) {
            this.integralList = list.concat(_list);
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

  async onLoad(options) {
    this.init();
    const that = this;
    this.setOptionsQuery({ options, that });

    if (that.isNewUser)
      that.AuthLoginByWeixin().then(() => {
        that.setAccessRecort(that.storeId);
      });
      
    await Promise.all([this.getIntegralList()]);
  },

  onShow() {},

  //上拉加载
  onReachBottom() {
    this.curPage = this.curPage + 1;
    if (this.curPage <= this.allPage) {
      Promise.all([this.getIntegralList()]);
    }
  }
};
</script>

<style lang="less">
@import "../../../../static/css/common";
.integral {
  position: relative;
  .integral-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 15px 15px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    .backgroundColor(#fff);

    z-index: 9;
    .integral-face {
      padding: 15px;
      text-align: center;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      .backgroundColor(#f85437);
      .integral-face-value {
        margin-bottom: 20px;
        .textColor(#fff);
        .fontSize(16px);
      }
      .integral-face-title {
        .textColor(#333);
      }
    }
  }
  .integral-content {
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
