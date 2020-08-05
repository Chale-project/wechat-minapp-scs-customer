<template>
  <view class="pages group-join">

    <view class="goods-info">
      <view class="goods-content">
        <view class="goods-thumb">
          <image :src="goodsInfo.coverImage?goodsInfo.coverImage:'/static/images/default_logo_1x1.jpg'" @error="errThumbImg" mode="widthFix" />
        </view>
        <view class="goods-infos">
          <view class="goods-title ellipsis-2">{{goodsInfo.title}}</view>
          <view class="goods-activity-price ellipsis-2">拼购价：<text class="price-value">￥{{checkedGoodsInfo.groupPrice||goodsInfo.groupPrice}}</text></view>
          <view class="goods-original-price ellipsis-2">单买价：<text class="price-value">￥{{checkedGoodsInfo.originalPrice||goodsInfo.originalPrice}}</text></view>
        </view>

      </view>
    </view>

    <view class="group-info">
      <view class="group-header">
        <view class="group-header-status-waiting" v-if="groupInfo.state=='waitGroup'">
          <view class="group-differ-person" v-if="groupInfo.waitGroupOrderCount>0">还差 <text>{{groupInfo.waitGroupOrderCount}}</text> 人拼购成功</view>
          <view class="end-group-time">还剩 <i-count-down :target="targetTime" :clear-timer="clearTimer" show-day @callback="countDownCallback"></i-count-down>
          </view>

        </view>
        <view class="group-header-status-success" v-else-if="groupInfo.state=='success'">
          <view class="status-icon">
            <image src="/static/images/g_icon_success.png" mode="widthFix" />
          </view>
          <view class="status-text">{{groupInfo.groupPeopleCount}}人拼购成功</view>
        </view>
        <view class="group-header-status-fail" v-else-if="groupInfo.state=='fail'">
          <view class="status-icon">
            <image src="/static/images/g_icon_fail.png" mode="widthFix" />
          </view>
          <view class="status-text">拼购失败</view>
        </view>

      </view>
      <view class="group-body">
        <view class="join-group-user" v-for="(v,i) of showGroupUserList" :key="i">
          <image :src="v.headPic?v.headPic:errDefaultImage" @error="errAvatar(i)" mode="aspectFit" />
          <view class="join-group-tag" v-if="v.isMaster">团长</view>
          <view class="join-group-tag-num" v-if="i==maxShowUserNum-1">+{{groupUserNum-maxShowUserNum}}</view>
        </view>
        <view class="join-group-unknown" v-if="!isIncludeSelf&&groupInfo.state!='success'"><text>?</text></view>
      </view>
      <view class="group-footer" v-if="groupInfo.state=='waitGroup'&&groupInfo.waitGroupOrderCount>0">
        <block v-if="!isIncludeSelf">
          <button type="default" open-type="getUserInfo" lang="zh_CN" class="but-default-submit" hover-class="but-default-submit-active" :disabled="disabledBut" v-if="isNewUser" @getuserinfo="bindGetUserInfo">我要参团</button>
          <form @submit="joinGroup" :report-submit='true' v-else>
            <button type="default" form-type="submit" class="but-default-submit" hover-class="but-default-submit-active" :disabled="disabledBut">我要参团</button>
          </form>
        </block>
        <block v-else>
          <button type="default" open-type="share" class="but-default-submit" hover-class="but-default-submit-active">邀请好友参团</button>
        </block>

      </view>
      <!-- <view class="group-footer" v-else-if="groupInfo.state=='unpay'">
        <button type="default" class="but-default-submit" hover-class="but-default-submit-active" @click="goToPay">支付后完成拼团</button>
      </view> -->

    </view>

    <view class="group-paly">
      <van-cell is-link custom-class="goods-group-cell" @click="showPlayWay">
        <view slot="title">
          <text class="goods-group-title">拼团玩法</text>
          <text class="goods-group-choiced">好友参团 · 人满发货 · 不满退款</text>
        </view>
      </van-cell>
    </view>

    <!-- 商品属性选择内容 -->
    <van-popup :show="showAttr" position="bottom" @close="closeGoodsAttr" custom-class="goods-attr-popup-box">
      <view class="goods-attr-popup-content">
        <view class="close-popup" @click="closeGoodsAttr">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="goods-popup-header">
          <view class="goods-attr-thumb">
            <image :src="checkedGoodsInfo.itemImages?checkedGoodsInfo.itemImages:'/static/images/default_logo_1x1.jpg'" @error="errImg" mode="widthFix" />
          </view>
          <view class="goods-attr-others">
            <view class="goods-attr-group-price">￥{{checkedGoodsInfo.groupPrice}} <text>{{groupInfo.groupPeopleCount}}人拼</text></view>
            <view class="goods-attr-original-price">￥{{checkedGoodsInfo.descPrice}}</view>
            <view class="goods-attr-stock">库存：{{checkedGoodsInfo.groupNum||0}}件</view>
          </view>
        </view>
        <view class="goods-popup-body">
          <scroll-view class="goods-attr-scroll-area" scroll-y="true">
            <view class="goods-attr-content">

              <view class="goods-attr-item">
                <view class="goods-attr-name">规格</view>
                <view class="goods-attr-list">
                  <view :class="v.checked?'goods-attr-tag selected':'goods-attr-tag'" v-for="(v,j) of goodsSpecList" :key="j" @click="toggleSkuValue(v.id)">{{v.specificationItems}}</view>
                </view>
              </view>

            </view>
            <view class="goods-number-content">
              <view class="goods-number-title">数量</view>
              <van-stepper :value="curNumber" integer min="1" step="1" @change="onChangeGoodsNumber" />
            </view>
          </scroll-view>
        </view>
        <view class="goods-popup-footer">
          <van-button round block custom-class="but-choice-ok" :disabled="choiceOkStatus" @click="choiceOk">选好了</van-button>
        </view>
      </view>
    </van-popup>

    <van-popup :show="showPlay" position="bottom" custom-class="play-way-box" @close="onClosePopup">
      <view class="play-way-content">
        <view class="close-popup" @click="onClosePopup">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="play-way-header">玩法流程</view>
        <view class="play-way-body">
          <scroll-view class="playway-scroll-area" scroll-y="true" lower-threshold="50">
            <view class="playway-content">
              <view class="home-panel">
                <view class="home-panel-body">
                  <view class="playway-container">
                    <view class="playway-group-open">
                      <view class="playway-group-open-title"><text>开团流程</text></view>
                      <view class="playway-group-content">
                        <timeAxis :timeline="openList" />
                      </view>
                    </view>
                    <view class="playway-group-join">
                      <view class="playway-group-join-title"><text>参团流程</text></view>
                      <view class="playway-group-content">
                        <timeAxis :timeline="joinList" color="#f19b38" />
                      </view>
                    </view>
                  </view>
                </view>
              </view>

            </view>
          </scroll-view>
        </view>
        <view class="play-way-footer">
          <button type="default" class="but-default-submit but-playway-wechat" hover-class="but-default-submit-active" @click="onClosePopup">关闭</button>
        </view>
      </view>
    </van-popup>
    <!-- 返回店铺首页 -->
    <back-home />
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import timeAxis from "@/components/timeAxis";
import backHome from "@/components/backHome";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    timeAxis,
    backHome
  },
  data() {
    return {
      showAttr: !1,
      showPlay: !1,
      openList: [
        {
          title: "点击“我要开团”按钮；",
          url: "https://fcloud.minshop.vip/group/k_group_1.jpg"
        },
        {
          title: "提交并成功支付订单；",
          url: "https://fcloud.minshop.vip/group/k_group_2.jpg"
        },
        {
          title: "点击“邀请好友参团”按钮并成功分享；",
          url: "https://fcloud.minshop.vip/group/k_group_4.jpg"
        },
        {
          title:
            "在团有效时间内，凑齐人数就拼购成功，商家在24小时内发货；未凑齐人数就拼购失败，系统将原路退款到付款账户；",
          url: "https://fcloud.minshop.vip/group/c_group_5.jpg"
        }
      ], //开团玩法

      joinList: [
        {
          title: "点击“我要参团”按钮；",
          url: "https://fcloud.minshop.vip/group/c_group_2.jpg"
        },
        {
          title: "提交并成功支付订单；",
          url: "https://fcloud.minshop.vip/group/c_group_3.jpg"
        },
        {
          title: "点击“邀请好友参团”按钮并成功分享；",
          url: "https://fcloud.minshop.vip/group/k_group_4.jpg"
        },
        {
          title:
            "在团有效时间内，凑齐人数就拼购成功，商家在24小时内发货；未凑齐人数就拼购失败，系统将原路退款到付款账户；",
          url: "https://fcloud.minshop.vip/group/c_group_5.jpg"
        }
      ], //参团玩法

      //倒计时
      targetTime: 0,
      clearTimer: false,

      groupId: null,
      goodsInfo: {},
      groupInfo: {},

      goodsSpecList: [], //商品规格list

      groupUserList: [], //参团成员
      groupUserNum: 0, //成员总数

      showGroupUserList: [], //只显示参团成员
      maxShowUserNum: 5, //最多显示成员数

      operationType: 4, // 1:单独购买；2：购物车；3:我要开团；4：我要参团
      choiceOkStatus: !0,
      checkedGoodsInfo: {}, //已选择的商品

      disabledBut: !0,

      curNumber: 1,
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {
    ...mapState(["isNewUser", "openid", "userInfo", "storeId"]),

    //团中是否包含自己
    isIncludeSelf() {
      const _groupUserList = this.groupUserList;
      for (const i in _groupUserList) {
        if (_groupUserList[i].userNumber == this.userInfo.userNumber) return !0;
        else return !1;
      }
    }
  },

  created() {},

  mounted() {},

  methods: {
    ...mapActions([
      "checkIsNewUser",
      "bindWxLogin",
      "setOptionsQuery",
      "setAccessRecort"
    ]),

    //数据初始化
    init() {
      this.showAttr = !1;
      this.showPlay = !1;
      this.operationType = 4;
      this.goodsInfo = {};
      this.groupInfo = {};
      this.groupUserList = [];
      this.groupUserNum = 0;
      this.showGroupUserList = [];
      this.checkedGoodsInfo = {};
      this.disabledBut = !0;
      this.curNumber = 1;
      this.choiceOkStatus = !0;
    },

    //显示商品属性选择
    showGoodsAttr(e) {
      this.showAttr = !this.showAttr;
    },

    //关闭商品属性选择
    closeGoodsAttr() {
      this.showAttr = !1;
    },

    //显示拼团玩法
    showPlayWay() {
      this.showPlay = !0;
    },

    //关闭拼团玩法
    onClosePopup() {
      this.showPlay = !1;
    },

    //设置商品购买数量
    onChangeGoodsNumber(e) {
      this.curNumber = e.mp.detail;
    },

    //秒杀倒计时回调
    countDownCallback() {
      this.targetTime = 0;
    },

    //获取团基本信息
    async getGroupInfo() {
      const info = await api
        .getGroupInfo(this.groupId)
        .then(res => {
          let _info = res.result;
          const _goodsInfo = _info.goodsGroupModel;
          const _groupInfo = _info.orderGroupModel;

          _goodsInfo.originalPrice = util.moneyFormat(_goodsInfo.originalPrice);
          _goodsInfo.groupPrice = util.moneyFormat(_goodsInfo.groupPrice);

          if (_goodsInfo.goodsGroupDescModels.length > 0)
            this.setGoodsSpec(_goodsInfo.goodsGroupDescModels);
          else this.goodsSpecList = [];

          this.targetTime = util.timeStamp(_groupInfo.endGroupTime);
          this.goodsInfo = _goodsInfo;

          this.groupUserNum = _groupInfo.userList.length;

          if (_groupInfo.userList.length > 0) {
            this.groupUserList = _groupInfo.userList;

            if (_groupInfo.userList.length > this.maxShowUserNum) {
              this.showGroupUserList = this.setShowGroupUserList(
                _groupInfo.userList
              );
            } else this.showGroupUserList = _groupInfo.userList;
          } else {
            this.groupUserLis = [];
            this.showGroupUserList = [];
          }

          this.disabledBut = !1;
          this.groupInfo = _groupInfo;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //设置商品规格属性
    setGoodsSpec(arr) {
      for (const i in arr) {
        arr[i].descPrice = util.moneyFormat(arr[i].descPrice);
        arr[i].groupPrice = util.moneyFormat(arr[i].groupPrice);
        if (i == 0) arr[i].checked = !0;
        else arr[i].checked = !1;
      }
      this.goodsSpecList = arr;
      this.setCheckedSpec();
    },

    //选择商品规格属性值
    toggleSkuValue(id) {
      let speclist = this.goodsSpecList;
      for (let j in speclist) {
        if (speclist[j].id === id) {
          speclist[j].checked = !0;
        } else {
          speclist[j].checked = !1;
        }
      }
      this.setCheckedSpec();
    },

    //设置已选中的规格属性值
    setCheckedSpec() {
      let _arr = this.goodsSpecList;
      for (const i in _arr) {
        if (_arr[i].checked) {
          this.checkedGoodsInfo = _arr[i];
        }
      }
      this.choiceOkStatus = !1;
    },

    //设置显示团成员个数
    setShowGroupUserList(arr) {
      return arr.splice(0, this.maxShowUserNum);
    },

    //未支付去支付
    goToPay() {
      //TODO
    },

    // 首次创建用户并拼团
    bindGetUserInfo(e) {
      let data = e.mp.detail;
      if (data.errMsg == "getUserInfo:ok") {
        let _decryptData = {
          encryptedData: data.encryptedData,
          iv: data.iv,
          openid: this.openid
        };
        this.bindWxLogin(_decryptData).then(res => {
          this.setAccessRecort(this.storeId);

          this.showAttr = !0;
        });
      }
    },

    //选择商品参团
    joinGroup(e) {
      this.operationType = 4;
      api.saveFormId(e.mp.detail.formId);

      const _flag = this.checkStock();
      if (!_flag) {
        util.showToastError("灰常遗憾，库存已不足了！");
        return;
      }

      if (this.groupInfo.waitGroupOrderCount <= 0) {
        util.showToastError("灰常遗憾，你来迟了，团人数已拼满啦！");
        return;
      }

      if (this.goodsSpecList.length > 0) {
        if (this.goodsSpecList.length > 1) this.showGoodsAttr();
        else this.choiceOk();
      } else {
        const obj = {
          id: this.goodsInfo.id,
          number: 1
        };
        this.goToOrder(obj);
      }
    },

    //选好了
    choiceOk() {
      if (this.operationType == 4) {
        const curSpecGoods = this.checkedGoodsInfo;
        const obj = {
          id: curSpecGoods.id,
          number: this.curNumber
        };
        this.goToOrder(obj);
      }
      this.closeGoodsAttr();
    },

    //校验库存
    checkStock() {
      let flag = !0;
      let _stock = this.checkedGoodsInfo.groupNum || this.goodsInfo.num || 0;

      if (this.curNumber - _stock > 0) flag = !1;
      else flag = !0;

      return flag;
    },

    //立即购买，开团购买跳转到订单创建页面
    goToOrder(obj) {
      const _operationType = this.operationType;
      const _platformGoodsType = this.goodsInfo.platformGoodsType;
      let url = "";
      switch (_operationType) {
        case 4:
          if (_platformGoodsType == "virtual")
            url = `/pages/subPackageVirtualG/virtualGCreateOrder?idsNum=${
              obj.id
            }~${obj.number}&stp=group&groupId=${this.groupId}`;
          else if (_platformGoodsType == "physical")
            url = `/pages/subPackageEntityG/entityCreateOrder?idsNum=${
              obj.id
            }~${obj.number}&stp=group&groupId=${this.groupId}`;
          else
            url = `/pages/subPackageShop/orderCreate/orderCreate?idsNum=${
              obj.id
            }~${obj.number}&stp=group&groupId=${this.groupId}`;

          break;
      }

      util.navigateTo(url);
    },

    //返回店铺首页
    goToStore() {
      wx.switchTab({
        url: "/pages/home/home"
      });
    },

    //处理no found 图片
    errThumbImg() {
      this.goodsInfo.coverImage = this.errDefaultImage;
    },

    //处理no found 图片
    errImg(i) {
      this.checkedGoodsInfo.itemImages = this.errDefaultImage;
    },

    //处理no found 图片
    errAvatar(i) {
      this.showGroupUserList[i].headPic = this.errDefaultImage;
    }
  },

  async onLoad(options) {
    this.init();
    const that = this;
    that.groupId = options.groupId;

    wx.getSystemInfo({
      success: function(res) {
        that.imgH = `${res.windowWidth}px`;
      }
    });

    that.setOptionsQuery({ options, that });

    that.checkIsNewUser(that).then(() => {
      that.setAccessRecort(that.storeId);
    });

    await Promise.all([that.getGroupInfo()]);
  },

  onShow() {},

  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res);
    }
    let _path = `/pages/subPackageGroupBuy/groupJoin?groupId=${
      this.groupId
    }&uId=${this.userInfo.id}&storeId=${this.storeId}`;

    return {
      title: `就差你一人啦，${this.goodsInfo.groupPrice} 元快来拼购${
        this.goodsInfo.title
      }`,
      path: _path,
      imageUrl: this.goodsInfo.coverImage
    };
  }
};
</script>
<style lang="less">
@import "../../../static/css/common";
.group-join {
  position: relative;

  .goods-info {
    padding: 20px 15px;
    .backgroundColor(#fff);
    .goods-content {
      display: flex;
      padding: 10px 15px;
      border: 0.5px solid #eee;
      .borderRadius(2px);
      .goods-thumb {
        width: 120px;
        height: 120px;
        margin-right: 10px;
        overflow: hidden;
        image {
          width: 100%;
        }
      }
      .goods-infos {
        width: calc(100% - 130px);
        .goods-title {
          height: 40px;
          margin-bottom: 10px;
          .fontSize(15px);
        }
        .goods-activity-price {
          .textColor(#f85437);
          .price-value {
            .fontSize(18px);
          }
        }
        .goods-original-price {
          .textColor(#999);
          .price-value {
            text-decoration: line-through;
          }
        }
      }
    }
  }

  .group-info {
    position: relative;
    padding: 20px 15px;
    .backgroundColor(#fff);
    .group-header {
      position: relative;
      padding: 10px 15px;
      text-align: center;
      .group-header-status-waiting {
        .group-differ-person {
          text {
            .textColor(#f85437);
            .fontSize(20px);
          }
        }
        .end-group-time {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 12px;
          text-align: center;
          line-height: 1px;
          text {
            color: #f85437;
          }
        }
      }

      .group-header-status-success,
      .group-header-status-fail {
        .status-icon {
          width: 80px;
          margin: 0 auto 15px;
          image {
            width: 100%;
          }
        }
        .status-text {
          .fontSize(18px);
        }
      }
      .group-header-status-success .status-text {
        .textColor(#07c160);
      }
      .group-header-status-fail .status-text {
        .textColor(#f85437);
      }
    }

    .group-body {
      position: relative;
      padding: 10px 15px;
      display: flex;
      justify-content: center;
      .join-group-user,
      .join-group-unknown {
        position: relative;
        width: 45px;
        height: 45px;
        margin: 5px;
        text-align: center;
        line-height: 45px;
        .textColor(#999);
        image {
          width: 44px;
          height: 44px;
          .borderRadius(50%);
          border: 0.5px solid #f85437;
        }
        .join-group-tag {
          position: absolute;
          height: 14px;
          left: 2px;
          right: 2px;
          top: 37px;
          line-height: 14px;
          text-align: center;
          .textColor(#fff);
          .fontSize(9px);
          .borderRadius(7px);
          .backgroundColor(#f85437);
          z-index: 9;
        }
        .join-group-tag-num {
          position: absolute;
          min-width: 14px;
          height: 14px;
          right: -2px;
          top: -2px;
          line-height: 14px;
          text-align: center;
          .textColor(#fff);
          .fontSize(9px);
          .borderRadius(7px);
          .backgroundColor(#f85437);
          z-index: 9;
        }
      }
      .join-group-unknown {
        border: 0.5px dashed #999;
        .borderRadius(50%);
        .backgroundColor(#f1f1f1);
      }
    }

    .group-footer {
      margin-top: 10px;
    }
  }
  .group-info::after {
    .backgroundLine(15px, 0);
  }

  .group-paly {
    .goods-group-cell {
      padding-left: 60px;
      .goods-group-title {
        margin-left: -45px;
      }
      .goods-group-choiced {
        padding-left: 17px;
        font-size: 12px;
      }
    }
  }

  // 商品属性区域
  .goods-attr-popup-box {
    overflow-y: visible;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .goods-attr-popup-content {
      position: relative;
      box-sizing: border-box;
      .goods-popup-header {
        position: absolute;
        display: flex;
        top: -50px;
        left: 0;
        right: 0;
        padding: 20px 15px;
        z-index: 10;
        .goods-attr-thumb {
          width: 80px;
          height: 80px;
          margin-right: 10px;
          .borderRadius(4px);
          overflow: hidden;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .goods-attr-others {
          width: calc(100% - 110px);
          padding-top: 35px;
          padding-right: 20px;
          .goods-attr-group-price {
            .fontSize(16px);
            .color-red();
            text {
              display: inline-block;
              margin-left: 10px;
              padding: 0 4px;
              border: 0.5px solid #f85437;
              .fontSize(10px);
              .borderRadius(4px);
              vertical-align: text-top;
            }
          }
          .goods-attr-original-price {
            .fontSize(12px);
            .textColor(#f85437);
          }
          .goods-attr-stock {
            .textColor(#666);
          }
        }
      }
      .goods-popup-body {
        height: 320px;
        padding: 70px 0;
        .goods-attr-scroll-area {
          height: 100%;
          .goods-attr-content {
            position: relative;
            padding: 0 15px 20px;
            .goods-attr-item {
              margin-bottom: 10px;
              .goods-attr-name {
                margin-bottom: 10px;
                .fontSize(16px);
              }
              .goods-attr-list {
                .goods-attr-tag {
                  position: relative;
                  display: inline-block;
                  margin-right: 15px;
                  margin-bottom: 15px;
                  padding: 6px 15px;
                  .borderRadius(4px);
                  .backgroundColor(#f1f1f1);
                }
                .goods-attr-tag.selected {
                  .backgroundColor(#f85437);
                  .textColor(#fff);
                }
              }
            }
          }
          .goods-attr-content::after {
            .backgroundLine();
          }
          .goods-number-content {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 15px;
          }
          .goods-number-content::after {
            .backgroundLine();
          }
        }
      }
      .goods-popup-footer {
        position: absolute;
        height: 50px;
        padding: 10px 30px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .but-choice-ok {
          height: 50px;
          line-height: 50px;
          .but-default(#f85437);
          .fontSize(16px);
        }
      }

      .close-popup {
        position: absolute;
        width: 24px;
        height: 24px;
        right: 10px;
        top: 10px;
        z-index: 999;
      }
    }
  }

  // 玩法弹出层
  .play-way-box {
    overflow-y: visible;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .play-way-content {
      position: relative;
      box-sizing: border-box;
      .play-way-header {
        padding: 20px 15px;
        text-align: center;
      }
      .play-way-body {
        min-height: 400px;
        padding-bottom: 60px;
        .playway-scroll-area {
          height: 430px;
          .playway-content {
            position: relative;
            padding: 0 15px 20px;
            text {
              .textColor(#999);
            }
            .playway-group-open-title,
            .playway-group-join-title {
              margin-bottom: 15px;
              text {
                display: inline-block;
                padding: 10px 30px 10px 15px;
                background: #f85437;
                color: #fff;
                text-align: center;
                font-size: 24px;
                border-top-right-radius: 25px;
                border-bottom-right-radius: 25px;
              }
            }
            .playway-group-join-title {
              text {
                background: #f19b38;
              }
            }
            .playway-group-content {
              padding: 10px 0 20px 15px;
            }
          }
          .playway-content::after {
            .backgroundLine();
          }
        }
      }
      .play-way-footer {
        position: absolute;
        height: 50px;
        padding: 10px 30px 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .but-playway-wechat {
          .but-default(#f85437);
        }
      }

      .close-popup {
        position: absolute;
        width: 24px;
        height: 24px;
        right: 10px;
        top: 10px;
        z-index: 999;
      }
    }
  }
}
</style>
