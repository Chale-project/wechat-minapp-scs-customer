<template >
  <view class="pages home">
    <view class="home-panel">
      <view class="home-panel-body">
        <view class="search-container">
          <van-search :value="keywords" placeholder="搜索附近门店" show-action @focus="onFocus" @clear="onClear" @change="onChangekeywords" @search="onSearchStore" @cancel="onCancel" custom-class="search-custom-class" field-class="search-field-class" input-class="search-input-class" background="background:#fff;" />
        </view>
      </view>
    </view>
    <block v-if="!isSearch">

      <view class="home-panel">
        <view class="home-panel-header">
          <view class="more-operate" @click="onOpenPopup">更多</view>
          <text>浏览记录</text>
        </view>
        <view class="home-panel-body">
          <view class="store-container" v-if="accessRecordList.length>0" style="padding:0 15px 10px;">
            <scroll-view class="access-record-store" scroll-x>
              <view class="access-record-store-item" v-for="(v,i) of accessRecordList" :key="i">
                <form @submit="formSubmit" :report-submit='true'>
                  <view class="store-logo">
                    <image :src="v.shopLogo?v.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errImg(i)" mode="widthFix" />
                  </view>
                  <view class="store-info">
                    <view class="store-name ellipsis">
                      <text>{{v.shopName}}</text>
                    </view>
                  </view>
                  <input class="input-hidden" name='shopId' :value="v.shopId" />
                  <button form-type="submit" class="form-submit"></button>
                </form>
              </view>
            </scroll-view>
          </view>
          <Empty v-else />
        </view>
      </view>

      <view class="home-panel">
        <view class="home-panel-header">
          <text>附近门店</text>
        </view>
        <view class="home-panel-body">
          <view class="store-container" v-if="nearbyStoreList.length>0">
            <view class="store-group">
              <view class="store-cell" v-for="(v,i) of nearbyStoreList" :key="i">
                <form @submit="formSubmit" :report-submit='true'>
                  <view class="store-logo">
                    <image :src="v.shopLogo?v.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errNearShopLogo(i)" mode="widthFix" />
                    <input class="input-hidden" name='shopId' :value="v.shopId" />
                    <button form-type="submit" class="form-submit"></button>
                  </view>
                </form>

                <view class="store-info">
                  <form @submit="formSubmit" :report-submit='true'>
                    <view class="store-name ellipsis">
                      <text>{{v.shopName}}</text>
                      <input class="input-hidden" name='shopId' :value="v.shopId" />
                      <button form-type="submit" class="form-submit"></button>
                    </view>
                  </form>

                  <view class="store-address">
                    <form class="scs-form" @submit="formSubmit" :report-submit='true'>
                      <van-icon name="location-o" class="location-icon" />
                      <text>{{v.shopAddress}}</text>
                      <input class="input-hidden" name='shopId' :value="v.shopId" />
                      <button form-type="submit" class="form-submit"></button>
                    </form>
                    <text class="see-navigation" @click="seeNavigation(v)">立即导航</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <Empty v-else />
        </view>
      </view>

    </block>

    <block v-else>

      <view class="home-panel">
        <view class="home-panel-header">
          <text>搜索结果</text>
        </view>
        <view class="home-panel-body">
          <view class="store-container" v-if="searchStoreList.length>0">
            <view class="store-group">
              <view class="store-cell" v-for="(m,n) of searchStoreList" :key="n">
                <form @submit="formSubmit" :report-submit='true'>
                  <view class="store-logo">
                    <image :src="m.shopLogo?m.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errSearchImg(n)" mode="widthFix" />
                    <input class="input-hidden" name='shopId' :value="m.shopId" />
                    <button form-type="submit" class="form-submit"></button>
                  </view>
                </form>

                <view class="store-info">
                  <form @submit="formSubmit" :report-submit='true'>
                    <view class="store-name ellipsis">
                      <text>{{m.shopName}}</text>
                      <input class="input-hidden" name='shopId' :value="m.shopId" />
                      <button form-type="submit" class="form-submit"></button>
                    </view>
                  </form>

                  <view class="store-address">
                    <form class="scs-form" @submit="formSubmit" :report-submit='true'>
                      <van-icon name="location-o" class="location-icon" />
                      <text>{{m.shopAddress}}</text>
                      <input class="input-hidden" name='shopId' :value="m.shopId" />
                      <button form-type="submit" class="form-submit"></button>
                    </form>
                    <text class="see-navigation" @click="seeNavigation(m)">立即导航</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <Empty v-else desc="未搜到相关店铺！" />

        </view>
      </view>
    </block>

    <van-popup :show="showMore" position="bottom" custom-class="store-popup-box" @close="onClosePopup">
      <view class="store-popup-content">
        <view class="close-popup" @click="onClosePopup">
          <van-icon name="close" size="24px" color="#666" />
        </view>
        <view class="store-popup-header">更多浏览记录</view>
        <view class="store-popup-body">
          <scroll-view class="store-scroll-area" scroll-y="true" lower-threshold="50" @scrolltolower="scrollLowerLoading">
            <view class="store-content">
              <view class="home-panel">
                <view class="home-panel-body">
                  <view class="store-container" v-if="moreAccessRecordList.length>0">
                    <view class="store-group">
                      <view class="store-cell" v-for="(v,i) of moreAccessRecordList" :key="i">
                        <form @submit="formSubmit" :report-submit='true'>
                          <view class="store-logo">
                            <image :src="v.shopLogo?v.shopLogo:'/static/images/default_logo_1x1.jpg'" @error="errMoreImg(i)" mode="widthFix" />
                            <input class="input-hidden" name='shopId' :value="v.shopId" />
                            <button form-type="submit" class="form-submit"></button>
                          </view>
                        </form>

                        <view class="store-info">
                          <form @submit="formSubmit" :report-submit='true'>
                            <view class="store-name ellipsis">
                              <text>{{v.shopName}}</text>
                              <input class="input-hidden" name='shopId' :value="v.shopId" />
                              <button form-type="submit" class="form-submit"></button>
                            </view>
                          </form>

                          <view class="store-address">
                            <form class="scs-form" @submit="formSubmit" :report-submit='true'>
                              <van-icon name="location-o" class="location-icon" />
                              <text>{{v.shopAddress}}</text>
                              <input class="input-hidden" name='shopId' :value="v.shopId" />
                              <button form-type="submit" class="form-submit"></button>
                            </form>
                            <text class="see-navigation" @click="seeNavigation(v)">立即导航</text>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                  <Empty v-else />
                </view>
              </view>

            </view>
          </scroll-view>
        </view>
        <view class="store-popup-footer">
          <button type="default" class="but-default-submit but-store-wechat" hover-class="but-default-submit-active" @click="onClosePopup">关闭</button>
        </view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import api from "@/utils/api";
