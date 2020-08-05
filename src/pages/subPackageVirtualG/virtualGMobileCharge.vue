<template>
  <view class="pages virtual">
    <view class="mobile-charge-content">

      <van-tabs type="card" color="#f85437" animated @change="switchChargeType">
        <van-tab title="话费充值">
          <view class="virtual-charge-tab-content">
            <view class="virtual-charge-header">
              <van-cell-group>
                <van-field :value="mobile" :error-message="belongToOperatorText" input-class="input-text" left-icon="phone-circle-o" type="number" maxlength="11" placeholder="请输入手机号" @change="onChangeMobile" />
              </van-cell-group>
            </view>
            <view class="virtual-charge-body">
              <scroll-view scroll-y style="height: 250px;">
                <van-row gutter="15">
                  <van-col span="8" custom-class="charge-card-item" v-for="(k,i) of hfGoodsList" :key="i">
                    <view :class="k.checked?'charge-card-content active':'charge-card-content'" @click="choiceChargePhoneBill(i)">
                      <view class="charge-card-title"><text>{{k.title}}</text>元</view>
                      <view class="charge-card-value">售{{k.actualMoney/100}}元</view>
                    </view>
                  </van-col>
                </van-row>
              </scroll-view>
            </view>
          </view>
        </van-tab>
        <van-tab title="流量充值">
          <view class="virtual-charge-tab-content">
            <view class="virtual-charge-header">
              <van-cell-group>
                <van-field :value="mobile" :error-message="belongToOperatorText" input-class="input-text" left-icon="phone-circle-o" type="number" maxlength="11" placeholder="请输入手机号" @change="onChangeMobile" />
              </van-cell-group>
            </view>
            <view class="virtual-charge-body">
              <scroll-view scroll-y style="height: 250px;">
                <van-row gutter="15">
                  <block v-if="belongToOperatorType==0">
                    <van-col span="8" custom-class="charge-card-item" v-for="(v,j) of llLGoodsList" :key="j">
                      <view :class="v.checked?'charge-card-content active':'charge-card-content'" @click="choiceChargeFlowrate(j)">
                        <view class="charge-card-title"><text>{{v.title}}</text></view>
                        <view class="charge-card-value">售{{v.actualMoney/100}}元</view>
                      </view>
                    </van-col>
                  </block>
                  <block v-else-if="belongToOperatorType==1">
                    <van-col span="8" custom-class="charge-card-item" v-for="(v,j) of llYGoodsList" :key="j">
                      <view :class="v.checked?'charge-card-content active':'charge-card-content'" @click="choiceChargeFlowrate(j)">
                        <view class="charge-card-title"><text>{{v.title}}</text></view>
                        <view class="charge-card-value">售{{v.actualMoney/100}}元</view>
                      </view>
                    </van-col>
                  </block>
                  <block v-else-if="belongToOperatorType==2">
                    <van-col span="8" custom-class="charge-card-item" v-for="(v,j) of llDGoodsList" :key="j">
                      <view :class="v.checked?'charge-card-content active':'charge-card-content'" @click="choiceChargeFlowrate(j)">
                        <view class="charge-card-title"><text>{{v.title}}</text></view>
                        <view class="charge-card-value">售{{v.actualMoney/100}}元</view>
                      </view>
                    </van-col>
                  </block>

                </van-row>
              </scroll-view>
            </view>
          </view>
        </van-tab>
      </van-tabs>

    </view>

    <view class="mobile-charge-warning">
      <van-icon name="info-o" size="20px" color="#f85437" custom-class="warning-icon" />
      <text>充值流量均为全国通用型流量，即时生效，支持2G/3G/4G！</text>
    </view>

    <view class="mobile-charge-footer">
      <!-- <view class="charge-integral">
        <van-checkbox checked-color="#f85437" :value="isUseIntegral" :disabled="disabledIntegral" @change="onChangeIntegral">
          {{integral}}积分可抵{{integral/100}}元
        </van-checkbox>
      </view> -->
      <view class="charge-button">
        <form @submit="formSubmit" :report-submit='true'>
          <button type="default" form-type="submit" class="but-default-submit" hover-class="but-default-submit-active" :disabled="disabledCharge">立即储值</button>
        </form>
      </view>

    </view>

  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import pay from "@/utils/pay";
import Empty from "@/components/empty";
import { mapState } from "vuex";

