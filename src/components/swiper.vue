<template>
  <swiper class="swiper" :style="{height:height}" :current="current" :indicator-dots="indicatorDots" :indicator-color="indicatorColor" :indicator-active-color="indicatorActiveColor" :autoplay="autoplay" :interval="interval" :duration="duration">
    <block v-for="(item, index) in images" :key="index">
      <swiper-item>
        <image :src="item.picPath?item.picPath:'/static/images/default_logo_1.5x1.jpg'" @error="errImg(index)" @click="onClick(item.linkPath)" class="slide-image" :mode="mode" />
      </swiper-item>
    </block>
  </swiper>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: "250px"
    },
    current: {
      type: Number,
      default: 0
    },
    images: {
      type: Array
    },
    mode: {
      type: String,
      default: "widthFix"
    }
  },
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      indicatorColor: "#ddd",
      indicatorActiveColor: "#f85437",
      errDefaultImage: "/static/images/default_logo_1.5x1.jpg"
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClick(path) {
      this.$emit("toPath", path);
    },

    //处理no found 图片
    errImg(i) {
      this.images[i].picPath = this.errDefaultImage;
    }
  }
};
</script>

<style lang="less">
.slide-image {
  width: 100%;
}
</style>