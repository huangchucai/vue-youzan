<template>
  <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swp-page swiper-slide" v-for="list in lists">
          <a class="js-no-follow" :href="list.clickUrl">
            <img class="goods-main-photo fadeIn" :src="list.image">
          </a>
        </div>
      </div>
      <div class="swiper-pagination"></div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
export default {
  name:'swiper-banner',
  props: {
    // lists: {
    //   type: Array,
    //   required: true
    // },
    lists: {},
    name: {}
  },
  // swiper必须要依赖dom
  mounted() {
    // this.init();
    // new Swiper('.swiper-container',{
    //   loop: true,
    //   pagination: '.swiper-pagination',
    //   autoplay: 2000
    // })
  },
  methods: {
    init() {
      new Swiper('.swiper-container',{
        loop: true,
        pagination: '.swiper-pagination',
        autoplay: 2000
     })
    }
  },
  watch: {
    lists(val,oldval){
      this.$nextTick(() => {
        if(val){
          this.init();
        }
      })
    }
  }
}
  
</script>>



<style>
.swiper-slide img {
  width: 100%;
  height: 100%;
}
</style>
