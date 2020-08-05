<template>
  <view class="pages about">
    <view class="about-banner">
      <img src="/static/images/about_banner.png" mode="widthFix">
    </view>
    <view class="about-content">
      <view class="about-title"><text class="about-text">{{storeInfo.shopName}}</text></view>
      <view class="about-detail">
        <block v-if="!!storeDesc">
          <wxParse :content="storeDesc" />
        </block>
        <block v-else>
          <Empty desc="店家还没有店铺介绍哦！" />
        </block>

        <view class="store-address">
          <view class="store-address-icon">
            <image src="/static/images/user_center_address.png" mode="widthFix" />
          </view>
          <view class="store-address-detail">{{storeInfo.shopAddress}}<text class="see-navigation" @click="seeNavigation">立即导航</text></view>
        </view>

      </view>
    </view>
  </view>
</template>

<script>
import wxParse from "mpvue-wxparse";
import Empty from "@/components/empty";
import { mapState } from "vuex";

export default {
  components: {
    Empty,
    wxParse
  },
  data() {
    return {
      storeDesc: null
    };
  },
  computed: {
    ...mapState(["storeInfo"])
  },
  created() {},

  mounted() {},

  methods: {
    //导航
    seeNavigation() {
      wx.openLocation({
        latitude: this.storeInfo.shopLatitude,
        longitude: this.storeInfo.shopLongitude,
        name: this.storeInfo.shopName,
        address: this.storeInfo.shopAddress
      });
    }
  },

  onLoad(options) {
    this.storeDesc = decodeURIComponent(this.storeInfo.shopIntro);
  },

  onShow() {}
};
</script>

<style lang="less">
@import "../../../../static/css/common";

.about {
  position: relative;
  .about-banner {
    max-height: 264px;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .about-content {
    position: relative;
    margin: -10px 15px 20px;
    padding: 10px 15px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    .backgroundColor(#fff);
    z-index: 9;
    .about-title {
      width: 68%;
      margin: 0 auto;
      padding: 5px;
      text-align: center;
      background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+IEmuOgAAAA1JREFUCJljMDY2/g8AAs8BmTPrRL8AAAAASUVORK5CYII=")
        center repeat-x;
      .about-text {
        padding: 0 10px;
        font-weight: bold;
        .fontSize(16px);
        .backgroundColor(#fff);
      }
    }
    .about-detail {
      padding: 10px 0;
      line-height: 1.5;
      .wxParse {
        image {
          max-width: 100%;
        }
      }
      .store-address {
        display: flex;
        margin-top: 20px;
        padding: 20px 0;
        .store-address-icon {
          width: 20px;
          image {
            width: 100%;
          }
        }
        .store-address-detail {
          margin-left: 10px;
          .see-navigation {
            display: inline-block;
            margin-left: 5px;
            height: 20px;
            padding-left: 25px;
            text-align: right;
            color: #1890ff;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM5NTUwQzkzNzE1OTExRTlBN0Y2QzA0MzdERTFFQUJCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM5NTUwQzk0NzE1OTExRTlBN0Y2QzA0MzdERTFFQUJCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Mzk1NTBDOTE3MTU5MTFFOUE3RjZDMDQzN0RFMUVBQkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Mzk1NTBDOTI3MTU5MTFFOUE3RjZDMDQzN0RFMUVBQkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz61mOpkAAACb0lEQVR42sSXTWxMURTHp1XpoomNRCKREFYNCQsRHwtd+BqULlhQlMSCSKQrLLqxaBo7WlR8tE1FqY/WSFCh8RUSdGGBqoWMEqILNCrRjBq/m/wnuXnemzfTvvfmJL/kzXlzc88759z/vbconU7HCmnFsQJbSeZh1pFfUcw3A+IwN3mwrDaqDEyCxXAYnsNp+PRfBkKwqVAJG6HK8v+Eq2EGsBA2wWpYIF8/TFNQV+BD0AGYUm6BnbAIpsh/A07CetglXxekgwjAjJ0J26HG9LGV4kY4py83E2+DMngFT1xXQZ61nQ97YLN8f6EPzsJl+C7/Pjhujb0NP8YbwDxYDrut2ibhEbTBfcf/9zomH4VrnjqQxTbAGtihNBq7BzdVz0GXMTWqvW1P4VmuAUxXbVfCCvnG4AT0wB1IeYytVv2d1pVVCfW8TCleAnPkfwNH4TG89cnWVmiV+Nj2BTr8AjBfXAezLV8CDsC7HEplGrIFJru8Mxn75rcZXYS1cMya0KjYAzgE5Vkmj2sFlHq878hlN/wNA1ArNdsPveqHBpXijCazM1cB5y3xcdprrZS8tmMjJk1qwCrV9Y/645YUzqjeOrgkbfCyFi3BmF8PeFlCNMMqCVBcjLk0nG0jCjiQA8kLqIelEpmUz+QZ5RsI+kT0EU4pK3523d54gj6Stfu8f+8iz4EG0KPdzcvuSoBCCyAl7XAzs6Q7ozgVm11w2MX/UgIWegCfodvF3+3XfEHeC5zNOCxxiuxi0ieNyFivxxkhtACMbF+wfrcW4mqWUOqH4OG4rmYTtKQOLF+VkcgDiOkMOJTvoKJCX8//CTAARBOJ9xeGpokAAAAASUVORK5CYII=");
            background-position: left center;
            background-repeat: no-repeat;
            background-size: contain;
          }
        }
      }
    }
  }
}
</style>
