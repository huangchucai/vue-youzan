import './goods_common.css'
import './goods_custom.css'
import './goods_mars.css'
import './goods_sku.css'
import './goods_theme.css'
import './goods_transition.css'
import './goods.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'
import Swipe from 'components/Swiper.vue'
import mixin from 'js/mixin.js'
const { id } = qs.parse(location.search.substring(1));
let detailTab = ['商品详情', '本店成交']
new Vue({
  el:'#goods-app',
  data() {
    return {
      goodsDetail : null,
      swipeList: [],
      showSku: false,
      skyType: 1,
      skuNum: 1,
      currentIndex: null,
      detailTab,
      dealLists: null,
      dealIndex: 0,
      isAddCart:false,
      showMessage: false
    }
  },
  created() {
    this.getGoodsDetail()
    this.getGoodsDeal()
  },
  methods: {
    getGoodsDetail() {
      axios.post(url.goodsDetail,{id}).then((res) => {
        this.goodsDetail = res.data.data
        this.goodsDetail.imgs.forEach(item => {
          this.swipeList.push({image: item})
        })
        this.goodsDetail.skuList.forEach(sku => {
          let lists = []
          sku.lists.forEach(item => {
            lists.push({
              active: false,
              tag: item
            })
          })
          sku.lists = lists
        }) 
      })
    },
    chooseSku(type) {
      this.showSku = true;
      this.skyType = type;
    },
    changeSkuNum(num) {
      if(this.skuNum === 1 &&  num < 0) return 
      this.skuNum += num;
    },
    showSkuItem(item,idx,arr) {
      if(item.active) {
        item.active = false;
      }else{
        arr.forEach((item,i) => {
          item.active = i === idx;
        })
      }
    },
    getGoodsDeal() {
      axios.post(url.deal,id).then(res => {
        this.dealLists = res.data.data.lists
      })
    },
    showTab(idx){
      this.dealIndex = idx;
    },
    addCart(){
      axios.post(url.add, {id,number: this.skuNum}).then((res) => {
        if(res.data.status === 200) {
          this.showMessage = true
          this.showSku = false
          this.isAddCart = true
          setTimeout(() => {
            this.showMessage = false
          },1000)
        }
      })
    }
  },
  components: {
    Swipe
  },
  watch: {
    showSku(val) {
      document.body.style.height = val ? '100%' : 'auto';
      document.body.style.overflow = val ? 'hidden' : 'auto';
      document.querySelector('html').style.overflow = val ? 'hidden' : 'auto'
      document.querySelector('html').style.height = val ? '100%' : 'auto'
    }
  }
})