import util from "@/utils/util";
import Empty from "@/components/empty";
import { mapActions } from "vuex";

export default {
  components: {
    Empty
  },
  data() {
    return {
      keywords: null,
      isSearch: !1,
      searchStoreList: [],
      curSearchPage: 1,
      allSearchPage: null,

      latitude: null,
      longitude: null,
      nearbyStoreList: [],
      accessRecordList: [],

      pageSize: 20,

      showMore: !1,
      curPage: 1,
      allPage: null,
      moreAccessRecordList: [],

      errDefaultImage: "/static/images/default_logo_1x1.jpg"
    };
  },

  computed: {},

  mounted() {},

  methods: {
    ...mapActions(["AuthLoginByWeixin", "setOptionsQuery", "setAccessRecort"]),

    init() {
      this.keywords = null;
      this.isSearch = !1;
      this.curSearchPage = 1;
      this.allSearchPage = null;
      this.searchStoreList = [];

      this.nearbyStoreList = [];
      this.accessRecordList = [];

      this.curPage = 1;
      this.allPage = null;
      this.showMore = !1;
      this.moreAccessRecordList = [];
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
    onSearchStore(e) {
      if (!this.keywords) {
        util.showToastError("请输入店铺名称！");
        return false;
      }
      this.curSearchPage = 1;
      this.allSearchPage = null;
      this.searchStoreList = [];

      this.getSearchStoreList();
    },

    //取消
    onCancel(e) {
      this.isSearch = !1;
      this.keywords = null;
    },

    //关闭弹出层
    onClosePopup() {
      this.showMore = !1;
    },

    //打开弹出层
    onOpenPopup(e) {
      this.showMore = !0;

      this.curPage = 1;
      this.allPage = null;
      this.moreAccessRecordList = [];

      this.getMoreAccessStoreList();
    },

    //滚动到底部加载更多
    scrollLowerLoading() {
      this.curPage = this.curPage + 1;
      if (this.curPage <= this.allPage) {
        this.getMoreAccessStoreList();
      }
    },

    //扫码进店
    scanCode() {
      const that = this;
      wx.scanCode({
        success(res) {
          if (res.path) {
            const strArr = res.path.split("?");
            const path = strArr[0];
            const queryArr = strArr[1].split("=");
            that
              .setOptionsQuery({ options: { scene: queryArr[1] }, that })
              .then(() => {
                wx.switchTab({
                  url: `/${path}`
                });
              });
          } else if (res.result) {
            const _url = res.result;
            that.setOptionsQuery({ options: { q: _url }, that }).then(() => {
              wx.switchTab({
                url: `/pages/pay/pay`
              });
            });
          }
        }
      });
    },

    formSubmit(e) {
      const _formId = e.mp.detail.formId;
      const _shopId = e.mp.detail.value.shopId;
      api.saveFormId(_formId);
      this.enterStore(_shopId);
    },

    //点击店铺列表进入相应店铺
    enterStore(id) {
      const that = this;
      that.setAccessRecort(id);
      const options = { storeId: id };
      this.setOptionsQuery({ options, that }).then(() => {
        wx.switchTab({
          url: "/pages/home/home"
        });
      });
    },

    //查看导航
    seeNavigation(obj) {
      wx.openLocation({
        latitude: obj.shopLatitude,
        longitude: obj.shopLongitude,
        name: obj.shopName,
        address: obj.shopAddress
      });
    },

    //附近门店
    async getNearbyStore() {
      const data = {
        currentPage: 1,
        pageSize: 999,
        where: {
          lat: this.latitude,
          lot: this.longitude
        }
      };
      const _store = await api
        .getNearbyStoreList(data)
        .then(res => {
          const _list = res.result.list;
          if (_list.length > 0) {
            this.nearbyStoreList = _list;
          }
        })
        .catch(err => {});
    },

    //获取访问记录门店
    async getAccessStoreList() {
      const data = {
        currentPage: 1,
        pageSize: 10,
        where: {}
      };
      const _store = await api
        .getAccessRecordList(data)
        .then(res => {
          const curlist = res.result.list;
          this.allPage = res.result.totalPage;
          if (curlist.length > 0) {
            this.accessRecordList = curlist;
          }
        })
        .catch(err => {});
    },

    //获取更多访问记录门店
    async getMoreAccessStoreList() {
      const data = {
        currentPage: this.curPage,
        pageSize: this.pageSize,
        where: {}
      };
      const _store = await api
        .getAccessRecordList(data)
        .then(res => {
          const list = this.moreAccessRecordList;
          const curlist = res.result.list;
          this.allPage = res.result.totalPage;
          if (curlist.length > 0) {
            this.moreAccessRecordList = list.concat(curlist);
          }
        })
        .catch(err => {});
    },

    //搜索店铺
    async getSearchStoreList() {
      const data = {
        currentPage: this.curSearchPage,
        pageSize: this.pageSize,
        where: {
          shopName: this.keywords
        }
      };
      const _storeList = await api
        .getSearchStore(data)
        .then(res => {
          const list = this.searchStoreList;
          const curlist = res.page.list;
          this.allSearchPage = res.page.totalPage;
          if (curlist.length > 0) {
            this.searchStoreList = list.concat(curlist);
          }
        })
        .catch(err => {});
    },

    //处理no found 图片
    errNearShopLogo(i) {
      this.nearbyStoreList[i].shopLogo = this.errDefaultImage;
    },

    //处理no found 图片
    errImg(i) {
      this.accessRecordList[i].shopLogo = this.errDefaultImage;
    },

    //处理no found 图片
    errMoreImg(i) {
      this.moreAccessRecordList[i].shopLogo = this.errDefaultImage;
    },

    //处理no found 图片
    errSearchImg(i) {
      this.searchStoreList[i].shopLogo = this.errDefaultImage;
    }
  },

  onLoad() {},

  async onShow() {
    this.init();
    await Promise.all([this.AuthLoginByWeixin()])
      .then(() => {
        this.getAccessStoreList();
        util
          .getLocation()
          .then(res => {
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            this.getNearbyStore();
          })
          .catch(() => {});
      })
      .catch(() => {});
  },

  //下拉刷新
  async onPullDownRefresh() {
    this.init();
    await Promise.all([this.AuthLoginByWeixin()])
      .then(() => {
        this.getAccessStoreList();
        util
          .getLocation()
          .then(res => {
            this.latitude = res.latitude;
            this.longitude = res.longitude;
            this.getNearbyStore();
          })
          .catch(() => {});
      })
      .catch(() => {});
    wx.stopPullDownRefresh();
  },

  //上拉加载
  onReachBottom() {
    const _isSearch = this.isSearch;
    switch (_isSearch) {
      case true:
        this.curSearchPage = this.curSearchPage + 1;
        if (this.curSearchPage <= this.allSearchPage) {
          this.getSearchStoreList();
        }
        break;
    }
  }
};
</script>

<style lang="less">
@import "../../../static/css/common";
.home {
  .home-panel {
    margin-bottom: 10px;
    &-header {
      padding: 10px 15px;
      .textColor(#333);
      .fontSize(16px);
      .backgroundColor(#fff);
      .more-operate {
        position: relative;
        float: right;
        color: #999;
        font-size: 14px;
        padding-right: 15px;
      }
      .more-operate:after {
        position: absolute;
        width: 24px;
        height: 24px;
        top: 50%;
        transform: translateY(-50%);
        font-family: vant-icon;
        font-size: 14px;
        color: #999;
        content: "\F00A";
        text-align: center;
        line-height: 24px;
      }
    }
    &-body {
      .backgroundColor(#fff);
    }
    .search-container {
      padding: 3px 5px 3px 0;
      overflow: hidden;
      .van-search.search-custom-class {
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

    .store-container {
      min-height: 122px;
      .store-group {
        position: relative;
        .store-cell {
          position: relative;
          display: flex;
          align-items: center;
          padding: 10px 25px 10px 15px;
          .store-logo {
            position: relative;
            width: 40px;
            height: 40px;
            margin-right: 10px;
            .borderRadius(50%);
            overflow: hidden;
            image {
              width: 100%;
            }
            .input-hidden {
              display: none;
            }
            .form-submit {
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              z-index: 99;
              opacity: 0;
              background: transparent;
              text-indent: 99999999px;
            }
          }
          .store-info {
            width: calc(100% - 50px);
            .store-name {
              position: relative;
              padding-bottom: 5px;
              .input-hidden {
                display: none;
              }
              .form-submit {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                z-index: 99;
                opacity: 0;
                background: transparent;
                text-indent: 99999999px;
              }
            }
            .store-address {
              .textColor(#999);
              .fontSize(12px);
              .location-icon {
                vertical-align: middle;
                margin-right: 5px;
              }
              .scs-form {
                display: inline-block;
                position: relative;
                .input-hidden {
                  display: none;
                }
                .form-submit {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  left: 0;
                  right: 0;
                  top: 0;
                  bottom: 0;
                  z-index: 99;
                  opacity: 0;
                  background: transparent;
                  text-indent: 99999999px;
                }
              }
              .see-navigation {
                display: inline-block;
                margin-left: 5px;
                height: 14px;
                padding-left: 20px;
                text-align: right;
                color: #1890ff;
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM5NTUwQzkzNzE1OTExRTlBN0Y2QzA0MzdERTFFQUJCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM5NTUwQzk0NzE1OTExRTlBN0Y2QzA0MzdERTFFQUJCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Mzk1NTBDOTE3MTU5MTFFOUE3RjZDMDQzN0RFMUVBQkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Mzk1NTBDOTI3MTU5MTFFOUE3RjZDMDQzN0RFMUVBQkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz61mOpkAAACb0lEQVR42sSXTWxMURTHp1XpoomNRCKREFYNCQsRHwtd+BqULlhQlMSCSKQrLLqxaBo7WlR8tE1FqY/WSFCh8RUSdGGBqoWMEqILNCrRjBq/m/wnuXnemzfTvvfmJL/kzXlzc88759z/vbconU7HCmnFsQJbSeZh1pFfUcw3A+IwN3mwrDaqDEyCxXAYnsNp+PRfBkKwqVAJG6HK8v+Eq2EGsBA2wWpYIF8/TFNQV+BD0AGYUm6BnbAIpsh/A07CetglXxekgwjAjJ0J26HG9LGV4kY4py83E2+DMngFT1xXQZ61nQ97YLN8f6EPzsJl+C7/Pjhujb0NP8YbwDxYDrut2ibhEbTBfcf/9zomH4VrnjqQxTbAGtihNBq7BzdVz0GXMTWqvW1P4VmuAUxXbVfCCvnG4AT0wB1IeYytVv2d1pVVCfW8TCleAnPkfwNH4TG89cnWVmiV+Nj2BTr8AjBfXAezLV8CDsC7HEplGrIFJru8Mxn75rcZXYS1cMya0KjYAzgE5Vkmj2sFlHq878hlN/wNA1ArNdsPveqHBpXijCazM1cB5y3xcdprrZS8tmMjJk1qwCrV9Y/645YUzqjeOrgkbfCyFi3BmF8PeFlCNMMqCVBcjLk0nG0jCjiQA8kLqIelEpmUz+QZ5RsI+kT0EU4pK3523d54gj6Stfu8f+8iz4EG0KPdzcvuSoBCCyAl7XAzs6Q7ozgVm11w2MX/UgIWegCfodvF3+3XfEHeC5zNOCxxiuxi0ieNyFivxxkhtACMbF+wfrcW4mqWUOqH4OG4rmYTtKQOLF+VkcgDiOkMOJTvoKJCX8//CTAARBOJ9xeGpokAAAAASUVORK5CYII=");
                background-position: left 1px;
                background-repeat: no-repeat;
                background-size: contain;
              }
            }
          }
        }
        .store-cell::before {
          content: "\F00A";
          width: 16px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          font-family: vant-icon;
          right: 10px;
          .fontSize(16px);
          .ct();
        }
        .store-cell::after {
          bottom: 0;
          .backgroundLine(15px);
        }
        .store-cell:last-child::after {
          bottom: 0;
          .backgroundLine(0, 0, 0);
        }
      }
      .store-group::before {
        top: 0;
        .backgroundLine();
      }
      .store-group::after {
        bottom: 0;
        .backgroundLine();
      }

      .access-record-store {
        box-sizing: border-box;
        height: 100px;
        overflow: hidden;
        background: #fff;
        padding: 15px 0 5px;
        white-space: nowrap;
        .access-record-store-item {
          position: relative;
          display: inline-block;
          width: 100px;
          margin-right: 5px;
          .store-logo {
            width: 50px;
            height: 50px;
            margin: 0 auto;
            .borderRadius(50%);
            text-align: center;
            overflow: hidden;
            image {
              width: 100%;
            }
          }
          .store-info {
            .store-name {
              height: 19px;
              line-height: 19px;
              padding: 5px 10px;
              text-align: center;
            }
          }
          .input-hidden {
            display: none;
          }
          .form-submit {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 99;
            opacity: 0;
            background: transparent;
            text-indent: 99999999px;
          }
        }
      }
    }
  }

  // 弹出层
  .store-popup-box {
    overflow-y: visible;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .store-popup-content {
      position: relative;
      box-sizing: border-box;
      .store-popup-header {
        padding: 20px 15px;
        text-align: center;
      }
      .store-popup-body {
        min-height: 400px;
        padding-bottom: 60px;
        .store-scroll-area {
          height: 400px;
          .store-content {
            position: relative;
            padding: 0 15px 20px;
            text {
              .textColor(#999);
            }
          }
          .store-content::after {
            .backgroundLine();
          }
        }
      }
      .store-popup-footer {
        position: absolute;
        height: 50px;
        padding: 10px 30px 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        .but-store-wechat {
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