export default {
  components: {
    Empty
  },
  data() {
    return {
      orderType: "virtualGoods",
      type: "0", //'0'：充话费；'2'：充全国通用流量；
      belongToOperatorType: 0, //0：中国联通；1：中国移动；2：中国电信
      belongToOperatorText: "",
      mobile: "",
      integral: 10240, //积分
      isUseIntegral: !1, //是否使用积分
      disabledIntegral: !1, //积分使用禁用
      disabledCharge: !1,
      //充话费面值
      hfGoodsList: [
        { title: "10", faceValue: "10", actualMoney: "1000", checked: false },
        { title: "20", faceValue: "20", actualMoney: "2000", checked: false },
        { title: "30", faceValue: "30", actualMoney: "3000", checked: false },
        { title: "40", faceValue: "40", actualMoney: "4000", checked: false },
        { title: "50", faceValue: "50", actualMoney: "5000", checked: false },
        {
          title: "100",
          faceValue: "100",
          actualMoney: "10000",
          checked: false
        },
        {
          title: "200",
          faceValue: "200",
          actualMoney: "20000",
          checked: false
        },
        {
          title: "300",
          faceValue: "300",
          actualMoney: "30000",
          checked: false
        },
        { title: "500", faceValue: "500", actualMoney: "50000", checked: false }
      ],

      //充联通流量面值
      llLGoodsList: [
        { title: "20M", faceValue: "3", actualMoney: "300", checked: false },
        { title: "30M", faceValue: "4", actualMoney: "400", checked: false },
        { title: "50M", faceValue: "6", actualMoney: "600", checked: false },
        { title: "100M", faceValue: "10", actualMoney: "1000", checked: false },
        { title: "200M", faceValue: "15", actualMoney: "1500", checked: false },
        { title: "300M", faceValue: "20", actualMoney: "2000", checked: false },
        { title: "500M", faceValue: "30", actualMoney: "3000", checked: false },
        { title: "1G", faceValue: "50", actualMoney: "5000", checked: false }
      ],
      //充移动流量面值
      llYGoodsList: [
        { title: "10M", faceValue: "3", actualMoney: "300", checked: false },
        { title: "20M", faceValue: "4", actualMoney: "400", checked: false },
        { title: "30M", faceValue: "5", actualMoney: "500", checked: false },
        { title: "50M", faceValue: "7", actualMoney: "700", checked: false },
        { title: "100M", faceValue: "10", actualMoney: "1000", checked: false },
        { title: "200M", faceValue: "20", actualMoney: "2000", checked: false },
        { title: "500M", faceValue: "30", actualMoney: "3000", checked: false },
        { title: "1G", faceValue: "50", actualMoney: "5000", checked: false },
        { title: "2G", faceValue: "70", actualMoney: "7000", checked: false },
        { title: "3G", faceValue: "100", actualMoney: "10000", checked: false },
        { title: "4G", faceValue: "130", actualMoney: "13000", checked: false },
        { title: "6G", faceValue: "180", actualMoney: "18000", checked: false },
        { title: "11G", faceValue: "280", actualMoney: "28000", checked: false }
      ],
      //充电信流量面值
      llDGoodsList: [
        { title: "5M", faceValue: "1", actualMoney: "100", checked: false },
        { title: "10M", faceValue: "2", actualMoney: "200", checked: false },
        { title: "30M", faceValue: "5", actualMoney: "500", checked: false },
        { title: "50M", faceValue: "7", actualMoney: "700", checked: false },
        { title: "100M", faceValue: "10", actualMoney: "1000", checked: false },
        { title: "200M", faceValue: "15", actualMoney: "1500", checked: false },
        { title: "500M", faceValue: "30", actualMoney: "3000", checked: false },
        { title: "1G", faceValue: "50", actualMoney: "5000", checked: false }
      ],
      checkedHfGoods: {},
      checkedLlGoods: {},
      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },
  computed: {
    ...mapState(["storeId", "storeInfo"])
  },

  created() {},

  mounted() {},

  methods: {
    //切换话费流量充值
    switchChargeType(e) {
      const _index = e.mp.detail.index;
      switch (_index) {
        case 1:
          this.type = "2";
          break;

        default:
          this.type = "0";
          break;
      }
    },

    //手机号
    onChangeMobile(e) {
      const _mobile = e.mp.detail;
      this.mobile = _mobile;
      if (_mobile.length == 11) {
        this.queryMobileOperator(_mobile);
      } else {
        this.belongToOperatorType = 0;
        this.belongToOperatorText = "";
      }
    },

    //查询手机号所属运营商
    async queryMobileOperator(mobile) {
      const info = await api
        .queryMobileOperator(mobile)
        .then(res => {
          const info = res.result;
          this.belongToOperatorType = info.provider;
          this.belongToOperatorText = `${info.areaName} ${info.providerName}`;
          this.setLlGoodsData(info.provider);
        })
        .catch(err => {});
    },

    //重置流量商品List
    setLlGoodsData(_type) {
      let _llLGD = this.llLGoodsList;
      let _llYGD = this.llYGoodsList;
      let _llDGD = this.llDGoodsList;
      switch (_type) {
        case 1:
          _llLGD.map(item => {
            item.checked = false;
          });
          _llDGD.map(item => {
            item.checked = false;
          });
          break;
        case 2:
          _llLGD.map(item => {
            item.checked = false;
          });
          _llYGD.map(item => {
            item.checked = false;
          });
          break;

        default:
          _llYGD.map(item => {
            item.checked = false;
          });
          _llDGD.map(item => {
            item.checked = false;
          });
          break;
      }
      this.checkedLlGoods = {};
    },

    //选充值话费面值
    choiceChargePhoneBill(index) {
      const _list = this.hfGoodsList;
      for (const i in _list) {
        if (i == index) {
          _list[i].checked = !0;
          this.checkedHfGoods = _list[i];
        } else {
          _list[i].checked = !1;
        }
      }
    },

    //选充值流量面值
    choiceChargeFlowrate(index) {
      const operatorType = this.belongToOperatorType;
      let _list = [];
      switch (operatorType) {
        case 1:
          _list = this.llYGoodsList;
          break;
        case 2:
          _list = this.llDGoodsList;
          break;
        default:
          _list = this.llLGoodsList;
          break;
      }
      for (const j in _list) {
        if (j == index) {
          _list[j].checked = !0;
          this.checkedLlGoods = _list[j];
        } else {
          _list[j].checked = !1;
        }
      }
    },

    //是否使用积分
    onChangeIntegral() {
      this.isUseIntegral = !this.isUseIntegral;
    },


    formSubmit(e) {
      api.saveFormId(e.mp.detail.formId);
      this.onBindCharge();
    },

    //校验数据
    checkData() {
      let reg = /^(1)[0-9]{10}$/,
        _mobile = this.mobile,
        _type = this.type,
        _chfObj = this.checkedHfGoods,
        _cllObj = this.checkedLlGoods;

      if (this.storeInfo.state == "disabled") {
        util.showToastError("该店铺被禁用！");
        return false;
      }

      if (!reg.test(_mobile)) {
        util.showToastError("请输入有效的手机号码！");
        return false;
      }
      if (_type == 0) {
        if (Object.keys(_chfObj).length < 1) {
          util.showToastError("请选择充值金额！");
          return false;
        } else {
          return true;
        }
        return false;
      } else if (_type == 2) {
        if (Object.keys(_cllObj).length < 1) {
          util.showToastError("请选择充值流量！");
          return false;
        } else {
          return true;
        }
      }
    },

    //立即充值
    onBindCharge() {
      const flag = this.checkData();
      if (flag) {
        let data = {
          shopId: this.storeId,
          orderType: this.orderType,
          type: this.type,
          operation: this.belongToOperatorType,
          faceValue: null,
          flowSize: null,
          account: this.mobile
        };
        if (this.type == 0) {
          data.faceValue = this.checkedHfGoods.faceValue;
          data.flowSize = null;
        } else if (this.type == 2) {
          data.faceValue = this.checkedLlGoods.faceValue;
          data.flowSize = this.checkedLlGoods.title;
        }

        this.mobileRecharge(data);
      }
    },

    //充话费 充流量
    async mobileRecharge(data) {
      this.disabledCharge = !0;
      const charge = await pay
        .payOrder(data)
        .then(res => {
          this.disabledCharge = !1;
          if (res.errMsg === "requestPayment:ok") {
            util.showToastSuccess("支付成功！");
            setTimeout(() => {
              util.goToPaySuccess();
            }, 500);
          }
        })
        .catch(err => {
          this.disabledCharge = !1;
          if (err.errMsg === "requestPayment:fail cancel") {
            util.showToastError("取消支付！");
          } else {
            util.showToastError(err.msg);
          }
        });
    },

    //处理no found 图片
    errImg(i) {
      this.categoryList[i].categoryLogo = this.errDefaultImage;
    }
  },

  onLoad(options) {},

  onShow() {}
};
</script>

<style lang="less">
@import "../../../static/css/common";
.virtual {
  .mobile-charge-content {
    padding: 10px 0;
    margin-bottom: 10px;
    .backgroundColor(#fff);
    .virtual-charge-tab-content {
      .virtual-charge-header {
        padding: 10px 0;
        .input-text {
          .fontSize(20px);
        }
        .van-icon-phone-circle-o {
          font-size: 21px;
          .textColor(#f85437);
        }
      }

      .virtual-charge-body {
        .charge-card-item {
          padding-top: 7.5px;
          padding-bottom: 7.5px;
          .charge-card-content {
            padding: 10px;
            border: 0.5px solid #ddd;
            text-align: center;
            overflow: hidden;
            .borderRadius(4px);
            .charge-card-title {
              text {
                .fontSize(24px);
              }
            }
            .charge-card-value {
              .textColor(#999);
            }
          }
          .charge-card-content.active {
            border-color: #f85437;
            .backgroundColor(#fcf4f3);
          }
        }
      }
    }
  }

  .mobile-charge-warning {
    margin-bottom: 10px;
    padding: 10px 15px;
    .textColor(#666);
    .warning-icon {
      margin-right: 10px;
      vertical-align: bottom;
    }
  }

  .mobile-charge-footer {
    padding: 10px 15px;
    .charge-integral {
      margin-bottom: 10px;
      padding: 0 15px;
    }
    .charge-button {
      padding: 10px 15px;
      .but-charge {
        .fontSize(16px);
        .but-default(#f85437);
      }
    }
  }
}
</style>
